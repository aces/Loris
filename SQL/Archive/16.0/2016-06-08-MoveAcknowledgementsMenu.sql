DELETE FROM LorisMenu WHERE Label='Acknowledgements'; -- deletes both top level and subitem
INSERT INTO LorisMenu (Label, Link, Parent, OrderNumber) VALUES ('Acknowledgements','acknowledgements/', (SELECT ID FROM LorisMenu as L WHERE Label='Tools'), 8);
