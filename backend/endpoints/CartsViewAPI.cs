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
        app.MapGet("/return_cart_list", async (int userId, int page = 1, int limit = 9) =>
        {
            try
            {
                //podstawa by działało - pobiera tekst do połączenia się z DB
                var connectionString = config.GetConnectionString("DefaultConnection");
                //tworzy kwerendę do bazy danych MySQL
                //using - otwarcie połączenia z bazą danych i automatyczne zamknięcie połączenia po zakończeniu
                using var connection = new MySqlConnection(connectionString);
                await connection.OpenAsync();   //otwiera asynchroniczne połączenie - nie blokuje programu na jego czas!

                //zczytywanie zapytania SQL z pliku
                string sql = File.ReadAllText("sql/return_car_list");
                //dodanie paginacji do zapytania
                sql += $" LIMIT {limit} OFFSET {(page - 1) * limit};";

                //tworzenie komendy sql
                using var commandSQL = new MySqlCommand(sql, connection);
                commandSQL.Parameters.AddWithValue("@userId", userId);  //przekazanie parametru user do sql

                //comantSQL - wie jakie zapytanie trzeba wykonać, ExecuteReaderAsync - wykonuje zapytanie i zwraca wynik jako obiekt MySqlDataReader
                using var reader = await commandSQL.ExecuteReaderAsync();

                var results = new List<object>();
                //czytanie rekordów z bazy danych
                while (await reader.ReadAsync())
                {
                    results.Add(new
                    {
                        id_cart = reader["id_cart"],
                        id_cart_list = reader["id_cart_list"],
                        user_id_user = reader["user_id_user"],
                    });
                }
                // Wyświetlenie informacji o zapytaniu w konsoli
                DisplayEndpointInfo(sql, results.Count, userId, page);
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