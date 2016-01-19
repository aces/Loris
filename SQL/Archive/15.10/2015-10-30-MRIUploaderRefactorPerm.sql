UPDATE permissions SET code='imaging_uploader', description='Imaging Uploader' WHERE code='mri_upload';
UPDATE help SET hash=md5('imaging_uploader') WHERE topic='Imaging Uploader';