# Biobank Module

## Purpose
The Biobank Module enables the management of biological specimens by providing functionalities for specimen tracking, container management, pooling, and shipment handling. It ensures standardized operations and maintains data integrity within the LORIS ecosystem.

## Intended Users
The primary users of the Biobank Module are:
 - Biobank Managers: Oversee the overall biobank operations, including specimen tracking and inventory management.
 - Laboratory Technicians: Handle the processing, storage, and preparation of biological specimens.
 - Researchers: Access and utilize specimens for various studies and experiments.
 - Site Coordinators: Ensure that specimens are correctly collected, processed, and integrated into the LORIS system across multiple sites.

## Scope
The Biobank Module facilitates the comprehensive management of biological specimens within the LORIS platform. Its functionalities include:

- **Specimen Tracking:** Monitor the lifecycle of each specimen from collection to storage and shipment.
- **Container Management:** Manage storage containers, including their types, capacities, and hierarchical relationships.
- **Pooling:** Combine multiple specimens into pools for efficient processing and analysis.
- **Shipment Handling:** Track the shipment of specimens, including logging shipment events and statuses.

**NOT in scope:**

- Automated quality control of specimens.
- Integration with external laboratory information management systems (LIMS) beyond LORIS.

## Permissions
Access to the Biobank Module is controlled through specific permissions to ensure data security and appropriate access levels.

| Permission Code                   | Description                  |  Access Level |
|-----------------------------------|------------------------------|---------------|
| `biobank_specimen_view`           | View Specimen Data           |  View         |
| `biobank_specimen_create`         | Create Specimens             |  Create       |
| `biobank_specimen_edit`           | Edit/Upload Specimen Data    |  Edit/Upload  |
| `biobank_container_view`          | View Container Data          |  View         |
| `biobank_container_create`        | Create Containers            |  Create       |
| `biobank_container_edit`          | Edit Container Data          |  Edit         |
| `biobank_pool_view`               | View Pool Data               |  View         |
| `biobank_pool_create`             | Create Pools                 |  Create       |
| `biobank_fullsiteaccess`          | Full Site Access             |  View         |
| `biobank_fullprojectaccess`       | Full Project Access          |  View         |

*Note: Ensure `Category` and `Access Level` align with your organization's permission schema.*

## Configuration
The module's functionality is supported by multiple configuration tables, each serving a specific purpose in managing specimens, containers, pools, and shipments.

| Table                                 | Configuration                           | Description                                                                                                                                               |
|---------------------------------------|-----------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------|
| `biobank_specimen_type`               | Specimen Types                          | **Defines various specimen types (e.g., Blood, RNA) and their relationships with parent specimen types via `biobank_specimen_type_parent`.**              |
| `biobank_container_capacity`          | Container Capacity                      | **Defines the capacity of containers, specifying how many specimens each container can hold.**                                                           |
| `biobank_container_dimension`         | Container Dimensions                    | **Stores dimensional data of containers, including size and volume specifications.**                                                                      |
| `biobank_container_status`            | Container Status                        | **Tracks the status of containers (e.g., Active, Inactive) to monitor their availability and usage.**                                                      |
| `biobank_container_type`              | Container Types                         | **Specifies types of containers used for storing specimens, linked to specimen types through `biobank_specimen_type_container_type_rel`.**                 |
| `biobank_specimen_attribute`          | Specimen Attributes                     | **Stores attributes related to specimens, such as concentration and quality metrics.**                                                                     |
| `biobank_specimen_attribute_datatype` | Specimen Attribute Datatypes            | **Defines data types for specimen attributes to ensure consistent data entry and validation.**                                                            |
| `biobank_specimen_protocol`           | Specimen Protocols                      | **Associates specimens with specific collection and preparation protocols, ensuring standardized handling procedures.**                                    |
| `biobank_specimen_protocol_attribute_rel` | Specimen Protocol Attribute Relations | **Links specimen protocols to their attributes, maintaining data consistency and integrity.**                                                              |
| `biobank_specimen_type_container_type_rel` | Specimen Type Container Type Relations | **Links specimen types to container types, ensuring appropriate container usage for each specimen type.**                                                  |
| `biobank_specimen_type_parent`        | Specimen Type Parent Relations          | **Manages parent-child relationships between specimen types, allowing for hierarchical classification and organization.**                                    |
| `biobank_specimen_type_unit_rel`      | Specimen Type Unit Relations            | **Links specimen types to measurement units, ensuring consistent data entry for specimen measurements.**                                                   |
| `biobank_unit`                        | Measurement Units                       | **Defines measurement units (e.g., µL, mL) used across the Biobank Module for consistent data entry and reporting.**                                        |
| `shipment_status`                     | Shipment Statuses                       | **Tracks the status of shipments (e.g., Pending, Shipped, Delivered) to monitor their progress and completion.**                                           |
| `shipment_type`                       | Shipment Types                          | **Defines different types of shipments (e.g., Internal, External) to categorize and manage shipping processes effectively.**                                 |


### Detailed Configuration Settings
- **Specimen Types (`biobank_specimen_type`):** Defines various specimen types (e.g., Blood, RNA) and their relationships with parent specimen types via `biobank_specimen_type_parent`.

- **Specimen Attributes (`biobank_specimen_attribute` & `biobank_specimen_attribute_datatype`):** Stores attributes related to specimens, such as concentration, quantification dates, and quality metrics. Data types are defined in `biobank_specimen_attribute_datatype`.

- **Container Types (`biobank_container_type`):** Specifies types of containers used for storing specimens, linked to specimen types through `biobank_specimen_type_container_type_rel`.

- **Measurement Units (`biobank_unit` & `biobank_specimen_type_unit_rel`):** Defines measurement units (e.g., µL, mL) and associates them with specimen types to ensure consistent data entry.

- **Protocols (`biobank_specimen_protocol`):** Links specimens and pools to specific collection and preparation protocols, ensuring standardized handling procedures.

- **Pools (`biobank_pool`):** Manages pools created from multiple specimens, allowing for efficient processing and aliquoting.

- **Shipments (`shipment`, `shipment_log`, `shipment_status`, `shipment_type`):** Tracks the shipment of containers, including event logging for comprehensive tracking and accountability.

- **Container Hierarchy (`biobank_container_parent`):** Manages parent-child relationships between containers to reflect storage hierarchies.

- **Data Integrity (`biobank_specimen_protocol_attribute_rel`):** Ensures that specimen protocols are correctly linked to their attributes, maintaining data consistency.

## Interactions with LORIS
The Biobank Module integrates seamlessly with various components of the LORIS platform to enhance functionality and data management:

- **Links:** Includes links to Session, Sites and Candidate modules.
