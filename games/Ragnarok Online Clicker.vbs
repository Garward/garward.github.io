Set objShell = CreateObject("WScript.Shell")
Set objFSO = CreateObject("Scripting.FileSystemObject")

' Get the directory where this script is located
strScriptPath = objFSO.GetParentFolderName(WScript.ScriptFullName)
strIndexPath = strScriptPath & "\index.html"

' Check if index.html exists
If Not objFSO.FileExists(strIndexPath) Then
    MsgBox "Error: index.html not found in " & strScriptPath & vbCrLf & vbCrLf & "Please make sure this file is in the same folder as index.html", vbCritical, "Ragnarok Online Clicker"
    WScript.Quit 1
End If

' Convert to file:// URL
strFileURL = "file:///" & Replace(strIndexPath, "\", "/")

' Try different browsers in order of preference
Dim browsers(2)
browsers(0) = "chrome.exe --new-window --app=""" & strFileURL & """"
browsers(1) = "msedge.exe --new-window --app=""" & strFileURL & """"
browsers(2) = "firefox.exe """ & strFileURL & """"

Dim launched
launched = False

' Try each browser
For i = 0 To UBound(browsers)
    On Error Resume Next
    objShell.Run browsers(i), 1, False
    If Err.Number = 0 Then
        launched = True
        Exit For
    End If
    On Error GoTo 0
Next

' Fallback to default browser if none worked
If Not launched Then
    On Error Resume Next
    objShell.Run """" & strIndexPath & """", 1, False
    If Err.Number <> 0 Then
        MsgBox "Failed to launch Ragnarok Online Clicker" & vbCrLf & vbCrLf & "Please check that you have a web browser installed.", vbCritical, "Launch Error"
        WScript.Quit 1
    End If
    On Error GoTo 0
End If

' Script completes silently
