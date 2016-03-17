UPDATE Config AS c, ConfigSettings AS cs SET c.value="/data/incoming/" WHERE c.ConfigID=cs.ID AND cs.Name="MRIUploadIncomingPath";
