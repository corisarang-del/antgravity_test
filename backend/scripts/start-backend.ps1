param(
    [string]$HostName = "127.0.0.1",
    [int]$Port = 8000,
    [switch]$NoReload
)

$ErrorActionPreference = "Stop"

$repoBackendRoot = Join-Path $PSScriptRoot ".."
$pythonPath = Join-Path $repoBackendRoot ".venv\\Scripts\\python.exe"

if (-not (Test-Path $pythonPath)) {
    throw "Python venv not found: $pythonPath"
}

# Clear broken system proxy values to prevent market-data API failures.
$env:HTTP_PROXY = ""
$env:HTTPS_PROXY = ""
$env:ALL_PROXY = ""
$env:http_proxy = ""
$env:https_proxy = ""
$env:all_proxy = ""

$existingNoProxy = $env:NO_PROXY
if ([string]::IsNullOrWhiteSpace($existingNoProxy)) {
    $env:NO_PROXY = "localhost,127.0.0.1"
} elseif ($existingNoProxy -notmatch "localhost" -or $existingNoProxy -notmatch "127.0.0.1") {
    $env:NO_PROXY = "$existingNoProxy,localhost,127.0.0.1"
}
$env:no_proxy = $env:NO_PROXY

$args = @("-m", "uvicorn", "main:app", "--host", $HostName, "--port", "$Port")
if (-not $NoReload) {
    $args += "--reload"
}

Push-Location $repoBackendRoot
try {
    & $pythonPath @args
} finally {
    Pop-Location
}
