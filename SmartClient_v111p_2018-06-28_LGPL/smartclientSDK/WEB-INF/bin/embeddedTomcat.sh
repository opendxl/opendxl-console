#!/bin/sh

# if JAVA_HOME is not set, try to autodetect
if [ "x$JAVA_HOME" = "x" ]; then
    if [ -x /usr/libexec/java_home ]; then #Canonical OSX mechanism
        JAVA_HOME=`/usr/libexec/java_home`
    elif [ -d /usr/lib/jvm/java ]; then #Canonical Linux mechanism
        JAVA_HOME=/usr/lib/jvm/java
    else
        # On Unix jdk1.3+ is in /usr/j2se - failing that it's in /usr/java
        if [ -d /usr/java/default ]; then
            JAVA_HOME=/usr/java/default
        elif [ -d /usr/java/latest ]; then
            JAVA_HOME=/usr/java/latest
        elif [ -d /usr/j2se ]; then
            JAVA_HOME=/usr/j2se
        elif [ -d /usr/java ]; then
            JAVA_HOME=/usr/java
        fi
    fi
    if [ "x$JAVA_HOME" = "x" ]; then    
        echo
        echo "Unable to auto-detect JAVA_HOME.  Assuming 'java' is in PATH"
        echo
    else 
        echo
        echo "Using auto-detected JAVA_HOME: $JAVA_HOME"
        echo
    fi
else
    echo
    echo "Using user-defined JAVA_HOME: $JAVA_HOME" 
    echo
fi

# disable use of high quality, but blocking /dev/random generator by requesting /dev/urandom if it exists
RANDOMGEN="";
if [ -e /dev/urandom ]; then
    RANDOMGEN="-Djava.security.egd=file:/dev/./urandom"
fi

# if JAVA_HOME is set, we use $JAVA_HOME/bin/java - otherwise just use whatever's in the PATH
JAVA=java
if [ "x$JAVA_HOME" != "x" ]; then
    export JAVA_HOME
    JAVA="$JAVA_HOME/bin/java"
else
    echo
    echo "Error: could not find a Java JDK or JRE on your system."
    echo
    echo "If you do not have Java installed, please download and install the JDK."
    echo "If you do have Java installed, please set the JAVA_HOME environment"
    echo "variable to the base directory of the JDK."
    echo
    exit 1
fi

# JDK 9 doesn't ship with EE APIs such as javax.xml.bind: must pass a special flag
JAVA_RUNTIME_ARGS="";
JAVA_VERSION=$($JAVA -version 2>&1 | awk -F '"' '/version/ {print $2}')
if [[ "$JAVA_VERSION" = "9" ]]; then
    JAVA_RUNTIME_ARGS="--add-modules java.se.ee"
fi

 
# Workaround: HSQLDB shifts dates according to timezone, even if the column is declared as a 
# true "date" column, which should be timezoneless.  The "user.timezone" reference in this 
# call sets the local timezone to match the timezone where the sample DB was created.
$JAVA $JAVA_RUNTIME_ARGS -Xmx512m -XX:MaxPermSize=256m -Djava.awt.headless=true $RANDOMGEN  -Duser.timezone=GMT -Djava.awt.headless=true  -cp $JAVA_HOME/lib/tools.jar:$JAVA_HOME/lib/dt.jar:../../WEB-INF/embeddedTomcat/classes:../../WEB-INF/embeddedTomcat/LICENSE:../../WEB-INF/embeddedTomcat/NOTICE:../../WEB-INF/embeddedTomcat/annotations-api.jar:../../WEB-INF/embeddedTomcat/ecj-4.6.3.jar:../../WEB-INF/embeddedTomcat/tomcat-dbcp.jar:../../WEB-INF/embeddedTomcat/tomcat-embed-core.jar:../../WEB-INF/embeddedTomcat/tomcat-embed-el.jar:../../WEB-INF/embeddedTomcat/tomcat-embed-jasper.jar:../../WEB-INF/embeddedTomcat/tomcat-embed-websocket.jar:../../WEB-INF/embeddedTomcat/classes/:../../WEB-INF/lib/isomorphic_embedded_tomcat85.jar:../../WEB-INF/lib/log4j-1.2.17.jar:../../WEB-INF/lib/commons-cli-1.4.jar:../../WEB-INF/embeddedTomcat/* com.isomorphic.embedded_tomcat.EmbeddedTomcat85 -CmaxPostSize=104857600 -CmaxThreads=1000 -CmaxHeaderCount=200 -CmaxHttpHeaderSize=1048576 -CmaxKeepAliveRequests=1000 --catalinaHome ../embeddedTomcat "$@"
