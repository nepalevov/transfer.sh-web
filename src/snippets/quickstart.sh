# Upload using cURL
$ curl --upload-file ./hello.txt {{.WebAddress}}hello.txt
{{.WebAddress}}{{.SampleToken}}/hello.txt

# Or adjust TTL and/or download limit using headers
$ curl -H "Max-Downloads: 1" -H "Max-Days: 5" --upload-file ./hello.txt {{.WebAddress}}hello.txt
{{.WebAddress}}{{.SampleToken}}/hello.txt

# Download using cURL
$ curl {{.WebAddress}}{{.SampleToken}}/hello.txt -o hello.txt
