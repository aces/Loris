CREATE TABLE menu_categories (
	name varchar(255) NOT NULL PRIMARY KEY,
	orderby integer unsigned default 1
);

INSERT INTO menu_categories (name, orderby) VALUES
('Candidate', 1),
('Clinical', 2),
('Electrophysiology', 3),
('Genomics', 4),
('Imaging', 5),
('Reports', 6),
('Tools', 7),
('Admin', 8);
