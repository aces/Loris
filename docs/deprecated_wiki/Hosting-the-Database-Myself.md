# Installing the Database - 1 of 2

> **Before continuing:** MySQL must be installed and a `root` or admin-level MySQL user credential must be created before continuing. (This is not the same as a unix `root` credential.) 

1. Figure out your `<loris-url>` (It's probably the IP address of your remote machine)
1. Open your internet browser
1. Navigate to `<loris-url>/installdb.php`
1. Fill in `<mysql-host-name>`; if the MySQL server is on the same machine that is hosting Loris, it will be `localhost`
1. Fill in `<mysql-admin-username>`; e.g. `root` -- must be an existing MySQL user
1. Fill in `<mysql-admin-password>`
1. Fill in `<mysql-database>`; this database must not exist yet as the installer will try to create it
1. Submit

[[img/Installing-Loris-After-Installing-Prerequisites/install-db-admin-zoomed-4.png]]

# Installing the Database - 2 of 2

1. Fill in `<mysql-user-username>`, `<mysql-user-password>`; _recommended:_ `lorisuser`
1. Fill in `<loris-admin-username>`, `<loris-admin-passwrd>`; e.g. admin
1. Submit

[[img/Installing-Loris-After-Installing-Prerequisites/install-db-user-zoomed-4.png]]

# Return to Installing Loris
[Click here to continue with the next step: Logging into Loris](https://github.com/aces/Loris/wiki/Installing-Loris#logging-in-to-the-loris-admin-panel)
