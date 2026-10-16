# Encrypt files with password using gpg and upload
$ cat /tmp/hello.txt|gpg -ac -o-|curl -X PUT --upload-file "-" {{.WebAddress}}test.txt

# Download and decrypt
$ curl {{.WebAddress}}{{.SampleToken}}/test.txt|gpg -o- > /tmp/hello.txt
