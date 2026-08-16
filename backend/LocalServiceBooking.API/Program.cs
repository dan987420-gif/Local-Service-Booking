using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using LocalServiceBooking.API.Data;
using LocalServiceBooking.API.Middleware;
using LocalServiceBooking.API.Services;

var builder = WebApplication.CreateBuilder(args);

var port = Environment.GetEnvironmentVariable("PORT") ?? "5000";
builder.WebHost.UseUrls($"http://0.0.0.0:{port}");

// Add Controllers & JSON settings
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
        options.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
    });

// Helper function to convert Postgres URI format to standard connection string
string ConvertPostgresUriToConnectionString(string? uriStr)
{
    if (string.IsNullOrWhiteSpace(uriStr)) return string.Empty;
    
    uriStr = uriStr.Trim().TrimEnd('.');

    if (!uriStr.StartsWith("postgresql://", StringComparison.OrdinalIgnoreCase) && 
        !uriStr.StartsWith("postgres://", StringComparison.OrdinalIgnoreCase))
    {
        return uriStr;
    }

    try
    {
        var uri = new Uri(uriStr);
        var userInfo = uri.UserInfo.Split(':');
        var username = userInfo[0];
        var password = userInfo.Length > 1 ? Uri.UnescapeDataString(userInfo[1]) : "";
        var host = uri.Host;
        var port = uri.Port > 0 ? uri.Port : 5432;
        var database = uri.AbsolutePath.TrimStart('/');

        return $"Host={host};Port={port};Database={database};Username={username};Password={password};SSL Mode=Require;Trust Server Certificate=true;";
    }
    catch
    {
        return uriStr;
    }
}

string SanitizeSupabaseConnectionString(string? connStr)
{
    if (string.IsNullOrWhiteSpace(connStr)) return string.Empty;

    var connectionString = ConvertPostgresUriToConnectionString(connStr);

    try
    {
        var dbBuilder = new Npgsql.NpgsqlConnectionStringBuilder(connectionString);
        if (dbBuilder.Host != null && dbBuilder.Host.Contains("pooler.supabase.com", StringComparison.OrdinalIgnoreCase))
        {
            if (dbBuilder.Username == "postgres")
            {
                dbBuilder.Username = "postgres.yyiptgonfedomzcttjvo";
            }
        }
        return dbBuilder.ToString();
    }
    catch
    {
        return connectionString;
    }
}

// Configure Database Connection (Supabase PostgreSQL)
var rawSupabaseConnectionString = Environment.GetEnvironmentVariable("SUPABASE_DB_CONNECTION_STRING") 
    ?? builder.Configuration.GetConnectionString("SupabaseConnection");

var supabaseConnectionString = SanitizeSupabaseConnectionString(rawSupabaseConnectionString);

if (string.IsNullOrWhiteSpace(supabaseConnectionString))
{
    throw new InvalidOperationException("Database connection string 'SupabaseConnection' is not configured.");
}

builder.Services.AddDbContext<ApplicationDbContext>(options =>
{
    options.UseNpgsql(supabaseConnectionString);
});

// Configure Scoped Services
builder.Services.AddScoped<JwtService>();
builder.Services.AddScoped<RecommendationService>();
builder.Services.AddScoped<TrustScoreService>();

// Configure JWT Authentication
var secretKey = builder.Configuration["JwtSettings:SecretKey"];
if (string.IsNullOrEmpty(secretKey) || secretKey == "YOUR_SUPER_SECRET_KEY_HERE")
{
    throw new InvalidOperationException("JWT SecretKey is not configured.");
}
var key = Encoding.UTF8.GetBytes(secretKey);

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
        ValidateIssuer = true,
        ValidIssuer = builder.Configuration["JwtSettings:Issuer"] ?? "LocalServiceBookingAPI",
        ValidateAudience = true,
        ValidAudience = builder.Configuration["JwtSettings:Audience"] ?? "LocalServiceBookingClient",
        ClockSkew = TimeSpan.Zero
    };
});

// Configure CORS for Vite React Frontend
var allowedOrigins = builder.Configuration["AllowedOrigins"]?.Split(',') 
    ?? new[] { "http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173", "http://localhost:5174" };

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins(allowedOrigins)
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// Configure Swagger / OpenAPI
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Local Service Booking API (ServiceConnect)",
        Version = "v1",
        Description = "ASP.NET Core Web API for ServiceConnect Local Service Booking Application"
    });

    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Example: \"Bearer {token}\"",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

var app = builder.Build();

// Seed Database automatically on startup (non-blocking)
_ = Task.Run(() =>
{
    using (var scope = app.Services.CreateScope())
    {
        var services = scope.ServiceProvider;
        try
        {
            var dbContext = services.GetRequiredService<ApplicationDbContext>();
            DbInitializer.Initialize(dbContext);
        }
        catch (Exception ex)
        {
            var logger = services.GetRequiredService<ILogger<Program>>();
            logger.LogError(ex, "An error occurred while seeding the database asynchronously.");
        }
    }
});

// Configure HTTP Middleware Pipeline
app.UseMiddleware<ExceptionMiddleware>();

if (app.Environment.IsDevelopment() || true)
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Local Service Booking API v1");
        c.RoutePrefix = "swagger";
    });
}

app.UseCors("AllowFrontend");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.MapGet("/healthz", () => Results.Ok(new { status = "healthy", timestamp = DateTime.UtcNow }));

app.Run();
