DROP TABLE IF EXISTS ExternalLinkTypes;
CREATE TABLE ExternalLinkTypes (
    LinkTypeID int NOT NULL AUTO_INCREMENT PRIMARY KEY,
    LinkType varchar(255)
);  
INSERT INTO ExternalLinkTypes (LinkType)
    VALUES ('FooterLink'),
           ('StudyLinks'),
           ('dashboard');

DROP TABLE IF EXISTS ExternalLinks;
CREATE TABLE ExternalLinks (
    LinkID int NOT NULL AUTO_INCREMENT PRIMARY KEY,
    LinkTypeID int,
    LinkText varchar(255) NOT NULL,
    LinkURL varchar(255) NOT NULL,
    FOREIGN KEY (LinkTypeID) REFERENCES ExternalLinkTypes(LinkTypeID)
);
INSERT INTO ExternalLinks (LinkTypeID, LinkText, LinkURL) VALUES 
    (1,  'Loris Website', 'http://www.loris.ca'),
    (1,  'GitHub', 'https://github.com/aces'),
    (2,  'Loris Website', 'http://www.loris.ca'),
    (2,  'GitHub', 'https://github.com/aces'),
    (3,  'Loris Website', 'http://www.loris.ca');

