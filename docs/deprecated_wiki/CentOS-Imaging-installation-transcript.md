**CAVEAT**: THIS TRANSCRIPT is a record of a successful Loris-MRI **15.10** installation on CentOS.      
For Loris-MRI **16.0**, several of these steps have been automated/included in the install process and may no longer need to be run manually for CentOS.

This transcript is offered as a helpful guide but by no means an exhaustive roadmap to installing every dependency for the MINC and DICOM toolkit. 

## 1 Check dependencies 
Checking if some needed dependencies (needed by the MINC toolkit and/or DICOM toolkit) are installed:
```
a) [lorisadmin@PROJ mri]$ yum list installed 'libstdc*'
b) [lorisadmin@PROJ mri]$ yum list installed 'glibc'
c) [lorisadmin@PROJ ~]$ yum list installed 'gcc*'
d) [lorisadmin@PROJ mri]$ yum list installed 'perl*'
```
## 2 Create directories
```
[lorisadmin@PROJ data]$ sudo mkdir /data/PROJ/
[lorisadmin@PROJ data]$ cd
[lorisadmin@PROJ ~]$
[lorisadmin@PROJ ~]$ sudo chown -R lorisadmin:lorisadmin /data/PROJ
[lorisadmin@PROJ ~]$ mkdir /data/PROJ/bin
[lorisadmin@PROJ ~]$ mkdir /data/PROJ/bin/mri
[lorisadmin@PROJ ~]$ mkdir /data/PROJ/data
[lorisadmin@PROJ ~]$ mkdir /data/PROJ/data/tarchive
[lorisadmin@PROJ ~]$ mkdir /data/PROJ/data/trashbin
[lorisadmin@PROJ ~]$ mkdir /data/PROJ/data/assembly
[lorisadmin@PROJ ~]$ mkdir /data/PROJ/data/jiv
[lorisadmin@PROJ ~]$ mkdir /data/PROJ/data/pic
[lorisadmin@PROJ ~]$ mkdir /data/PROJ/data/logs

[lorisadmin@PROJ mri]$ sudo mkdir /data/PROJ/data/batch_output
[lorisadmin@PROJ mri]$ sudo mkdir /data/PROJ/bin/mri/dicom-archive/.loris_mri
[lorisadmin@PROJ dicom-archive]$ sudo chown -R lorisadmin:lorisadmin .loris_mri/

[lorisadmin@PROJ ~]$ sudo mkdir /data/incoming
[lorisadmin@PROJ ~]$ sudo chown -R lorisadmin:lorisadmin /data/incoming
```
## 3 Clone LORIS-MRI repo
```
[lorisadmin@PROJ ~]$ cd /data/PROJ/bin
```
CAVEAT: no longer relevant for Loris-MRI 16.* -- see Loris-MRI Readme for your Release code instead
```
[lorisadmin@PROJ bin]$ git clone https://github.com/aces/Loris-MRI.git mri
[lorisadmin@PROJ mri]$ git submodule init
[lorisadmin@PROJ mri]$ git submodule sync
[lorisadmin@PROJ mri]$ git submodule update
```
## 4 Install ImageMagick 
ImageMagick is required by the MINC toolkit:
```
[lorisadmin@PROJ mri]$ sudo yum install ImageMagick
[sudo] password for lorisadmin:
```
## 5 Install MINC toolkit
```
[lorisadmin@PROJ mri]$ cd
[lorisadmin@PROJ ~]$ wget http://packages.bic.mni.mcgill.ca/minc-toolkit/RPM/minc-toolkit-1.0.08-20160205-CentOS_6.7-x86_64.rpm
[lorisadmin@PROJ opt]$ sudo rpm -Uvh ~/minc-toolkit-1.0.08-20160205-CentOS_6.7-x86_64.rpm
[sudo] password for lorisadmin:
```
## 6 Ensure bashrc will source MINC toolkit
Ensure your .bashrc file contains the following line, to source the MINC toolkit:
```
source /opt/minc/minc-toolkit-config.sh
```
## 7 Install DICOM toolkit
First, ensure CharLS is installed -- this is a required dependency for the DICOM toolkit: 
```
[lorisadmin@PROJ minc]$ cd
[lorisadmin@PROJ ~]$ sudo yum -y install CharLS
[sudo] password for lorisadmin:
```
If CharLS is not already installed and is not easily findable, try:
```
sudo yum --enablerepo=epel install CharLS
```

Next, download and install the DICOM toolkit package (dcmtk)
```
[lorisadmin@PROJ minc]$ cd
[lorisadmin@PROJ ~]$ wget http://tissuestack.org/downloads/CentOS/dcmtk-3.6.0-0.el6.x86_64.rpm
[lorisadmin@PROJ ~]$ sudo rpm -i -v dcmtk-3.6.0-0.el6.x86_64.rpm
```

If your LORIS will be using the Imaging Uploader to auto-launch the imaging insertion pipeline: 
Next, find your Dicom Dictionary path and add it to the environment file: 
```
[lorisadmin@PROJ ~]$ sudo find / | grep "dicom.dic"
```
Finally, add this path to your environment file. 
Depending on the output of the previous command, you might add (e.g.) `export DCMDICTPATH=/usr/share/libdcmtk2/dicom.dic` or `export DCMDICTPATH=/usr/share/dcmtk/dicom.dic` to your environment file (just two examples).

## 8 Install Perl libraries
Use Cpan to install required Perl libraries
```
[lorisadmin@PROJ ~]$ sudo cpan
cpan1> install Math::Round
cpan2> install Getopt::Tabular
cpan3> install Time::JulianDay
```
Note: the following command failed - see step 9 below
```
cpan4> install Path::Class
```

```
cpan5> install Archive::Extract
cpan6> install Archive::Zip
cpan7> quit
```
## 9 Install Perl Path Library
Install the failed Path library as follows:
```
[lorisadmin@PROJ ~]$ sudo yum install perl-Path-Class
```
If this doesn't work for your system, try: 
```
sudo yum --enablerepo=epel install perl-Path-Class
```

## 10 Source bashrc
Source the .bashrc file
```
[lorisadmin@PROJ mri]$ source ~/.bashrc
```

## 11 Steps from Imaging_install.sh script
Use the imaging_install.sh script to do the remaining steps (lines were commented out from the installation script as they were done manually in the steps above)
```
CAVEAT again: THIS TRANSCRIPT refers to the **15.10** imaging_install.sh script.
SOME STEPS manually executed in this transcript are no longer necessary for Loris 16+
```

```
[lorisadmin@PROJ mri]$ bash ./imaging_install.sh

MINC Toolkit appears to be installed.
What is the database name? PROJ
What is the database host? ###.###.###.#
What is the MySQL user? lorisdbadmin
What is the MySQL password? ############
What is the Linux user which the installation will be based on? lorisadmin
What is the project name? PROJ
What is your email address? ###.###@gmail.com
What prod file name would you like to use? default: prod
Enter the list of Site names (space separated)
Modifying environment script

Creating MRI config file
config file is located at /data/PROJ/bin/mri/dicom-archive/.loris_mri/prod
```
(End of imaging_install.sh output)

## Further notes / modifications

b) Adding to the nginx conf tnl.conf (limits of 2000M), otherwise, Imaging Uploader might issue a "413 Request Entity Too Large" error when uploading a file

c) Note modifications to _php.ini_ recommended in the Imaging Uploader Module [Readme https://github.com/aces/Loris/blob/master/modules/imaging_uploader/README.md](https://github.com/aces/Loris/blob/master/modules/imaging_uploader/README.md)

d) installation of DBD::mysql required for the imaging pipeline scripts
```
[lorisadmin@PROJ ~]$ sudo cpan
[sudo] password for lorisadmin:
Terminal does not support AddHistory.

cpan shell -- CPAN exploration and modules installation (v1.9402)
Enter 'h' for help.

cpan1> install DBD::mysql
```

BUT THIS FAILED...
the last few lines of the execution gives:
```
make: *** [dbdimp.o] Error 1
CAPTTOFU/DBD-mysql-4.033.tar.gz
/usr/bin/make -- NOT OK
Warning (usually harmless): 'YAML' not installed, will not store persistent state
Running make test
Can't test without successful make
Running make install
Make had returned bad status, install seems impossible
Failed during this command:
CAPTTOFU/DBD-mysql-4.033.tar.gz : make NO

So I re-installed using:
[lorisadmin@PROJ ~]$ sudo yum install "perl(DBD::mysql)"
[sudo] password for lorisadmin:

THIS SEEMS TO WORK, with the last few messages:

Installed:
perl-DBD-MySQL.x86_64 0:4.013-3.el6

Complete!
```

e) the following steps were required in Loris 15.10, but are now covered in the 16.* imaging install process:

In /data/ directory, enable apache user to upload using the imaging uploader, but we also want lorisadmin to be able to process the data:
```
1) [lorisadmin@PROJ data]$ sudo chown lorisadmin:apache incoming/
2) [lorisadmin@PROJ data]$ sudo chmod 770 incoming/
3) [lorisadmin@PROJ data]$ sudo chmod g+s incoming/
```
Our install script now makes lorisadmin part of apache group (they have to be part of the same group to be able to read/write into same directories for processing and to be able to load brainbrowser in the front-end):
```
sudo usermod -a -G apache lorisadmin
```
/data/PROJ/bin/mri/environment file updated to reflect latest release (namely source the MINC toolkit and umask 0002)
updated the Loris-MRI code base to 16.0.0 release as follows:
```
git fetch origin
git pull origin master
git submodule update (to update the dicom-archive submodule)
```
in /var/www/PROJ/project/config.xml - added:
```
<!-- MINC TOOLS PATH -->
<MINCToolsPath>/opt/minc/</MINCToolsPath>
```