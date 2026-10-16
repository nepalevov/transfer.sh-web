# Backup, encrypt and transfer
$ mysqldump --all-databases|gzip|gpg -ac -o-|curl -X PUT --upload-file "-" {{.WebAddress}}test.txt
