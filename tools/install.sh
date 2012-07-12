#!/bin/sh
# This will:
#   1. Install PEAR libraries
#   2. Set up 
# This will only install the database components and Loris config file.
# It will not affect any system

CWD=`pwd`;

if [ ! -f ../SQL/0000-00-00-schema.sql ]; then
    echo "Could not find schema file";
    exit 1;
fi
if [ ! -d ../project ]; then
    mkdir ../project
fi
if [ -f ../project/config.xml ]; then
    echo "Loris appears to already be installed. Aborting."
    exit 1;
fi


read -p "What is the database name? " mysqldb
read -p "Database host? " mysqlhost
read -p "What MySQL user will Loris connect as? " mysqluser
read -p "What MySQL is $mysqluser's password? " mysqlpass

echo
echo "The install script needs a root MySQL user to install the"
echo "default schema. This will only be used to create and populate"
echo "the default tables, and will not be saved."
read -p "Root MySQL user: " mysqlrootuser
read -p "Root MySQL password: " mysqlrootpass
echo "CREATE DATABASE $mysqldb" | mysql -h$mysqlhost -u$mysqlrootuser -p$mysqlrootpass -A > /dev/null 2>&1
echo "GRANT UPDATE,INSERT,SELECT,DELETE ON $mysqldb.* TO '$mysqluser'@'localhost' IDENTIFIED BY '$mysqlpass' WITH GRANT OPTION" | mysql $mysqldb -h$mysqlhost -u$mysqlrootuser -p$mysqlrootpass -A > /dev/null 2>&1

MySQLError=$?;

if [ $MySQLError -eq 0 ]; then
    RootDir=`dirname $CWD`;
    echo "Creating config file"
    sed -e "s/%HOSTNAME%/$mysqlhost/g" -e "s/%USERNAME%/$mysqluser/g" -e "s/%PASSWORD%/$mysqlpass/g" -e "s/%DATABASE%/$mysqldb/g" -e "s#%LORISROOT%#$RootDir/#g" ../docs/config/config.xml > ../project/config.xml

    if [ ! -d $RootDir/php/smarty/templates_c ]; then
        echo "Creating templates_c"
        mkdir $RootDir/php/smarty/templates_c
    fi
    echo "Fixing permissions on template_c"
    chmod 777 $RootDir/php/smarty/templates_c/

    echo "Creating database tables"
    mysql $mysqldb -h$mysqlhost -u$mysqlrootuser -p$mysqlrootpass -A >> logs/install-`date +%Y-%m-%d`.log 2>&1 < ../SQL/0000-00-00-schema.sql
    read -p "Enter admin user's password (will be echoed to screen, and prompted to reset on login to Loris): " lorispass
    echo "Updating admin password "
    mysql $mysqldb -h$mysqlhost -u$mysqluser -p$mysqlpass -A -e "UPDATE users SET Password_MD5=CONCAT('aa', MD5('aa$lorispass')) WHERE ID=1"

    while true; do
        read -p "Would you like to install PEAR libraries (affects system files)? [yn] " yn
        case $yn in
            [Yy]* )
                echo "Installing PEAR libraries (may prompt for sudo password)"
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
                break;;
            [Nn]* ) 
                echo "Not installing PEAR libraries"
                break;;
            * ) echo "Please enter y or n"
       esac
    done;
    while true; do
        read -p "Would you like to automatically create/install apache config files? [yn] " yn
        case $yn in
            [Yy]* )
                read -p "Enter project name (no spaces): " projectname
                if [ -f /etc/apache2/sites-available/$projectname ]; then
                    echo "Apache appears to already be configured for $projectname. Aborting\n"
                    exit 1
                fi;

                # Need to pipe to sudo tee because > is done as the logged in user, even if run through sudo
                sed -e "s#%LORISROOT%#$RootDir/#g"  -e "s#%PROJECTNAME%#$projectname#g" ../docs/config/apache2-site | sudo tee /etc/apache2/sites-available/$projectname > /dev/null
                sudo a2dissite default
                sudo a2ensite $projectname
                break;;
            [Nn]* )
                echo "Not configuring apache"
                break;;
             * ) echo "Please enter y or n"
        esac
    done;


    echo "Installation complete."
    echo "Must update cli/php.ini if any command line scripts are to be used."
else
    echo "Could not connect to database with user provided";
    exit 1;
fi;
