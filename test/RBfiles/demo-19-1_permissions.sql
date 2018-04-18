-- MySQL dump 10.16  Distrib 10.1.32-MariaDB, for Linux (x86_64)
--
-- Host: 192.168.122.1    Database: Demo
-- ------------------------------------------------------
-- Server version	5.1.73

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Dumping data for table `permissions`
--

LOCK TABLES `permissions` WRITE;
/*!40000 ALTER TABLE `permissions` DISABLE KEYS */;
TRUNCATE TABLE `permissions`; INSERT INTO `permissions` (`permID`, `code`, `description`, `categoryID`) VALUES (1,'superuser','There can be only one Highlander',1),(2,'user_accounts','User management',2),(3,'user_accounts_multisite','Across all sites create and edit users',2),(4,'context_help','Edit help documentation',2),(5,'bvl_feedback','Behavioural QC',1),(6,'imaging_browser_qc','Edit imaging browser QC status',2),(7,'mri_efax','Edit MRI Efax files',2),(8,'send_to_dcc','Send to DCC',2),(9,'unsend_to_dcc','Reverse Send from DCC',2),(10,'access_all_profiles','Across all sites access candidate profiles',2),(11,'data_entry','Data entry',1),(12,'examiner_view','Add and certify examiners',2),(13,'examiner_multisite','Across all sites add and certify examiners',2),(14,'training','View and complete training',2),(15,'timepoint_flag','Edit exclusion flags',2),(16,'timepoint_flag_evaluate','Evaluate overall exclusionary criteria for the timepoint',2),(17,'conflict_resolver','Resolving conflicts',2),(18,'data_dict_view','View Data Dictionary (Parameter type descriptions)',2),(19,'violated_scans_view_allsites','Violated Scans: View all-sites Violated Scans',2),(20,'violated_scans_edit','Violated Scans: Edit MRI protocol table',2),(21,'data_integrity_flag','Data Integrity Flag',2),(22,'config','Edit configuration settings',2),(23,'imaging_browser_view_site','View own-site Imaging Browser pages',2),(24,'imaging_browser_view_allsites','View all-sites Imaging Browser pages',2),(25,'dicom_archive_view_allsites','Across all sites view Dicom Archive module and pages',2),(26,'reliability_edit_all','Access and Edit all Reliability profiles',2),(27,'reliability_swap_candidates','Swap Reliability candidates across all sites',2),(28,'instrument_builder','Instrument Builder: Create and Edit instrument forms',2),(29,'data_dict_edit','Edit Data Dictionary',2),(30,'data_team_helper','Data Team Helper',2),(31,'candidate_parameter_view','View Candidate Parameters',2),(32,'candidate_parameter_edit','Edit Candidate Parameters',2),(33,'genomic_browser_view_site','View Genomic Browser data from own site',2),(34,'genomic_browser_view_allsites','View Genomic Browser data across all sites',2),(35,'document_repository_view','View and upload files in Document Repository',2),(36,'document_repository_delete','Delete files in Document Repository',2),(37,'server_processes_manager','View and manage server processes',2),(38,'imaging_uploader','Imaging Uploader',2),(39,'acknowledgements_view','View Acknowledgements',2),(40,'acknowledgements_edit','Edit Acknowledgements',2),(41,'dataquery_view','View Data Query Tool',2),(42,'genomic_data_manager','Manage the genomic files',2),(43,'media_write','Media files: Uploading/Downloading/Editing',2),(44,'media_read','Media files: Browsing',2),(45,'issue_tracker_reporter','Can add a new issue, edit own issue, comment on all',2),(46,'issue_tracker_developer','Can re-assign issues, mark issues as closed, comment on all, edit issues.',2),(47,'imaging_browser_phantom_allsites','Can access only phantom data from all sites in Imaging Browser',2),(48,'imaging_browser_phantom_ownsite','Can access only phantom data from own site in Imaging Browser',2);
/*!40000 ALTER TABLE `permissions` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2018-05-07 13:31:40
