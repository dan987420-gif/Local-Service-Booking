# PowerShell Script to build React frontend and copy to C# backend wwwroot

Write-Host "1. Building React frontend..." -ForegroundColor Cyan
Set-Location "frontend/local-service-booking"
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Error "Failed to build React frontend."
    Exit 1
}

Write-Host "2. Copying static files to C# backend wwwroot..." -ForegroundColor Cyan
Set-Location "../.."
$wwwrootPath = "backend/LocalServiceBooking.API/wwwroot"

if (Test-Path $wwwrootPath) {
    Remove-Item -Recurse -Force $wwwrootPath
}
New-Item -ItemType Directory -Path $wwwrootPath | Out-Null

Copy-Item -Path "frontend/local-service-booking/dist/*" -Destination $wwwrootPath -Recurse -Force

Write-Host "Success! Frontend static files compiled and copied to C# backend. Now stage, commit and push to Git!" -ForegroundColor Green
