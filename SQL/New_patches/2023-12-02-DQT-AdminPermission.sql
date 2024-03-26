INSERT INTO permissions (code, description, moduleID)
    VALUES (
      'dataquery_admin',
      'Dataquery Admin',
      (SELECT ID FROM modules WHERE Name='dataquery')
    );
