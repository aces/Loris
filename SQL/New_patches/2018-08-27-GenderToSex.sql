ALTER TABLE `candidate` CHANGE COLUMN Gender Sex enum('Male','Female');
ALTER TABLE `tarchive` CHANGE PatientGender PatientSex varchar(255);
