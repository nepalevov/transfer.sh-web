# Encrypt files with password using openssl and upload
$ cat /tmp/hello.txt|openssl aes-256-cbc -pbkdf2 -e|curl -X PUT --upload-file "-" {{.WebAddress}}test.txt

# Download and decrypt
$ curl {{.WebAddress}}{{.SampleToken}}/test.txt|openssl aes-256-cbc -pbkdf2 -d > /tmp/hello.txt
