using MySql.Data.MySqlClient;
using static CartsViewAPI;

var builder = WebApplication.CreateBuilder(args);   //start aplikacji .net

// Dodaj CORS - by frontend mógł komunikować się z backendem
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins("http://localhost:3000")
              .AllowCredentials()
              .AllowAnyHeader()
              .AllowAnyMethod();
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

// Endpoint usuwający koszyk z bazy danych
app.DeleteCart(builder.Configuration);

// Endpoint rejestrujący konto użytkownika
app.RegisterAccount(builder.Configuration);

// Endpoint logujący do konta użytkownika
app.LoginToAccount(builder.Configuration);

// Endpoint zwracający informacje o użytkowniku
app.GetUserInfoFromCookies();

// Endpoint odpowiadający za aktualizacje info o użytkowniku
app.UpdateAccount();

//Endpoint odpowiadający za wylogowanie użytkownika
app.Logout();

// Endpoint usuwający konto użytkownika
app.DeleteAccount();

// Endpoint dodający przedmiot do koszyka
app.AddItem(builder.Configuration);

//Endpoint zwracający listę przedmiotów w koszyku
app.GetItemsList(builder.Configuration);

//Endpoint do pozyskiwania szczegółów przedmiotu
app.GetItemDetails(builder.Configuration);

//Endpoint do aktualizowania denych przedmiotu
app.UpdateItem(builder.Configuration);

// Endpoint do usuwania przedmiotu z koszyka
app.DeleteItem(builder.Configuration);

app.Run();