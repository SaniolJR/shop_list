using MySql.Data.MySqlClient;

//================minimal configuration for a mobile app using .NET 8=================

//configure mobile app
var builder = WebApplication.CreateBuilder(args);
// Add services to the container - openAPI
builder.Services.AddOpenApi();
//to biuld app
var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}
//share API documentation in production
app.UseHttpsRedirection();

//===================end minimal configuration for a mobile app using .NET 8=================


//MapGet is used to add endpoints to the app, endpoint adress must start with/

//===================run the app=================

app.MapGet("/describe", async () =>
{
    try
    {
        var opisKolumn = new List<object>();
        var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
        using var connection = new MySqlConnection(connectionString);
        await connection.OpenAsync();
        using var command = new MySqlCommand("DESCRIBE item", connection);
        using var reader = await command.ExecuteReaderAsync();
        while (await reader.ReadAsync())
        {
            opisKolumn.Add(new
            {
                Field = reader.GetString(0),
                Type = reader.GetString(1),
                Null = reader.GetString(2),
                Key = reader.GetString(3),
                Default = reader.IsDBNull(4) ? null : reader.GetValue(4),
                Extra = reader.GetString(5)
            });
        }
        return Results.Ok(opisKolumn);
    }
    catch (Exception ex)
    {
        return Results.Problem(ex.Message);
    }
});

app.Run();
