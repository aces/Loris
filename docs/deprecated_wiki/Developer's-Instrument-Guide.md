**[[HOME|Home]]** > **[[SETUP|Setup]]** > **[[DEVELOPER'S INSTRUMENT GUIDE|Developer's Instrument Guide]]**

> This guide reflects a typical workflow and best practices used by Loris developers at the MNI.  Some specifics such as git workflow steps may not apply to all projects and implementations. 

## Should this instrument be coded? (PHP vs. LINST)
1. An instrument should likely be coded manually in PHP if it involves:
  * [dependencies between fields](https://github.com/aces/Loris/wiki/XIN-Rules)
  * special data formats or restricted types
  * [special scoring](https://github.com/aces/Loris/wiki/Instrument-Scoring)
  * look-up tables (t-scores etc)
  * age-dependencies in administering the instrument
2. Has it been coded before? [[Current instruments list]]

# Developer Workflow
### Before getting started...
  1. Get the entire PDF or paper copy, including any “lookup” tables used for scoring/normalization.
  1. Find out: Which sections of the questionnaire should be included or omitted?
      Typically, administrative details included on the original form can be ignored, but instructions that will be helpful for the examiner might be included. 
  1. Decide: How will all your fields map to the element types allowed by [Loris form](https://github.com/aces/Loris/wiki/LORIS-Form)
  1. Find out: Does your instrument require certification? Are there certified [examiners](https://github.com/aces/Loris/wiki/Instrument-Insertion#populate-examiners)? Should users be certified as examiners for this instrument using the [[Training module]]?

### Get Started!
2. Create a new git branch based off the up-to-date branch for your [project-specific repo](https://github.com/aces/Loris/wiki/Code-Customization#the-project-directory).
3. [Create an instrument](https://github.com/aces/Loris/wiki/How-to-Code-an-Instrument) in the project/instruments/ directory.
4. [Insert the Instrument](https://github.com/aces/Loris/wiki/Instrument-Insertion).
5. [Front-end testing](https://github.com/aces/Loris/wiki/instrument-Testing-and-Troubleshooting).
6. Push branch and create pull request to your [project-specific repo](https://github.com/aces/Loris/wiki/Code-Customization#the-project-directory). Assign relevant tags and tester.
7. Update any management documents and/or add a category to your bug tracker utility.

**[[NEXT: (2) Create an instrument|How-to-Code-an-Instrument]]**

----
See also:
* [Coding Standards](https://github.com/aces/Loris/blob/master/docs/CodingStandards)
* [[XIN Rules]]
* [[Instrument Groups]]
* [[Instrument Scoring]]
* [[About superuser]]
* [[Loris Dictionary]]