#!/usr/bin/env bash
#Authors :
#Basile Lamotte & Victor BULTEZ
node index.js &
case "$OSTYPE" in
linux*) xdg-open http://localhost:3000 ;;
darwin*) open http://localhost:3000 ;;
cygwin*) cygstart http://localhost:3000 ;;
msys*) start http://localhost:3000 ;;
win32*) start http://localhost:3000 ;;
freebsd*) xdg-open http://localhost:3000 ;;
esac
python -u main.py ${1-4} > output.txt
