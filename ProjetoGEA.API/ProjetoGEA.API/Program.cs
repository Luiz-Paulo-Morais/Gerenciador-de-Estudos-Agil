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

//var key = Encoding.ASCII.GetBytes(keyValue);
var key = Encoding.UTF8.GetBytes(keyValue);

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
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = configuration["Jwt:Issuer"],
        ValidAudience = configuration["Jwt:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(key),
        RequireExpirationTime = false, // 🚀 Permite tokens expirados para teste
        ValidateActor = false,
        ValidateTokenReplay = false
    };

    // Personaliza a extração do token do cookie
    options.Events = new JwtBearerEvents
    {
        OnMessageReceived = context =>
        {
            if (context.Request.Cookies.ContainsKey("token"))
            {
                var token = context.Token = context.Request.Cookies["token"];
                Console.WriteLine($"[DEBUG] Token Recebido no Cookie: {token}");
            }
            else
            {
                Console.WriteLine("[DEBUG] Nenhum token encontrado nos cookies.");
            }
            return Task.CompletedTask;
        }
    };
});

// ===== Configuração de CORS =====
builder.Services.AddCors(options =>
{
    options.AddPolicy("CorsPolicy", policy =>
    {
        policy.WithOrigins("http://localhost:3000")
              //.SetIsOriginAllowedToAllowWildcardSubdomains()
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials(); // ✅ Permite envio de cookies;
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

app.UseCors("CorsPolicy");
app.UseAuthentication(); // JWT
app.UseAuthorization();

if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection(); // Apenas em produção
}

app.MapControllers();

app.Run();
