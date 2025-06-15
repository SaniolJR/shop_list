using MySql.Data.MySqlClient;
using Microsoft.AspNetCore.Builder;
using BCrypt.Net;

public class RegisterAccountDto
{
    public string nick { get; set; }
    public string passwd { get; set; }
    public string email { get; set; }
}

public static class AccountsAPI
{
    public static void RegisterAccount(this WebApplication app, IConfiguration config)
    {
        app.MapPost("/register_account", async (RegisterAccountDto account) =>
        {
            try
            {
                if (string.IsNullOrEmpty(account.passwd) || account.passwd.Length < 6)
                {
                    return Results.BadRequest(new { message = "Hasło musi mieć co najmniej 6 znaków." });
                }

                var connectionString = config.GetConnectionString("DefaultConnection");
                using var connection = new MySqlConnection(connectionString);
                await connection.OpenAsync();

                // WALIDACJA: czy email już istnieje?
                string checkEmailSql = "SELECT COUNT(*) FROM user WHERE email = @email";
                using (var checkCmd = new MySqlCommand(checkEmailSql, connection))
                {
                    checkCmd.Parameters.AddWithValue("@email", account.email);
                    var count = Convert.ToInt32(await checkCmd.ExecuteScalarAsync());
                    if (count > 0)
                    {
                        return Results.BadRequest(new { message = "Użytkownik o tym adresie email już istnieje." });
                    }
                }

                //szyfrowanie hasła
                string hashedPassword = BCrypt.Net.BCrypt.HashPassword(account.passwd);

                string newUserSql = "INSERT INTO user (nick, passwd, email) VALUES (@nick, @passwd, @email)";
                using (var commandSQL = new MySqlCommand(newUserSql, connection))
                {
                    commandSQL.Parameters.AddWithValue("@nick", account.nick);
                    commandSQL.Parameters.AddWithValue("@passwd", hashedPassword);
                    commandSQL.Parameters.AddWithValue("@email", account.email);

                    await commandSQL.ExecuteNonQueryAsync();
                }
                return Results.Ok(new { success = true, message = "Konto zostało utworzone." });
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
                return Results.Problem(ex.Message);
            }
        });
    }

    public static void LoginToAccount(this WebApplication app, IConfiguration config)
    {
        app.MapPost("/login_account", async (RegisterAccountDto account, HttpResponse response) =>
        {
            try
            {

                if (string.IsNullOrEmpty(account.email) || string.IsNullOrEmpty(account.passwd))
                {
                    return Results.BadRequest(new { message = "Email i hasło są wymagane." });
                }

                var connectionString = config.GetConnectionString("DefaultConnection");
                using var connection = new MySqlConnection(connectionString);
                await connection.OpenAsync();

                string checkUserSql = "SELECT id_user, nick, email, passwd FROM user WHERE email = @email";
                using var commandSQL = new MySqlCommand(checkUserSql, connection);
                commandSQL.Parameters.AddWithValue("@email", account.email);

                using var reader = await commandSQL.ExecuteReaderAsync();
                if (await reader.ReadAsync())
                {
                    var userId = reader["id_user"].ToString();
                    var nick = reader["nick"].ToString();
                    var email = reader["email"].ToString();
                    string storedHashedPassword = reader["passwd"]?.ToString() ?? string.Empty;

                    // sprawdzania hasla
                    if (BCrypt.Net.BCrypt.Verify(account.passwd, storedHashedPassword))
                    {
                        // Ustaw ciasteczko z ID użytkownika
                        response.Cookies.Append("userID", userId, new CookieOptions
                        {
                            HttpOnly = true,
                            Secure = false,
                            SameSite = SameSiteMode.Lax
                        });

                        response.Cookies.Append("userNick", nick, new CookieOptions
                        {
                            HttpOnly = true,
                            Secure = false,
                            SameSite = SameSiteMode.Lax
                        });

                        return Results.Ok(new { success = true, message = "Zalogowano pomyślnie.", userId, nick, email });
                    }
                    else
                    {
                        return Results.BadRequest(new { message = "Nieprawidłowe hasło." });
                    }
                }
                else
                {
                    return Results.BadRequest(new { message = "Użytkownik o tym adresie email nie istnieje." });
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
                return Results.Problem(ex.Message);
            }
        });
    }

    public static void GetUserInfoFromCookies(this WebApplication app)
    {
        app.MapGet("/me", async (HttpRequest request) =>
        {
            var userId = request.Cookies["userID"];
            if (string.IsNullOrEmpty(userId))
                return Results.Unauthorized();

            var connectionString = request.HttpContext.RequestServices
            .GetRequiredService<IConfiguration>()
            .GetConnectionString("DefaultConnection");
            using var connection = new MySqlConnection(connectionString);
            await connection.OpenAsync();

            string sql = "SELECT id_user, nick, email FROM user WHERE id_user = @userId LIMIT 1";
            using var cmd = new MySqlCommand(sql, connection);
            cmd.Parameters.AddWithValue("@userId", userId);

            using var reader = await cmd.ExecuteReaderAsync();
            if (await reader.ReadAsync())
            {
                return Results.Ok(new
                {
                    userId = reader["id_user"],
                    nick = reader["nick"],
                    email = reader["email"]
                });
            }
            else
            {
                return Results.NotFound();
            }
        });
    }

    public static void UpdateAccount(this WebApplication app)
    {
        app.MapPatch("/update_account", async (HttpRequest request) =>
        {
            var userId = request.Cookies["userID"];
            if (string.IsNullOrEmpty(userId))
                return Results.Unauthorized();

            // Odczytaj body JSON
            using var readerBody = new StreamReader(request.Body);
            var body = await readerBody.ReadToEndAsync();
            if (string.IsNullOrWhiteSpace(body))
                return Results.BadRequest(new { message = "Brak danych do aktualizacji." });

            // Parsuj JSON (może być nick, email lub passwd)
            var data = System.Text.Json.JsonDocument.Parse(body).RootElement;
            string? newNick = data.TryGetProperty("nick", out var n) ? n.GetString() : null;
            string? newEmail = data.TryGetProperty("email", out var e) ? e.GetString() : null;
            string? newPasswd = data.TryGetProperty("passwd", out var p) ? p.GetString() : null;

            if (string.IsNullOrEmpty(newNick) && string.IsNullOrEmpty(newEmail) && string.IsNullOrEmpty(newPasswd))
                return Results.BadRequest(new { message = "Brak danych do aktualizacji." });

            if (!string.IsNullOrEmpty(newPasswd) && newPasswd.Length < 6)
            {
                return Results.BadRequest(new { message = "Hasło musi mieć co najmniej 6 znaków." });

            }

            var connectionString = request.HttpContext.RequestServices
                .GetRequiredService<IConfiguration>()
                .GetConnectionString("DefaultConnection");
            using var connection = new MySqlConnection(connectionString);
            await connection.OpenAsync();

            // Buduj zapytanie SQL dynamicznie
            var updates = new List<string>();
            if (!string.IsNullOrEmpty(newNick)) updates.Add("nick = @nick");
            if (!string.IsNullOrEmpty(newEmail)) updates.Add("email = @email");
            if (!string.IsNullOrEmpty(newPasswd)) updates.Add("passwd = @passwd");
            string sql = $"UPDATE user SET {string.Join(", ", updates)} WHERE id_user = @userId";

            using var cmd = new MySqlCommand(sql, connection);
            if (!string.IsNullOrEmpty(newNick))
                cmd.Parameters.AddWithValue("@nick", newNick);
            if (!string.IsNullOrEmpty(newEmail))
                cmd.Parameters.AddWithValue("@email", newEmail);
            if (!string.IsNullOrEmpty(newPasswd))
            {
                string hashedPassword = BCrypt.Net.BCrypt.HashPassword(newPasswd);
                cmd.Parameters.AddWithValue("@passwd", hashedPassword);
            }
            cmd.Parameters.AddWithValue("@userId", userId);

            var affected = await cmd.ExecuteNonQueryAsync();
            if (affected > 0)
                return Results.Ok(new { success = true, message = "Dane zaktualizowane." });
            else
                return Results.BadRequest(new { message = "Nie udało się zaktualizować danych." });
        });
    }

    public static void Logout(this WebApplication app)
    {
        app.MapPost("/logout", (HttpResponse response) =>
        {
            response.Cookies.Delete("userID");
            response.Cookies.Delete("userNick");
            return Results.Ok(new { success = true, message = "Wylogowano." });
        });
    }

    public static void DeleteAccount(this WebApplication app)
    {
        app.MapDelete("/delete_account", async (HttpRequest request, HttpResponse response) =>
        {
            var userId = request.Cookies["userID"];
            if (string.IsNullOrEmpty(userId))
                return Results.Unauthorized();

            var connectionString = request.HttpContext.RequestServices
                .GetRequiredService<IConfiguration>()
                .GetConnectionString("DefaultConnection");
            using var connection = new MySqlConnection(connectionString);
            await connection.OpenAsync();

            // Usuń użytkownika
            string sql = "DELETE FROM user WHERE id_user = @userId";
            using var cmd = new MySqlCommand(sql, connection);
            cmd.Parameters.AddWithValue("@userId", userId);

            var affected = await cmd.ExecuteNonQueryAsync();

            // Usuwamy ciasteczko po usunięciu konta
            response.Cookies.Delete("userID");

            if (affected > 0)
                return Results.Ok(new { success = true, message = "Konto zostało usunięte." });
            else
                return Results.BadRequest(new { message = "Nie udało się usunąć konta." });
        });
    }


}