# Biobank Module Test Plan

## Biobank Module Main Page
- **Access Control:**
  - *User can access the Biobank Module main page if and only if they have at least one of the following permissions: `biobank_specimen_view`, `biobank_container_view`, `biobank_pool_view`, or `biobank_shipment_view`.* [Manual Testing]
  
- **Data Visibility:**
  - *Users with `biobank_fullsiteaccess` can view specimen, container, pool, and shipment data from all sites.*
  - *Users with `biobank_fullsiteaccess` can view specimen, container, pool, and shipment data from all projects.*
  - *Users with specific view permissions (`biobank_specimen_view`, `biobank_container_view`, etc.) can only see data pertaining to their own site.* [Manual Testing]
  
- **Filter Functionality:**
  - *Test that all filters (e.g., Specimen Type, Container Type, Shipment Status) work correctly.*
  - *When a filter is not applied, all relevant data associated with the user's permissions should be displayed.*
  
- **Clear Filters Button:**
  - *Test the Clear Filters button to ensure it resets all applied filters and displays the default dataset based on user permissions.* [Automation Testing]
  
- **Sortable Columns:**
  - *Test that each column in the main table is sortable by clicking on the header.*
  
- **Hyperlinks Verification:**
  - *Ensure that all hyperlinks in the Specimen, Container, Pool, and Shipment columns are active and load the correct detailed views.*
  
## Specimen Management
- **View Specimens:**
  - *Ensure that users with `biobank_specimen_view` can view specimen details on the
    specimen Page.*
  
- **Create Specimen:**
  - *Verify that users with `biobank_specimen_create` permission can create new specimens and that these specimens appear correctly in the database and UI.*
  
- **Edit/Upload Specimen Data:**
  - *Test that users with `biobank_specimen_edit` can edit or upload data for existing specimens.*
  
- **Permission Enforcement:**
  - *Ensure that users without the necessary permissions cannot create, view, or edit specimen data.*

## Container Management
- **View Containers:**
  - *Ensure that users with `biobank_container_view` can view container details.*
  
- **Create Container:**
  - *Verify that users with `biobank_container_create` permission can create new containers and that these containers appear correctly in the database and UI.*
  
- **Edit Container Data:**
  - *Test that users with `biobank_container_edit` can edit container information.*
  
- **Container Status Tracking:**
  - *Test that container statuses (e.g., Active, Dispensed) are correctly tracked and displayed based on the `biobank_container_status` table.*

## Pool Management
- **Create Pool:**
  - *Verify that users with `biobank_pool_create` permission can create new pools by combining multiple specimens.*
  
- **View Pools:**
  - *Ensure that users with `biobank_pool_view` can view pool details.*
  
## Shipment Handling
- **View Shipments:**
  - *Ensure that users with `biobank_shipment_view` can view shipment details.*

- **Create Shipment:**
  - *Verify that users with `biobank_shipment_create` permission can create new shipment records and associate containers with shipments.*
  
- **Edit Shipment Data:**
  - *Test that users with `biobank_shipment_update` can edit shipment information.*
