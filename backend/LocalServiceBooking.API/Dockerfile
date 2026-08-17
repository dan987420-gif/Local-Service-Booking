# Stage 1: Build the React frontend
FROM node:20-alpine AS frontend-build
WORKDIR /frontend

# Copy package files and install all dependencies
COPY frontend/local-service-booking/package*.json ./
RUN npm install --include=dev

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

# Copy compiled React assets from Stage 1 into wwwroot folder
COPY --from=frontend-build /frontend/dist ./wwwroot

# Publish the C# application
RUN dotnet publish -c Release -o out

# Stage 3: Build final runtime image
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=backend-build /app/out .

EXPOSE 8080

# ASP.NET Core automatically binds to PORT set by Render or defaults to 8080
ENTRYPOINT ["dotnet", "LocalServiceBooking.API.dll"]
