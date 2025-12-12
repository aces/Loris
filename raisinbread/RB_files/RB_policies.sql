SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE `policies`;
LOCK TABLES `policies` WRITE;
INSERT INTO `policies` (`PolicyID`, `Name`, `Version`, `ModuleID`, `PolicyRenewalTime`, `PolicyRenewalTimeUnit`, `Content`, `SwalTitle`, `HeaderButton`, `HeaderButtonText`, `Active`, `AcceptButtonText`, `DeclineButtonText`, `CreatedAt`, `UpdatedAt`) VALUES (1,'dataquery_example',1,49,7,'D','By using this Data Query Tool, you acknowledge that you know it is in beta and may not work as expected. You also agree to use it responsibly and not to misuse the data.','Terms of Use','Y','Terms of Use','Y','Yes, I accept','Decline','2025-05-28 10:54:21','2025-05-28 10:54:21');
INSERT INTO `policies` (`PolicyID`, `Name`, `Version`, `ModuleID`, `PolicyRenewalTime`, `PolicyRenewalTimeUnit`, `Content`, `SwalTitle`, `HeaderButton`, `HeaderButtonText`, `Active`, `AcceptButtonText`, `DeclineButtonText`, `CreatedAt`, `UpdatedAt`) VALUES (2,'login_example',1,28,7,'D','By using this LORIS instance you acknowledge that you know it is filled with test data, and not real user data.','Terms of Use','Y','Terms of Use','Y','Accept','','2025-05-28 10:54:23','2025-05-28 10:54:23');
UNLOCK TABLES;
SET FOREIGN_KEY_CHECKS=1;
