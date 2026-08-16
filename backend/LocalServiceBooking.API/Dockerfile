# Stage 1: Build the application
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build-env
WORKDIR /app

# Copy csproj and restore as distinct layers
COPY *.csproj ./
RUN dotnet restore

# Copy everything else and build
COPY . ./
RUN dotnet publish -c Release -o out

# Stage 2: Build runtime image
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build-env /app/out .

# Expose port 80/5000 (informative metadata)
EXPOSE 5000

# Render dynamically injects a PORT environment variable.
# We bind to all interfaces (0.0.0.0) on the Render-assigned port, defaulting to 5000.
ENTRYPOINT ["sh", "-c", "dotnet LocalServiceBooking.API.dll --urls http://0.0.0.0:${PORT:-5000}"]
