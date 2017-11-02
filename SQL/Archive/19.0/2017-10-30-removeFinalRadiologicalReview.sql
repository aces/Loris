/*! remove Radiological Reviews from menu */
DROP TABLE IF EXISTS `final_radiological_review_history`;
DROP TABLE IF EXISTS `final_radiological_review`;
    
DELETE FROM LorisMenu where Label = "Radiological Reviews";
update LorisMenu set OrderNumber = (OrderNumber-1) where Parent = 3;
