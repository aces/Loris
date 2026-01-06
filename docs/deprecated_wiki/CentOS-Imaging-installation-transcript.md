**CAVEAT**: THIS TRANSCRIPT is a record of a successful LORIS-MRI **21.0** installation on CentOS. 

Note: the master branch has been changed to main since the 23 release.      

This transcript is offered as a helpful guide but by no means an exhaustive roadmap to installing every dependency for the MINC and DICOM toolkit. 

## 1 Check dependencies 
Checking if some needed dependencies (needed by the MINC toolkit and/or DICOM toolkit) are installed:
```
a) [lorisadmin@PROJ mri]$ yum list installed 'libstdc*'
b) [lorisadmin@PROJ mri]$ yum list installed 'glibc'
c) [lorisadmin@PROJ ~]$ yum list installed 'gcc*'
d) [lorisadmin@PROJ mri]$ yum list installed 'perl*'
```

## 2 Create the LORIS-MRI directory
```
[lorisadmin@PROJ ~]$ sudo mkdir -p /data/PROJ/bin/mri
[lorisadmin@PROJ ~]$ sudo chown -R lorisadmin:lorisadmin /data/PROJ
```

## 3 Clone LORIS-MRI repo
```
[lorisadmin@PROJ ~]$ cd /data/PROJ/bin
[lorisadmin@PROJ bin]$ git clone https://github.com/aces/Loris-MRI.git mri
```

## 4 Install ImageMagick 
ImageMagick is required by the MINC toolkit:
```
[lorisadmin@PROJ mri]$ sudo yum install ImageMagick
[sudo] password for lorisadmin:
```

## 5 Install MINC toolkit

### 5.1 Install MINC toolkit
```
[lorisadmin@PROJ ~]$ wget http://packages.bic.mni.mcgill.ca/minc-toolkit/RPM/minc-toolkit-1.9.16-20180117-CentOS_7.3.1611-x86_64.rpm
[lorisadmin@PROJ ~]$ sudo rpm -Uvh minc-toolkit-1.9.16-20180117-CentOS_7.3.1611-x86_64.rpm
[sudo] password for lorisadmin:
```

### 5.2 Install BEAST libraries of the MINC toolkit (required for defacing algorithm)

```
[lorisadmin@PROJ ~]$ wget http://packages.bic.mni.mcgill.ca/minc-toolkit/RPM/beast-library-1.1.0-20121212.rpm
[lorisadmin@PROJ ~]$ sudo rpm -Uvh beast-library-1.1.0-20121212.rpm
```

### 5.3 Install MNI models (required for defacing algorithm)

```
[lorisadmin@PROJ ~]$ wget http://packages.bic.mni.mcgill.ca/minc-toolkit/RPM/bic-mni-models-0.1.1-20120421.rpm
[lorisadmin@PROJ ~]$ sudo rpm -Uvh bic-mni-models-0.1.1-20120421.rpm
```

## 6 Install DICOM toolkit
First, ensure CharLS is installed -- this is a required dependency for the DICOM toolkit: 
```
[lorisadmin@PROJ ~]$ sudo yum -y install CharLS
[sudo] password for lorisadmin:
```
If CharLS is not already installed and is not easily findable, try:
```
[lorisadmin@PROJ ~]$ sudo yum --enablerepo=epel install CharLS
```

Note: other dependencies that might need to be installed:
```
[lorisadmin@PROJ ~]$ sudo yum install libpng12
[lorisadmin@PROJ ~]$ sudo yum install -y compat-libtiff3
```

Next, download and install the DICOM toolkit package (dcmtk)
```
[lorisadmin@PROJ ~]$ wget https://tissuestack.org/downloads/CentOS/el6/dcmtk-3.6.0-0.el6.x86_64.rpm
[lorisadmin@PROJ ~]$ sudo rpm -i -v dcmtk-3.6.0-0.el6.x86_64.rpm
```

## 7 Run the install script

### 7.1 Source the MINC toolkit:
```
[lorisadmin@PROJ ~]$ source /opt/minc/1.9.16/minc-toolkit-config.sh
```

### 7.2 Install CPAN
```
[lorisadmin@PROJ ~]$ sudo yum install cpan
```

### 7.3 Install Python virtualenv
```
[lorisadmin@PROJ ~]$ sudo yum -y install python-pip
[lorisadmin@PROJ ~]$ sudo yum install python3-devel mysql-devel
 [lorisadmin@PROJ ~]$ sudo pip install virtualenv
```

_Note_: on CentOS, we need to install `python3-devel` and `mysql-devel`, otherwise the
installation of `mysqlclient` done in script `imaging_install.sh` will fail
(see https://pypi.org/project/mysqlclient/)

### 7.4 Run the LORIS-MRI install script
```
[lorisadmin@PROJ ~]$ cd /data/PROJ/bin/mri
[lorisadmin@PROJ mri]$ sh imaging_install.sh 
```

The following questions will be prompted when running the install script:
```
What is the database name?
What is the database host? 
What is the MySQL user?
What is the MySQL password? 
What is the Linux user which the installation will be based on?
What is the project name?
What is your email address?
What prod file name would you like to use? default: prod 
Enter the list of Site names (space separated)
Would you like to configure as much as possible automatically? [yes] 
What approach do you want?  (Choose 'local::lib', 'sudo' or ‘manual')
Would you like me to automatically choose some CPAN mirror sites for you? 
(This means connecting to the Internet) [yes]
```

If your LORIS will be using the Imaging Uploader to auto-launch the imaging insertion pipeline --

Find your DICOM Dictionary path and add it to the environment file: 
```
[lorisadmin@PROJ ~]$ sudo find / | grep "dicom.dic"
```
Finally, add this path to your environment file. 

Depending on the output of the previous command, you might add (e.g.) `export DCMDICTPATH=/usr/share/libdcmtk2/dicom.dic` or `export DCMDICTPATH=/usr/share/dcmtk/dicom.dic` to your environment file (just two examples).

## 8 Ensure `.bashrc` will source the LORIS-MRI environment file
Ensure your .bashrc file contains the following line, to source the MINC toolkit:
```
[lorisadmin@PROJ ~]$ source /data/PROJ/bin/mri/environment
```

## 9 Source `.bashrc`
Source the `.bashrc` file
```
[lorisadmin@PROJ mri]$ source ~/.bashrc
```


## Deprecated troubleshooting notes

The following installation troubleshooting notes applied to older LORIS releases. If you are experiencing issues, verify these settings. 

a) Adding to the nginx conf tnl.conf (limits of 2000M), otherwise, Imaging Uploader might issue a "413 Request Entity Too Large" error when uploading a file

b) Note the modifications to `php.ini` recommended in the Imaging Uploader Module [Readme https://github.com/aces/Loris/blob/master/modules/imaging_uploader/README.md](https://github.com/aces/Loris/blob/master/modules/imaging_uploader/README.md)

c) installation of DBD::mysql required for the imaging pipeline scripts
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

d) Minc tools path in config.xml 

in /var/www/PROJ/project/config.xml - added in LORIS 16:
```
<!-- MINC TOOLS PATH -->
<MINCToolsPath>/opt/minc/</MINCToolsPath>
```