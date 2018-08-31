UPDATE LorisMenu
  SET OrderNumber=5
  WHERE Label="Reports";

UPDATE LorisMenu
  SET OrderNumber=6
  WHERE Label="Tools";

UPDATE LorisMenu
  SET OrderNumber=7
  WHERE Label="Admin";


INSERT INTO LorisMenu
  (Parent, Label, Link, Visible, OrderNumber)
  VALUES
  (NULL, 'Electrophysiology', NULL, NULL, 4);

INSERT INTO LorisMenu (Label, Link, Parent, OrderNumber) VALUES
    (
      'Electrophysiology Browser',
      'electrophysiology_browser/',
      (SELECT ID FROM LorisMenu as L WHERE Label='Electrophysiology'),
      1
    );
