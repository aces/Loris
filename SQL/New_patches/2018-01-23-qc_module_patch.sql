INSERT INTO LorisMenu (Label, Link, Parent, OrderNumber) VALUES ('Quality Control','quality_control/', (SELECT ID FROM LorisMenu as L WHERE Label='Tools'), 10);
