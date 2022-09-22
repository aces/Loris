ALTER TABLE parameter_type ADD COLUMN `Alias` VARCHAR(255) DEFAULT NULL AFTER Name;
ALTER TABLE parameter_type MODIFY COLUMN `SourceFrom` VARCHAR(255);
ALTER TABLE parameter_type ADD UNIQUE `name_sourceFrom_index` (`Name`, `SourceFrom`);


INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('slice_thickness','SliceThickness','text','Nominal reconstructed slice thickness (for tomographic imaging) or depth of field (for optical non-tomographic imaging), in mm. DICOM:0018_0050','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='SliceThickness', Description='Nominal reconstructed slice thickness (for tomographic imaging) or depth of field (for optical non-tomographic imaging), in mm. DICOM:0018_0050';

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('dicom_0x0018:el_0x0015','BodyPartExamined','text','Text description of the part of the body examined. Some IODs support the Anatomic Region Sequence (0008,2218), which can provide a more comprehensive mechanism for specifying the body part being examined. DICOM:0018_0015','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='BodyPartExamined', Description='Text description of the part of the body examined. Some IODs support the Anatomic Region Sequence (0008,2218), which can provide a more comprehensive mechanism for specifying the body part being examined. DICOM:0018_0015';

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('acquisition:num_slices','NumberOfSlices','text','The maximum number of Slices that may exist in this Series. DICOM:0054_0081','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='NumberOfSlices', Description='The maximum number of Slices that may exist in this Series. DICOM:0054_0081';

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('pixel_bandwidth','PixelBandwidth','text','Reciprocal of the total sampling period, in hertz per pixel. DICOM:0018_0095','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='PixelBandwidth', Description='Reciprocal of the total sampling period, in hertz per pixel. DICOM:0018_0095';

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('acquisition_matrix','AcquisitionMatrixPE','text','Dimensions of the acquired frequency/phase data before reconstruction. Multi-valued: frequency rowsfrequency columnsphase rowsphase columns. DICOM:0018_1310','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='AcquisitionMatrixPE', Description='Dimensions of the acquired frequency/phase data before reconstruction. Multi-valued: frequency rowsfrequency columnsphase rowsphase columns. DICOM:0018_1310';

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('study_id','StudyID','text','User or equipment generated Study identifier. DICOM:0020_0010','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='StudyID', Description='User or equipment generated Study identifier. DICOM:0020_0010';

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('modality','Modality','text','Type of equipment that originally acquired the data used to create images or related objects. DICOM:0008_0060','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='Modality', Description='Type of equipment that originally acquired the data used to create images or related objects. DICOM:0008_0060';

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('sequence_variant','SequenceVariant','text','Variant of the Scanning Sequence. DICOM:0018_0021','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='SequenceVariant', Description='Variant of the Scanning Sequence. DICOM:0018_0021';

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('mr_acquisition_type','MRAcquisitionType','text','Identification of data encoding scheme. DICOM:0018_0023','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='MRAcquisitionType', Description='Identification of data encoding scheme. DICOM:0018_0023';

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('dicom_0x0028:el_0x0002','SamplesPerPixel','text','Number of samples (planes) in this image. DICOM:0028_0002','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='SamplesPerPixel', Description='Number of samples (planes) in this image. DICOM:0028_0002';

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('patient_name','PatientName','text','Set of identifiers used to determine to which candidate the scan belongs to. DICOM:0010_0010','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='PatientName', Description='Set of identifiers used to determine to which candidate the scan belongs to. DICOM:0010_0010';

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('dicom_0x0028:el_0x0004','PhotometricInterpretation','text','Specifies the intended interpretation of the pixel data. DICOM:0028_0004','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='PhotometricInterpretation', Description='Specifies the intended interpretation of the pixel data. DICOM:0028_0004';

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('acquisition:start_time','PerformedProcedureStepStartTime','text','Time on which the Performed Procedure Step started. DICOM:0040_0245','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='PerformedProcedureStepStartTime', Description='Time on which the Performed Procedure Step started. DICOM:0040_0245';

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('number_of_phase_encoding_steps','PhaseEncodingSteps','text','Total number of lines in k-space in the \"y\" direction collected during acquisition. DICOM:0018_0089','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='PhaseEncodingSteps', Description='Total number of lines in k-space in the \"y\" direction collected during acquisition. DICOM:0018_0089';

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('percent_phase_field_of_view','PercentPhaseFOV','text','Ratio of field of view dimension in phase direction to field of view dimension in frequency direction, expressed as a percent. DICOM:0018_0094','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='PercentPhaseFOV', Description='Ratio of field of view dimension in phase direction to field of view dimension in frequency direction, expressed as a percent. DICOM:0018_0094';

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('study:field_value','ValueField','text','The field within a Data Element that contains the Value(s) of that Data Element. DICOM:0000_0060','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='ValueField', Description='The field within a Data Element that contains the Value(s) of that Data Element. DICOM:0000_0060';

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('largest_pixel_image_value','LargestPixelImageValue','text','The maximum actual pixel value encountered in this image. DICOM:0028_0107','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='LargestPixelImageValue', Description='The maximum actual pixel value encountered in this image. DICOM:0028_0107';

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('software_versions','SoftwareVersions','text','Manufacturers designation of software version of the equipment that produced the composite instances. DICOM:0018_1020','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='SoftwareVersions', Description='Manufacturers designation of software version of the equipment that produced the composite instances. DICOM:0018_1020';

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('spacing_between_slices','SpacingBetweenSlices','text','Spacing between slices, in mm, measured from center-to-center of each slice along the normal to the first image. The sign of the Spacing Between Slices (0018,0088) determines the direction of stacking. The normal is determined by the cross product of the direction cosines of the first row and first column of the first frame, such that a positive spacing indicates slices are stacked behind the first slice and a negative spacing indicates slices are stacked in front of the first slice. DICOM:0018_0088','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='SpacingBetweenSlices', Description='Spacing between slices, in mm, measured from center-to-center of each slice along the normal to the first image. The sign of the Spacing Between Slices (0018,0088) determines the direction of stacking. The normal is determined by the cross product of the direction cosines of the first row and first column of the first frame, such that a positive spacing indicates slices are stacked behind the first slice and a negative spacing indicates slices are stacked in front of the first slice. DICOM:0018_0088';

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('transmitting_coil','TransmitCoilName','text','Name of transmit coil used. DICOM:0018_1251','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='TransmitCoilName', Description='Name of transmit coil used. DICOM:0018_1251';

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('cols','Columns','text','Number of columns in the image. DICOM:0028_0011','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='Columns', Description='Number of columns in the image. DICOM:0028_0011';

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('number_of_averages','NumberOfAverages','text','Number of times a given pulse sequence is repeated before any parameter is changed. DICOM:0018_0083','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='NumberOfAverages', Description='Number of times a given pulse sequence is repeated before any parameter is changed. DICOM:0018_0083';

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('scanning_sequence','ScanningSequence','text','Description of the type of data taken. DICOM:0018_0020','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='ScanningSequence', Description='Description of the type of data taken. DICOM:0018_0020';

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('pixel_representation','PixelRepresentation','text','Data representation of the pixel samples. Each sample shall have the same pixel representation. DICOM:0028_0103','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='PixelRepresentation', Description='Data representation of the pixel samples. Each sample shall have the same pixel representation. DICOM:0028_0103';

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('phase_encoding_direction','InPlanePhaseEncodingDirectionDICOM','text','The axes of the in-plane phase encoding with respect to the frame. DICOM:0018_1312','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='InPlanePhaseEncodingDirectionDICOM', Description='The axes of the in-plane phase encoding with respect to the frame. DICOM:0018_1312';

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('acquisition:dose_units','DoseUnits','text','Dose axis units. DICOM:3004_0002','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='DoseUnits', Description='Dose axis units. DICOM:3004_0002';

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('manufacturer','Manufacturer','text','Manufacturer of the equipment that produced the composite instances. Corresponds to DICOM Tag 0008, 0070 Manufacturer','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='Manufacturer', Description='Manufacturer of the equipment that produced the composite instances. Corresponds to DICOM Tag 0008, 0070 Manufacturer';

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('bits_allocated','BitsAllocated','text','Number of bits allocated for each pixel sample. Each sample shall have the same number of bits allocated. DICOM:0028_0100','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='BitsAllocated', Description='Number of bits allocated for each pixel sample. Each sample shall have the same number of bits allocated. DICOM:0028_0100';

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('imaged_nucleus','ImagedNucleus','text','Nucleus that is resonant at the imaging frequency. Examples: 31P, 1H. DICOM:0018_0085','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='ImagedNucleus', Description='Nucleus that is resonant at the imaging frequency. Examples: 31P, 1H. DICOM:0018_0085';

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('image_position_patient','ImagePositionPatient','text','The x, y, and z coordinates of the upper left hand corner (center of the first voxel transmitted) of the image, in mm. DICOM:0020_0032','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='ImagePositionPatient', Description='The x, y, and z coordinates of the upper left hand corner (center of the first voxel transmitted) of the image, in mm. DICOM:0020_0032';

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('sequence_name','SequenceName','text','Any arbitrary name of a molecular sequence. DICOM:0018_0024','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='SequenceName', Description='Any arbitrary name of a molecular sequence. DICOM:0018_0024';

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('series_number','SeriesNumber','text','A number that identifies this Series. DICOM:0020_0011','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='SeriesNumber', Description='A number that identifies this Series. DICOM:0020_0011';

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('slice_location','SliceLocation','text','Relative position of the image plane expressed in mm. DICOM:0020_1041','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='SliceLocation', Description='Relative position of the image plane expressed in mm. DICOM:0020_1041';

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('window_center','WindowCenter','text','Preferred value for Window Center (0028,1050) in the image instances produced by this reconstruction protocol element. DICOM:0028_1050','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='WindowCenter', Description='Preferred value for Window Center (0028,1050) in the image instances produced by this reconstruction protocol element. DICOM:0028_1050';

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('echo_time','EchoTime','text','Time in ms between the middle of the excitation pulse and the peak of the echo produced (kx=0). In the case of segmented k-space, the TE(eff) is the time between the middle of the excitation pulse to the peak of the echo that is used to cover the center of k-space (i.e.,-kx=0, ky=0). DICOM:0018_0081','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='EchoTime', Description='Time in ms between the middle of the excitation pulse and the peak of the echo produced (kx=0). In the case of segmented k-space, the TE(eff) is the time between the middle of the excitation pulse to the peak of the echo that is used to cover the center of k-space (i.e.,-kx=0, ky=0). DICOM:0018_0081';

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('manufacturer_model_name','ManufacturersModelName','text',"Manufacturer's model name of the equipment that produced the composite instances. Corresponds to DICOM Tag 0008, 1090 Manufacturers Model Name",'parameter_file')
    ON DUPLICATE KEY UPDATE Alias='ManufacturersModelName', Description="Manufacturer's model name of the equipment that produced the composite instances. Corresponds to DICOM Tag 0008, 1090 Manufacturers Model Name";

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('dicominfo:image_type','ImageType','text','Image identification characteristics. DICOM:0008_0008','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='ImageType', Description='Image identification characteristics. DICOM:0008_0008';

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('window_width','WindowWidth','text','Window Width for display. DICOM:0028_1051','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='WindowWidth', Description='Window Width for display. DICOM:0028_1051';

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('repetition_time','RepetitionTime','text','The period of time in msec between the beginning of a pulse sequence and the beginning of the succeeding (essentially identical) pulse sequence. Required except when Scanning Sequence (0018,0020) is EP and Sequence Variant (0018,0021) is not SK.','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='RepetitionTime', Description='The period of time in msec between the beginning of a pulse sequence and the beginning of the succeeding (essentially identical) pulse sequence. Required except when Scanning Sequence (0018,0020) is EP and Sequence Variant (0018,0021) is not SK.';

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('receiving_coil','ReceiveCoilName','text','Name of receive coil used. DICOM:0018_1250','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='ReceiveCoilName', Description='Name of receive coil used. DICOM:0018_1250';

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('sar','SAR','text','Calculated whole body Specific Absorption Rate in watts/kilogram. DICOM:0018_1316','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='SAR', Description='Calculated whole body Specific Absorption Rate in watts/kilogram. DICOM:0018_1316';

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('patient_position','PatientPosition','text',"Description of imaging subject's position relative to the equipment. DICOM:0018_5100",'parameter_file')
    ON DUPLICATE KEY UPDATE Alias='PatientPosition', Description="Description of imaging subject's position relative to the equipment. DICOM:0018_5100";

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('window_center_width_explanation','WindowCenterWidthExplanation','text','Explanation of the Window Center and Width. DICOM:0028_1055','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='WindowCenterWidthExplanation', Description='Explanation of the Window Center and Width. DICOM:0028_1055';

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('high_bit','HighBit','text','Most significant bit for pixel sample data. Each sample shall have the same high bit. DICOM:0028_0102','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='HighBit', Description='Most significant bit for pixel sample data. Each sample shall have the same high bit. DICOM:0028_0102';

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('rows','Rows','text','Number of rows in the image. DICOM:0028_0010','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='Rows', Description='Number of rows in the image. DICOM:0028_0010';

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('acquisition_number','AcquisitionNumber','text','A number identifying the single continuous gathering of data over a period of time that resulted in this image or instance, which may include multiple bed positions. This number is not required to be unique across SOP Instances in a series. DICOM:0020_0012','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='AcquisitionNumber', Description='A number identifying the single continuous gathering of data over a period of time that resulted in this image or instance, which may include multiple bed positions. This number is not required to be unique across SOP Instances in a series. DICOM:0020_0012';

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('echo_numbers','EchoNumber','text','The echo number used in generating this image. In the case of segmented k-space, it is the effective Echo Number. DICOM:0018_0086','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='EchoNumber', Description='The echo number used in generating this image. In the case of segmented k-space, it is the effective Echo Number. DICOM:0018_0086';

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('percent_sampling','PercentSampling','text','Fraction of acquisition matrix lines acquired, expressed as a percent. DICOM:0018_0093','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='PercentSampling', Description='Fraction of acquisition matrix lines acquired, expressed as a percent. DICOM:0018_0093';

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('image_orientation_patient','ImageOrientationPatientDICOM','text','The direction cosines of the first row and the first column with respect to the patient. DICOM:0020_0037','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='ImageOrientationPatientDICOM', Description='The direction cosines of the first row and the first column with respect to the patient. DICOM:0020_0037';

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('instance_number','InstanceNumber','text','A number that identifies this SOP Instance. DICOM:0020_0013','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='InstanceNumber', Description='A number that identifies this SOP Instance. DICOM:0020_0013';

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('echo_train_length','EchoTrainLength','text','Number of lines in k-space acquired per excitation of the same volume regardless of the type of echo or the number of frames derived from them. DICOM:0018_0091','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='EchoTrainLength', Description='Number of lines in k-space acquired per excitation of the same volume regardless of the type of echo or the number of frames derived from them. DICOM:0018_0091';

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('bits_stored','BitsStored','text','Number of bits stored for each pixel sample. Each sample shall have the same number of bits stored. See PS 3.5 for further explanation. DICOM:0028_0101','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='BitsStored', Description='Number of bits stored for each pixel sample. Each sample shall have the same number of bits stored. See PS 3.5 for further explanation. DICOM:0028_0101';

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('protocol_name','ProtocolName','text','Description of the conditions under which the Series was performed. DICOM:0018_1030','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='ProtocolName', Description='Description of the conditions under which the Series was performed. DICOM:0018_1030';

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('series_description','SeriesDescription','text','User provided description of the Series. DICOM:0008_103E','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='SeriesDescription', Description='User provided description of the Series. DICOM:0008_103E';

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('magnetic_field_strength','MagneticFieldStrength','text','Nominal field strength of MR magnet in Tesla. DICOM:0018_0087','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='MagneticFieldStrength', Description='Nominal field strength of MR magnet in Tesla. DICOM:0018_0087';

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('dicom_0x0020:el_0x1002','ImagesInAcquisition','text','Number of images that resulted from this acquisition of data. DICOM:0020_1002','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='ImagesInAcquisition', Description='Number of images that resulted from this acquisition of data. DICOM:0020_1002';

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('dicom_0x0018:el_0x0025','AngioFlag','text','Angio Image Indicator. Primary image for Angio processing. Enumerated Values: Y Image is Angio N Image is not Angio. DICOM:0018_0025','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='AngioFlag', Description='Angio Image Indicator. Primary image for Angio processing. Enumerated Values: Y Image is Angio N Image is not Angio. DICOM:0018_0025';

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('dicom_0x0018:el_0x9075','DiffusionDirectionality','text','Specifies whether diffusion conditions for the frame are directional, or isotropic with respect to direction. DICOM:0018_9075','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='DiffusionDirectionality', Description='Specifies whether diffusion conditions for the frame are directional, or isotropic with respect to direction. DICOM:0018_9075';

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('study_instance_uid','StudyInstanceUID','text','Unique identifier for the Study. DICOM:0020_000D','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='StudyInstanceUID', Description='Unique identifier for the Study. DICOM:0020_000D';

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('pixel_spacing','PixelSpacing','text','Physical distance in the patient between the center of each pixel, specified by a numeric pair - adjacent row spacing (delimiter) adjacent column spacing in mm. DICOM:0028_0030','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='PixelSpacing', Description='Physical distance in the patient between the center of each pixel, specified by a numeric pair - adjacent row spacing (delimiter) adjacent column spacing in mm. DICOM:0028_0030';

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('patient:weight','PatientWeight','text','Weight of the patient in kilograms. DICOM:0010_1030','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='PatientWeight', Description='Weight of the patient in kilograms. DICOM:0010_1030';

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('variable_flip_angle_flag','VariableFlipAngle','text','Flip angle variation applied during image acquisition. DICOM:0018_1315','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='VariableFlipAngle', Description='Flip angle variation applied during image acquisition. DICOM:0018_1315';

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('dicom_0x0010:el_0x1030','PatientWeight','text','Weight of the patient in kilograms. DICOM:0010_1030','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='PatientWeight', Description='Weight of the patient in kilograms. DICOM:0010_1030';

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('imaging_frequency','ImagingFrequency','text','Precession frequency in MHz of the nucleus being imaged. DICOM:0018_0084','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='ImagingFrequency', Description='Precession frequency in MHz of the nucleus being imaged. DICOM:0018_0084';

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('acquisition:flip_angle','FlipAngle','text','Steady state angle in degrees to which the magnetic vector is flipped from the magnetic vector of the primary field. DICOM:0018_1314','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='FlipAngle', Description='Steady state angle in degrees to which the magnetic vector is flipped from the magnetic vector of the primary field. DICOM:0018_1314';

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('series_instance_uid','SeriesInstanceUID','text','Unique identifier for the Series that is part of the Study identified in Study Instance UID (0020,000D), if present, and contains the referenced object instance(s). DICOM:0020_000E','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='SeriesInstanceUID', Description='Unique identifier for the Series that is part of the Study identified in Study Instance UID (0020,000D), if present, and contains the referenced object instance(s). DICOM:0020_000E';

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('smallest_pixel_image_value','SmallestPixelImageValue','text','The minimum actual pixel value encountered in this image. DICOM:0028_0106','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='SmallestPixelImageValue', Description='The minimum actual pixel value encountered in this image. DICOM:0028_0106';

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('inversion_time','InversionTime','text','Time in msec after the middle of inverting RF pulse to middle of excitation pulse to detect the amount of longitudinal magnetization. Required if Scanning Sequence (0018,0020) has values of IR. DICOM:0018_0082','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='InversionTime', Description='Time in msec after the middle of inverting RF pulse to middle of excitation pulse to detect the amount of longitudinal magnetization. Required if Scanning Sequence (0018,0020) has values of IR. DICOM:0018_0082';

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('dicom_0x0018:el_0x0022','ScanOptions','text','Parameters of scanning sequence. DICOM:0018_0022','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='ScanOptions', Description='Parameters of scanning sequence. DICOM:0018_0022';

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('dicom_0x0020:el_0x0100','TemporalPositionIdentifier','text','Temporal order of a dynamic or functional set of Images. DICOM:0020_0100','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='TemporalPositionIdentifier', Description='Temporal order of a dynamic or functional set of Images. DICOM:0020_0100';

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('dicom_0x0008:el_0x9209','AcquisitionContrast','text','Indication of acquisition contrast used with frames in the SOP Instance. DICOM:0008_9209','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='AcquisitionContrast', Description='Indication of acquisition contrast used with frames in the SOP Instance. DICOM:0008_9209';

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('acquisition_time','AcquisitionTime','text','The time the acquisition of data that resulted in this image started. DICOM:0008_0032','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='AcquisitionTime', Description='The time the acquisition of data that resulted in this image started. DICOM:0008_0032';

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('dicom_0x0018:el_0x1090','CardiacNumberOfImages','text','Number of images per cardiac cycle. DICOM:0018_1090','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='CardiacNumberOfImages', Description='Number of images per cardiac cycle. DICOM:0018_1090';

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('dicom_0x0028:el_0x0006','PlanarConfiguration','text','Indicates whether the pixel data are encoded color-by-plane or color-by-pixel. DICOM:0028_0006','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='PlanarConfiguration', Description='Indicates whether the pixel data are encoded color-by-plane or color-by-pixel. DICOM:0028_0006';

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('dicom_0x0008:el_0x0064','ConversionType','text','Describes the kind of image conversion. DICOM:0008_0064','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='ConversionType', Description='Describes the kind of image conversion. DICOM:0008_0064';

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('dicom_0x0020:el_0x0020','PatientOrientation','text','Patient direction of the rows and columns of the image. DICOM:0020_0020','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='PatientOrientation', Description='Patient direction of the rows and columns of the image. DICOM:0020_0020';

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('dicom_0x0008:el_0x1032','ProcedureCodeSequence','text','A Sequence that conveys the type of procedure performed. DICOM:0008_1032','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='ProcedureCodeSequence', Description='A Sequence that conveys the type of procedure performed. DICOM:0008_1032';

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('dicom_0x0010:el_0x1020','PatientHeight','text',"Patient's height or length in meters. DICOM:0010_1020",'parameter_file')
    ON DUPLICATE KEY UPDATE Alias='PatientHeight', Description="Patient's height or length in meters. DICOM:0010_1020";

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('dicom_0x0032:el_0x1064','StudyInstance','text','A sequence that conveys the requested procedure. One or more Items may be included in this Sequence. DICOM:0032_1064','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='StudyInstance', Description='A sequence that conveys the requested procedure. One or more Items may be included in this Sequence. DICOM:0032_1064';

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('image_date','ContentDate','text','The date the data creation was started. For instance, this is the date the pixel data is created, not the date the data is acquired. DICOM:0008_0023','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='ContentDate', Description='The date the data creation was started. For instance, this is the date the pixel data is created, not the date the data is acquired. DICOM:0008_0023';

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('acquisition_date','AcquisitionDate','text','The date the acquisition of data that resulted in this image started. DICOM:0008_0022','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='AcquisitionDate', Description='The date the acquisition of data that resulted in this image started. DICOM:0008_0022';

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('series_date','SeriesDate','text','Date the Series started. DICOM:0008_0021','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='SeriesDate', Description='Date the Series started. DICOM:0008_0021';

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('image_time','ContentTime','text','The time the data creation was started. For instance, this is the time the pixel data is created, not the time the data is acquired. DICOM:0008_0033','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='ContentTime', Description='The time the data creation was started. For instance, this is the time the pixel data is created, not the time the data is acquired. DICOM:0008_0033';

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('series_time','SeriesTime','text','Time the Series started. DICOM:0008_0031','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='SeriesTime', Description='Time the Series started. DICOM:0008_0031';

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('study_date','StudyDate','text','Date the Study started. DICOM:0008_0020','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='StudyDate', Description='Date the Study started. DICOM:0008_0020';

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('study_time','StudyTime','text','Time the Study started. DICOM:0008_0030','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='StudyTime', Description='Time the Study started. DICOM:0008_0030';

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('device_serial_number','DeviceSerialNumber','text',"Manufacturer's serial number of the device. DICOM:0018_1000",'parameter_file')
    ON DUPLICATE KEY UPDATE Alias='DeviceSerialNumber', Description="Manufacturer's serial number of the device. DICOM:0018_1000";

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('frame_of_reference_uid','FrameOfReferenceUID','text','Uniquely identifies the frame of reference for a Series. shall be used to uniquely identify a frame of reference for a series. Each series shall have a single Frame of Reference UID. However, multiple Series within a Study may share a Frame of Reference. DICOM:0020_0052','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='FrameOfReferenceUID', Description='Uniquely identifies the frame of reference for a Series. shall be used to uniquely identify a frame of reference for a series. Each series shall have a single Frame of Reference UID. However, multiple Series within a Study may share a Frame of Reference. DICOM:0020_0052';

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('image_comments','ImageComments','text','User-defined comments about the image. DICOM:0020_4000','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='ImageComments', Description='User-defined comments about the image. DICOM:0020_4000';

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('dicom_0x0028:el_0x1053','RescaleSlope','text','m in the equation specified by Rescale Intercept (0028,1052). DICOM:0028_1053','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='RescaleSlope', Description='m in the equation specified by Rescale Intercept (0028,1052). DICOM:0028_1053';

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('dicom_0x0028:el_0x1054','RescaleType','text','Specifies the output units of Rescale Slope (0028,1053) and Rescale Intercept (0028,1052). DICOM:0028_1054','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='RescaleType', Description='Specifies the output units of Rescale Slope (0028,1053) and Rescale Intercept (0028,1052). DICOM:0028_1054';

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('dicom_0x0028:el_0x1052','RescaleIntercept','text','The value b in relationship between stored values (SV) and pixel value units (U) defined in Units (0054,1001): U = m*SV+b. DICOM:0028_1052','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='RescaleIntercept', Description='The value b in relationship between stored values (SV) and pixel value units (U) defined in Units (0054,1001): U = m*SV+b. DICOM:0028_1052';

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('institution_name','InstitutionName','text','Institution or organization to which the identified individual is responsible or accountable May also refer to the institution or organization at which the relevant equipment is located. DICOM:0008_0080','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='InstitutionName', Description='Institution or organization to which the identified individual is responsible or accountable May also refer to the institution or organization at which the relevant equipment is located. DICOM:0008_0080';

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('study_description','StudyDescription','text','Institution-generated description or classification of the Study (component) performed. DICOM:0008_1030','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='StudyDescription', Description='';

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('operator_name','OperatorName','text','Name(s) of the operator(s) who supporting this Series. DICOM:0008_1070','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='OperatorName', Description='Name(s) of the operator(s) who supporting this Series. DICOM:0008_1070';

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('patient_id','PatientID','text','A primary identifier for the patient. In the case of imaging a group of small animals simultaneously, the single value of this identifier corresponds to the identification of the entire group. DICOM:0010_0020','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='PatientID', Description='A primary identifier for the patient. In the case of imaging a group of small animals simultaneously, the single value of this identifier corresponds to the identification of the entire group. DICOM:0010_0020';

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('patient_dob','PatientsBirthDate','text','Birth date of the patient. DICOM:0010_0030','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='PatientsBirthDate', Description='Birth date of the patient. DICOM:0010_0030';

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('effective_series_duration','EffectiveDuration','text','Total time in seconds that data was actually taken for the entire Multi-frame image. DICOM:0018_0072','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='EffectiveDuration', Description='Total time in seconds that data was actually taken for the entire Multi-frame image. DICOM:0018_0072';

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('spatial_resolution','SpatialResolution','text','The inherent limiting resolution in mm of the acquisition equipment for high contrast objects for the data gathering and reconstruction technique chosen. If variable across the images of the series, the value at the image center. DICOM:0018_1050','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='SpatialResolution', Description='The inherent limiting resolution in mm of the acquisition equipment for high contrast objects for the data gathering and reconstruction technique chosen. If variable across the images of the series, the value at the image center. DICOM:0018_1050';

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('fov_dimensions','FieldOfViewDimensions','text','Dimensions of the field of view, in mm. If Field of View Shape (0018,1147) is: RECTANGLE: row dimension followed by column. ROUND: diameter. HEXAGONAL: diameter of a circumscribed circle. DICOM:0018_1149','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='FieldOfViewDimensions', Description='Dimensions of the field of view, in mm. If Field of View Shape (0018,1147) is: RECTANGLE: row dimension followed by column. ROUND: diameter. HEXAGONAL: diameter of a circumscribed circle. DICOM:0018_1149';

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('laterality','Laterality','text','Laterality of (paired) body part examined. Required if the body part examined is a paired structure and Image Laterality (0020,0062) or Frame Laterality (0020,9072) are not sent. DICOM:0020_0060','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='Laterality', Description='Laterality of (paired) body part examined. Required if the body part examined is a paired structure and Image Laterality (0020,0062) or Frame Laterality (0020,9072) are not sent. DICOM:0020_0060';

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('position_reference_indicator','PositionReferenceIndicator','text','Part of the imaging target used as a reference. DICOM:0020_1040','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='PositionReferenceIndicator', Description='Part of the imaging target used as a reference. DICOM:0020_1040';

INSERT INTO `parameter_type` (Name, Alias, Type, Description, SourceFrom) VALUES
    ('pixel_padding_value','PixelPaddingValue','text','Value of pixels added to non-rectangular image to pad to rectangular format. DICOM:0028_0120','parameter_file')
    ON DUPLICATE KEY UPDATE Alias='PixelPaddingValue', Description='Value of pixels added to non-rectangular image to pad to rectangular format. DICOM:0028_0120';
