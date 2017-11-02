/*! remove Radiological Reviews from menu */
DROP TABLE IF EXISTS `final_radiological_review_history`;
DROP TABLE IF EXISTS `final_radiological_review`;
    
DELETE FROM LorisMenu where Label = "Radiological Reviews";
update LorisMenu set OrderNumber = (OrderNumber-1) where Parent = 3;

delete from permissions where code = "edit_final_radiological_review";
delete from permissions where code = "view_final_radiological_review";
update permissions set permID = (permID-2) where permID > 22;
