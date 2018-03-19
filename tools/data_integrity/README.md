This directory contains tools used for verifying or rectifying the data 
in the database. 

A **Data Checker** is a tool that reads data from the database, verifies 
it's integrity, and returns a set of errors found. 

Verifying the integrity of the data include but is not limited to the following:
 - Checking for orphans
 - Recomputing some calculated data (scores, ages, ...)
 - Checking for inconsistencies
 - Checking for missing files on disk
 - ...
 
 A **Data Fixer** is a tool that has the ability to identify errors and 
 automatically repair the erroneous data with or without input from the 
 user. Rectifying the data generally requires running the script with 
 a confirmation argument on the command line.