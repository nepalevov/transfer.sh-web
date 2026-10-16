# Upload multiple files at once
$ curl -i -F filedata=@/tmp/hello.txt -F filedata=@/tmp/hello2.txt {{.WebAddress}}

# Combining downloads as zip or tar archive
$ curl {{.WebAddress}}({{.SampleToken}}/hello.txt,{{.SampleToken2}}/world.txt).tar.gz

$ curl {{.WebAddress}}({{.SampleToken}}/hello.txt,{{.SampleToken2}}/world.txt).zip
