This directory contains SQL patches automatically generated to revert database changes 
applied in a tool script. Patches in this directory are designed to roll-back the 
database into a previous state and should only be run by project administrators after 
thorough testing.  

**Notes:** 
 - It is left to the author of the tool script to decide if a 
roll-back behaviour is required. 
 - Files in this directory are not tracked by github.