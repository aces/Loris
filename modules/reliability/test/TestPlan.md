Test Plan: Reliability

1.) Selection Filter: Try filtering by Subproject, Site, Instrument, Gender, Invalid Candidate, DCCID, PSCID, Site or Reliability and Visit Label – make sure both “Enter” and “Show Data” work to show results

2.) Make sure “Clear Form” resets back to blank DCCID; Blank PSCID, your “site” and all other fields read “All”, and that is reflected in the list of Log Entries below

3.)  Make sure all columns sort both ascending and descending

4.) Swap Candidates : try swapping both different combinations of PSCID and visit lables and try a couple of different instruments.
4. a) Swapping should not be allowed if user is a different site than candidate
4.b)  Swapping should not be allowed if candidates does not have instrument for that visit

5.) Click a PSCID and should be directed to an instrument specific reliability form, fill out fields and hit “save data” and double check that it was saved

6.) Check that the hide arrows work in selection filter and swap candidates

7) Add/change reliability threshold for instrument in the config file and verify that the Reliable column changes appropriately.
