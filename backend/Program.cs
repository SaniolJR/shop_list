using MySql.Data.MySqlClient;

var builder = WebApplication.CreateBuilder(args);

// Dodaj CORS
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// Dodaj OpenAPI
builder.Services.AddOpenApi();

var app = builder.Build();

// Użyj CORS (przed innymi middleware)
app.UseCors();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

// HTTPS redirection (opcjonalnie, może być po CORS)
app.UseHttpsRedirection();

// Endpoint zwracający listę koszyków użytkownika
app.MapGet("/return_cart_list", async (int userId, int page = 1, int limit = 9) =>
{
    try
    {
        var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
        using var connection = new MySqlConnection(connectionString);
        await connection.OpenAsync();

        // Wczytaj zapytanie SQL
        string sql = File.ReadAllText("sql/return_car_list");

        // Dodaj paginację do zapytania (wstaw wartości bezpośrednio do SQL)
        sql += $" LIMIT {limit} OFFSET {(page - 1) * limit};";

        using var commandSQL = new MySqlCommand(sql, connection);
        commandSQL.Parameters.AddWithValue("@userId", userId);

        using var reader = await commandSQL.ExecuteReaderAsync();

        var results = new List<object>();
        while (await reader.ReadAsync())
        {
            results.Add(new
            {
                id_cart = reader["id_cart"],
                id_cart_list = reader["id_cart_list"],
                user_id_user = reader["user_id_user"],
            });
        }
        Console.WriteLine("--------------------------------------------------");
        Console.WriteLine($"ZAPYTANIE SQL: {sql}");
        Console.WriteLine($"ZWRACAM {results.Count} WYNIKÓW DLA UŻYTKOWNIKA {userId} (STRONA {page})");
        return Results.Ok(results);
    }
    catch (Exception ex)
    {
        Console.WriteLine(ex.ToString());
        return Results.Problem(ex.Message);
    }
});

app.Run();