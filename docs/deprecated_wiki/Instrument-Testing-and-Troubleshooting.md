**[[HOME|Home]]** > **[[SETUP|Setup]]** > **[[DEVELOPER'S INSTRUMENT GUIDE|Developer's Instrument Guide]]** > **[[TESTING AND TROUBLESHOOTING|Instrument Testing and Troubleshooting]]**

##Finalizing an Instrument
Preparing an instrument for merging includes:
* Running PHPCS on the instrument
* Ensuring the instrument loads on the front-end within the proper visit label and cohorts
* Ensuring data entry and [XIN Rules](https://github.com/aces/Loris/wiki/XIN-Rules) are enforced by the instrument
* Creating a pull request to the [project-specific repo](https://github.com/aces/Loris/wiki/Code-Customization#the-project-directory)

##Testing
To test an instrument:

1. Register a DCC candidate
2. Create a timepoint
3. Start its visit stage (date must be within test_battery-defined age range)
4. Enter sample data, testing each field's type and logic constraints

>_Loris 16.0 and prior:_ For sandbox debugging purposes, ensure the following section appears in config.xml, and toggle to show (1) or hide (0) MySQL queries in the browser. This feature may interfere with JavaScript running in the page, and is not recommended for use in production instances.
```xml
  <gui>
       <showDatabaseQueries>0</showDatabaseQueries>
   </gui>
```

##Troubleshooting
If you run into an error where “Date of Administration” format is wrong when saving the first page, try [cleaning the flag table](https://github.com/aces/Loris/wiki/Instrument-Insertion#clean-flag-table).

**[[RETURN: (1) DEVELOPER'S INSTRUMENT GUIDE|Developer's Instrument Guide]]**

----
See also:
* [[XIN Rules]]
* [[Instrument Groups]]
* [[Instrument Scoring]]
* [[Loris Dictionary]]