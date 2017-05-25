#!/usr/bin/env bash
set -x
set -e
sudo service mysql stop || echo "mysql not stopped"
sudo stop mysql-5.6 || echo "mysql-5.6 not stopped"
sudo  mysqld_safe --skip-grant-tables &
sleep 4
echo "flush"
echo "kill b"
sudo service mysql restart
echo "restart"
sleep 4
