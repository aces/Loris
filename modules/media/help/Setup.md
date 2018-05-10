## Media module set up 

Set the `mediaPath` config value to the desired path on the server where the files 
will be uploaded.

Create the directory on the server.

The upload path must be readable and writable by your web server; 
either the web server `user` or `group` must have read and write permissions.

The default group for your web server process is listed below:
```
Ubuntu: $GROUP$ = www-data
CentOS: $GROUP$ = apache
```

To find the `user` of your web server, run:
 
`ps aux | grep 'apache' | egrep -v 'grep|Ss' | awk '{ print $1 }' | sort | uniq`

To find the `group` of your web server, run:

`ps aux | grep 'apache' | egrep -v 'grep|Ss' | awk '{ print $1 }' | sort | uniq | xargs groups`

To see if your web server's user or group owns the upload path, run:
 
`ls -ld /data/uploads | awk '{ print "user:" $3 ", group:" $4 }'`

If neither owns the folder, you should run the following two commands:
```
sudo chown <unix-user>:<web-server-group> /data/uploads
sudo chmod 775 /data/uploads
```
