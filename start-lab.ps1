# Survey App - Production Startup Script
$ErrorActionPreference = "Continue"

# 1. Get Local IP Address and Generate Random Port
$ip = (Get-NetIPAddress -AddressFamily IPv4 | Where-Object { $_.InterfaceAlias -notlike "*Loopback*" -and $_.IPv4Address -notlike "169.254.*" } | Select-Object -First 1).IPAddress
if (-not $ip) { $ip = "localhost" }
$port = Get-Random -Minimum 10000 -Maximum 60000

Write-Host "`n===================================================="
Write-Host "      Survey Platform - Production Mode"
Write-Host "====================================================`n"

# 2. Check if a valid build exists (Check for BUILD_ID)
if (-not (Test-Path ".next\BUILD_ID")) {
    Write-Host "[!] No production build found. Building project now..." -ForegroundColor Yellow
    Write-Host "[!] This may take 1-2 minutes. Please wait..." -ForegroundColor Yellow
    npm run build
    if ($LASTEXITCODE -ne 0) {
        Write-Host "`n[ERROR] Build failed! Please check the errors above." -ForegroundColor Red
        return
    }
}

# 3. Manage Firewall (Requires Admin Rights)
Write-Host "[*] Configuring firewall for port $port..." -ForegroundColor Gray
try {
    # Remove old rules to keep it clean
    Remove-NetFirewallRule -DisplayName "Survey-Platform-Inbound" -ErrorAction SilentlyContinue
    # Add new rule for the current session
    New-NetFirewallRule -DisplayName "Survey-Platform-Inbound" -Direction Inbound -LocalPort $port -Protocol TCP -Action Allow -ErrorAction Stop
    Write-Host "[+] Firewall configured successfully." -ForegroundColor Green
} catch {
    Write-Host "[!] Warning: Failed to configure firewall. If others cannot connect, please run as Administrator." -ForegroundColor Yellow
}

# 4. Start the server
Write-Host "`n[+] Starting server..." -ForegroundColor Green
Write-Host "[+] ACCESS URL: http://$($ip):$port" -ForegroundColor Green
Write-Host "[+] ADMIN URL:  http://$($ip):$port/admin" -ForegroundColor Yellow
Write-Host "[!] KEEP THIS WINDOW OPEN.`n"

$env:NODE_OPTIONS = "--max-old-space-size=4096"
$env:PORT = $port
npm run lab
