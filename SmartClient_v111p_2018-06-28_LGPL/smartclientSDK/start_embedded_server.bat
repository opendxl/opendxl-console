@echo off

rem read in command line args
set ARGS=
:argLoop
if ""%1""=="""" goto endArgLoop
    set ARGS=%ARGS% %1
    shift
    goto argLoop
:endArgLoop

set CWD=%CD%
cd .\WEB-INF\bin
embeddedTomcat.bat --war "/=%CWD%" --port 8080 %ARGS%