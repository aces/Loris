
#!/bin/bash

#
# This will:
#   1. Install PEAR libraries
#   2. Set up the Loris DB schema
# This will only install the database components and Loris config file.
#

CWD=`pwd`
RootDir=`dirname $CWD`

# Banner
cat <<BANNER

---------------------------------------------------------------------
                   LORIS Installation Script
---------------------------------------------------------------------

BANNER

# First check that we're running in the proper environment.
if [ ! -f ../SQL/0000-00-00-schema.sql ] ; then
    echo "Could not find schema file; make sure the current directory is in tools/ under the distribution."
    exit 2
fi

# Must be run interactively.
if ! test -t 0 -a -t 1 -a -t 2 ; then
    echo "This installation program should be run interactively."
    exit 2
fi

# Create some subdirectories, if needed.
mkdir -p logs ../project ../project/tables_sql



#
# Configure logging.
# From now on, STDOUT and STDERR are sent to both the terminal AND a logfile in logs/
#
START=`date "+%Y-%m-%dT%H:%M:%S"`
LOGFILE="logs/install-$START.log"
LOGPIPE=/tmp/pipe.$$
mkfifo -m 700 $LOGPIPE
trap "rm -f $LOGPIPE" EXIT
tee <$LOGPIPE capt &
exec 1>$LOGPIPE 2>&1



echo "LORIS Installation Script starting at $START"
echo "The log for this session will be stored in file $CWD/$LOGFILE"

if [ -f ../project/config.xml ]; then
    echo "Loris appears to already be installed. Aborting."
    exit 2;
fi

cat <<QUESTIONS

Please answer the following questions. You'll be asked:

  a) A name for the MySQL Database. This should be
     a simple identifier such as "Loris" or "Abc_Def".
     This database will be created later on.

  b) The hostname for the machine where the MySQL server run
     (this is where we'll create the database).";

  c) The MySQL username the that Loris system will use to connect
     to this server and database; this MySQL account will be
     created later on.

  d) The password for this username (it will be set later on).

  e) Another password for the 'admin' account of the Loris DB
     (it will also be set later on).

Validations are POORLY implemented here; if you make a mistake
answering these questions, kill the script with CTRL-C and
start it again.

QUESTIONS


read -p "What is the database name? " mysqldb
read -p "Database host? " mysqlhost
read -p "What MySQL user will Loris connect as? " mysqluser
stty -echo
read -p "What is the password for MySQL user '$mysqluser'? " mysqlpass
stty echo ; echo ""
stty -echo
read -p "Enter Loris admin user's password: " lorispass
stty echo ; echo ""
read -p "Enter www host:  " host
read -p "Enter www url: " url 



echo
echo "This install script needs a root MySQL user to install the"
echo "default schema. This will only be used once, to create and populate"
echo "the default tables."
read -p "Root MySQL username: " mysqlrootuser
stty -echo
read -p "Root MySQL password: " mysqlrootpass
stty echo



echo ""
echo "Attempting to create the MySQL database '$mysqldb' ..."
echo ""
echo "CREATE DATABASE $mysqldb" | mysql -h$mysqlhost --user=$mysqlrootuser --password=$mysqlrootpass -A > /dev/null 2>&1
MySQLError=$?;
if [ $MySQLError -ne 0 ] ; then
    echo "Could not connect to database with the root user provided.";
    exit 1;
fi



echo ""
echo "Attempting to create and grant privileges to MySQL user '$mysqluser'@'localhost' ..."
echo ""
echo "GRANT UPDATE,INSERT,SELECT,DELETE ON $mysqldb.* TO '$mysqluser'@'localhost' IDENTIFIED BY '$mysqlpass' WITH GRANT OPTION" | mysql $mysqldb -h$mysqlhost --user=$mysqlrootuser --password=$mysqlrootpass -A > /dev/null 2>&1
MySQLError=$?;
if [ $MySQLError -ne 0 ] ; then
    echo "Could not connect to database with the root user provided.";
    exit 1;
fi



echo ""
echo "Creating database tables from schema."
echo ""
mysql $mysqldb -h$mysqlhost --user=$mysqlrootuser --password=$mysqlrootpass -A 2>&1 < ../SQL/0000-00-00-schema.sql
echo "Updating Loris admin user's password."
mysql $mysqldb -h$mysqlhost --user=$mysqluser --password=$mysqlpass -A -e "UPDATE users SET Password_MD5=CONCAT('aa', MD5('aa$lorispass')) WHERE ID=1"



echo ""
echo "Creating config file."
echo ""
sed -e "s/%HOSTNAME%/$mysqlhost/g" \
    -e "s/%USERNAME%/$mysqluser/g" \
    -e "s/%PASSWORD%/$mysqlpass/g" \
    -e "s/%DATABASE%/$mysqldb/g" \
    -e "s#%LORISROOT%#$RootDir/#g" \
    -e "s_<host>HOSTNAME</host>_<host>$host</host>_g" \
    -e "s_<url>https://HOSTNAME/main.php</url>_<url>https://$url/main.php</url>_g" \
    < ../docs/config/config.xml > ../project/config.xml


echo ""
echo "Creating smarty symlink."
echo ""
if ! [ -L $RootDir/php/smarty ]; then
	ln -s $RootDir/php/smarty/ $RootDir/smarty
fi


echo ""
echo "Setting up templates_c directory."
echo ""
mkdir -p  $RootDir/php/smarty/templates_c
chmod 777 $RootDir/php/smarty/templates_c



while true; do
    read -p "Would you like to install PEAR libraries (affects system files)? [yn] " yn
    case $yn in
        [Yy]* )
            echo "Installing PEAR libraries (may prompt for sudo password)."
            sudo pear upgrade-all >> logs/install-`date +%Y-%m-%d`.log 2>&1
            sudo pear install Benchmark >> logs/install-`date +%Y-%m-%d`.log 2>&1
            sudo pear install Config >> logs/install-`date +%Y-%m-%d`.log 2>&1
            sudo pear install File_Archive >> logs/install-`date +%Y-%m-%d`.log 2>&1
            sudo pear install HTML_Common >> logs/install-`date +%Y-%m-%d`.log 2>&1
            sudo pear install HTML_QuickForm >> logs/install-`date +%Y-%m-%d`.log 2>&1
            sudo pear config-set preferred_state beta >> logs/install-`date +%Y-%m-%d`.log 2>&1
            sudo pear install HTML_QuickForm2 >> logs/install-`date +%Y-%m-%d`.log 2>&1
            sudo pear install Mail >> logs/install-`date +%Y-%m-%d`.log 2>&1
            sudo pear install Mail_Mime >> logs/install-`date +%Y-%m-%d`.log 2>&1
            sudo pear install Net_SMTP >> logs/install-`date +%Y-%m-%d`.log 2>&1
            sudo pear install Net_Socket >> logs/install-`date +%Y-%m-%d`.log 2>&1
            sudo pear install OLE >> logs/install-`date +%Y-%m-%d`.log 2>&1
            sudo pear install Pager >> logs/install-`date +%Y-%m-%d`.log 2>&1
            sudo pear install PhpDocumentor >> logs/install-`date +%Y-%m-%d`.log 2>&1
            sudo pear install Spreadsheet_Excel_Writer >> logs/install-`date +%Y-%m-%d`.log 2>&1
            sudo pear install Structures_Graph >> logs/install-`date +%Y-%m-%d`.log 2>&1
            sudo pear install XML_Parser >> logs/install-`date +%Y-%m-%d`.log 2>&1
            if [[ -n $(which pear) ]]; then
		echo ""
                echo "PEAR libraries seem to be installed now."
            fi
            break;;
        [Nn]* ) 
            echo "Not installing PEAR libraries."
            break;;
        * ) echo "Please enter 'y' or 'n'."
   esac
done;


while true; do
    read -p "Would you like to automatically create/install apache config files? [yn] " yn
    case $yn in
        [Yy]* )
            read -p "Enter project name: " projectname
            if [ -f /etc/apache2/sites-available/$projectname ]; then
                echo "Apache appears to already be configured for $projectname. Aborting\n"
                exit 1
            fi;

            # Need to pipe to sudo tee because > is done as the logged in user, even if run through sudo
            sed -e "s#%LORISROOT%#$RootDir/#g" \
                -e "s#%PROJECTNAME%#$projectname#g" \
                < ../docs/config/apache2-site | sudo tee /etc/apache2/sites-available/$projectname > /dev/null
            sudo a2dissite default
            sudo a2ensite $projectname
            break;;
        [Nn]* )
            echo "Not configuring apache."
            break;;
         * ) echo "Please enter 'y' or 'n'."
    esac
done;

echo "Installation complete."


