using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using LocalServiceBooking.API.Data;
using LocalServiceBooking.API.Middleware;
using LocalServiceBooking.API.Services;

var builder = WebApplication.CreateBuilder(args);

// Add Controllers & JSON settings
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
        options.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
    });

// Helper function to validate Npgsql connection string
bool IsValidNpgsqlConnectionString(string? connStr)
{
    if (string.IsNullOrWhiteSpace(connStr)) return false;
    
    if (connStr.Contains("your-project-ref") || 
        connStr.Contains("YOUR_DATABASE_PASSWORD") || 
        connStr.Contains("YOUR_SESSION_POOLER") ||
        connStr.Equals("YOUR_SESSION_POOLER_CONNECTION_STRING", StringComparison.OrdinalIgnoreCase))
    {
        return false;
    }

    try
    {
        var dbBuilder = new Npgsql.NpgsqlConnectionStringBuilder(connStr);
        return !string.IsNullOrEmpty(dbBuilder.Host);
    }
    catch
    {
        return false;
    }
}

// Configure Database Connection (SQL Server or Supabase PostgreSQL)
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
var supabaseConnectionString = Environment.GetEnvironmentVariable("SUPABASE_DB_CONNECTION_STRING") 
    ?? builder.Configuration.GetConnectionString("SupabaseConnection");

bool isSupabaseConfigured = IsValidNpgsqlConnectionString(supabaseConnectionString);
Console.WriteLine($"Supabase connection configured: {(isSupabaseConfigured ? "YES" : "NO")}");

builder.Services.AddDbContext<ApplicationDbContext>(options =>
{
    if (isSupabaseConfigured)
    {
        options.UseNpgsql(supabaseConnectionString);
    }
    else
    {
        options.UseSqlServer(connectionString);
    }
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

// Seed Database automatically on startup
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
        logger.LogError(ex, "An error occurred while seeding the database.");
    }
}

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

app.Run();
