# Introduction to LORIS Study Variables

## Identifiers

In LORIS, and indeed in all of its instances (CBIG, CCNA, xxx, yyy, etc), the names of participants is anonymized by assigning numeric and alphanumeric ID's to them. In this way, the data of a participant is protected from connection to their name or personal identifying information ("PII"). The IDs in LORIS have different purposes ranging from internal data-linking operations to data dissemination outside of LORIS. Their internal usage in the codebase is in the purvue of LORIS software developers. By contrast, an admin user should keep in mind the cardinality of each LORIS ID type: that is the key to understanding its purpose.

The table of contents below links to an explanation page for each of the ID types.

## Identifiers

- [CandID](CandID.md)

- Cardinality: One per participant per project
- Purpose: Internal database operations

- [PSCID](PscID.md)

- Cardinality: One per participant per project
- Main participant identifier

- [ExteralID]

- Cardinality: Multiple per participant
- For use outside of LORIS

- [Projects]
- [Sites]
- [Cohorts]
- [Timepoints]
- [Configurations]