# Updating your LORIS
The [Release notes](https://github.com/aces/Loris/releases) for each version of LORIS contain Upgrade steps for existing projects.
This page contains more information about this process, including for Imaging projects.

We recommend upgrading to the most recent [LORIS release](https://github.com/aces/Loris/releases).

The LORIS team provides support (on a best-effort basis via the [Loris-dev mailing list](https://github.com/aces/Loris/wiki/Get-in-Touch)) for the last 2 releases of LORIS (including minor releases), and does not support pre-release development branches.

> If you are a developer working on a development branch, note that the main branch reflects the last [stable release](https://github.com/aces/Loris/releases).

## Update your LORIS in a few steps:
Important If you are upgrading over multiple versions, first upgrade to each minor release increment before upgrading to the next major release.

Consult the [Release notes](https://github.com/aces/Loris/releases) for the Upgrade Process specific to each release. Back up your database and code customizations before beginning. The typical steps are:

 * Update your dependencies
 * Apply the [Release Patch](https://github.com/aces/Loris/tree/main/SQL/Release_patches) to the database
 * Run any upgrade scripts provided
 * Update or merge [custom code](https://github.com/aces/Loris/wiki/Code-Customization) to work with the new release, if necessary
 * Update data to match type/column modifications, if necessary

### Upgrade tips
 * Clear both your Browser cache and cached templates `rm -f` `/var/www/loris/smarty/templates_c/* - note _c (i.e. do not clear smarty/templates/)`
 * Ensure your admin user has all available permissions:
 ```SQL
 INSERT IGNORE INTO `user_perm_rel` (userID, permID) SELECT DISTINCT 1, permID FROM  permissions;
 ```
 * Good to note: Pull requests tagged with [Caveat for Existing Projects](https://github.com/aces/Loris/pulls?q=is%3Apr+label%3A%22Caveat+for+Existing+Projects%22+is%3Amerged) mean that there may be changes to your data after upgrading.
 * It may help to update tables to utf8 character set:
 ```SQL
    ALTER TABLE users CONVERT TO CHARACTER SET utf8;
 ```
## Imaging projects
Update your [Loris-MRI code](https://github.com/aces/Loris-MRI/releases) to the latest Loris-MRI release and carefully review the Loris-MRI release notes for changes to the imaging pipeline scripts, config files and tables, and follow all recommended steps for Existing Projects. We recommend testing your pipelines after upgrading.