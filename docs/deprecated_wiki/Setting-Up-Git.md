# Terminology
+ `<git-username>` = The username you registered for Github with
+ `<git-clone-url>` = The URL you clone with `git clone`
+ `<git-name>` = The `user.name` you configure git with (Maybe your real name or a cool online profile name?)

# For ones used to `$terminology`
+ `<git-username>` = No equivalent
+ `<git-clone-url>` = No equivalent
+ `<git-name>` = No equivalent

# Registering

1. [Register](https://github.com/) a Github account
1. Verify your email address
1. Remember your `<git-username>`!

*In this example, `loris-install` is the `<git-username>`*

[[img/Installing-Loris-After-Installing-Prerequisites/register-2.png]]

# Forking
1. [Log in](https://github.com/) to Github
1. Go to the [LORIS repository](https://github.com/aces/Loris)
1. Look for the "Fork" button
1. Click it
1. Wait while it forks
1. Fork complete

*The location of the "Fork" button:*

[[img/Installing-Loris-After-Installing-Prerequisites/fork-location-zoomed-2.png]]

*What it looks like while waiting:*

[[img/Installing-Loris-After-Installing-Prerequisites/fork-wait-2.png]]

# Getting the Clone Link
1. Remember your `<git-username>`!
1. [Log in](https://github.com/) to Github
1. Go to `https://github.com/<git-username>/Loris`
1. Look for the "Clone or download" button
1. Click it
1. Look for the "Copy to clipboard" button
1. Click it
1. You now have the `<git-clone-url>`

*In this example, I navigated to `https://github.com/loris-install/Loris`*

[[img/Installing-Loris-After-Installing-Prerequisites/clone-location-zoomed-2.png]]

# Cloning

Make sure you're ssh'd as `<unix-user>`

1. Run `sudo apt-get install -y git`, if you don't have `git` yet
1. Run `cd /var/www` (Or where your `apache2` is serving files from)
1. Run `cd <loris-directory>`
1. Run `git clone <git-clone-url> .`
> Important: note the **period** -- the last argument in this git clone command
1. Wait while it clones
1. Clone complete

<!-- *You should see something like this:*

[[img/Installing-Loris-After-Installing-Prerequisites/clone.png]] -->


# Configuring Git Information

Make sure you're ssh'd as `<unix-user>`

1. Run `cd /var/www` (Or where your `apache2` is serving files from)
1. Run `cd <loris-directory>`
1. Run `git config --global user.name "<git-name>"`

# Adding `aces/Loris`

1. Run `cd /var/www` (Or where your `apache2` is serving files from)
1. Run `cd <loris-directory>`
1. Run `git remote add aces https://github.com/aces/Loris.git`
1. Run `git fetch aces`

<!-- [[img/Installing-Loris-After-Installing-Prerequisites/add-aces.png]] -->

# Return to Installing LORIS
[Click here to continue](https://github.com/aces/Loris/wiki/Installing-Loris#running-the-install-script)
