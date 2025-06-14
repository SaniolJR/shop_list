using Microsoft.AspNetCore.Builder;
using MySql.Data.MySqlClient;


public class AddCartDto
{
    public int userId { get; set; }
    public string name { get; set; }
    public string description { get; set; }
}

public static class CartsViewAPI
{

    //endpoint zwracający listę koszyków użytkownika, przyjmuje userId, page i limit jako parametry
    public static void ReturnCartList(this WebApplication app, IConfiguration config)
    {
        app.MapGet("/return_cart_list", async (int userId) =>
{
    try
    {
        var connectionString = config.GetConnectionString("DefaultConnection");
        using var connection = new MySqlConnection(connectionString);
        await connection.OpenAsync();

        string sql = File.ReadAllText("sql/return_car_list");
        // NIE doklejaj LIMIT/OFFSET!
        using var commandSQL = new MySqlCommand(sql, connection);
        commandSQL.Parameters.AddWithValue("@userId", userId);

        using var reader = await commandSQL.ExecuteReaderAsync();

        var results = new List<object>();
        while (await reader.ReadAsync())
        {
            results.Add(new
            {
                id_cart = reader["id_cart"],
                name = reader["name"],
                description = reader["description"],
                id_cart_list = reader["id_cart_list"],
                user_id_user = reader["user_id_user"],
            });
        }
        DisplayEndpointInfo(sql, results.Count, userId, 1);
        return Results.Ok(results);
    }
    catch (Exception ex)
    {
        Console.WriteLine(ex.ToString());
        return Results.Problem(ex.Message);
    }
});
    }

    //endpoint dodający koszyk do bazy danych, przyjmuje userId jako parametr
    public static void AddCart(this WebApplication app, IConfiguration config)
    {
        app.MapPost("/add_cart", async (AddCartDto cart) =>
        {
            try
            {
                // polaczenie z bd
                var connectionString = config.GetConnectionString("DefaultConnection");
                using var connection = new MySqlConnection(connectionString);
                await connection.OpenAsync();

                // szukanie listy koszyków użytkownika
                string selectListSql = "SELECT id_cart_list FROM cart_list WHERE user_id_user = @userId";
                using var selectCmd = new MySqlCommand(selectListSql, connection);
                selectCmd.Parameters.AddWithValue("@userId", cart.userId);
                object? cartListIdObj = await selectCmd.ExecuteScalarAsync();

                int cartListId;
                if (cartListIdObj == null)
                {
                    // jesli nie istnieje lista koszyków, tworzymy nową
                    string insertListSql = "INSERT INTO cart_list (user_id_user) VALUES (@userId)";
                    using var insertCmd = new MySqlCommand(insertListSql, connection);
                    insertCmd.Parameters.AddWithValue("@userId", cart.userId);
                    await insertCmd.ExecuteNonQueryAsync();

                    // pobieramy ID nowo utworzonej listy koszyków
                    using var lastIdCmd = new MySqlCommand("SELECT LAST_INSERT_ID()", connection);
                    cartListId = Convert.ToInt32(await lastIdCmd.ExecuteScalarAsync());
                }
                else
                {
                    // jeśli istnieje, pobieramy jego ID
                    cartListId = Convert.ToInt32(cartListIdObj);
                }

                // dodajemy koszyk do listy koszyków
                string insertCartSql = "INSERT INTO cart (name, description, cart_list_id_cart_list) VALUES (@name, @description, @cartListId)";
                using var insertCartCmd = new MySqlCommand(insertCartSql, connection);
                insertCartCmd.Parameters.AddWithValue("@name", cart.name);
                insertCartCmd.Parameters.AddWithValue("@description", cart.description);
                insertCartCmd.Parameters.AddWithValue("@cartListId", cartListId);

                await insertCartCmd.ExecuteNonQueryAsync();

                // Wyświetlenie informacji o dodaniu koszyka w konsoli
                Console.WriteLine($"Dodano koszyk: {cart.name} (ID listy koszyków: {cartListId}) dla użytkownika {cart.userId}");

                return Results.Ok("Koszyk został dodany.");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
                return Results.Problem(ex.Message);
            }
        });
    }

    //metoda do wyświetlania w konsoli
    public static void DisplayEndpointInfo(string sql, int resultsCount, int userId, int page)
    {
        Console.WriteLine("--------------------------------------------------");
        Console.WriteLine($"ZAPYTANIE SQL: {sql}");
        Console.WriteLine($"ZWRACAM {resultsCount} WYNIKÓW DLA UŻYTKOWNIKA {userId} (STRONA {page})");
    }
}