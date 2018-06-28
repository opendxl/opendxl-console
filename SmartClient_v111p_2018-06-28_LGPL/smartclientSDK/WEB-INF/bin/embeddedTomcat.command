#!/usr/bin/perl
# MacOS X launcher
#
# READ - CHANGING HTTP PORT NUMBER:
#----------------------------------
# If you want to change the port number to which the servlet engine's http listener
# binds, do so in start_embedded_tomcat.sh, also in this directory, then re-run this script.

# autoflush
$| = 1;

# When running a .command file, the Terminal's pwd is set to the user's home directory and the
# script itself is run as an absolute path.  Using this path we figure out the path to the script
# that's being executed and the name of the script.
my $launchDir = $0;
$launchDir =~ s/(.*)\/(.*)/$1/;

my $name = $2;
$name =~ s/(.*)\.command/$1/;

# now chdir into the directory containing the script and run the .sh script of the same name
chdir($launchDir) || die "Can't chdir to $launchDir: $!";
system("sh $name.sh");
