INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) VALUES('login_logo_left', 'Path for top left logo on the login page.', 1, 0, 'text', 1, 'Login Top Left Logo', 3);
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) VALUES('login_logo_right', 'Path for top right logo on the login page.', 1, 0, 'text', 1, 'Login Top Right Logo', 3);
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) VALUES('login_logo_left_link', 'Optional link to redirect when clicking on top left logo', 1, 0, 'text', 1, 'Login Top Left Logo Link', 4);
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) VALUES('login_logo_right_link', 'Optional link to redirect when clicking on top right logo', 1, 0, 'text', 1, 'Login Top Right Logo Link', 4);
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) VALUES('partner_logos', 'Logos for partners to be displayed in the homepage', 1, 1, 'text', 1, 'Partner Logos', 4);

INSERT INTO Config (ConfigID, Value) VALUES ((SELECT ID FROM ConfigSettings WHERE Name="login_logo_left"), "/images/LORIS_logo_white.svg");
INSERT INTO Config (ConfigID, Value) VALUES ((SELECT ID FROM ConfigSettings WHERE Name="login_logo_right"), "/images/GitHub-Mark-Light-64px.png");
INSERT INTO Config (ConfigID, Value) VALUES ((SELECT ID FROM ConfigSettings WHERE Name="login_logo_left_link"), "/");
INSERT INTO Config (ConfigID, Value) VALUES ((SELECT ID FROM ConfigSettings WHERE Name="login_logo_right_link"), "https://github.com/aces/Loris");