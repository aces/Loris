# Instrument manager

## Uploading Instruments

The instrument manager provides the ability to view the status of
instruments that are installed in LORIS and, if configured, the
ability to install new instruments created with the instrument
builder.

If configured, the top of the page displays an "Upload Instrument"
section where a user can click "Browse" to select a LINST file from
their computer.  After selecting a valid LINST file, clicking
"Install Instrument" will install the instrument into LORIS (but
it must still be manually inserted into a study specific test battery.)

## Viewing Installed Instruments

Below the "Upload Instrument" section is a table displaying all
instruments which are currently installed in LORIS. For each
instrument it displays the columns:

*Instrument*: This provides the name of the instrument (as given
in the `test_names` table).

*Instrument Type*: This contains either "PHP" or "Instrument Builder",
depending on if the instrument was created using the instrument
builder or coded in PHP.

*Table Installed*: This does a very basic check for each instruments
and displays either "Exists" (or the instrument table exists in the
LORIS SQL database) or "Missing" (if the instrument SQL table does
not exist).

*Table Valid*: This column displays whether the LORIS SQL database
is correctly configured, with respect to the instrument that's
installed in the LORIS `project/instruments` directory. It contains
either of the following: 
 - "Appears Valid" if everything looks peachy 
 - "Column (name) invalid" if the SQL table exists, but the column 
 named "(name)" does not reflect the type as configured in the 
 instrument
 - "enum (name) invalid" if the column exists, but does not accurately 
 reflect the possible options in a select box
 - "?" if it's unable to determine the validity of the table.

*Pages Valid*: This column checks whether the `instrument_subtests`
table in LORIS is correctly populated by verifying it against the
instrument which is installed in LORIS. It contains either "Appears
Valid" or "Missing page (pagename)" if a page is missing from the
`instrument_subtests` table.

Note that the last two columns can only be determined for LINST
(instrument builder) instruments as there is no way to extract the
"proper" values from instruments coded in PHP.