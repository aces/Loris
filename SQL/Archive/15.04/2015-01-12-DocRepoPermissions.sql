UPDATE permissions SET code='document_repository_view', description='View and upload files in Document Repository' WHERE code='file_upload';

INSERT INTO permissions (code,description,categoryID) VALUES ('document_repository_delete','Delete files in Document Repository','2');

