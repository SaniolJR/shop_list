using MySql.Data.MySqlClient;
using static CartsViewAPI;

var builder = WebApplication.CreateBuilder(args);   //start aplikacji .net

// Dodaj CORS - by frontend mógł komunikować się z backendem
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin() // pozwala na dowolne źródło żądań
              .AllowAnyHeader() //pozwala na dowolne nagłówki
              .AllowAnyMethod();    //pozwala na dowolne metody HTTP
    });
});

// Dodaj OpenAPI - automatyczna dokumentacja API
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
app.ReturnCartList(builder.Configuration);
// Endpoint dodający koszyk do bazy danych
app.AddCart(builder.Configuration);


app.Run();