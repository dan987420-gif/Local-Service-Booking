# Stage 1: Build the React frontend
FROM node:20 AS frontend-build
WORKDIR /frontend

# Copy package files and install dependencies
COPY frontend/local-service-booking/package*.json ./
RUN npm install

# Copy frontend source and build static assets
COPY frontend/local-service-booking/ ./
RUN npm run build

# Stage 2: Build the C# backend application
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS backend-build
WORKDIR /app

# Copy csproj and restore
COPY backend/LocalServiceBooking.API/*.csproj ./
RUN dotnet restore

# Copy backend source
COPY backend/LocalServiceBooking.API/ ./

# Copy compiled React assets from Stage 1 into the wwwroot folder
COPY --from=frontend-build /frontend/dist ./wwwroot

# Publish the C# application
RUN dotnet publish -c Release -o out

# Stage 3: Build final runtime image
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=backend-build /app/out .

EXPOSE 5000

# Render dynamically injects a PORT environment variable
ENTRYPOINT ["sh", "-c", "dotnet LocalServiceBooking.API.dll --urls http://0.0.0.0:${PORT:-5000}"]
