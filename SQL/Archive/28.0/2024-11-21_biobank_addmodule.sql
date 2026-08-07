INSERT INTO modules (Name, Active) VALUES ('biobank', 'Y');

INSERT INTO `permissions` (code, description, moduleID, action, categoryID) VALUES
    ('biobank_specimen_view','View Specimen Data',(SELECT ID FROM modules WHERE Name='biobank'), 'View', '2'),
    ('biobank_specimen_create','Create Specimens',(SELECT ID FROM modules WHERE Name='biobank'), 'Create', '2'),
    ('biobank_specimen_update','Process Specimens',(SELECT ID FROM modules WHERE Name='biobank'), 'Edit', '2'),
    ('biobank_specimen_alter','Edit Specimen Data',(SELECT ID FROM modules WHERE Name='biobank'), 'Edit', '2'),
    ('biobank_container_view','View Container Data',(SELECT ID FROM modules WHERE Name='biobank'), 'View', '2'),
    ('biobank_container_create','Create Containers',(SELECT ID FROM modules WHERE Name='biobank'), 'Create', '2'),
    ('biobank_container_update','Edit Container Data',(SELECT ID FROM modules WHERE Name='biobank'), 'Edit', '2'),
    ('biobank_pool_view','View Pool Data',(SELECT ID FROM modules WHERE Name='biobank'), 'View', '2'),
    ('biobank_pool_create','Create Pools',(SELECT ID FROM modules WHERE Name='biobank'), 'Create', '2'),
    ('biobank_fullsiteaccess','Full Site Access',(SELECT ID FROM modules WHERE Name='biobank'), 'View', '2'),
    ('biobank_fullprojectaccess','Full Project Access',(SELECT ID FROM modules WHERE Name='biobank'), 'View', '2');
