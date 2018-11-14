We recommend upgrading to the **most recent [LORIS release](https://github.com/aces/Loris/releases)**.  

See additional notes at bottom for [Imaging projects](#imaging-projects)

> If you are a developer used to working on the development branch, note that the master branch reflects the last [stable release](https://github.com/aces/Loris/releases).  

> We do not support the unstable pre-release development branch. e.g. 17.1-dev is the next development branch after the 17.0.* release

## Important: Upgrading to 17.0
* PHP 7 and MySQL 5.7 are supported for Loris 17.0. Timestamp fields in custom tables may require updating for MySQL 5.7
    * projects upgrading to PHP7 should install modules `php-mbstring` and `php-gd`
* Update [[all PHP QuickForm instruments|LORIS-Form#how-to-update-php-quickform-instruments-to-lorisform]], since HTML QuickForm is now replaced by [[LorisForm|Loris form]] 
* If your dashboard loads but no other modules load, ensure that your `/var/apache2/apache2.conf` file is set to `AllowOverride All` in the section `<Directory /var/www/>` to enable re-write rules (based on `htdocs/.htaccess` file)

## Update your LORIS in a few steps: 
* Download the new [release codebase](https://github.com/aces/Loris/releases). Be careful of overwriting any [custom code modifications](Code-Customization) that you may have added - you'll want to merge these with the code updates. 
* Run `composer install --no-dev` and then `composer dump-autoload` to update dependencies and re-generate the autoload.php file
* Apply the MySQL release-upgrade patch found in the [SQL/Release_patches](https://github.com/aces/Loris/tree/master/SQL/Release_patches) directory.  Carefully note modifications to data columns and data type definitions
* Check your [project/ directory for code that may be overriding](Code-Customization) the main Loris codebase - these files may need updating to work with the release codebase.  Note that as of 16.0 release, custom module support has changed
* Review _all_ [Release Notes](https://github.com/aces/Loris/releases) for every release since your last version, including minor releases -- especially those in the section specifically for Existing Projects.  Follow carefully the recommended steps for existing projects

#### Upgrade tips
* Ensure your _admin_ user has all available permissions:
```sql
INSERT IGNORE INTO `user_perm_rel` (userID, permID) SELECT DISTINCT 1, permID FROM permissions;
```
* If old template code continues to be sourced, clear your _smarty/templates_c_ directory where templates are cached (NB: clear smarty/templates_c/ but do _not_ clear smarty/templates/)
* Good to note: Pull requests tagged with [Caveat for Existing Projects](https://github.com/aces/Loris/pulls?q=is%3Apr+label%3A"Caveat+for+Existing+Projects"+is%3Amerged)
* It may help to update tables to utf8 character set:
```sql
    ALTER TABLE users CONVERT TO CHARACTER SET utf8;
```
### Imaging projects

Update your Loris-MRI code to the latest [Loris-MRI release](https://github.com/aces/Loris-MRI/releases) (to accompany your Loris release) carefully note changes to the imaging pipeline scripts, config files and tables, and follow all recommended steps in the Release notes for Existing Projects.  Ensure you have also updated to the most recent version of the [dicom-archive-tools](https://github.com/aces/dicom-archive-tools) repo. 
Loris-MRI Pull requests marked [Caveat for Existing Projects](https://github.com/aces/Loris-MRI/pulls?q=is%3Amerged+is%3Apr+label%3A%22Caveat+for+Existing+Projects%22) mean that there may be changes to your data after upgrading.  


