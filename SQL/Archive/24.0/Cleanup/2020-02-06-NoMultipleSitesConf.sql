-- This configuration is not used by any code in LORIS. Admins should verify that they
-- aren't using it for custom modules or instruments before applying this patch.
DELETE FROM Config WHERE ConfigID IN (Select ID FROM ConfigSettings WHERE Name='multipleSites');
DELETE FROM ConfigSettings WHERE Name='multipleSites';
