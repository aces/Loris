-- Add 'path' and 'web_path' to DataType enum. The first should represent an 
-- arbitrary path used in LORIS. 'web_path' should represent a full path
-- that is reachable by the web-server i.e. Apache. Paths of type 'web_path'
-- will be validated when configured from the front-end and will throw errors
-- if not reachable by the server.
ALTER TABLE ConfigSettings MODIFY COLUMN DataType enum('text','boolean','email','instrument','textarea','scan_type','lookup_center','path','web_path');
UPDATE ConfigSettings SET DataType='web_path' where Name IN ('imagePath', 'base', 'data', 'extLibs', 'mincPath', 'DownloadPath', 'IncomingPath', 'MRICodePath', 'MRIUploadIncomingPath', 'GenomicDataPath', 'mediaPath', 'dataDirBasepath');
UPDATE ConfigSettings SET DataType='path' WHERE Name IN ('log', 'MRICodePath', 'tarchiveLibraryDir', 'get_dicom_info', 'niak_path');
