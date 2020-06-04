This directory contains tools meant to be used once and only once on 
the database. These tools are generally created for a specific release 
with a specific intent and are no longer needed after they have been 
executed successfully. The scripts in this directory do not get removed 
unless they have been converted to a data_integrity tool or are 
completely deprecated in which case they get moved into the appropriate 
directory before removal.