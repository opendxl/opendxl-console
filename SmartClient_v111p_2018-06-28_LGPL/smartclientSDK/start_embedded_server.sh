#!/bin/sh
CWD=`pwd`
cd ./WEB-INF/bin && ./embeddedTomcat.sh --war /=$CWD --port 8080 "$@"