## Instrument Quality Assurance

### Double Data Entry
Double Data Entry (DDE) is the practice of requiring users to manually input the 
same instrument data twice in order to reduce the risk of error in data entry by 
flagging differences between the primary and secondary data entry. For DDE-enabled 
instruments, a participant's instrument data collection at a given visit cannot be 
finalized in LORIS unless both the first data entry form and second (double) data 
entry form are completed.

When an instrument's data is completely entered for both the primary and 
secondary data entry, the conflicts between these two datasets are automatically 
computed and reported in the Conflict Resolver module (For more information about 
conflict resolution navigate directly to the [Conflict Resolution](TODO) section 
or continue following the documentation)

To enable an instrument for double data entry, the instrument must be listed 
under the "Double data entry instruments" section of the "Study" tab in the 
Configuration module. DDE data is saved in a separate entry in the database 
identified by the same `CommentID` value just prefixed with the `DDE_` string.
