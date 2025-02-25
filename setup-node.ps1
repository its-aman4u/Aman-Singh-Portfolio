D:\My data\My Coding\My Portfolio\node-v20.11.1-win-x64\node-v20.11.1-win-x64 = "D:\My data\My Coding\My Portfolio\node-v20.11.1-win-x64\node-v20.11.1-win-x64"

# Check if Node.js path is already in PATH
 = C:\WINDOWS\system32;C:\WINDOWS;C:\WINDOWS\System32\Wbem;C:\WINDOWS\System32\WindowsPowerShell\v1.0\;C:\WINDOWS\System32\OpenSSH\;C:\Users\Holisol.HSLL-HO-1955\AppData\Local\Microsoft\WindowsApps;D:\My data\Microsoft VS Code\bin;C:\Users\Holisol.HSLL-HO-1955\AppData\Local\Programs\Git\cmd;D:\My data\My Coding\Windsurf\bin;C:\Users\Holisol.HSLL-HO-1955\AppData\Local\Microsoft\WinGet\Packages\Schniz.fnm_Microsoft.Winget.Source_8wekyb3d8bbwe;;D:\My data\My Coding\My Portfolio\node-v20.11.1-win-x64\node-v20.11.1-win-x64 -split ';'
if (-not ( -contains D:\My data\My Coding\My Portfolio\node-v20.11.1-win-x64\node-v20.11.1-win-x64)) {
    C:\WINDOWS\system32;C:\WINDOWS;C:\WINDOWS\System32\Wbem;C:\WINDOWS\System32\WindowsPowerShell\v1.0\;C:\WINDOWS\System32\OpenSSH\;C:\Users\Holisol.HSLL-HO-1955\AppData\Local\Microsoft\WindowsApps;D:\My data\Microsoft VS Code\bin;C:\Users\Holisol.HSLL-HO-1955\AppData\Local\Programs\Git\cmd;D:\My data\My Coding\Windsurf\bin;C:\Users\Holisol.HSLL-HO-1955\AppData\Local\Microsoft\WinGet\Packages\Schniz.fnm_Microsoft.Winget.Source_8wekyb3d8bbwe;;D:\My data\My Coding\My Portfolio\node-v20.11.1-win-x64\node-v20.11.1-win-x64 += ";D:\My data\My Coding\My Portfolio\node-v20.11.1-win-x64\node-v20.11.1-win-x64"
}

# Verify Node.js installation
try {
    Write-Host "Node.js version:"
    Start-Process -FilePath "D:\My data\My Coding\My Portfolio\node-v20.11.1-win-x64\node-v20.11.1-win-x64\node.exe" -ArgumentList "-v" -NoNewWindow -Wait
}
catch {
    Write-Host "Failed to verify Node.js version: "
}

# Verify npm installation
try {
    Write-Host "npm version:"
    Start-Process -FilePath "D:\My data\My Coding\My Portfolio\node-v20.11.1-win-x64\node-v20.11.1-win-x64\npm.cmd" -ArgumentList "-v" -NoNewWindow -Wait
}
catch {
    Write-Host "Failed to verify npm version: "
}
