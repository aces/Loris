#! /bin/sh

################################
####WHAT WILL NOT DO#############
###1)It doesn't set up the SGE
###2)It doesn't fetch the CIVET stuff   TODO:Get the CIVET stuff from somewhere and place it in h

read -p "what is the database name? " mysqldb
read -p "What is the databse host? " mysqlhost
read -p "What is the Mysql user? " mysqluser
read -p "what is the linux user which the intallation will be based on? " USER
read -p "what is the project Name " PROJ   ##this will be used to create all the corresponding directories...i.e /data/gusto/bin.....
read -p "what is your email address " email
read -p "Enter the Site number(if there is only one site) " site
read -p "MRI code directory name "   mridirname

#################################################################################################
########################################MINC TOOL###############################################
##################################################################################################
echo "installing Minc toolkit (May prompt for sudo password)"
sudo -S apt-get install minc-tools

echo "installing dicom toolkit (May prompt for sudo password)"
sudo -S apt-get install dcmtk



#################################################################################################
############################INSTALL THE PERL LIBRARIES############################################
#################################################################################################
          echo "Installing the perl libraries...THis will take a few minutes..."
          ##echo $rootpass | sudo perl -MCPAN -e shell
          sudo -S cpan install Math::Round
          ##echo $rootpass | sudo -S cpan install Bundle::CPAN
          sudo -S cpan install Getopt::Tabular
          sudo -S cpan install Time::JulianDay
##########################################################################################
###########################3##Create directories########################################
#########################################################################################

  sudo -S mkdir -p /data/$PROJ/bin/ 
  sudo -S mkdir -p /data/$PROJ/data/
  sudo -S mkdir -p /data/$PROJ/data/trashbin   ##holds mincs that didn't match protocol
  sudo -S mkdir -p /data/$PROJ/data/tarchive   ##holds tared dicom-folder
  sudo -S mkdir -p /data/$PROJ/data/pic           ##holds jpegs generated for the MRI-browser
  sudo -S mkdir -p /data/$PROJ/data/logs         ## holds logs from pipeline script
  sudo -S mkdir -p /data/$PROJ/data/jiv            ## holds JIVs used for JIV viewer
  sudo -S mkdir -p /data/$PROJ/data/assembly ## holds the MINC files
  sudo -S mkdir -p /data/$PROJ/data/batch_output  ##contains the result of the SGE (queue
  sudo -S mkdir -p /home/$USER/.neurodb
  ###############incoming directory
  sudo -S mkdir -p /data/incoming/$site$PROJ/incoming


##################################################################
################Get the code#######################################
##################################################################
###NOTE By default the code goes to /data/project/bin/
		cd /data/$PROJ/bin/
		git clone git@github.com:aces/Loris-MRI.git $mridirname
		cd $mridirname
		git submodule init
		git submodule sync
		git submodule update

####################################################################################
#######set environment variables under .bashrc#####################################
###################################################################################
##export $HOME=/home/lorisdev/  Do it only if neccessary
sed -i "s#ibis#$PROJ#g" /data/$PROJ/bin/$mridirname/environment
##Make sure that CIVET stuff are placed in the right place
##source  /data/$PROJ/bin/$mridirname/environment
export TMPDIR=/tmp


######################################################################################
##########################change the prod file#######################################
#####################################################################################
echo "Creating MRI config file"

sed -e "s#project#$PROJ#g" -e "s#/your/inepuisable/diskspace/location#/data/$PROJ/data#g" -e "s#yourname\@gmail.com#$email#g" -e "s#\/wherever\/you\/put\/this\/get_dicom_info.pl#/data/$PROJ/bin/$mridirname/dicom-archive/get_dicom_info.pl#g"  -e "s#DBNAME#$mysqldb#g" -e "s#DBUSER#$mysqluser#g" -e "s#DBPASS#$mysqlpass#g" -e "s#DBHOST#$mysqlhost#g" /data/$PROJ/bin/$mridirname/dicom-archive/profileTemplate > /home/$USER/.neurodb/prod


####################################################################################
######################chyange permissions ##########################################
####################################################################################
sudo chown $USER:$USER /home/$USER/.neurodb/prod
sudo chmod 775 /home/$USER/.neurodb/prod
sudo chmod -R 775 /data/$PROJECT/
sudo chown zia:zia /tmp/
##tarchiveLibraryDir = '/data/$PROJ/data/tarchive';

######################################################################
###########Modify the config.xml########################################
######################################################################
##sed -i "s#%/PATH/TO/MINC/DATA/ROOT/mri-data/minc/%#/data/$PROJ/data#g" -i "s#LORISROOT%#/data/$PROJ/data#g" ../project/config.xml
##mincpath

