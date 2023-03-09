## Additional Configurations
_LORIS instruments support additional optional configurations. These configurations 
can alter the access or presentation of the instrument in the browser. Make sure 
to read the sections below carefully for a detailed description of each functionality._

### Permissions
Instrument permissions offer the option to restrict access to a specific instrument 
to users having a specific permission. In order to use this feature, the `project/config.xml` 
file will need to be modified to include the association between the instrument and 
the permission. The code section below is a copy of the instrument permissions section 
from the `config.xml` file. 

In order to enable permissions, the `<useInstrumentPermissions>` tag value should 
be change to `true` and a new `<instrument>` tag will need to be added for every 
instrument-permission association. In the example below, instrument `sampleInstrument` 
is associated to the `sampleInstrumentPermissionName` permission and `sampleInstrument2` 
is associated to the `sampleInstrument2PermissionName` permission.
```xml
<instrumentPermissions>
    <useInstrumentPermissions>true</useInstrumentPermissions>
    <instrument>
        <Test_name>sampleInstrument</Test_name>
        <permission>sampleInstrumentPermissionName</permission>
    </instrument>
    <instrument>
        <Test_name>sampleInstrument2</Test_name>
        <permission>sampleInstrument2PermissionName</permission>
    </instrument>
</instrumentPermissions>
```

> _**NOTE:** Leaving the `useInstrumentPermissions` as the default (`false`) will 
>grant all users having access to the timepoint access to all instruments at this 
>timepoint. Setting the value to `true` will only affect instruments added to an 
>`<instrument>` tag, instruments not specifically mentioned will not be affected._

### Certification
Instrument certification is a feature by which some instruments can only be 
completed, in a clinical setting, by a certified examiner. For that reason, 
LORIS will limit the examiner options available in the instrument to "certified" 
examiners (For more details about examiners, see [Adding Examiners](TODO) in the 
Getting Started section). 

In order to use this functionality, the `EnableCertification` flag must first be 
enabled by changing the `0` to `1` in the `project/config.xml` configuration 
file. The next step is to complete the `CertificationProjects` section by adding 
a new `<CertificationProject>` tag for every project using the certification 
functionality. Finally, a new `<test>` tag should be added for each instrument 
using this feature under the `<CertificationInstruments>` parent tag. In the 
example below the instrument certification feature is enabled for projects 1 
and 5 and instrument "sampleInstrument".

```
<Certification>
	<EnableCertification>1</EnableCertification>
	<CertificationProjects>
		<CertificationProject>1</CertificationProject>
		<CertificationProject>5</CertificationProject>
	</CertificationProjects>
	<CertificationInstruments>
		<test value="sampleInstrument">Sample Instrument Display Name</test>
	</CertificationInstruments>
</Certification>
```
> _**NOTES:**_
> - _The projects listed in the `CertificationProjects ` section are the 
>identifiers of the projects derived from the `Project` table of the database._
> - _The syntax of the `<test>` tag is important. The tag must have a `value`
> attribute set to the "testname" found in the `test_names` table of the database. 
>The instrument's display name should be added between the open and the closing 
>tag as seen in the example above._


### Surveys

Survey Instruments allow participants to enter the data directly in the 
instrument without going through an examiner or a data-entry personnel. Study 
coordinators can use the front-end Survey module to create a unique survey key 
for each instrument for each participant and email the survey to a participant. 
Survey functionality can be enabled on a per instrument basis.

In order to make an instrument "Survey ready", the `isDirectEntry` field of the 
database's `test_names` table must be set to `1`; alternatively the value can be 
set to `0` or `NULL` if the instrument is not designed to be completed by the 
participants themselves.

Instruments completed as a survey by the participant are still displayed in the 
instrument list of a timepoint and are highlighted in green to be distinguished 
from non-survey instruments in the same timepoint.

> _**NOTE:** Instruments meant to be sent out to participants as surveys 
>**should not** be added to a visit's test battery otherwise coordinators will 
>not be able to create the surveys from the survey module (For more information 
>about test batteries, navigate to the [Test Battery](./07_clinical_test_battery.md) 
>section directly or continue following the documentation)._

### Exclusion

Excluded instruments are instruments which are designed not to be parsed and 
included in the study's data dictionary. Excluding an instrument also precludes 
it from being exported to the Data Query Tool at the data dissemination stage.

In order to exclude an instrument it must be added to the "Excluded Instruments" 
list of the Configuration module under the "Study" tab.
