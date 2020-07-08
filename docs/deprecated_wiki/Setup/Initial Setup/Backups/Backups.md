**[[HOME|Home]]** > **[[SETUP|Setup]]** > **[[BACKUPS|Backups]]**

Database backups are imperative. There are many ways to automate the creation of backsup, using bash tools such as rsync and taking advantage of cronjobs.

One example set-up is to perform a `mysqldump` once every week. To do this, open `/etc/crontab` with a text editor and add the following line:

```bash
0 0 0 0 sun mysqldump --user=USER --host=DBHOSTURL --password=PASSWORD DBNAME > /home/lorisadmin/backups/`date +%Y-%m-%d.sql`;
```

This will create a weekly backup in `~/backups`. This should be copied over to `/data/$project/data` to preserve hard disk space.