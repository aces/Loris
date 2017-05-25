
#!/usr/bin/env bash
set -x
set -e
sudo service mysql stop || echo "mysql not stopped"
sudo stop mysql-5.6 || echo "mysql-5.6 not stopped"
sudo  mysqld_safe --skip-grant-tables &
sleep 4
mysql -u root -e "SET PASSWORD FOR 'root'@'localhost' = PASSWORD('')"

sudo service mysql restart
sleep 4
