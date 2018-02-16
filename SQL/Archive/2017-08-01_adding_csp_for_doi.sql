-- Adding https://data.datacite.org to CSP connect-src
INSERT INTO Config (ConfigID, Value) SELECT ID, 'connect-src \'self\' https://data.datacite.org;' FROM ConfigSettings WHERE NAme = 'CSPAdditionalHeaders';
