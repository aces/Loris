# Getting the Release URL

1. Go to the [LORIS latest release page](https://github.com/aces/Loris/releases/latest)
1. Look for the "Source code" URL(s)
1. *Right-click* the `.zip` URL
1. Copy the URL (AKA "link address")
1. You now have the `<loris-release-url>`

*The "Latest release" and "Source code" locations:*

[[img/Installing-Loris-After-Installing-Prerequisites/release-latest-zoomed-2.png]]

# Downloading LORIS

Make sure you're ssh'd as `<unix-user>`

> Note that the path is assumed to be var/www/loris however your own path may be var/www/`<project-name>`, depending on your setup. 

1. Run `cd /var/www` (Or where your `apache2` is serving files from)
1. Run `sudo wget <loris-release-url> -O release.zip`, this will download the `zip` file and rename it to `release.zip`
1. Run `sudo unzip release.zip`
1. Run `ls`, you will see a directory named `Loris-XX-X-X`
1. Run `sudo mv Loris* loris`, this will rename that directory to just `loris`
1. Run `ls`
1. You should see a `loris` directory
1. Run `sudo rm release.zip`, to delete the `zip` file that we no longer need

<!--
*Downloading and unzipping:*

[[img/Installing-Loris-After-Installing-Prerequisites/download-unzip.png]]

*Renaming and cleaning up:*

[[img/Installing-Loris-After-Installing-Prerequisites/rename-clean-up.png]]
-->
# Return to Installing LORIS
[Click here to continue](https://github.com/aces/Loris/wiki/Installing-Loris#running-the-install-script)