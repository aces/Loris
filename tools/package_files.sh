#!/usr/bin/env bash
# Reads a list of files from stdin and packages them up into a tar file

set -euo pipefail

GetConfigOption() {
        eval $1=`sed -n -e "/$2/ { s/^[ \t\n]*//; s/[ \t\n]*$//; s#<[/]*$2>##gp }" ../project/config.xml`
}
GetConfigOption SavePath 'UserDownloadFiles'
GetConfigOption DownloadPath 'DownloadPath'
if [ $# -lt 1 ]; then
    echo "Usage: $0 destination\n";
    exit 2;
fi;
echo "$SavePath"
echo "$DownloadPath"

cd $DownloadPath
while read filename; do
    tar rfv /tmp/$1.tar ./$filename
done;
# gzip changes the md5sum based on the filename without the -n
# parameter.. even if it's the same data.
# The -n makes it possible to replace duplicate queries with 
# sym/hard links
gzip -n /tmp/$1.tar;
mv /tmp/$1.tar.gz $SavePath
