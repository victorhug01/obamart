using Microsoft.EntityFrameworkCore;
using obamart.Contexts;
using obamart.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddOpenApi();

// configurando os serviços da aplicação
builder.Services.AddScoped<ClienteService>();

var connstring = builder.Configuration.GetConnectionString("Postgres");
builder.Services.AddDbContext<ObamartDbContext>(o => o.UseNpgsql(connstring));

var app = builder.Build();

if (app.Environment.IsDevelopment()) app.MapOpenApi();

app.MapControllers();

app.Run();
