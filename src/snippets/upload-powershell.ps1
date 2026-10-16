# Upload using Powershell
PS H:\> invoke-webrequest -method put -infile .\file.txt {{.WebAddress}}file.txt
