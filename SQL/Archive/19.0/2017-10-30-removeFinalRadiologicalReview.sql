/*! remove Radiological Reviews from menu */
DELETE FROM LorisMenu where Label = "Radiological Reviews";
update LorisMenu set OrderNumber = (OrderNumber-1) where Parent = 3;
