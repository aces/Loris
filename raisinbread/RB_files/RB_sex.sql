SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE `sex`;
LOCK TABLES `sex` WRITE;
INSERT INTO `sex` (`Name`, `Colour`) VALUES ('Female', '#2FA4E7');
INSERT INTO `sex` (`Name`, `Colour`) VALUES ('Male', '#1C70B6');
INSERT INTO `sex` (`Name`, `Colour`) VALUES ('Other', '#4AE8C2');
UNLOCK TABLES;
SET FOREIGN_KEY_CHECKS=1;
