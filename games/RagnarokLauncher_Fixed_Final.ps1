# Final fixed launcher - eliminates the path error

# Use a safer method to get the EXE directory
try {
    $exeDir = [System.IO.Path]::GetDirectoryName([System.Reflection.Assembly]::GetExecutingAssembly().Location)
    if ([string]::IsNullOrEmpty($exeDir)) {
        throw "Assembly location is null"
    }
} catch {
    # Fallback to current directory
    $exeDir = $PWD.Path
}

# Ensure we have a valid directory
if ([string]::IsNullOrEmpty($exeDir)) {
    $exeDir = "."
}

# Build the HTML path safely
$htmlFile = [System.IO.Path]::Combine($exeDir, "index.html")

# Check if file exists
if ([System.IO.File]::Exists($htmlFile)) {
    # Create file URL with proper formatting
    $url = "file:///" + $htmlFile.Replace('\', '/').Replace(' ', '%20')
    
    # Launch Chrome
    try {
        Start-Process "chrome.exe" "--new-window --app=$url" -ErrorAction Stop
    } catch {
        # Fallback to Edge
        try {
            Start-Process "msedge.exe" "--new-window --app=$url" -ErrorAction Stop
        } catch {
            # Fallback to default browser
            Start-Process $htmlFile
        }
    }
}
