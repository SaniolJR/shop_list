using MySql.Data.MySqlClient;
using Microsoft.AspNetCore.Builder;

// 1. Definiuję klasę dla danych przychodzących z frontendu
public class AddItemRequest
{
    public int userId { get; set; }
    public int cartId { get; set; }
    public string name { get; set; }
    public string description { get; set; }
    public float price { get; set; }
    public string currency { get; set; }
    public string link { get; set; }
    public string imageURL { get; set; }
}

public static class ItemsViewAPI
{
    public static void AddItem(this WebApplication app, IConfiguration config)
    {
        // przyjmujemy obiekt AddItemRequest jako dane wejściowe
        app.MapPost("/add_item", async (AddItemRequest request) =>
        {
            try
            {
                // sprawdzenie poprawnosci danych
                if (string.IsNullOrWhiteSpace(request.name) || request.name.Length > 100)
                {
                    return Results.BadRequest(new { message = "Nazwa jest wymagana i nie może przekraczać 100 znaków." });
                }

                if (!string.IsNullOrEmpty(request.description) && request.description.Length > 200)
                {
                    return Results.BadRequest(new { message = "Opis nie może przekraczać 200 znaków." });
                }

                if (request.price < 0)
                {
                    return Results.BadRequest(new { message = "Cena nie może być ujemna." });
                }

                if (!string.IsNullOrEmpty(request.currency) && request.currency.Length > 15)
                {
                    return Results.BadRequest(new { message = "Waluta nie może przekraczać 15 znaków." });
                }

                if (!string.IsNullOrEmpty(request.link) && request.link.Length > 200)
                {
                    return Results.BadRequest(new { message = "Link nie może przekraczać 200 znaków." });
                }

                if (!string.IsNullOrEmpty(request.imageURL) && request.imageURL.Length > 200)
                {
                    return Results.BadRequest(new { message = "Link do zdjęcia nie może przekraczać 200 znaków." });
                }

                // łączenie z DB
                var connectionString = config.GetConnectionString("DefaultConnection");
                using var connection = new MySqlConnection(connectionString);
                await connection.OpenAsync();

                // czy koszyk należy do użytkownika? - walidacja
                string checkCartSQL = @"
                    SELECT c.id_cart FROM cart c
                    JOIN cart_list cl ON c.cart_list_id_cart_list = cl.id_cart_list
                    WHERE c.id_cart = @cartId AND cl.user_id_user = @userId";
                using var checkCommand = new MySqlCommand(checkCartSQL, connection);
                checkCommand.Parameters.AddWithValue("@cartId", request.cartId);
                checkCommand.Parameters.AddWithValue("@userId", request.userId);
                var cartExists = await checkCommand.ExecuteScalarAsync();

                if (cartExists == null)
                {
                    return Results.BadRequest(new { message = "Koszyk nie istnieje lub nie należy do użytkownika." });
                }

                // zapytanie SQL do dodania przedmiotu
                string insertItemSQL = @"
                    INSERT INTO item (name, description, price, currency, link, imageURL)
                    VALUES (@name, @description, @price, @currency, @link, @imageURL)";

                using var insertItemCmd = new MySqlCommand(insertItemSQL, connection);
                insertItemCmd.Parameters.AddWithValue("@name", request.name);
                insertItemCmd.Parameters.AddWithValue("@description", request.description ?? "");
                insertItemCmd.Parameters.AddWithValue("@price", request.price);
                insertItemCmd.Parameters.AddWithValue("@currency", request.currency ?? "");
                insertItemCmd.Parameters.AddWithValue("@link", request.link ?? "");
                insertItemCmd.Parameters.AddWithValue("@imageURL", request.imageURL ?? "");

                await insertItemCmd.ExecuteNonQueryAsync();
                int newItemId = (int)insertItemCmd.LastInsertedId;

                // zapytanie SQL do dodania przedmiotu do koszyka
                string insertCartItemSQL = @"
                    INSERT INTO cart_items (cart_id_cart, produkt_id_produkt)
                    VALUES (@cartId, @itemId)";

                using var insertCartItemCmd = new MySqlCommand(insertCartItemSQL, connection);
                insertCartItemCmd.Parameters.AddWithValue("@cartId", request.cartId);
                insertCartItemCmd.Parameters.AddWithValue("@itemId", newItemId);

                await insertCartItemCmd.ExecuteNonQueryAsync();

                // zwrócienei sukcesu do FE
                return Results.Ok(new { success = true, message = "Przedmiot został dodany do koszyka." });
            }
            catch (Exception ex)
            {
                // zwrócenie błędu do FE
                return Results.Problem($"Błąd podczas dodawania przedmiotu: {ex.Message}");
            }
        });
    }

    public static void GetItemsList(this WebApplication app, IConfiguration config)
    {
        app.MapGet("/return_items_list", async (int userId, int cartId) =>
        {
            try
            {
                var connectionString = config.GetConnectionString("DefaultConnection");
                using var connection = new MySqlConnection(connectionString);
                await connection.OpenAsync();

                // Sprawdź czy koszyk należy do użytkownika
                string checkCartSQL = @"
                    SELECT c.id_cart FROM cart c
                    JOIN cart_list cl ON c.cart_list_id_cart_list = cl.id_cart_list
                    WHERE c.id_cart = @cartId AND cl.user_id_user = @userId";
                using var checkCommand = new MySqlCommand(checkCartSQL, connection);
                checkCommand.Parameters.AddWithValue("@cartId", cartId);
                checkCommand.Parameters.AddWithValue("@userId", userId);
                var cartExists = await checkCommand.ExecuteScalarAsync();

                if (cartExists == null)
                {
                    return Results.BadRequest("Koszyk nie istnieje lub nie należy do użytkownika.");
                }

                // Pobierz itemy z koszyka
                string sql = @"
                    SELECT i.id_item, i.name, i.description, i.price, i.currency, i.link, i.imageURL
                    FROM item i
                    JOIN cart_items ci ON i.id_item = ci.produkt_id_produkt
                    WHERE ci.cart_id_cart = @cartId";

                using var command = new MySqlCommand(sql, connection);
                command.Parameters.AddWithValue("@cartId", cartId);

                using var reader = await command.ExecuteReaderAsync();
                var items = new List<object>();

                while (await reader.ReadAsync())
                {
                    items.Add(new
                    {
                        id_item = reader.GetInt32(reader.GetOrdinal("id_item")),
                        name = reader.GetString(reader.GetOrdinal("name")),
                        description = reader.IsDBNull(reader.GetOrdinal("description")) ? "" : reader.GetString(reader.GetOrdinal("description")),
                        price = reader.IsDBNull(reader.GetOrdinal("price")) ? 0 : reader.GetFloat(reader.GetOrdinal("price")),
                        currency = reader.IsDBNull(reader.GetOrdinal("currency")) ? "" : reader.GetString(reader.GetOrdinal("currency")),
                        link = reader.IsDBNull(reader.GetOrdinal("link")) ? "" : reader.GetString(reader.GetOrdinal("link")),
                        imageURL = reader.IsDBNull(reader.GetOrdinal("imageURL")) ? "" : reader.GetString(reader.GetOrdinal("imageURL"))
                    });
                }

                return Results.Ok(items);
            }
            catch (Exception ex)
            {
                return Results.Problem($"Błąd podczas pobierania listy przedmiotów: {ex.Message}");
            }
        });
    }



}