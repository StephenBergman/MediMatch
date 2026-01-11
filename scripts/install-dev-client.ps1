param(
    [Parameter(Mandatory=$true)]
    [string]$PackagerUrl
)

function Encode-Url([string]$u) {
    return [System.Uri]::EscapeDataString($u)
}

$ErrorActionPreference = 'Stop'

if (-not (Get-Command adb -ErrorAction SilentlyContinue)) {
    Write-Error "`adb` not found on PATH. Please install Android platform-tools and add to PATH."
    exit 2
}

Write-Host "Using packager URL: $PackagerUrl"
$encoded = Encode-Url $PackagerUrl
$deepLink = "exp+medimatch://expo-development-client/?url=$encoded"

Write-Host "Building and installing debug APK..."
Push-Location android
try {
    & .\gradlew.bat installDebug
} finally {
    Pop-Location
}

$apkPath = Join-Path -Path (Get-Location) -ChildPath "android\app\build\outputs\apk\debug\app-debug.apk"
if (-not (Test-Path $apkPath)) {
    Write-Error "APK not found at $apkPath"
    exit 3
}

Write-Host "Installing APK..."
& adb install -r $apkPath

Write-Host "Launching dev client with deep link: $deepLink"
& adb shell am start -a android.intent.action.VIEW -d $deepLink com.bergman34.MediMatch

Write-Host "Done. If the app doesn't connect, ensure your device and dev machine are on the same network and the packager URL is reachable from the device."
