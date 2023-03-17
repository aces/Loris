SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE `physiological_event_archive`;
LOCK TABLES `physiological_event_archive` WRITE;
INSERT INTO `physiological_event_archive` (`EventArchiveID`, `PhysiologicalFileID`, `Blake2bHash`, `FilePath`) VALUES (1,11,'ee1bf1c5b6d6ee84758bf76d5c069db52816d91e9fe6c553986e6ec5da992ca94b75874acfcaa1757dd773727d5768aa2461051ea001310134646247eaa44a78','bids_imports/PIDCC0821_V03_BIDSVersion_1.6.0/sub-PIDCC0821/ses-V03/eeg/sub-PIDCC0821_ses-V03_task-FACE_acq-eeg_events.tgz');
INSERT INTO `physiological_event_archive` (`EventArchiveID`, `PhysiologicalFileID`, `Blake2bHash`, `FilePath`) VALUES (2,12,'77291d2e2bb7be1eff546b1590f5fa131892bea27afc3e90de0d38d36c0128481c3e782fc42b55b78961b8b1f432ee21d958d5e35301334508fa3fae0ebd8302','bids_imports/PIDCC0821_V03_BIDSVersion_1.6.0/sub-PIDCC0821/ses-V03/eeg/sub-PIDCC0821_ses-V03_task-MMN_acq-eeg_events.tgz');
INSERT INTO `physiological_event_archive` (`EventArchiveID`, `PhysiologicalFileID`, `Blake2bHash`, `FilePath`) VALUES (3,13,'5ebec2e0155fe8477fe44e89483876e21eb9928e9028cf340e02de3a72f3520ca059ae2a32ddf3d2aafdb6009229af8e3db551eef573889dc84cbf171b2b6505','bids_imports/PIDCC0821_V03_BIDSVersion_1.6.0/sub-PIDCC0821/ses-V03/eeg/sub-PIDCC0821_ses-V03_task-RS_acq-eeg_events.tgz');
INSERT INTO `physiological_event_archive` (`EventArchiveID`, `PhysiologicalFileID`, `Blake2bHash`, `FilePath`) VALUES (4,14,'b8fa64cf48949fa82d22d95d602e97df4914cde4733f8148dce49a293cb21d6228193dcefafbc9b429fcfff8490ffd4f59730e64257f2702f9ad8f81e64646a8','bids_imports/PIDCC0821_V03_BIDSVersion_1.6.0/sub-PIDCC0821/ses-V03/eeg/sub-PIDCC0821_ses-V03_task-VEP_acq-eeg_events.tgz');
UNLOCK TABLES;
SET FOREIGN_KEY_CHECKS=1;
