# Upgrading Overview

At a high-level, the steps are,

1. Back up your database and files
1. Back up your [custom code](Code-Customization), if any
1. Get the [release](https://github.com/aces/Loris/releases) you want to upgrade to; The latest release may be found [here](https://github.com/aces/Loris/releases/latest)
1. Replace the current LORIS install
1. Your custom code and the newer release may not work without some work, reading the notes that come with the release will help
1. Look for the `SQL/Release_patches` folder and apply the necessary `.sql` patches, in the correct order
1. Look for additional patch instructions that come with the release notes

# 16.X to 17.0

Instructions may be found [here](https://github.com/aces/Loris/wiki/Updating-your-Loris)

# 17.0 to 17.1

Instructions may be found [here](https://github.com/aces/Loris/wiki/Upgrading-17.0-to-17.1)

<!--
> To future maintainers of this documentation, please add a new section and page for each set of upgrade instructions. This is to keep this page as clean as possible. The only real change that might be necessary is if the "high-level" upgrade instructions need changing.
-->
