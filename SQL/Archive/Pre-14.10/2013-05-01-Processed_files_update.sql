ALTER TABLE files ADD COLUMN SourcePipeline varchar(255);
ALTER TABLE files ADD COLUMN PipelineDate date;
ALTER TABLE files ADD COLUMN SourceFileID int(10) unsigned REFERENCES files(FileID);
ALTER TABLE files CHANGE FileType FileType  enum('mnc','obj','xfm','xfmmnc','imp','vertstat','xml','txt');
