# Import keys from keybase
$ keybase track [them]

# Encrypt for recipient(s) and upload
$ cat somebackupfile.tar.gz | keybase encrypt [them] | curl --upload-file '-' {{.WebAddress}}test.txt

# Download and decrypt
$ curl {{.WebAddress}}{{.SampleToken}}/test.md |keybase decrypt
