using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using ProjetoGEA.Aplicacao;
using ProjetoGEA.Repositorio;
using ProjetoGEA.Dominio.Entidades;

using ProjetoGEA.Api.Models;
using System.Text;

var builder = WebApplication.CreateBuilder(args);
var configuration = builder.Configuration;

// ===== Dependências da Aplicação =====
builder.Services.AddScoped<IUsuarioAplicacao, UsuarioAplicacao>();
builder.Services.AddScoped<IUsuarioRepositorio, UsuarioRepositorio>();
builder.Services.AddScoped<IMateriaAplicacao, MateriaAplicacao>();
builder.Services.AddScoped<IMateriaRepositorio, MateriaRepositorio>();
builder.Services.AddScoped<ISimuladoAplicacao, SimuladoAplicacao>();
builder.Services.AddScoped<ISimuladoRepositorio, SimuladoRepositorio>();
builder.Services.AddScoped<ISprintAplicacao, SprintAplicacao>();
builder.Services.AddScoped<ISprintRepositorio, SprintRepositorio>();
builder.Services.AddScoped<ITarefaAplicacao, TarefaAplicacao>();
builder.Services.AddScoped<ITarefaRepositorio, TarefaRepositorio>();

// ===== Configuração do Banco de Dados =====
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<ProjetoGEAContexto>(options =>
    options.UseSqlServer(connectionString));

// ===== Configuração do Identity =====
builder.Services.AddIdentity<Usuario, IdentityRole<int>>()
    .AddEntityFrameworkStores<ProjetoGEAContexto>()
    .AddDefaultTokenProviders();

// ===== Configuração do JWT =====
var keyValue = configuration["Jwt:Key"];
//depuracao
Console.WriteLine($"Jwt:Key = {keyValue}");

var key = Encoding.ASCII.GetBytes(keyValue);

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false;
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(key),
        ValidateIssuer = false,
        ValidateAudience = false,
        ClockSkew = TimeSpan.Zero
    };
});

// ===== Configuração de CORS =====
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins("http://localhost:3000")
              .SetIsOriginAllowedToAllowWildcardSubdomains()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// ===== Adicionar Controllers e Swagger =====
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddAuthorization(); // Adicionando autorização
builder.Services.AddScoped<AuthService>();

var app = builder.Build();

// ===== Middleware =====
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    app.UseDeveloperExceptionPage();
}

app.UseHttpsRedirection();
app.UseCors();
app.UseAuthentication(); // JWT
app.UseAuthorization();

app.MapControllers();

app.Run();
