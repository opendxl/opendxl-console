@echo off

set HAVE_JDK=0
set HAVE_JRE=0
set JAVA_IN_PATH=0
set USER_DEFINED_JAVA_HOME=0

rem ===========================================================================
rem JAVA_HOME detection
rem ===========================================================================
rem if JAVA_HOME is set in the env, use that
if not "%JAVA_HOME%" == "" (
   set USER_DEFINED_JAVA_HOME=1
   goto checkJavaHome
)

rem if JAVA_HOME is not set in the current environment, try to look it up in the registry
rem ===========================================================================
rem JDK >= 9 detection: JavaHome stored under a different registry key than older releases
rem ===========================================================================
set KeyName=HKEY_LOCAL_MACHINE\SOFTWARE\JavaSoft\JDK
set Cmd=reg query "%KeyName%" /s
for /f "tokens=2*" %%i in ('%Cmd% ^| find "JavaHome"') do (
	set JAVA_HOME=%%j
	set JAVA=%%j\bin\java
)
if not "%JAVA_HOME%" == "" (
   set HAVE_JDK=1
   goto checkJavaHome
)

rem if JAVA_HOME is not set in the current environment, try to look it up in the registry
rem ===========================================================================
rem JDK < 9 detection
rem ===========================================================================
set KeyName=HKEY_LOCAL_MACHINE\SOFTWARE\JavaSoft\Java Development Kit
set Cmd=reg query "%KeyName%" /s
for /f "tokens=2*" %%i in ('%Cmd% ^| find "JavaHome"') do (
	set JAVA_HOME=%%j
	set JAVA=%%j\bin\java
)
if not "%JAVA_HOME%" == "" (
   set HAVE_JDK=1
   goto checkJavaHome
)

rem ===========================================================================
rem JRE >= 9 detection
rem ===========================================================================
set KeyName=HKEY_LOCAL_MACHINE\SOFTWARE\JavaSoft\JDK
set Cmd=reg query "%KeyName%" /s
for /f "tokens=2*" %%i in ('%Cmd% ^| find "JavaHome"') do (
	set JAVA_HOME=%%j
	set JAVA=%%j\bin\java
)
if not "%JAVA_HOME%" == "" (
   set HAVE_JRE=1
   goto checkJavaHome
)

rem ===========================================================================
rem JRE < 9 detection
rem ===========================================================================
set KeyName=HKEY_LOCAL_MACHINE\SOFTWARE\JavaSoft\Java Runtime Environment
set Cmd=reg query "%KeyName%" /s
for /f "tokens=2*" %%i in ('%Cmd% ^| find "JavaHome"') do (
	set JAVA_HOME=%%j
	set JAVA=%%j\bin\java
)
if not "%JAVA_HOME%" == "" (
   set HAVE_JRE=1
   goto checkJavaHome
)

rem ===========================================================================
rem Java path detection
rem ===========================================================================
rem as a last effort, try java in the path
for /f %%A in ("java.exe") do (
    set JAVA_BIN_DIR=%%~dp$PATH:A
    set JAVA=%%~dp$PATH:A\java
)
if not "%JAVA_BIN_DIR%" == "" (
   set JAVA_IN_PATH=1
   goto checkJavaHome
)

:checkJavaHome
if %USER_DEFINED_JAVA_HOME% == 1 (
    echo. 
    echo:Using user-defined JAVA_HOME: "%JAVA_HOME%"
    echo. 
    goto setJava
)

if %HAVE_JDK% == 1 (
    echo.
    echo:Using auto-detected JDK JAVA_HOME: "%JAVA_HOME%"
    echo.
    goto setJava
)

if %HAVE_JRE% == 1 (
    echo.
    echo:Using auto-detected JRE JAVA_HOME: "%JAVA_HOME%"
    echo.
    goto setJava
)

if %JAVA_IN_PATH% == 1 (
    echo.
    echo:Using Java installation detected in PATH variable at "%JAVA_BIN_DIR%"
    echo.
    goto setJava
)

rem if JAVA_HOME is unset, complain
if "%JAVA_HOME%" == "" (
    echo.
    echo:Error: could not find a Java JDK or JRE in your environment.
    echo.
    echo:If you do not have Java installed, please download and install the JDK.
    echo:If you do have Java installed, please set the JAVA_HOME environment
    echo:variable to the base directory of the JDK.
    echo.
    pause
    exit
)

:setJava
rem if JAVA_HOME environment var is set, look in there for the java binary - otherwise rely on the
rem PATH environment var
if "%JAVA%" == "" set JAVA=java
if not "%JAVA_HOME%" == "" set JAVA=%JAVA_HOME%\bin\java
 
rem read in command line args
set ARGS=
:argLoop
if ""%1""=="""" goto endArgLoop
    set ARGS=%ARGS% %1
    shift
    goto argLoop
:endArgLoop

rem determine java version
for /f "tokens=3*" %%g in ('"%JAVA%" -version 2^>^&1 ^| findstr /i version') do (
    set JAVA_VERSION=%%g
)
set JAVA_VERSION=%JAVA_VERSION:"=%

rem JDK 9 doesn't ship with EE APIs such as javax.xml.bind: must pass a special flag
set JAVA_RUNTIME_ARGS=
if "%JAVA_VERSION%" == "9" (
    set JAVA_RUNTIME_ARGS=--add-modules=java.se.ee
)

rem Remember (so we can restore) and set UTF8 codepage on console.  Note that you also need to set a font
rem contains UTF8 chars (most if not all TrueType fonts will work. E.g. "Lucida Console")
for /f "tokens=2 delims=:." %%x in ('chcp') do set DEFAULT_CODEPAGE=%%x
chcp 65001

rem Workaround: HSQLDB shifts dates according to timezone, even if the column is declared as a 
rem true "date" column, which should be timezoneless.  The "user.timezone" reference in this 
rem call sets the local timezone to match the timezone where the sample DB was created.
"%JAVA%" %JAVA_RUNTIME_ARGS% -Xmx512m -XX:MaxPermSize=256m -Djava.awt.headless=true  -Duser.timezone=GMT -Djava.awt.headless=true  -cp "%JAVA_HOME%\lib\tools.jar";"%JAVA_HOME%\lib\dt.jar";..\..\WEB-INF\embeddedTomcat\classes;..\..\WEB-INF\embeddedTomcat\LICENSE;..\..\WEB-INF\embeddedTomcat\NOTICE;..\..\WEB-INF\embeddedTomcat\annotations-api.jar;..\..\WEB-INF\embeddedTomcat\ecj-4.6.3.jar;..\..\WEB-INF\embeddedTomcat\tomcat-dbcp.jar;..\..\WEB-INF\embeddedTomcat\tomcat-embed-core.jar;..\..\WEB-INF\embeddedTomcat\tomcat-embed-el.jar;..\..\WEB-INF\embeddedTomcat\tomcat-embed-jasper.jar;..\..\WEB-INF\embeddedTomcat\tomcat-embed-websocket.jar;..\..\WEB-INF\embeddedTomcat\classes\;..\..\WEB-INF\lib\isomorphic_embedded_tomcat85.jar;..\..\WEB-INF\lib\log4j-1.2.17.jar;..\..\WEB-INF\lib\commons-cli-1.4.jar;..\..\WEB-INF\embeddedTomcat\* com.isomorphic.embedded_tomcat.EmbeddedTomcat85 -CmaxPostSize=104857600 -CmaxThreads=1000 -CmaxHeaderCount=200 -CmaxHttpHeaderSize=1048576 -CmaxKeepAliveRequests=1000 --catalinaHome ../embeddedTomcat %ARGS%

rem Restore original codepage. Technically this can fail to be called if the user
rem interrupts batch execution with Ctrl+C.  But given that these are not intended to be
rem production tools and the fact that in most cases failure to reset is innocuous, this should
rem be fine.
chcp %DEFAULT_CODEPAGE%

rem if there was an error or relevant output - allow the user to see it before the window
rem auto-closes
pause
