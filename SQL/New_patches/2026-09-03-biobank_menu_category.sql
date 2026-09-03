-- The 27.0 to 28.0 upgrade activates the biobank module and installs its
-- permissions, but the menu_categories table it creates in the same patch holds
-- only the eight categories that predate biobank. The Biobank category itself
-- was only ever added to the fresh install schema, so an upgraded instance runs
-- an active module whose category does not exist, and every page raises
-- "Menu category Biobank not found" before it renders.

-- Guarded on the category being absent so that this changes nothing on a fresh
-- install, or on a second run.
UPDATE menu_categories
   SET orderby = orderby + 1
 WHERE orderby >= 6
   AND (SELECT COUNT(*)
          FROM (SELECT name FROM menu_categories) AS existing
         WHERE existing.name = 'Biobank') = 0;

INSERT IGNORE INTO menu_categories (name, orderby) VALUES ('Biobank', 6);
