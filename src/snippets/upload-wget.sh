# Upload using wget
$ wget --method PUT --body-file=./hello.txt {{.WebAddress}}hello.txt -O - -nv
