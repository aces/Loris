-- Removing the config setting if_site of the imaging pipeline section as discussed during a LORIS imaging meeting
DELETE FROM Config WHERE ConfigID=(
    SELECT ID FROM ConfigSettings WHERE Name='if_site'
);
DELETE FROM ConfigSettings WHERE Name='if_site';
