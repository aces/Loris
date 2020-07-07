INSERT INTO `permissions` (code,description,categoryID) VALUES ('document_repository_edit','Upload and edit files in Document Repository','2');
UPDATE `permissions` SET description='Document Repository: View' WHERE code='document_repository_view';
UPDATE `permissions` SET description='Document Repository: Edit and upload' WHERE code='document_repository_view';
UPDATE `permissions` SET description='Document Repository: Delete' WHERE code='document_repository_view';
