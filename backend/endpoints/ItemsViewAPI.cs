using MySql.Data.MySqlClient;
using Microsoft.AspNetCore.Builder;

public static class ItemsViewAPI
{
    public static void ReturnItemList(this WebApplication app, IConfiguration config)
    {
        app.MapGet("/return_item_list", async (int userId, int page, int limit) =>
        {
            try
            {
                var connectionString = config.GetConnectionString("DefaultConnection");
                using var connection = new MySqlConnection(connectionString);
                await connection.OpenAsync();

                string sql = File.ReadAllText("sql/return_item_list.sql");
                sql += $" LIMIT {limit} OFFSET {(page - 1) * limit}";

                using var commandSQL = new MySqlCommand(sql, connection);
                commandSQL.Parameters.AddWithValue("@userId", userId);

                using var reader = await commandSQL.ExecuteReaderAsync();

                var results = new List<object>();
                while (await reader.ReadAsync())
                {
                    results.Add(new
                    {
                        id_item = reader["id_item"],
                        name = reader["name"],
                        description = reader["description"],
                        price = reader["price"],
                        user_id_user = reader["user_id_user"],
                    });
                }
                return Results.Ok(results);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
                return Results.Problem(ex.Message);
            }
        });
    }


}