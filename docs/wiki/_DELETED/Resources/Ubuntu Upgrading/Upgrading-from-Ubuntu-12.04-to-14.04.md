**[[HOME|Home]]** > **[[SETUP|Setup]]** > **[[UPGRADING FROM UBUNTU 12.04 TO 14.04|Upgrading-from-Ubuntu-12.04-10-14.04]]**

When upgrading LORIS from Ubuntu 12.04 to 14.04, modify your Apache config by adding file extension *.conf . 
The current LORIS codebase is unaffected by the PHP upgrade within this Ubuntu upgrade.

Note that project-customized php code may encounter issues if any function calls pass references of variables instead of making the arguments themselves as references in your function definition.