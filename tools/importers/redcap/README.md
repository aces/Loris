# REDCap Importer

## Main dependencies
- [Java 11+](https://www.oracle.com/java/technologies/) Default JRE/JDK

The easiest option for installing Java is to use the version packaged with Ubuntu. By default, Ubuntu 20.04 includes Open JDK 11, which is an open-source variant of the JRE and JDK.
To install this version, run:
```
apt update
apt install default-jre
apt install default-jdk
```

- [Swagger Codegen 3.X](https://github.com/swagger-api/swagger-codegen/tree/3.0.0)

To download current stable 3.x.x branch (OpenAPI version 3), run:
```
wget https://repo1.maven.org/maven2/io/swagger/codegen/v3/swagger-codegen-cli/3.0.52/swagger-codegen-cli-3.0.52.jar -O swagger-codegen-cli.jar

java -jar swagger-codegen-cli.jar generate \
   -i ./../../../modules/api/static/schema-v0.0.4-dev.yml \
   -l php \
   -o ./../../../php/libraries
```

## Importers and their requirements

There are two importers that can be extended to write a project's custom REDCap importer:
the abstract classes RedcapImporter and RedcapReportImporter.

The RedcapImporter queries all records from the REDCap API, while the RedcapReportImporter
queries records from a REDCap report.

All methods can be overwritten in the project's custom importer.

A custom importer class requires the following:
- A project string to be specified, $project
- And custom variables
- Any custom methods
- A redcap config file named 'redcap_config_$project.json' that meets the redcap_config_schema.json schema
