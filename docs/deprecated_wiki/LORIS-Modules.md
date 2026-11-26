**[[HOME|Home]]** > **[[SETUP|Setup]]** > **[[LORIS MODULES|LORIS Modules]]**

***

- [About Modules](#about-modules)
- [Customizing Loris modules](#customizing-loris-modules)

***

## About Modules 

Each module is documented by a Readme in the codebase, under its specific `modules/` subdirectory -- for example [[https://github.com/aces/Loris/blob/main/modules/candidate_list/README.md]]

For a complete list of modules, see the directory: `https://github.com/aces/Loris/blob/main/modules/`

* [[How to make a LORIS module]]

Modules are added and activated via the `LorisMenu` MySQL table. User permissions for viewing and accessing menus and menu items are stored in the LorisMenuPermissions table. For example, the Configuration module is visible under the Admin menu only to users who have config permission.

Module-specific setup instructions (if any have been written) are typically included in a Readme under the modules/_$modulename_/ directory.

## Customizing Loris modules

For notes on how to customize modules, please consult the [[Code Customization page|Code-Customization#module-override]]

***
