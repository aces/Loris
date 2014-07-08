#LORIS Neuroimaging Platform

LORIS is a web-accessible database solution for Neuroimaging. LORIS provides a secure online database infrastructure to automate the flow of clinical data for complex multi-site neuroimaging studies.

# Prerequisites

LORIS has following prerequisites:

 * Apache2
 * MySQL
 * PHP/PEAR >= 5.2

# Installation 

For complete installation instructions, please see our [Loris Installation Guide](https://docs.google.com/document/d/1wh-kLdT6u80c-VxtcGrgPvGWuc2R_7PqleDC1VC6co0) in Google docs.

Notes for Loris post-installation setup are contained in the [Loris Developers Guide](https://docs.google.com/document/d/129T2SfqzKTTOkoXRykzCLe5Vy70A9Dzjw1O3vqgwsPQ).

# Community
Please feel free to subscribe to the LORIS Developer's mailing list, where you can feel free to ask any LORIS-related questions.

[LORIS Developers mailing list](http://www.bic.mni.mcgill.ca/mailman/listinfo/loris-dev)

# Upgrade Notes

To upgrade LORIS to the latest version, pull the latest code from GitHub. MySQL patches are contained in the SQL/ subdirectory of LORIS. You must run any new patches that appear in that directory after running the `git pull` command. If you do not do this, some features may break as the MySQL table schema is likely out of date.

