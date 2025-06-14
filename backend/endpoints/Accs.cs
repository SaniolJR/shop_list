using MySql.Data.MySqlClient;
using Microsoft.AspNetCore.Builder;

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

                string newUserSql = "INSERT INTO user (nick, passwd, email) VALUES (@nick, @passwd, @email)";
                using (var commandSQL = new MySqlCommand(newUserSql, connection))
                {
                    commandSQL.Parameters.AddWithValue("@nick", account.nick);
                    commandSQL.Parameters.AddWithValue("@passwd", account.passwd);
                    commandSQL.Parameters.AddWithValue("@email", account.email);

                    await commandSQL.ExecuteNonQueryAsync();
                }
                return Results.Ok(new { message = "Account registered successfully." });
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
                return Results.Problem(ex.Message);
            }
        });
    }
}