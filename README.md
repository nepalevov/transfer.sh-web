# transfer.sh-web

This repository contains the web frontend for [transfer.sh](https://github.com/dutchcoders/transfer.sh/).

## How to use it

You must specify `web-path` directory, pointing to `dist` generated folder (Grunt & bindata)

Sample :

```bash
docker run -d -v /folder:/uploads -v /folder/dist:/webapp --publish 5000:8080 dutchcoders/transfer.sh:latest --provider local --basedir /uploads --web-path /webapp/
```

## Requirement

You must install first :

* Grunt
* Go & go-bindata (go get -u github.com/shuLhan/go-bindata/...)

## Initialization

NPM

```bash
npm install
```

## Build

```bash
grunt build
go generate .
```

## Verify

You should see a `dist` directory, where all the basic .html are generated.
