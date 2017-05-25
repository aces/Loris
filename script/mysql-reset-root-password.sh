#!/usr/bin/env bash
set -x
set -e
sudo service mysql stop || echo "mysql not stopped"
sudo stop mysql-5.6 || echo "mysql-5.6 not stopped"
sudo  mysqld_safe --skip-grant-tables &
sleep 4
echo "flush"
sudo mysql -e "use mysql; update user set authentication_string=PASSWORD(\'\') where User=\'root\'; update user set plugin='mysql_native_password';FLUSH PRIVILEGES;"
sudo kill -9 `sudo cat /var/lib/mysql/mysqld_safe.pid`
echo "kill a"
sudo kill -9 `sudo cat /var/run/mysqld/mysqld.pid`
echo "kill b"
sudo service mysql restart
echo "restart"
sleep 4
