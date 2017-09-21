SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS; 
SET @OLD_sql_mode=@@sql_mode; 
SET FOREIGN_KEY_CHECKS=0; 
SET sql_mode = ''; 
UPDATE rida_ccna.Clinical_Biosamples_CBSR SET Date_taken=NULL, Testdate=Testdate WHERE CAST(Date_taken AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Clinical_Biosamples_CBSR SET date_exported=NULL, Testdate=Testdate WHERE CAST(date_exported AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Clinical_CBC SET Date_taken=NULL, Testdate=Testdate WHERE CAST(Date_taken AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Clinical_Current_Medication SET Date_taken=NULL, Testdate=Testdate WHERE CAST(Date_taken AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Clinical_Current_Medication SET start_1=NULL, Testdate=Testdate WHERE CAST(start_1 AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Clinical_Current_Medication SET start_2=NULL, Testdate=Testdate WHERE CAST(start_2 AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Clinical_Current_Medication SET start_3=NULL, Testdate=Testdate WHERE CAST(start_3 AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Clinical_Current_Medication SET start_4=NULL, Testdate=Testdate WHERE CAST(start_4 AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Clinical_Current_Medication SET start_5=NULL, Testdate=Testdate WHERE CAST(start_5 AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Clinical_Current_Medication SET start_6=NULL, Testdate=Testdate WHERE CAST(start_6 AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Clinical_Current_Medication SET start_7=NULL, Testdate=Testdate WHERE CAST(start_7 AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Clinical_Current_Medication SET start_8=NULL, Testdate=Testdate WHERE CAST(start_8 AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Clinical_Current_Medication SET start_9=NULL, Testdate=Testdate WHERE CAST(start_9 AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Clinical_Current_Medication SET start_10=NULL, Testdate=Testdate WHERE CAST(start_10 AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Clinical_Current_Medication SET start_11=NULL, Testdate=Testdate WHERE CAST(start_11 AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Clinical_Current_Medication SET start_12=NULL, Testdate=Testdate WHERE CAST(start_12 AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Clinical_Current_Medication SET start_13=NULL, Testdate=Testdate WHERE CAST(start_13 AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Clinical_Current_Medication SET start_14=NULL, Testdate=Testdate WHERE CAST(start_14 AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Clinical_Current_Medication SET start_15=NULL, Testdate=Testdate WHERE CAST(start_15 AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Clinical_Current_Medication SET start_16=NULL, Testdate=Testdate WHERE CAST(start_16 AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Clinical_Current_Medication SET start_17=NULL, Testdate=Testdate WHERE CAST(start_17 AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Clinical_Current_Medication SET start_18=NULL, Testdate=Testdate WHERE CAST(start_18 AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Clinical_Current_Medication SET start_19=NULL, Testdate=Testdate WHERE CAST(start_19 AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Clinical_Current_Medication SET start_20=NULL, Testdate=Testdate WHERE CAST(start_20 AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Clinical_Diagnosis_Confirmation SET Date_taken=NULL, Testdate=Testdate WHERE CAST(Date_taken AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Clinical_Diagnosis_Confirmation SET phy_date_1=NULL, Testdate=Testdate WHERE CAST(phy_date_1 AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Clinical_Family_History SET Date_taken=NULL, Testdate=Testdate WHERE CAST(Date_taken AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Clinical_Gait_Pre_Assessment SET Date_taken=NULL, Testdate=Testdate WHERE CAST(Date_taken AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Clinical_Hachinski_Ischaemic_Score SET Date_taken=NULL, Testdate=Testdate WHERE CAST(Date_taken AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Clinical_Hobbies_And_Leisure_Activities SET Date_taken=NULL, Testdate=Testdate WHERE CAST(Date_taken AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Clinical_Initial_Symptoms SET Date_taken=NULL, Testdate=Testdate WHERE CAST(Date_taken AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Clinical_Initial_Symptoms SET year_month_of_first_symptoms_date=NULL, Testdate=Testdate WHERE CAST(year_month_of_first_symptoms_date AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Clinical_Initial_Symptoms SET year_month_of_initial_diagnosis_date=NULL, Testdate=Testdate WHERE CAST(year_month_of_initial_diagnosis_date AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Clinical_LBSA_I_PDQ SET Date_taken=NULL, Testdate=Testdate WHERE CAST(Date_taken AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Clinical_LBSA_I_UPDRS_IB_II SET Date_taken=NULL, Testdate=Testdate WHERE CAST(Date_taken AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Clinical_Lumbar_Puncture_Eligibility_Questionnaire SET Date_taken=NULL, Testdate=Testdate WHERE CAST(Date_taken AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Clinical_Lumbar_Puncture_Eligibility_Questionnaire SET completed_prior_to=NULL, Testdate=Testdate WHERE CAST(completed_prior_to AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Clinical_Lumbar_Puncture_Eligibility_Questionnaire SET scheduled_LP_appointment=NULL, Testdate=Testdate WHERE CAST(scheduled_LP_appointment AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Clinical_Lumbar_Puncture_Procedure_Report SET Date_taken=NULL, Testdate=Testdate WHERE CAST(Date_taken AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Clinical_Lumbar_Puncture_Procedure_Report SET date_of_LP_appt_date=NULL, Testdate=Testdate WHERE CAST(date_of_LP_appt_date AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Clinical_Lumbar_Puncture_Procedure_Report SET physician_date=NULL, Testdate=Testdate WHERE CAST(physician_date AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Clinical_Lumbar_Puncture_Procedure_Report SET nurse_date=NULL, Testdate=Testdate WHERE CAST(nurse_date AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Clinical_Medical_History SET Date_taken=NULL, Testdate=Testdate WHERE CAST(Date_taken AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Clinical_Mental_Health_History SET Date_taken=NULL, Testdate=Testdate WHERE CAST(Date_taken AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Clinical_Neurological_Exam SET Date_taken=NULL, Testdate=Testdate WHERE CAST(Date_taken AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Clinical_Oral_Health SET Date_taken=NULL, Testdate=Testdate WHERE CAST(Date_taken AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Clinical_Past_Medications SET Date_taken=NULL, Testdate=Testdate WHERE CAST(Date_taken AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Clinical_Past_Medications SET hormone_replacement_therapy_start_date=NULL, Testdate=Testdate WHERE CAST(hormone_replacement_therapy_start_date AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Clinical_Past_Medications SET hormone_replacement_therapy_end_date=NULL, Testdate=Testdate WHERE CAST(hormone_replacement_therapy_end_date AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Clinical_Past_Medications SET serms_start_date=NULL, Testdate=Testdate WHERE CAST(serms_start_date AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Clinical_Past_Medications SET serms_end_date=NULL, Testdate=Testdate WHERE CAST(serms_end_date AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Clinical_Past_Medications SET aromatase_inhibitors_start_date=NULL, Testdate=Testdate WHERE CAST(aromatase_inhibitors_start_date AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Clinical_Past_Medications SET aromatase_inhibitors_end_date=NULL, Testdate=Testdate WHERE CAST(aromatase_inhibitors_end_date AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Clinical_Past_Medications SET chemotherapy_start_date=NULL, Testdate=Testdate WHERE CAST(chemotherapy_start_date AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Clinical_Past_Medications SET chemotherapy_end_date=NULL, Testdate=Testdate WHERE CAST(chemotherapy_end_date AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Clinical_Past_Medications SET corticosteroids_start_date=NULL, Testdate=Testdate WHERE CAST(corticosteroids_start_date AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Clinical_Past_Medications SET corticosteroids_end_date=NULL, Testdate=Testdate WHERE CAST(corticosteroids_end_date AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Clinical_Past_Medications SET androgen_deprivation_therapy_start_date=NULL, Testdate=Testdate WHERE CAST(androgen_deprivation_therapy_start_date AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Clinical_Past_Medications SET androgen_deprivation_therapy_end_date=NULL, Testdate=Testdate WHERE CAST(androgen_deprivation_therapy_end_date AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Clinical_Past_Medications SET androgen_replacement_therapy_start_date=NULL, Testdate=Testdate WHERE CAST(androgen_replacement_therapy_start_date AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Clinical_Past_Medications SET androgen_replacement_therapy_end_date=NULL, Testdate=Testdate WHERE CAST(androgen_replacement_therapy_end_date AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Clinical_Past_Medications SET birth_control_start_date=NULL, Testdate=Testdate WHERE CAST(birth_control_start_date AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Clinical_Past_Medications SET birth_control_end_date=NULL, Testdate=Testdate WHERE CAST(birth_control_end_date AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Clinical_Physical_Exam SET Date_taken=NULL, Testdate=Testdate WHERE CAST(Date_taken AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Clinical_Signs_Symptoms SET Date_taken=NULL, Testdate=Testdate WHERE CAST(Date_taken AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Clinical_Smoking SET Date_taken=NULL, Testdate=Testdate WHERE CAST(Date_taken AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Clinical_Surgical_History SET Date_taken=NULL, Testdate=Testdate WHERE CAST(Date_taken AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Clinical_UPDRS_III_IV SET Date_taken=NULL, Testdate=Testdate WHERE CAST(Date_taken AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.General_Health_Adverse_Childhood_Experiences SET Date_taken=NULL, Testdate=Testdate WHERE CAST(Date_taken AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.General_Health_Alcohol_Consumption SET Date_taken=NULL, Testdate=Testdate WHERE CAST(Date_taken AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.General_Health_Basic_Activities_Daily_Living SET Date_taken=NULL, Testdate=Testdate WHERE CAST(Date_taken AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.General_Health_Biosample_Collection SET Date_taken=NULL, Testdate=Testdate WHERE CAST(Date_taken AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.General_Health_Biosample_Collection SET blood_sample_date_taken_date=NULL, Testdate=Testdate WHERE CAST(blood_sample_date_taken_date AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.General_Health_Biosample_Collection SET saliva_sample_date_taken_date=NULL, Testdate=Testdate WHERE CAST(saliva_sample_date_taken_date AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.General_Health_Biosample_Collection SET buccal_sample_date_taken_date=NULL, Testdate=Testdate WHERE CAST(buccal_sample_date_taken_date AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.General_Health_Biosample_Collection SET urine_sample_date_taken_date=NULL, Testdate=Testdate WHERE CAST(urine_sample_date_taken_date AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.General_Health_Biosample_Collection SET fecal_sample_date_taken_date=NULL, Testdate=Testdate WHERE CAST(fecal_sample_date_taken_date AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.General_Health_Biosample_Collection SET csf_sample_date_taken_date=NULL, Testdate=Testdate WHERE CAST(csf_sample_date_taken_date AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.General_Health_CDTT SET Date_taken=NULL, Testdate=Testdate WHERE CAST(Date_taken AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.General_Health_Caregiving_Assessment SET Date_taken=NULL, Testdate=Testdate WHERE CAST(Date_taken AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.General_Health_Constant_Fatigue SET Date_taken=NULL, Testdate=Testdate WHERE CAST(Date_taken AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.General_Health_End_Of_Life_Care SET Date_taken=NULL, Testdate=Testdate WHERE CAST(Date_taken AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.General_Health_Falls_Balance SET Date_taken=NULL, Testdate=Testdate WHERE CAST(Date_taken AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.General_Health_Gait_Assessment SET Date_taken=NULL, Testdate=Testdate WHERE CAST(Date_taken AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.General_Health_Grip_Strength SET Date_taken=NULL, Testdate=Testdate WHERE CAST(Date_taken AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.General_Health_Health_Status SET Date_taken=NULL, Testdate=Testdate WHERE CAST(Date_taken AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.General_Health_Hearing SET Date_taken=NULL, Testdate=Testdate WHERE CAST(Date_taken AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.General_Health_Instrumental_Activities_Daily_Living SET Date_taken=NULL, Testdate=Testdate WHERE CAST(Date_taken AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.General_Health_Mayo_Fluctuations_Scale SET Date_taken=NULL, Testdate=Testdate WHERE CAST(Date_taken AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.General_Health_Nutrition SET Date_taken=NULL, Testdate=Testdate WHERE CAST(Date_taken AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.General_Health_Olfaction SET Date_taken=NULL, Testdate=Testdate WHERE CAST(Date_taken AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.General_Health_Physical_Activity SET Date_taken=NULL, Testdate=Testdate WHERE CAST(Date_taken AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.General_Health_Quality_Life SET Date_taken=NULL, Testdate=Testdate WHERE CAST(Date_taken AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.General_Health_Sleep SET Date_taken=NULL, Testdate=Testdate WHERE CAST(Date_taken AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.General_Health_Social_Activities SET Date_taken=NULL, Testdate=Testdate WHERE CAST(Date_taken AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.General_Health_Social_Network SET Date_taken=NULL, Testdate=Testdate WHERE CAST(Date_taken AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.General_Health_Social_Support SET Date_taken=NULL, Testdate=Testdate WHERE CAST(Date_taken AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.General_Health_Vision SET Date_taken=NULL, Testdate=Testdate WHERE CAST(Date_taken AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.General_Health_Vital_Signs SET Date_taken=NULL, Testdate=Testdate WHERE CAST(Date_taken AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Neuropsych_BORB SET Date_taken=NULL, Testdate=Testdate WHERE CAST(Date_taken AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Neuropsych_Boston_Diagnostic_Aphasia_Exam SET Date_taken=NULL, Testdate=Testdate WHERE CAST(Date_taken AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Neuropsych_Brief_Visuospatial_Memory SET Date_taken=NULL, Testdate=Testdate WHERE CAST(Date_taken AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Neuropsych_CCNA_Reaction_Time_Task SET Date_taken=NULL, Testdate=Testdate WHERE CAST(Date_taken AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Neuropsych_CCNA_Sentence_Inhibition_Task SET Date_taken=NULL, Testdate=Testdate WHERE CAST(Date_taken AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Neuropsych_DKEFS_Category_Fluency SET Date_taken=NULL, Testdate=Testdate WHERE CAST(Date_taken AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Neuropsych_DKEFS_Color_Word_Interference_Test SET Date_taken=NULL, Testdate=Testdate WHERE CAST(Date_taken AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Neuropsych_DKEFS_Letter_Fluency SET Date_taken=NULL, Testdate=Testdate WHERE CAST(Date_taken AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Neuropsych_Digit_Symbol_Test SET Date_taken=NULL, Testdate=Testdate WHERE CAST(Date_taken AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Neuropsych_Envelope SET Date_taken=NULL, Testdate=Testdate WHERE CAST(Date_taken AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Neuropsych_Face_Name_Association SET Date_taken=NULL, Testdate=Testdate WHERE CAST(Date_taken AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Neuropsych_Judgement_Of_Line_Orientation SET Date_taken=NULL, Testdate=Testdate WHERE CAST(Date_taken AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Neuropsych_NACC_Northwestern_Anagram_Test SET Date_taken=NULL, Testdate=Testdate WHERE CAST(Date_taken AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Neuropsych_NACC_Noun_Verb_Naming_Subtests SET Date_taken=NULL, Testdate=Testdate WHERE CAST(Date_taken AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Neuropsych_NACC_Semantic_Associates_Test SET Date_taken=NULL, Testdate=Testdate WHERE CAST(Date_taken AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Neuropsych_NACC_Sentence_Reading_Test SET Date_taken=NULL, Testdate=Testdate WHERE CAST(Date_taken AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Neuropsych_NACC_Sentence_Repetition_Test SET Date_taken=NULL, Testdate=Testdate WHERE CAST(Date_taken AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Neuropsych_NACC_Social_Behavior_Observer_Checklist SET Date_taken=NULL, Testdate=Testdate WHERE CAST(Date_taken AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Neuropsych_NACC_Social_Norms_Questionnaire SET Date_taken=NULL, Testdate=Testdate WHERE CAST(Date_taken AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Neuropsych_NACC_Word_Reading SET Date_taken=NULL, Testdate=Testdate WHERE CAST(Date_taken AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Neuropsych_RAVLT SET Date_taken=NULL, Testdate=Testdate WHERE CAST(Date_taken AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Neuropsych_Reitan_Trail SET Date_taken=NULL, Testdate=Testdate WHERE CAST(Date_taken AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Neuropsych_Semantic_Word_Picture SET Date_taken=NULL, Testdate=Testdate WHERE CAST(Date_taken AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Neuropsych_WAIS_III_Digit_Span_Test SET Date_taken=NULL, Testdate=Testdate WHERE CAST(Date_taken AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Neuropsych_WAIS_III_Vocabulary_Test SET Date_taken=NULL, Testdate=Testdate WHERE CAST(Date_taken AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.PI_Apathy_Inventory SET Date_taken=NULL, Testdate=Testdate WHERE CAST(Date_taken AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.PI_Basic_Activities_For_Daily_Living SET Date_taken=NULL, Testdate=Testdate WHERE CAST(Date_taken AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.PI_Behavioral_Inhibition_Scale SET Date_taken=NULL, Testdate=Testdate WHERE CAST(Date_taken AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.PI_Caregiving_Assessment SET Date_taken=NULL, Testdate=Testdate WHERE CAST(Date_taken AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.PI_General_Information SET Date_taken=NULL, Testdate=Testdate WHERE CAST(Date_taken AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.PI_General_Information SET primary_informant_dob=NULL, Testdate=Testdate WHERE CAST(primary_informant_dob AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.PI_Instrumental_Activities_For_Daily_Living SET Date_taken=NULL, Testdate=Testdate WHERE CAST(Date_taken AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.PI_Interpersonal_Reactivity_Index SET Date_taken=NULL, Testdate=Testdate WHERE CAST(Date_taken AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.PI_Neuropsychiatric_Inventory_Questionnaire SET Date_taken=NULL, Testdate=Testdate WHERE CAST(Date_taken AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.PI_Quality_Of_Life SET Date_taken=NULL, Testdate=Testdate WHERE CAST(Date_taken AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.PI_Revised_Self_Monitoring_Scale SET Date_taken=NULL, Testdate=Testdate WHERE CAST(Date_taken AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.PI_Schwab SET Date_taken=NULL, Testdate=Testdate WHERE CAST(Date_taken AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Primary_Informant_Questionnaire SET Date_taken=NULL, Testdate=Testdate WHERE CAST(Date_taken AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Primary_Informant_Questionnaire SET general_information_2=NULL, Testdate=Testdate WHERE CAST(general_information_2 AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Screening_AD SET Date_taken=NULL, Testdate=Testdate WHERE CAST(Date_taken AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Screening_Audiometry SET Date_taken=NULL, Testdate=Testdate WHERE CAST(Date_taken AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Screening_Benson_Complex_Figure SET Date_taken=NULL, Testdate=Testdate WHERE CAST(Date_taken AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Screening_Benson_Complex_Recall SET Date_taken=NULL, Testdate=Testdate WHERE CAST(Date_taken AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Screening_Biosample_Collection SET Date_taken=NULL, Testdate=Testdate WHERE CAST(Date_taken AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Screening_Biosample_Collection SET biosamples_saliva_date=NULL, Testdate=Testdate WHERE CAST(biosamples_saliva_date AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Screening_Biosample_Collection SET biosamples_buccal_date=NULL, Testdate=Testdate WHERE CAST(biosamples_buccal_date AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Screening_Biosample_Collection SET biosamples_urine_date=NULL, Testdate=Testdate WHERE CAST(biosamples_urine_date AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Screening_Birth_Sex_Handedness SET Date_taken=NULL, Testdate=Testdate WHERE CAST(Date_taken AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Screening_Birth_Sex_Handedness SET date_of_birth=NULL, Testdate=Testdate WHERE CAST(date_of_birth AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Screening_Birth_Sex_Handedness SET come_to_canada_year=NULL, Testdate=Testdate WHERE CAST(come_to_canada_year AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Screening_CERAD_Memory SET Date_taken=NULL, Testdate=Testdate WHERE CAST(Date_taken AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Screening_CERAD_Recog SET Date_taken=NULL, Testdate=Testdate WHERE CAST(Date_taken AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Screening_Candidate_Recruitment SET Date_taken=NULL, Testdate=Testdate WHERE CAST(Date_taken AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Screening_Candidate_Recruitment SET consent_form_signed_date=NULL, Testdate=Testdate WHERE CAST(consent_form_signed_date AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Screening_Clinical_Dementia_Rating SET Date_taken=NULL, Testdate=Testdate WHERE CAST(Date_taken AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Screening_Clinical_PPA SET Date_taken=NULL, Testdate=Testdate WHERE CAST(Date_taken AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Screening_Current_Living_Circumstances SET Date_taken=NULL, Testdate=Testdate WHERE CAST(Date_taken AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Screening_Driving_History SET Date_taken=NULL, Testdate=Testdate WHERE CAST(Date_taken AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Screening_Education SET Date_taken=NULL, Testdate=Testdate WHERE CAST(Date_taken AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Screening_Employment_History SET Date_taken=NULL, Testdate=Testdate WHERE CAST(Date_taken AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Screening_FTD SET Date_taken=NULL, Testdate=Testdate WHERE CAST(Date_taken AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Screening_Freezing_Gait_Questionnaire SET Date_taken=NULL, Testdate=Testdate WHERE CAST(Date_taken AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Screening_Functional_Capacity_Question SET Date_taken=NULL, Testdate=Testdate WHERE CAST(Date_taken AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Screening_General_Exclusion_Criteria SET Date_taken=NULL, Testdate=Testdate WHERE CAST(Date_taken AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Screening_General_Inclusion_Criteria SET Date_taken=NULL, Testdate=Testdate WHERE CAST(Date_taken AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Screening_Household_Income SET Date_taken=NULL, Testdate=Testdate WHERE CAST(Date_taken AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Screening_LBD SET Date_taken=NULL, Testdate=Testdate WHERE CAST(Date_taken AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Screening_LBSA_II_Schwab SET Date_taken=NULL, Testdate=Testdate WHERE CAST(Date_taken AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Screening_Languages SET Date_taken=NULL, Testdate=Testdate WHERE CAST(Date_taken AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Screening_Lawton_Brody SET Date_taken=NULL, Testdate=Testdate WHERE CAST(Date_taken AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Screening_Logical_Memory SET Date_taken=NULL, Testdate=Testdate WHERE CAST(Date_taken AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Screening_Logical_Memory SET I_administration_date=NULL, Testdate=Testdate WHERE CAST(I_administration_date AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Screening_Logical_Memory SET II_administration_date=NULL, Testdate=Testdate WHERE CAST(II_administration_date AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Screening_Logical_Memory_Delayed SET Date_taken=NULL, Testdate=Testdate WHERE CAST(Date_taken AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Screening_Logical_Memory_Delayed SET II_administration_date=NULL, Testdate=Testdate WHERE CAST(II_administration_date AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Screening_Logical_Memory_Immediate SET Date_taken=NULL, Testdate=Testdate WHERE CAST(Date_taken AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Screening_Logical_Memory_Immediate SET I_administration_date=NULL, Testdate=Testdate WHERE CAST(I_administration_date AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Screening_MCI SET Date_taken=NULL, Testdate=Testdate WHERE CAST(Date_taken AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Screening_MOCA SET Date_taken=NULL, Testdate=Testdate WHERE CAST(Date_taken AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Screening_MOCA SET administration_date=NULL, Testdate=Testdate WHERE CAST(administration_date AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Screening_Marital_Status SET Date_taken=NULL, Testdate=Testdate WHERE CAST(Date_taken AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Screening_Mixed SET Date_taken=NULL, Testdate=Testdate WHERE CAST(Date_taken AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Screening_PCI_DAT SET Date_taken=NULL, Testdate=Testdate WHERE CAST(Date_taken AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Screening_PD SET Date_taken=NULL, Testdate=Testdate WHERE CAST(Date_taken AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Screening_PDD SET Date_taken=NULL, Testdate=Testdate WHERE CAST(Date_taken AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Screening_PDMCI SET Date_taken=NULL, Testdate=Testdate WHERE CAST(Date_taken AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Screening_Physical_Activity SET Date_taken=NULL, Testdate=Testdate WHERE CAST(Date_taken AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Screening_Psychiatric_Generalized_Anxiety_Disorder SET Date_taken=NULL, Testdate=Testdate WHERE CAST(Date_taken AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Screening_Psychiatric_Geriatric_Depression_Scale SET Date_taken=NULL, Testdate=Testdate WHERE CAST(Date_taken AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Screening_Reproductive_History SET Date_taken=NULL, Testdate=Testdate WHERE CAST(Date_taken AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Screening_SCI SET Date_taken=NULL, Testdate=Testdate WHERE CAST(Date_taken AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Screening_Summary_Diagnosis_AD_Mixed SET Date_taken=NULL, Testdate=Testdate WHERE CAST(Date_taken AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Screening_Summary_Diagnosis_AD_Mixed SET evaluated_by_physician_date=NULL, Testdate=Testdate WHERE CAST(evaluated_by_physician_date AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Screening_Summary_Diagnosis_CI SET Date_taken=NULL, Testdate=Testdate WHERE CAST(Date_taken AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Screening_Summary_Diagnosis_CI SET evaluated_by_physician_date=NULL, Testdate=Testdate WHERE CAST(evaluated_by_physician_date AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Screening_Summary_Diagnosis_FTD SET Date_taken=NULL, Testdate=Testdate WHERE CAST(Date_taken AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Screening_Summary_Diagnosis_FTD SET evaluated_by_physician_date=NULL, Testdate=Testdate WHERE CAST(evaluated_by_physician_date AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Screening_Summary_Diagnosis_PD SET Date_taken=NULL, Testdate=Testdate WHERE CAST(Date_taken AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Screening_Summary_Diagnosis_PD SET evaluated_by_physician_date=NULL, Testdate=Testdate WHERE CAST(evaluated_by_physician_date AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Screening_UPDRS SET Date_taken=NULL, Testdate=Testdate WHERE CAST(Date_taken AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Screening_VMCI SET Date_taken=NULL, Testdate=Testdate WHERE CAST(Date_taken AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Teams_5x_Sit_To_Stand SET Date_taken=NULL, Testdate=Testdate WHERE CAST(Date_taken AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Teams_6MWT SET Date_taken=NULL, Testdate=Testdate WHERE CAST(Date_taken AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Teams_ADCS_ADL_Inventory SET Date_taken=NULL, Testdate=Testdate WHERE CAST(Date_taken AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Teams_ADCS_ADL_PI SET Date_taken=NULL, Testdate=Testdate WHERE CAST(Date_taken AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Teams_ADCS_ADL_Self_Report SET Date_taken=NULL, Testdate=Testdate WHERE CAST(Date_taken AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Teams_ASBCS SET Date_taken=NULL, Testdate=Testdate WHERE CAST(Date_taken AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Teams_Apathy_Inventory SET Date_taken=NULL, Testdate=Testdate WHERE CAST(Date_taken AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Teams_BAI SET Date_taken=NULL, Testdate=Testdate WHERE CAST(Date_taken AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Teams_Balance_Assessment SET Date_taken=NULL, Testdate=Testdate WHERE CAST(Date_taken AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Teams_Beck_Depression_Inventory_II SET Date_taken=NULL, Testdate=Testdate WHERE CAST(Date_taken AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Teams_CPA_Measures SET Date_taken=NULL, Testdate=Testdate WHERE CAST(Date_taken AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Teams_CPQ SET Date_taken=NULL, Testdate=Testdate WHERE CAST(Date_taken AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Teams_Cognitive_Activities_Questionnaire SET Date_taken=NULL, Testdate=Testdate WHERE CAST(Date_taken AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Teams_DAFS SET Date_taken=NULL, Testdate=Testdate WHERE CAST(Date_taken AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Teams_DAFS SET meds_last_time_refilled_prescription_using_phone=NULL, Testdate=Testdate WHERE CAST(meds_last_time_refilled_prescription_using_phone AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Teams_Data_Collection_Form SET Date_taken=NULL, Testdate=Testdate WHERE CAST(Date_taken AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Teams_Demographic_Information SET Date_taken=NULL, Testdate=Testdate WHERE CAST(Date_taken AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Teams_Feedback_Questionnaire SET Date_taken=NULL, Testdate=Testdate WHERE CAST(Date_taken AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Teams_Game_Experience SET Date_taken=NULL, Testdate=Testdate WHERE CAST(Date_taken AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Teams_Geriatric_Anxiety_Inventory SET Date_taken=NULL, Testdate=Testdate WHERE CAST(Date_taken AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Teams_Grip_Strength SET Date_taken=NULL, Testdate=Testdate WHERE CAST(Date_taken AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Teams_Jessen_Questions SET Date_taken=NULL, Testdate=Testdate WHERE CAST(Date_taken AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Teams_LEAPQ SET Date_taken=NULL, Testdate=Testdate WHERE CAST(Date_taken AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Teams_LEAPQ SET date_of_immigration_to_canada_date=NULL, Testdate=Testdate WHERE CAST(date_of_immigration_to_canada_date AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Teams_LEAPQ SET date_of_immigration_to_another_country_date=NULL, Testdate=Testdate WHERE CAST(date_of_immigration_to_another_country_date AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Teams_MMQ_Ability SET Date_taken=NULL, Testdate=Testdate WHERE CAST(Date_taken AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Teams_MMQ_Contentment SET Date_taken=NULL, Testdate=Testdate WHERE CAST(Date_taken AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Teams_MMQ_Strategy SET Date_taken=NULL, Testdate=Testdate WHERE CAST(Date_taken AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Teams_MMSE SET Date_taken=NULL, Testdate=Testdate WHERE CAST(Date_taken AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Teams_Medical_Care SET Date_taken=NULL, Testdate=Testdate WHERE CAST(Date_taken AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Teams_Memory_Toolbox SET Date_taken=NULL, Testdate=Testdate WHERE CAST(Date_taken AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Teams_Musical_Experience SET Date_taken=NULL, Testdate=Testdate WHERE CAST(Date_taken AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Teams_PARQ SET Date_taken=NULL, Testdate=Testdate WHERE CAST(Date_taken AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Teams_PARQ SET date_of_signature_date=NULL, Testdate=Testdate WHERE CAST(date_of_signature_date AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Teams_PASE SET Date_taken=NULL, Testdate=Testdate WHERE CAST(Date_taken AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Teams_Post_Expectations SET Date_taken=NULL, Testdate=Testdate WHERE CAST(Date_taken AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Teams_Pre_Expectations SET Date_taken=NULL, Testdate=Testdate WHERE CAST(Date_taken AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Teams_SF36 SET Date_taken=NULL, Testdate=Testdate WHERE CAST(Date_taken AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Teams_SPPB SET Date_taken=NULL, Testdate=Testdate WHERE CAST(Date_taken AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Teams_Short_QAM SET Date_taken=NULL, Testdate=Testdate WHERE CAST(Date_taken AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Teams_T10_Consent_Form SET Date_taken=NULL, Testdate=Testdate WHERE CAST(Date_taken AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Teams_T10_Eligibility_Criteria SET Date_taken=NULL, Testdate=Testdate WHERE CAST(Date_taken AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Teams_T12_Inclusion_Exclusion_Criteria SET Date_taken=NULL, Testdate=Testdate WHERE CAST(Date_taken AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Teams_T12_Written_Consent SET Date_taken=NULL, Testdate=Testdate WHERE CAST(Date_taken AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Teams_T12_Written_Consent SET date_of_consent_signature=NULL, Testdate=Testdate WHERE CAST(date_of_consent_signature AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Teams_T6_Consent_Form SET Date_taken=NULL, Testdate=Testdate WHERE CAST(Date_taken AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Teams_VLS_ALQ SET Date_taken=NULL, Testdate=Testdate WHERE CAST(Date_taken AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Teams_fMRI_Activation_Task SET Date_taken=NULL, Testdate=Testdate WHERE CAST(Date_taken AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.acknowledgements SET start_date=NULL WHERE CAST(start_date AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.acknowledgements SET end_date=NULL WHERE CAST(end_date AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.candidate SET DoB=NULL, Testdate=Testdate WHERE CAST(DoB AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.candidate SET EDC=NULL, Testdate=Testdate WHERE CAST(EDC AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.candidate SET Date_active=NULL, Testdate=Testdate WHERE CAST(Date_active AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.candidate SET Date_registered=NULL, Testdate=Testdate WHERE CAST(Date_registered AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.candidate SET ProbandDoB=NULL, Testdate=Testdate WHERE CAST(ProbandDoB AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.candidate SET date_exported_cbsr=NULL, Testdate=Testdate WHERE CAST(date_exported_cbsr AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.candidate_clinical_trial SET DateRegistered=NULL, DateUpdated=DateUpdated WHERE CAST(DateRegistered AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.certification SET date_cert=NULL WHERE CAST(date_cert AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.certification_history SET old_date=NULL, changeDate=changeDate WHERE CAST(old_date AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.certification_history SET new_date=NULL, changeDate=changeDate WHERE CAST(new_date AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.consent_info_history SET study_consent_date=NULL, data_entry_date=data_entry_date WHERE CAST(study_consent_date AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.consent_info_history SET study_consent_withdrawal=NULL, data_entry_date=data_entry_date WHERE CAST(study_consent_withdrawal AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.consent_info_history SET study_consent_cnd_date=NULL, data_entry_date=data_entry_date WHERE CAST(study_consent_cnd_date AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.consent_info_history SET study_consent_cnd_withdrawal=NULL, data_entry_date=data_entry_date WHERE CAST(study_consent_cnd_withdrawal AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.consent_info_history SET study_consent_T6_date=NULL, data_entry_date=data_entry_date WHERE CAST(study_consent_T6_date AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.consent_info_history SET study_consent_T6_withdrawal=NULL, data_entry_date=data_entry_date WHERE CAST(study_consent_T6_withdrawal AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.consent_info_history SET study_consent_T10_date=NULL, data_entry_date=data_entry_date WHERE CAST(study_consent_T10_date AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.consent_info_history SET study_consent_T10_withdrawal=NULL, data_entry_date=data_entry_date WHERE CAST(study_consent_T10_withdrawal AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.data_release SET upload_date=NULL WHERE CAST(upload_date AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.document_repository SET Date_taken=NULL, Date_uploaded=Date_uploaded WHERE CAST(Date_taken AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.feedback_bvl_thread SET Date_taken=NULL, Testdate=Testdate WHERE CAST(Date_taken AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.files SET PipelineDate=NULL WHERE CAST(PipelineDate AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.genomic_files SET Date_taken=NULL, Date_inserted=Date_inserted WHERE CAST(Date_taken AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.help SET created=NULL WHERE CAST(created AS CHAR(20))='0000-00-00 00:00:00';
UPDATE rida_ccna.help SET updated=NULL WHERE CAST(updated AS CHAR(20))='0000-00-00 00:00:00';
UPDATE rida_ccna.issues SET dateCreated=NULL, lastUpdate=lastUpdate WHERE CAST(dateCreated AS CHAR(20))='0000-00-00 00:00:00';
UPDATE rida_ccna.media SET date_taken=NULL, date_uploaded=date_uploaded WHERE CAST(date_taken AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.monitoring SET date_monitored=NULL WHERE CAST(date_monitored AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.monitoring_history SET date_monitored=NULL, data_entry_date=data_entry_date WHERE CAST(date_monitored AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.mri_acquisition_dates SET AcquisitionDate=NULL WHERE CAST(AcquisitionDate AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.mri_incidental_findings_long SET Date_taken=NULL, Testdate=Testdate WHERE CAST(Date_taken AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.mri_incidental_findings_long SET date_of_completion=NULL, Testdate=Testdate WHERE CAST(date_of_completion AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.mri_parameter_form SET Date_taken=NULL, Testdate=Testdate WHERE CAST(Date_taken AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.mri_parameter_form SET scan_date=NULL, Testdate=Testdate WHERE CAST(scan_date AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.mri_protocol_violated_scans SET time_run=NULL WHERE CAST(time_run AS CHAR(20))='0000-00-00 00:00:00';
UPDATE rida_ccna.mri_synoptic_report SET Date_taken=NULL, Testdate=Testdate WHERE CAST(Date_taken AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.mri_upload SET UploadDate=NULL WHERE CAST(UploadDate AS CHAR(20))='0000-00-00 00:00:00';
UPDATE rida_ccna.mri_visual_measurements SET Date_taken=NULL, Testdate=Testdate WHERE CAST(Date_taken AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.notification_spool SET TimeSpooled=NULL WHERE CAST(TimeSpooled AS CHAR(20))='0000-00-00 00:00:00';
UPDATE rida_ccna.participant_status SET study_consent_date=NULL WHERE CAST(study_consent_date AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.participant_status SET study_consent_withdrawal=NULL WHERE CAST(study_consent_withdrawal AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.participant_status SET study_consent_cnd_date=NULL WHERE CAST(study_consent_cnd_date AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.participant_status SET study_consent_cnd_withdrawal=NULL WHERE CAST(study_consent_cnd_withdrawal AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.participant_status SET study_consent_T6_date=NULL WHERE CAST(study_consent_T6_date AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.participant_status SET study_consent_T6_withdrawal=NULL WHERE CAST(study_consent_T6_withdrawal AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.participant_status SET study_consent_T10_date=NULL WHERE CAST(study_consent_T10_date AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.participant_status SET study_consent_T10_withdrawal=NULL WHERE CAST(study_consent_T10_withdrawal AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.server_processes SET start_time=NULL WHERE CAST(start_time AS CHAR(20))='0000-00-00 00:00:00';
UPDATE rida_ccna.server_processes SET end_time=NULL WHERE CAST(end_time AS CHAR(20))='0000-00-00 00:00:00';
UPDATE rida_ccna.session SET Date_stage_change=NULL, Testdate=Testdate WHERE CAST(Date_stage_change AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.session SET Date_screening=NULL, Testdate=Testdate WHERE CAST(Date_screening AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.session SET Date_visit=NULL, Testdate=Testdate WHERE CAST(Date_visit AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.session SET Date_approval=NULL, Testdate=Testdate WHERE CAST(Date_approval AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.session SET Date_active=NULL, Testdate=Testdate WHERE CAST(Date_active AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.session SET Date_registered=NULL, Testdate=Testdate WHERE CAST(Date_registered AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.session SET MRIQCFirstChangeTime=NULL, Testdate=Testdate WHERE CAST(MRIQCFirstChangeTime AS CHAR(20))='0000-00-00 00:00:00';
UPDATE rida_ccna.session SET MRIQCLastChangeTime=NULL, Testdate=Testdate WHERE CAST(MRIQCLastChangeTime AS CHAR(20))='0000-00-00 00:00:00';
UPDATE rida_ccna.tarchive SET PatientDoB=NULL WHERE CAST(PatientDoB AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.tarchive SET LastUpdate=NULL WHERE CAST(LastUpdate AS CHAR(20))='0000-00-00 00:00:00';
UPDATE rida_ccna.tarchive SET DateAcquired=NULL WHERE CAST(DateAcquired AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.tarchive SET DateFirstArchived=NULL WHERE CAST(DateFirstArchived AS CHAR(20))='0000-00-00 00:00:00';
UPDATE rida_ccna.tarchive SET DateLastArchived=NULL WHERE CAST(DateLastArchived AS CHAR(20))='0000-00-00 00:00:00';
UPDATE rida_ccna.tarchive SET DateSent=NULL WHERE CAST(DateSent AS CHAR(20))='0000-00-00 00:00:00';
UPDATE rida_ccna.tarchive_find_new_uploads SET LastRan=NULL WHERE CAST(LastRan AS CHAR(20))='0000-00-00 00:00:00';
UPDATE rida_ccna.videos SET Date_taken=NULL, Date_uploaded=Date_uploaded WHERE CAST(Date_taken AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.violations_resolved SET ChangeDate=NULL WHERE CAST(ChangeDate AS CHAR(20))='0000-00-00 00:00:00';
UPDATE rida_ccna.Clinical_Biosamples_CBSR SET Testdate='1000-01-01', Testdate=Testdate WHERE CAST(Testdate AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Clinical_CBC SET Testdate='1000-01-01', Testdate=Testdate WHERE CAST(Testdate AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Clinical_Current_Medication SET Testdate='1000-01-01', Testdate=Testdate WHERE CAST(Testdate AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Clinical_Diagnosis_Confirmation SET Testdate='1000-01-01', Testdate=Testdate WHERE CAST(Testdate AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Clinical_Family_History SET Testdate='1000-01-01', Testdate=Testdate WHERE CAST(Testdate AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Clinical_Gait_Pre_Assessment SET Testdate='1000-01-01', Testdate=Testdate WHERE CAST(Testdate AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Clinical_Hachinski_Ischaemic_Score SET Testdate='1000-01-01', Testdate=Testdate WHERE CAST(Testdate AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Clinical_Hobbies_And_Leisure_Activities SET Testdate='1000-01-01', Testdate=Testdate WHERE CAST(Testdate AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Clinical_Initial_Symptoms SET Testdate='1000-01-01', Testdate=Testdate WHERE CAST(Testdate AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Clinical_LBSA_I_PDQ SET Testdate='1000-01-01', Testdate=Testdate WHERE CAST(Testdate AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Clinical_LBSA_I_UPDRS_IB_II SET Testdate='1000-01-01', Testdate=Testdate WHERE CAST(Testdate AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Clinical_Lumbar_Puncture_Eligibility_Questionnaire SET Testdate='1000-01-01', Testdate=Testdate WHERE CAST(Testdate AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Clinical_Lumbar_Puncture_Procedure_Report SET Testdate='1000-01-01', Testdate=Testdate WHERE CAST(Testdate AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Clinical_Medical_History SET Testdate='1000-01-01', Testdate=Testdate WHERE CAST(Testdate AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Clinical_Mental_Health_History SET Testdate='1000-01-01', Testdate=Testdate WHERE CAST(Testdate AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Clinical_Neurological_Exam SET Testdate='1000-01-01', Testdate=Testdate WHERE CAST(Testdate AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Clinical_Oral_Health SET Testdate='1000-01-01', Testdate=Testdate WHERE CAST(Testdate AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Clinical_Past_Medications SET Testdate='1000-01-01', Testdate=Testdate WHERE CAST(Testdate AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Clinical_Physical_Exam SET Testdate='1000-01-01', Testdate=Testdate WHERE CAST(Testdate AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Clinical_Signs_Symptoms SET Testdate='1000-01-01', Testdate=Testdate WHERE CAST(Testdate AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Clinical_Smoking SET Testdate='1000-01-01', Testdate=Testdate WHERE CAST(Testdate AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Clinical_Surgical_History SET Testdate='1000-01-01', Testdate=Testdate WHERE CAST(Testdate AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Clinical_UPDRS_III_IV SET Testdate='1000-01-01', Testdate=Testdate WHERE CAST(Testdate AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.General_Health_Adverse_Childhood_Experiences SET Testdate='1000-01-01', Testdate=Testdate WHERE CAST(Testdate AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.General_Health_Alcohol_Consumption SET Testdate='1000-01-01', Testdate=Testdate WHERE CAST(Testdate AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.General_Health_Basic_Activities_Daily_Living SET Testdate='1000-01-01', Testdate=Testdate WHERE CAST(Testdate AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.General_Health_Biosample_Collection SET Testdate='1000-01-01', Testdate=Testdate WHERE CAST(Testdate AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.General_Health_CDTT SET Testdate='1000-01-01', Testdate=Testdate WHERE CAST(Testdate AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.General_Health_Caregiving_Assessment SET Testdate='1000-01-01', Testdate=Testdate WHERE CAST(Testdate AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.General_Health_Constant_Fatigue SET Testdate='1000-01-01', Testdate=Testdate WHERE CAST(Testdate AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.General_Health_End_Of_Life_Care SET Testdate='1000-01-01', Testdate=Testdate WHERE CAST(Testdate AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.General_Health_Falls_Balance SET Testdate='1000-01-01', Testdate=Testdate WHERE CAST(Testdate AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.General_Health_Gait_Assessment SET Testdate='1000-01-01', Testdate=Testdate WHERE CAST(Testdate AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.General_Health_Grip_Strength SET Testdate='1000-01-01', Testdate=Testdate WHERE CAST(Testdate AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.General_Health_Health_Status SET Testdate='1000-01-01', Testdate=Testdate WHERE CAST(Testdate AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.General_Health_Hearing SET Testdate='1000-01-01', Testdate=Testdate WHERE CAST(Testdate AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.General_Health_Instrumental_Activities_Daily_Living SET Testdate='1000-01-01', Testdate=Testdate WHERE CAST(Testdate AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.General_Health_Mayo_Fluctuations_Scale SET Testdate='1000-01-01', Testdate=Testdate WHERE CAST(Testdate AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.General_Health_Nutrition SET Testdate='1000-01-01', Testdate=Testdate WHERE CAST(Testdate AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.General_Health_Olfaction SET Testdate='1000-01-01', Testdate=Testdate WHERE CAST(Testdate AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.General_Health_Physical_Activity SET Testdate='1000-01-01', Testdate=Testdate WHERE CAST(Testdate AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.General_Health_Quality_Life SET Testdate='1000-01-01', Testdate=Testdate WHERE CAST(Testdate AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.General_Health_Sleep SET Testdate='1000-01-01', Testdate=Testdate WHERE CAST(Testdate AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.General_Health_Social_Activities SET Testdate='1000-01-01', Testdate=Testdate WHERE CAST(Testdate AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.General_Health_Social_Network SET Testdate='1000-01-01', Testdate=Testdate WHERE CAST(Testdate AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.General_Health_Social_Support SET Testdate='1000-01-01', Testdate=Testdate WHERE CAST(Testdate AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.General_Health_Vision SET Testdate='1000-01-01', Testdate=Testdate WHERE CAST(Testdate AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.General_Health_Vital_Signs SET Testdate='1000-01-01', Testdate=Testdate WHERE CAST(Testdate AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.MRICandidateErrors SET TimeRun='1000-01-01' WHERE CAST(TimeRun AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Neuropsych_BORB SET Testdate='1000-01-01', Testdate=Testdate WHERE CAST(Testdate AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Neuropsych_Boston_Diagnostic_Aphasia_Exam SET Testdate='1000-01-01', Testdate=Testdate WHERE CAST(Testdate AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Neuropsych_Brief_Visuospatial_Memory SET Testdate='1000-01-01', Testdate=Testdate WHERE CAST(Testdate AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Neuropsych_CCNA_Reaction_Time_Task SET Testdate='1000-01-01', Testdate=Testdate WHERE CAST(Testdate AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Neuropsych_CCNA_Sentence_Inhibition_Task SET Testdate='1000-01-01', Testdate=Testdate WHERE CAST(Testdate AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Neuropsych_DKEFS_Category_Fluency SET Testdate='1000-01-01', Testdate=Testdate WHERE CAST(Testdate AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Neuropsych_DKEFS_Color_Word_Interference_Test SET Testdate='1000-01-01', Testdate=Testdate WHERE CAST(Testdate AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Neuropsych_DKEFS_Letter_Fluency SET Testdate='1000-01-01', Testdate=Testdate WHERE CAST(Testdate AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Neuropsych_Digit_Symbol_Test SET Testdate='1000-01-01', Testdate=Testdate WHERE CAST(Testdate AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Neuropsych_Envelope SET Testdate='1000-01-01', Testdate=Testdate WHERE CAST(Testdate AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Neuropsych_Face_Name_Association SET Testdate='1000-01-01', Testdate=Testdate WHERE CAST(Testdate AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Neuropsych_Judgement_Of_Line_Orientation SET Testdate='1000-01-01', Testdate=Testdate WHERE CAST(Testdate AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Neuropsych_NACC_Northwestern_Anagram_Test SET Testdate='1000-01-01', Testdate=Testdate WHERE CAST(Testdate AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Neuropsych_NACC_Noun_Verb_Naming_Subtests SET Testdate='1000-01-01', Testdate=Testdate WHERE CAST(Testdate AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Neuropsych_NACC_Semantic_Associates_Test SET Testdate='1000-01-01', Testdate=Testdate WHERE CAST(Testdate AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Neuropsych_NACC_Sentence_Reading_Test SET Testdate='1000-01-01', Testdate=Testdate WHERE CAST(Testdate AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Neuropsych_NACC_Sentence_Repetition_Test SET Testdate='1000-01-01', Testdate=Testdate WHERE CAST(Testdate AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Neuropsych_NACC_Social_Behavior_Observer_Checklist SET Testdate='1000-01-01', Testdate=Testdate WHERE CAST(Testdate AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Neuropsych_NACC_Social_Norms_Questionnaire SET Testdate='1000-01-01', Testdate=Testdate WHERE CAST(Testdate AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Neuropsych_NACC_Word_Reading SET Testdate='1000-01-01', Testdate=Testdate WHERE CAST(Testdate AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Neuropsych_RAVLT SET Testdate='1000-01-01', Testdate=Testdate WHERE CAST(Testdate AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Neuropsych_Reitan_Trail SET Testdate='1000-01-01', Testdate=Testdate WHERE CAST(Testdate AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Neuropsych_Semantic_Word_Picture SET Testdate='1000-01-01', Testdate=Testdate WHERE CAST(Testdate AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Neuropsych_WAIS_III_Digit_Span_Test SET Testdate='1000-01-01', Testdate=Testdate WHERE CAST(Testdate AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Neuropsych_WAIS_III_Vocabulary_Test SET Testdate='1000-01-01', Testdate=Testdate WHERE CAST(Testdate AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.PI_Apathy_Inventory SET Testdate='1000-01-01', Testdate=Testdate WHERE CAST(Testdate AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.PI_Basic_Activities_For_Daily_Living SET Testdate='1000-01-01', Testdate=Testdate WHERE CAST(Testdate AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.PI_Behavioral_Inhibition_Scale SET Testdate='1000-01-01', Testdate=Testdate WHERE CAST(Testdate AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.PI_Caregiving_Assessment SET Testdate='1000-01-01', Testdate=Testdate WHERE CAST(Testdate AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.PI_General_Information SET Testdate='1000-01-01', Testdate=Testdate WHERE CAST(Testdate AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.PI_Instrumental_Activities_For_Daily_Living SET Testdate='1000-01-01', Testdate=Testdate WHERE CAST(Testdate AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.PI_Interpersonal_Reactivity_Index SET Testdate='1000-01-01', Testdate=Testdate WHERE CAST(Testdate AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.PI_Neuropsychiatric_Inventory_Questionnaire SET Testdate='1000-01-01', Testdate=Testdate WHERE CAST(Testdate AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.PI_Quality_Of_Life SET Testdate='1000-01-01', Testdate=Testdate WHERE CAST(Testdate AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.PI_Revised_Self_Monitoring_Scale SET Testdate='1000-01-01', Testdate=Testdate WHERE CAST(Testdate AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.PI_Schwab SET Testdate='1000-01-01', Testdate=Testdate WHERE CAST(Testdate AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Primary_Informant_Questionnaire SET Testdate='1000-01-01', Testdate=Testdate WHERE CAST(Testdate AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Screening_AD SET Testdate='1000-01-01', Testdate=Testdate WHERE CAST(Testdate AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Screening_Audiometry SET Testdate='1000-01-01', Testdate=Testdate WHERE CAST(Testdate AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Screening_Benson_Complex_Figure SET Testdate='1000-01-01', Testdate=Testdate WHERE CAST(Testdate AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Screening_Benson_Complex_Recall SET Testdate='1000-01-01', Testdate=Testdate WHERE CAST(Testdate AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Screening_Biosample_Collection SET Testdate='1000-01-01', Testdate=Testdate WHERE CAST(Testdate AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Screening_Birth_Sex_Handedness SET Testdate='1000-01-01', Testdate=Testdate WHERE CAST(Testdate AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Screening_CERAD_Memory SET Testdate='1000-01-01', Testdate=Testdate WHERE CAST(Testdate AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Screening_CERAD_Recog SET Testdate='1000-01-01', Testdate=Testdate WHERE CAST(Testdate AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Screening_Candidate_Recruitment SET Testdate='1000-01-01', Testdate=Testdate WHERE CAST(Testdate AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Screening_Clinical_Dementia_Rating SET Testdate='1000-01-01', Testdate=Testdate WHERE CAST(Testdate AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Screening_Clinical_PPA SET Testdate='1000-01-01', Testdate=Testdate WHERE CAST(Testdate AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Screening_Current_Living_Circumstances SET Testdate='1000-01-01', Testdate=Testdate WHERE CAST(Testdate AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Screening_Driving_History SET Testdate='1000-01-01', Testdate=Testdate WHERE CAST(Testdate AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Screening_Education SET Testdate='1000-01-01', Testdate=Testdate WHERE CAST(Testdate AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Screening_Employment_History SET Testdate='1000-01-01', Testdate=Testdate WHERE CAST(Testdate AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Screening_FTD SET Testdate='1000-01-01', Testdate=Testdate WHERE CAST(Testdate AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Screening_Freezing_Gait_Questionnaire SET Testdate='1000-01-01', Testdate=Testdate WHERE CAST(Testdate AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Screening_Functional_Capacity_Question SET Testdate='1000-01-01', Testdate=Testdate WHERE CAST(Testdate AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Screening_General_Exclusion_Criteria SET Testdate='1000-01-01', Testdate=Testdate WHERE CAST(Testdate AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Screening_General_Inclusion_Criteria SET Testdate='1000-01-01', Testdate=Testdate WHERE CAST(Testdate AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Screening_Household_Income SET Testdate='1000-01-01', Testdate=Testdate WHERE CAST(Testdate AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Screening_LBD SET Testdate='1000-01-01', Testdate=Testdate WHERE CAST(Testdate AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Screening_LBSA_II_Schwab SET Testdate='1000-01-01', Testdate=Testdate WHERE CAST(Testdate AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Screening_Languages SET Testdate='1000-01-01', Testdate=Testdate WHERE CAST(Testdate AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Screening_Lawton_Brody SET Testdate='1000-01-01', Testdate=Testdate WHERE CAST(Testdate AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Screening_Logical_Memory SET Testdate='1000-01-01', Testdate=Testdate WHERE CAST(Testdate AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Screening_Logical_Memory_Delayed SET Testdate='1000-01-01', Testdate=Testdate WHERE CAST(Testdate AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Screening_Logical_Memory_Immediate SET Testdate='1000-01-01', Testdate=Testdate WHERE CAST(Testdate AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Screening_MCI SET Testdate='1000-01-01', Testdate=Testdate WHERE CAST(Testdate AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Screening_MOCA SET Testdate='1000-01-01', Testdate=Testdate WHERE CAST(Testdate AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Screening_Marital_Status SET Testdate='1000-01-01', Testdate=Testdate WHERE CAST(Testdate AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Screening_Mixed SET Testdate='1000-01-01', Testdate=Testdate WHERE CAST(Testdate AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Screening_PCI_DAT SET Testdate='1000-01-01', Testdate=Testdate WHERE CAST(Testdate AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Screening_PD SET Testdate='1000-01-01', Testdate=Testdate WHERE CAST(Testdate AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Screening_PDD SET Testdate='1000-01-01', Testdate=Testdate WHERE CAST(Testdate AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Screening_PDMCI SET Testdate='1000-01-01', Testdate=Testdate WHERE CAST(Testdate AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Screening_Physical_Activity SET Testdate='1000-01-01', Testdate=Testdate WHERE CAST(Testdate AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Screening_Psychiatric_Generalized_Anxiety_Disorder SET Testdate='1000-01-01', Testdate=Testdate WHERE CAST(Testdate AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Screening_Psychiatric_Geriatric_Depression_Scale SET Testdate='1000-01-01', Testdate=Testdate WHERE CAST(Testdate AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Screening_Reproductive_History SET Testdate='1000-01-01', Testdate=Testdate WHERE CAST(Testdate AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Screening_SCI SET Testdate='1000-01-01', Testdate=Testdate WHERE CAST(Testdate AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Screening_Summary_Diagnosis_AD_Mixed SET Testdate='1000-01-01', Testdate=Testdate WHERE CAST(Testdate AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Screening_Summary_Diagnosis_CI SET Testdate='1000-01-01', Testdate=Testdate WHERE CAST(Testdate AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Screening_Summary_Diagnosis_FTD SET Testdate='1000-01-01', Testdate=Testdate WHERE CAST(Testdate AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Screening_Summary_Diagnosis_PD SET Testdate='1000-01-01', Testdate=Testdate WHERE CAST(Testdate AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Screening_UPDRS SET Testdate='1000-01-01', Testdate=Testdate WHERE CAST(Testdate AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Screening_VMCI SET Testdate='1000-01-01', Testdate=Testdate WHERE CAST(Testdate AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Teams_5x_Sit_To_Stand SET Testdate='1000-01-01', Testdate=Testdate WHERE CAST(Testdate AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Teams_6MWT SET Testdate='1000-01-01', Testdate=Testdate WHERE CAST(Testdate AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Teams_ADCS_ADL_Inventory SET Testdate='1000-01-01', Testdate=Testdate WHERE CAST(Testdate AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Teams_ADCS_ADL_PI SET Testdate='1000-01-01', Testdate=Testdate WHERE CAST(Testdate AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Teams_ADCS_ADL_Self_Report SET Testdate='1000-01-01', Testdate=Testdate WHERE CAST(Testdate AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Teams_ASBCS SET Testdate='1000-01-01', Testdate=Testdate WHERE CAST(Testdate AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Teams_Apathy_Inventory SET Testdate='1000-01-01', Testdate=Testdate WHERE CAST(Testdate AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Teams_BAI SET Testdate='1000-01-01', Testdate=Testdate WHERE CAST(Testdate AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Teams_Balance_Assessment SET Testdate='1000-01-01', Testdate=Testdate WHERE CAST(Testdate AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Teams_Beck_Depression_Inventory_II SET Testdate='1000-01-01', Testdate=Testdate WHERE CAST(Testdate AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Teams_CPA_Measures SET Testdate='1000-01-01', Testdate=Testdate WHERE CAST(Testdate AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Teams_CPQ SET Testdate='1000-01-01', Testdate=Testdate WHERE CAST(Testdate AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Teams_Cognitive_Activities_Questionnaire SET Testdate='1000-01-01', Testdate=Testdate WHERE CAST(Testdate AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Teams_DAFS SET Testdate='1000-01-01', Testdate=Testdate WHERE CAST(Testdate AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Teams_Data_Collection_Form SET Testdate='1000-01-01', Testdate=Testdate WHERE CAST(Testdate AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Teams_Demographic_Information SET Testdate='1000-01-01', Testdate=Testdate WHERE CAST(Testdate AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Teams_Feedback_Questionnaire SET Testdate='1000-01-01', Testdate=Testdate WHERE CAST(Testdate AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Teams_Game_Experience SET Testdate='1000-01-01', Testdate=Testdate WHERE CAST(Testdate AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Teams_Geriatric_Anxiety_Inventory SET Testdate='1000-01-01', Testdate=Testdate WHERE CAST(Testdate AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Teams_Grip_Strength SET Testdate='1000-01-01', Testdate=Testdate WHERE CAST(Testdate AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Teams_Jessen_Questions SET Testdate='1000-01-01', Testdate=Testdate WHERE CAST(Testdate AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Teams_LEAPQ SET Testdate='1000-01-01', Testdate=Testdate WHERE CAST(Testdate AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Teams_MMQ_Ability SET Testdate='1000-01-01', Testdate=Testdate WHERE CAST(Testdate AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Teams_MMQ_Contentment SET Testdate='1000-01-01', Testdate=Testdate WHERE CAST(Testdate AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Teams_MMQ_Strategy SET Testdate='1000-01-01', Testdate=Testdate WHERE CAST(Testdate AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Teams_MMSE SET Testdate='1000-01-01', Testdate=Testdate WHERE CAST(Testdate AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Teams_Medical_Care SET Testdate='1000-01-01', Testdate=Testdate WHERE CAST(Testdate AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Teams_Memory_Toolbox SET Testdate='1000-01-01', Testdate=Testdate WHERE CAST(Testdate AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Teams_Musical_Experience SET Testdate='1000-01-01', Testdate=Testdate WHERE CAST(Testdate AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Teams_PARQ SET Testdate='1000-01-01', Testdate=Testdate WHERE CAST(Testdate AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Teams_PASE SET Testdate='1000-01-01', Testdate=Testdate WHERE CAST(Testdate AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Teams_Post_Expectations SET Testdate='1000-01-01', Testdate=Testdate WHERE CAST(Testdate AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Teams_Pre_Expectations SET Testdate='1000-01-01', Testdate=Testdate WHERE CAST(Testdate AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Teams_SF36 SET Testdate='1000-01-01', Testdate=Testdate WHERE CAST(Testdate AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Teams_SPPB SET Testdate='1000-01-01', Testdate=Testdate WHERE CAST(Testdate AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Teams_Short_QAM SET Testdate='1000-01-01', Testdate=Testdate WHERE CAST(Testdate AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Teams_T10_Consent_Form SET Testdate='1000-01-01', Testdate=Testdate WHERE CAST(Testdate AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Teams_T10_Eligibility_Criteria SET Testdate='1000-01-01', Testdate=Testdate WHERE CAST(Testdate AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Teams_T12_Inclusion_Exclusion_Criteria SET Testdate='1000-01-01', Testdate=Testdate WHERE CAST(Testdate AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Teams_T12_Written_Consent SET Testdate='1000-01-01', Testdate=Testdate WHERE CAST(Testdate AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Teams_T6_Consent_Form SET Testdate='1000-01-01', Testdate=Testdate WHERE CAST(Testdate AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Teams_VLS_ALQ SET Testdate='1000-01-01', Testdate=Testdate WHERE CAST(Testdate AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.Teams_fMRI_Activation_Task SET Testdate='1000-01-01', Testdate=Testdate WHERE CAST(Testdate AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.candidate SET Testdate='1000-01-01', Testdate=Testdate WHERE CAST(Testdate AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.candidate_clinical_trial SET DateUpdated='1000-01-01', DateUpdated=DateUpdated WHERE CAST(DateUpdated AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.candidate_diagnosis_reappraisal SET DateRegistered='1000-01-01' WHERE CAST(DateRegistered AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.candidate_diagnosis_reappraisal SET DateInserted='1000-01-01' WHERE CAST(DateInserted AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.candidate_project_extid_rel SET DateUpdated='1000-01-01', DateUpdated=DateUpdated WHERE CAST(DateUpdated AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.certification_history SET changeDate='1000-01-01', changeDate=changeDate WHERE CAST(changeDate AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.certification_training_quiz_history SET Date='1000-01-01', Date=Date WHERE CAST(Date AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.conflicts_resolved SET ResolutionTimestamp='1000-01-01', ResolutionTimestamp=ResolutionTimestamp WHERE CAST(ResolutionTimestamp AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.consent_info_history SET data_entry_date='1000-01-01', data_entry_date=data_entry_date WHERE CAST(data_entry_date AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.data_integrity_flag SET dataflag_date='1000-01-01' WHERE CAST(dataflag_date AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.document_repository SET Date_uploaded='1000-01-01', Date_uploaded=Date_uploaded WHERE CAST(Date_uploaded AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.empty_queries SET timestamp='1000-01-01' WHERE CAST(timestamp AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.feedback_bvl_entry SET Testdate='1000-01-01', Testdate=Testdate WHERE CAST(Testdate AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.feedback_bvl_thread SET Testdate='1000-01-01', Testdate=Testdate WHERE CAST(Testdate AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.feedback_mri_comments SET ChangeTime='1000-01-01', ChangeTime=ChangeTime WHERE CAST(ChangeTime AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.final_radiological_review_history SET changeDate='1000-01-01', changeDate=changeDate WHERE CAST(changeDate AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.flag SET Testdate='1000-01-01', Testdate=Testdate WHERE CAST(Testdate AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.genomic_files SET Date_inserted='1000-01-01', Date_inserted=Date_inserted WHERE CAST(Date_inserted AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.history SET changeDate='1000-01-01', changeDate=changeDate WHERE CAST(changeDate AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.issues SET lastUpdate='1000-01-01', lastUpdate=lastUpdate WHERE CAST(lastUpdate AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.issues_comments SET dateAdded='1000-01-01' WHERE CAST(dateAdded AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.issues_comments_history SET dateEdited='1000-01-01' WHERE CAST(dateEdited AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.issues_history SET dateAdded='1000-01-01' WHERE CAST(dateAdded AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.media SET date_uploaded='1000-01-01', date_uploaded=date_uploaded WHERE CAST(date_uploaded AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.monitoring_history SET data_entry_date='1000-01-01', data_entry_date=data_entry_date WHERE CAST(data_entry_date AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.mri_incidental_findings_long SET Testdate='1000-01-01', Testdate=Testdate WHERE CAST(Testdate AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.mri_parameter_form SET Testdate='1000-01-01', Testdate=Testdate WHERE CAST(Testdate AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.mri_synoptic_report SET Testdate='1000-01-01', Testdate=Testdate WHERE CAST(Testdate AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.mri_violations_log SET TimeRun='1000-01-01' WHERE CAST(TimeRun AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.mri_visual_measurements SET Testdate='1000-01-01', Testdate=Testdate WHERE CAST(Testdate AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.participant_status SET data_entry_date='1000-01-01' WHERE CAST(data_entry_date AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.participant_status_history SET data_entry_date='1000-01-01', data_entry_date=data_entry_date WHERE CAST(data_entry_date AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.session SET Testdate='1000-01-01', Testdate=Testdate WHERE CAST(Testdate AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.user_account_history SET ChangeDate='1000-01-01', ChangeDate=ChangeDate WHERE CAST(ChangeDate AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.user_login_history SET Login_timestamp='1000-01-01' WHERE CAST(Login_timestamp AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.users SET Password_expiry='1000-01-01' WHERE CAST(Password_expiry AS CHAR(20))='0000-00-00';
UPDATE rida_ccna.videos SET Date_uploaded='1000-01-01', Date_uploaded=Date_uploaded WHERE CAST(Date_uploaded AS CHAR(20))='0000-00-00';
SET sql_mode = @OLD_sql_mode; 
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS; 
ALTER TABLE users DROP COLUMN Password_md5;-- This script put all unique records from LorisMenuPermissions in a 
-- temporary table before adding foreign keys and unique constraint 
-- to the table.
-- It also remove duplicates from LorisMenu table and add unique
-- constraint on Parent and Label column

CREATE TEMPORARY TABLE tmp_lmp AS 
  SELECT DISTINCT MenuId, PermID FROM LorisMenuPermissions;

DELETE FROM LorisMenuPermissions;

ALTER TABLE `LorisMenuPermissions` 
CHANGE COLUMN `MenuID` `MenuID` INT(10) UNSIGNED NOT NULL,
CHANGE COLUMN `PermID` `PermID` INT(10) UNSIGNED NOT NULL,
ADD PRIMARY KEY (`MenuID`, `PermID`);

ALTER TABLE `LorisMenuPermissions` 
ADD CONSTRAINT `fk_LorisMenuPermissions_1`
  FOREIGN KEY (`MenuID`)
  REFERENCES `LorisMenu` (`ID`)
  ON DELETE CASCADE
  ON UPDATE CASCADE,
ADD CONSTRAINT `fk_LorisMenuPermissions_2`
  FOREIGN KEY (`PermID`)
  REFERENCES `permissions` (`permID`)
  ON DELETE CASCADE
  ON UPDATE CASCADE;

INSERT IGNORE INTO LorisMenuPermissions SELECT MenuID, PermID FROM tmp_lmp;
DROP TABLE tmp_lmp;

-- Remove duplicates in the LorisMenu
DELETE FROM LorisMenu USING LorisMenu, LorisMenu lm1 
  WHERE LorisMenu.ID < lm1.ID AND LorisMenu.Parent = lm1.Parent AND LorisMenu.Label = lm1.Label;

ALTER TABLE `LorisMenu` 
ADD INDEX `fk_LorisMenu_1_idx` (`Parent` ASC),
ADD UNIQUE INDEX `index3` (`Parent` ASC, `Label` ASC);
ALTER TABLE `LorisMenu` 
ADD CONSTRAINT `fk_LorisMenu_1`
  FOREIGN KEY (`Parent`)
  REFERENCES `LorisMenu` (`ID`)
  ON DELETE RESTRICT
  ON UPDATE CASCADE;

DELETE FROM media USING media, media m1 
  WHERE media.date_uploaded < m1.date_uploaded AND media.file_name = m1.file_name;

ALTER TABLE `media`
ADD UNIQUE INDEX `file_name` (`file_name`);
ALTER TABLE flag ADD `Data` TEXT;
SET @parentID = (SELECT ID FROM ConfigSettings WHERE Name = 'APIKeys');

-- Cleanup 
DELETE FROM ConfigSettings WHERE Name='reCAPTCHAPrivate';
DELETE FROM ConfigSettings WHERE Name='reCAPTCHAPublic';
DELETE FROM Config WHERE ConfigID=(SELECT ID FROM ConfigSettings WHERE Name='reCAPTCHAPrivate');
DELETE FROM Config WHERE ConfigID=(SELECT ID FROM ConfigSettings WHERE Name='reCAPTCHAPublic');

-- Insert
INSERT INTO ConfigSettings (`Name`, `Description`, `Visible`, `AllowMultiple`, `DataType`, `Parent`, `Label`, `OrderNumber`) VALUES (
  'reCAPTCHAPrivate', 'Private Key for Google reCAPTCHA', 1, 0, 'text', @parentID, 'reCAPTCHA Private Key', 2
);
INSERT INTO ConfigSettings (`Name`, `Description`, `Visible`, `AllowMultiple`, `DataType`, `Parent`, `Label`, `OrderNumber`) VALUES (
  'reCAPTCHAPublic', 'Public Key for Google reCAPTCHA', 1, 0, 'text', @parentID, 'reCAPTCHA Public Key', 3
);
ALTER TABLE issues_categories CONVERT TO CHARACTER SET utf8;
ALTER TABLE issues_categories MODIFY COLUMN categoryName varchar(255);
-- This can take quite a while to execute depending on the row count of the CNV table 
ALTER TABLE CNV ADD FOREIGN KEY (`CandID`) REFERENCES `candidate` (`CandID`);
-- Insert necessary values into configsettings and config
INSERT INTO ConfigSettings (Name,Description,Visible,AllowMultiple,DataType,Parent,Label,OrderNumber) Values ("dobFormat","Format of the Date of Birth", 1, 0, "text", 1, "DOB Format:", 8);
INSERT INTO Config (ConfigID,Value) VALUES ((SELECT ID FROM ConfigSettings WHERE Name='dobFormat'),"YMd");
-- This is for LORIS instance that source the schema of LORIS v15.04.
-- The ExonicFunction column got added in 15.10 but there was a missing patch.
SET @s = (SELECT IF(
    (SELECT COUNT(*)
        FROM INFORMATION_SCHEMA.COLUMNS
        WHERE table_name = 'SNP'
        AND table_schema = DATABASE()
        AND column_name = 'ExonicFunction'
    ) > 0,
    "SELECT 'conform' as 'SNP table structure check'",
    "ALTER TABLE SNP ADD `ExonicFunction` enum('nonsynonymous','unknown') DEFAULT NULL AFTER `Damaging`"
));

PREPARE stmt FROM @s;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
WARNINGS;
SET SQL_NOTES=1;

SELECT 'Removing unused indexes to change the storage engine for help table' as 'Step #1';
ALTER TABLE `help` 
DROP INDEX `content`,
DROP INDEX `topic`;
ALTER TABLE `help` ENGINE = InnoDB;

SELECT 'Droping unused table help_related_links' as 'Step #2';
DROP TABLE help_related_links;


SELECT 'Adding foreign key between Config and ConfigSettings' as 'Step #3';
SELECT 'Config records not associated with a valid ConfigSettings.id will be deleted' as 'ATTENTION';
DELETE FROM `Config` WHERE ConfigID IS NULL;
ALTER TABLE `Config` CHANGE `ConfigID` `ConfigID` int(11) NOT NULL;
ALTER TABLE `Config` 
  ADD INDEX `fk_Config_1_idx` (`ConfigID` ASC);
ALTER TABLE `Config` 
  ADD CONSTRAINT `fk_Config_1`
  FOREIGN KEY (`ConfigID`)
    REFERENCES `ConfigSettings` (`ID`)
    ON DELETE CASCADE
    ON UPDATE CASCADE;

SELECT 'Adding foreign key between permissions and permissions_category' as 'Step #4';
SELECT 'permissions.categoryID not associated with a valid permissions_category.id will be set to 2 (Permission)' as 'ATTENTION';
UPDATE permissions SET categoryID = 2 WHERE categoryID NOT IN (SELECT id FROM permissions_category);
ALTER TABLE `permissions` 
  CHANGE COLUMN `categoryID` `categoryID` INT(10) NOT NULL DEFAULT 2;
ALTER TABLE `permissions` 
  ADD INDEX `fk_permissions_1_idx` (`categoryID` ASC);
ALTER TABLE `permissions` 
  ADD CONSTRAINT `fk_permissions_1`
  FOREIGN KEY (`categoryID`)
    REFERENCES `permissions_category` (`ID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION;


SELECT 'Adding foreign key between candidate and caveat_options' as 'Step #5';
SELECT 'List of candidate(s) with innexistant flagged_reason in the canveat_options table. Those flagged_reason will be set to NULL' as 'ATTENTION';
SELECT c.candid, c.flagged_reason 
  FROM candidate c
  WHERE NOT EXISTS (
    SELECT ID FROM caveat_options WHERE c.flagged_reason = ID
  ) AND c.flagged_reason IS NOT NULL;
ALTER TABLE `candidate` 
  ADD INDEX `FK_candidate_2_idx` (`flagged_reason` ASC);
ALTER TABLE `candidate` 
  ADD CONSTRAINT `FK_candidate_2`
  FOREIGN KEY (`flagged_reason`)
    REFERENCES `caveat_options` (`ID`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE;

SELECT 'Dropping duplicate index CandidateCenterID in the candidate table' as 'Step #6';
ALTER TABLE `candidate` 
  DROP INDEX `CandidateCenterID` ;

SELECT 'Adding index PSCID in the candidate table' as 'Step #7';
ALTER TABLE `candidate` 
  ADD INDEX `PSCID` (`PSCID` ASC);

SELECT 'Adding foreign key between document_repository_categories and document_repository tables' as 'Step #8';
SELECT 'document_repository.File_category not associated with a valid document_repository_categories.id will be set to NULL' as 'ATTENTION';
UPDATE document_repository SET File_category = NULL WHERE File_category NOT IN (SELECT id FROM document_repository_categories);
ALTER TABLE `document_repository` 
  CHANGE COLUMN `File_category` `File_category` INT(3) UNSIGNED NULL DEFAULT NULL;
ALTER TABLE `document_repository`
  ADD INDEX `fk_document_repository_1_idx` (`File_category` ASC);
ALTER TABLE `document_repository`
  ADD CONSTRAINT `fk_document_repository_1`
  FOREIGN KEY (`File_category`)
    REFERENCES `document_repository_categories` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION;

SELECT 'Adding foreign key between document_repository_categories and document_repository tables' as 'Step #9';
SELECT 'session_status records not associated with a valid session.id will be deleted' as 'ATTENTION';
DELETE FROM session_status WHERE SessionID NOT IN (SELECT id FROM `session`);
ALTER TABLE `session_status` 
  CHANGE COLUMN `SessionID` `SessionID` INT(10) UNSIGNED NOT NULL ;
ALTER TABLE `session_status` 
  ADD CONSTRAINT `fk_session_status_1`
  FOREIGN KEY (`SessionID`)
    REFERENCES `session` (`ID`)
    ON DELETE CASCADE
    ON UPDATE CASCADE;

SELECT 'Adding foreign key between participant_status and participant_status_options tables' as 'Step #10';
SELECT 'participant_status.participant_status not associated with a valid participant_status_options.id will be set to NULL' as 'ATTENTION';
SELECT 'participant_status.participant_suboptions not associated with a valid participant_status_options.id will be set to NULL' as 'ATTENTION';
UPDATE participant_status SET participant_status = NULL WHERE participant_status NOT IN (SELECT id FROM participant_status_options);
UPDATE participant_status SET participant_suboptions = NULL WHERE participant_suboptions NOT IN (SELECT id FROM participant_status_options);
ALTER TABLE `participant_status` 
CHANGE COLUMN `participant_status` `participant_status` INT(10) UNSIGNED NULL DEFAULT NULL ,
CHANGE COLUMN `participant_suboptions` `participant_suboptions` INT(10) UNSIGNED NULL DEFAULT NULL ;
ALTER TABLE `participant_status` 
  ADD INDEX `fk_participant_status_1_idx` (`participant_status` ASC),
  ADD INDEX `fk_participant_status_2_idx` (`participant_suboptions` ASC);
ALTER TABLE `participant_status` 
  ADD CONSTRAINT `fk_participant_status_1`
  FOREIGN KEY (`participant_status`)
    REFERENCES `participant_status_options` (`ID`)
    ON DELETE SET NULL
    ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_participant_status_2`
  FOREIGN KEY (`participant_suboptions`)
    REFERENCES `participant_status_options` (`ID`)
    ON DELETE SET NULL
    ON UPDATE CASCADE;

SELECT 'Adding foreign key between participant_status and candidate tables' as 'Step #11';
SELECT 'participant_status records not associated with a valid candidate.candid will be deleted' as 'ATTENTION';
DELETE FROM participant_status WHERE CandID NOT IN (SELECT candid FROM candidate);
ALTER TABLE `participant_status` 
  ADD CONSTRAINT `fk_participant_status_3`
  FOREIGN KEY (`CandID`)
    REFERENCES `candidate` (`CandID`)
    ON DELETE CASCADE
    ON UPDATE CASCADE;

SELECT 'Change the parameter_type_category primary key to conform all the other int(11) unsigned NOT NULL AUTO_INCREMENT columns' as 'Step #12'; 
ALTER TABLE parameter_type_category CHANGE `ParameterTypeCategoryID` `ParameterTypeCategoryID` int(11) unsigned NOT NULL AUTO_INCREMENT;

SELECT 'Changes storage engine to InnoDB for participant_* tables' as 'Step #13';
ALTER TABLE `participant_status` ENGINE = InnoDB;
ALTER TABLE `participant_status_options` ENGINE = InnoDB;
ALTER TABLE `participant_emails` ENGINE = InnoDB;
ALTER TABLE `participant_accounts` ENGINE = InnoDB;
ALTER TABLE `participant_status_history` ENGINE = InnoDB;
ALTER TABLE `consent_info_history` ENGINE = InnoDB;

SELECT 'Changes default chatset to utf8 for participant_* tables' as 'Step #14';
ALTER TABLE `participant_status` CONVERT TO CHARACTER SET utf8;
ALTER TABLE `participant_status_options` CONVERT TO CHARACTER SET utf8;
ALTER TABLE `participant_emails` CONVERT TO CHARACTER SET utf8;
ALTER TABLE `participant_accounts` CONVERT TO CHARACTER SET utf8;
ALTER TABLE `participant_status_history` CONVERT TO CHARACTER SET utf8;
ALTER TABLE `consent_info_history` CONVERT TO CHARACTER SET utf8;

SELECT 'Adding ignored foreign key between participant_emails and test_names tables' as 'Step #15';
ALTER TABLE `participant_emails` CONVERT TO CHARACTER SET utf8;
ALTER TABLE `participant_emails`
  ADD CONSTRAINT `fk_participant_emails_1`
  FOREIGN KEY (`Test_name`)
    REFERENCES `test_names` (`Test_name`)
    ON DELETE CASCADE
    ON UPDATE CASCADE;

SELECT 'Changes storage engine to InnoDB for remaining tables' as 'Step #16';
ALTER TABLE `ExternalLinkTypes` ENGINE = InnoDB;
ALTER TABLE `ExternalLinks` ENGINE = InnoDB;
ALTER TABLE `empty_queries` ENGINE = InnoDB;
ALTER TABLE `data_release` ENGINE = InnoDB;
ALTER TABLE `data_release_permissions` ENGINE = InnoDB;

SELECT 'Changes default chatset to utf8 for remaining tables' as 'Step #17';
ALTER TABLE `ExternalLinkTypes` CONVERT TO CHARACTER SET utf8;
ALTER TABLE `ExternalLinks` CONVERT TO CHARACTER SET utf8;
ALTER TABLE `empty_queries` CONVERT TO CHARACTER SET utf8;
ALTER TABLE `data_release` CONVERT TO CHARACTER SET utf8;
ALTER TABLE `data_release_permissions` CONVERT TO CHARACTER SET utf8;
ALTER TABLE `Visit_Windows` CONVERT TO CHARACTER SET utf8;

SELECT 'Dropping duplicate index SessionCenterID in the session table' as 'Step #18';
ALTER TABLE `session`
  DROP INDEX `SessionCenterID` ;

SELECT 'Rectifying some discrepancies' as 'Step #19';
UPDATE ConfigSettings SET OrderNumber = 1 WHERE Name = 'JWTKey';
ALTER TABLE `certification_history` COMMENT='primaryVals should always contain a valid certID from the certification table';
ALTER TABLE `session_status` COMMENT='Used if SupplementalSessionStatus configSettings is true';
ALTER TABLE `tarchive_find_new_uploads` COMMENT='This table is used by Loris-MRI/find_uploads_tarchive to store the last time the script was ran for that location';

SELECT 'Patch completed' as 'Status';
-- Add scan_type to ENUM
ALTER TABLE ConfigSettings MODIFY COLUMN DataType ENUM('text', 'boolean', 'email', 'instrument', 'textarea', 'scan_type');

-- Change Dicom Archive name to Imaging Modules
UPDATE ConfigSettings SET Name='imaging_modules', Description='DICOM Archive and Imaging Browser settings', Label='Imaging Modules' WHERE Name ='dicom_archive';

-- Add Imaging Browser to Imaging Modules
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'tblScanTypes', 'Scan types from the mri_scan_type table that the project wants to see displayed in Imaging Browser table', 1, 1, 'scan_type', ID, 'Imaging Browser Tabulated Scan Types', 6 FROM ConfigSettings WHERE Name="imaging_modules";

-- default imaging_browser settings
INSERT INTO Config (ConfigID, Value) SELECT cs.ID, GROUP_CONCAT(mst.Scan_Type) FROM ConfigSettings cs JOIN mri_scan_type mst WHERE cs.Name="tblScanTypes" AND mst.ID=44;
INSERT INTO Config (ConfigID, Value) SELECT cs.ID, GROUP_CONCAT(mst.Scan_Type) FROM ConfigSettings cs JOIN mri_scan_type mst WHERE cs.Name="tblScanTypes" AND mst.ID=45;


-- Loris-MRI/Imaging Pipeline options from the $profile (commonly "prod") file
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, Label, OrderNumber) VALUES ('imaging_pipeline', 'Imaging Pipeline settings', 1, 0, 'Imaging Pipeline', 12);
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'dataDirBasepath', 'Base Path to the data directory of Loris-MRI', 1, 0, 'text', ID, 'Loris-MRI Data Directory', 1 FROM ConfigSettings WHERE Name="imaging_pipeline";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'prefix', 'Study prefix or study name', 1, 0, 'text', ID, 'Study Name', 2 FROM ConfigSettings WHERE Name="imaging_pipeline";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'mail_user', 'User to be notified during imaging pipeline execution', 1, 0, 'text', ID, 'User to notify when executing the pipeline', 3 FROM ConfigSettings WHERE Name="imaging_pipeline";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'get_dicom_info', 'Full path to get_dicom_info.pl', 1, 0, 'text', ID, 'Full path to get_dicom_info.pl script', 4 FROM ConfigSettings WHERE Name="imaging_pipeline";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'horizontalPics', 'Generate horizontal pictures', 1, 0, 'boolean', ID, 'Horizontal pictures creation', 5 FROM ConfigSettings WHERE Name="imaging_pipeline";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'no_nii', 'Create NIFTII files if set to 0', 1, 0, 'boolean', ID, 'NIFTII file creation', 6 FROM ConfigSettings WHERE Name="imaging_pipeline";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'converter', 'If converter is set to dcm2mnc, the c-version of dcm2mnc will be used. If however you want to use any of the various versions of the converter, you will have to specify what it is called and the uploader will try to invoke it', 1, 0, 'text', ID, 'dcm2mnc binary to use when converting', 7 FROM ConfigSettings WHERE Name="imaging_pipeline";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'tarchiveLibraryDir', 'Location of storing the library of used tarchives. If this is not set, they will not be moved', 1, 0, 'text', ID, 'Path to Tarchives', 8 FROM ConfigSettings WHERE Name="imaging_pipeline";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'lookupCenterNameUsing', 'The element of the tarchive table to be used in getPSC(), being either PatientID or PatientName', 1, 0, 'text', ID, 'Center name lookup variable', 9 FROM ConfigSettings WHERE Name="imaging_pipeline";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'createCandidates', 'Creation of candidates if set to 1', 1, 0, 'boolean', ID, 'Upload creation of candidates', 10 FROM ConfigSettings WHERE Name="imaging_pipeline";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'is_qsub', 'Do not use batch management if qsub is set to 0', 1, 0, 'boolean', ID, 'Project batch management used', 11 FROM ConfigSettings WHERE Name="imaging_pipeline";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'if_site', 'Use site if set to 1', 1, 0, 'boolean', ID, 'If site is used', 12 FROM ConfigSettings WHERE Name="imaging_pipeline";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'DTI_volumes', 'Number of volumes in native DTI acquisitions', 1, 0, 'text', ID, 'Number of volumes in native DTI acquisitions', 13 FROM ConfigSettings WHERE Name="imaging_pipeline";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 't1_scan_type', 'Scan type of native T1 acquisition (as in the mri_scan_type table)', 1, 0, 'text', ID, 'Scan type of native T1 acquisition', 14 FROM ConfigSettings WHERE Name="imaging_pipeline";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'reject_thresh', 'Max number of directions that can be rejected to PASS QC', 1, 0, 'text', ID, 'Max number of DTI rejected directions for passing QC', 15 FROM ConfigSettings WHERE Name="imaging_pipeline";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'niak_path', 'Path to niak quarantine to use if mincdiffusion will be run (option -runMincdiffusion set when calling DTIPrep_pipeline.pl)', 1, 0, 'text', ID, 'NIAK Path', 16 FROM ConfigSettings WHERE Name="imaging_pipeline";
INSERT INTO ConfigSettings (Name, Description, Visible, AllowMultiple, DataType, Parent, Label, OrderNumber) SELECT 'QCed2_step', 'DTIPrep protocol step at which a secondary QCed dataset is produced (for example one without motion correction and eddy current correction would be saved at INTERLACE_outputDWIFileNameSuffix step of DTIPrep)', 1, 0, 'text', ID, 'Secondary QCed dataset', 17 FROM ConfigSettings WHERE Name="imaging_pipeline";


-- default imaging_pipeline settings
INSERT INTO Config (ConfigID, Value) SELECT ID, "/PATH/TO/DATA/location" FROM ConfigSettings cs WHERE cs.Name="dataDirBasepath";
INSERT INTO Config (ConfigID, Value) SELECT ID, "project" FROM ConfigSettings cs WHERE cs.Name="prefix";
INSERT INTO Config (ConfigID, Value) SELECT ID, "yourname\@example.com" FROM ConfigSettings cs WHERE cs.Name="mail_user";
INSERT INTO Config (ConfigID, Value) SELECT ID, "/PATH/TO/get_dicom_info.pl" FROM ConfigSettings cs WHERE cs.Name="get_dicom_info";
INSERT INTO Config (ConfigID, Value) SELECT ID, 1 FROM ConfigSettings cs WHERE cs.Name="horizontalPics";
INSERT INTO Config (ConfigID, Value) SELECT ID, 0 FROM ConfigSettings cs WHERE cs.Name="no_nii";
INSERT INTO Config (ConfigID, Value) SELECT ID, "dcm2mnc" FROM ConfigSettings cs WHERE cs.Name="converter";
INSERT INTO Config (ConfigID, Value) SELECT ID, "/PATH/TO/dicomlib/" FROM ConfigSettings cs WHERE cs.Name="tarchiveLibraryDir";
INSERT INTO Config (ConfigID, Value) SELECT ID, "PatientName" FROM ConfigSettings cs WHERE cs.Name="lookupCenterNameUsing";
INSERT INTO Config (ConfigID, Value) SELECT ID, 1 FROM ConfigSettings cs WHERE cs.Name="createCandidates";
INSERT INTO Config (ConfigID, Value) SELECT ID, 0 FROM ConfigSettings cs WHERE cs.Name="is_qsub";
INSERT INTO Config (ConfigID, Value) SELECT ID, 1 FROM ConfigSettings cs WHERE cs.Name="if_site";
INSERT INTO Config (ConfigID, Value) SELECT ID, 65 FROM ConfigSettings cs WHERE cs.Name="DTI_volumes";
INSERT INTO Config (ConfigID, Value) SELECT ID, "adniT1" FROM ConfigSettings cs WHERE cs.Name="t1_scan_type";
INSERT INTO Config (ConfigID, Value) SELECT ID, 19 FROM ConfigSettings cs WHERE cs.Name="reject_thresh";
INSERT INTO Config (ConfigID, Value) SELECT ID, "/opt/niak-0.6.4.1/" FROM ConfigSettings cs WHERE cs.Name="niak_path";
INSERT INTO Config (ConfigID, Value) SELECT ID, "INTERLACE_outputDWIFileNameSuffix" FROM ConfigSettings cs WHERE cs.Name="QCed2_step";
-- Add a permission to Imaging Broswer to give access to users to view phantoms data only
INSERT INTO permissions (code,description,categoryID) VALUES ('imaging_browser_phantom_allsites', 'Can access only phantom data from all sites in Imaging Browser', 2);
INSERT INTO permissions (code,description,categoryID) VALUES ('imaging_browser_phantom_ownsite', 'Can access only phantom data from own sites in Imaging Browser', 2);
INSERT INTO user_perm_rel (userID,permID) SELECT u.ID, p.permID FROM users u JOIN permissions p WHERE u.UserID='admin' AND p.code = 'imaging_browser_phantom_allsites';
INSERT INTO user_perm_rel (userID,permID) SELECT u.ID, p.permID FROM users u JOIN permissions p WHERE u.UserID='admin' AND p.code = 'imaging_browser_phantom_ownsite';
INSERT INTO LorisMenuPermissions (MenuID, PermID)
    SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='imaging_browser_phantom_allsites' AND m.Label='Imaging Browser';
INSERT INTO LorisMenuPermissions (MenuID, PermID)
    SELECT m.ID, p.PermID FROM permissions p CROSS JOIN LorisMenu m WHERE p.code='imaging_browser_phantom_ownsite' AND m.Label='Imaging Browser';


-- ad phone to users
ALTER TABLE users ADD COLUMN `Phone` varchar(15) default NULL;

-- Associates modules with the service available for each
CREATE TABLE `notification_modules` (
      `id` int(10) unsigned auto_increment NOT NULL,
      `module_name` varchar(100) NOT NULL,
      `operation_type` varchar(100) NOT NULL,
      `as_admin` enum('Y','N') NOT NULL DEFAULT 'N',
      `template_file` varchar(100) NOT NULL,
      `description` varchar(255) DEFAULT NULL,
      PRIMARY KEY (`id`),
      KEY (`module_name`),
      UNIQUE(module_name,operation_type)
) ENGINE=InnoDB DEFAULT CHARSET='utf8';

-- Associates modules with the service available for each
CREATE TABLE `notification_services` (
      `id` int(10) unsigned auto_increment NOT NULL,
      `service` VARCHAR(50) NOT NULL,
      PRIMARY KEY (`id`),
      UNIQUE(service)
) ENGINE=InnoDB DEFAULT CHARSET='utf8';

-- saves users preferences for notification type
CREATE TABLE `notification_modules_services_rel` (
      `module_id` int(10) unsigned NOT NULL,
      `service_id` int(10) unsigned NOT NULL,
      PRIMARY KEY (`module_id`,`service_id`),
      KEY `FK_notification_modules_services_rel_1` (`module_id`),
      KEY `FK_notification_modules_services_rel_2` (`service_id`),
      CONSTRAINT `FK_notification_modules_services_rel_1` FOREIGN KEY (`module_id`) REFERENCES `notification_modules` (`id`),
      CONSTRAINT `FK_notification_modules_services_rel_2` FOREIGN KEY (`service_id`) REFERENCES `notification_services` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET='utf8';

-- saves users preferences for notification type
CREATE TABLE `users_notifications_rel` (
      `user_id` int(10) unsigned NOT NULL,
      `module_id` int(10) unsigned NOT NULL,
      `service_id` int(10) unsigned NOT NULL,
      PRIMARY KEY (`user_id`,`module_id`,`service_id`),
      KEY `FK_notifications_users_rel_1` (`user_id`),
      KEY `FK_notifications_users_rel_2` (`module_id`),
      KEY `FK_notifications_users_rel_3` (`service_id`),
      CONSTRAINT `FK_notifications_users_rel_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`ID`),
      CONSTRAINT `FK_notifications_users_rel_2` FOREIGN KEY (`module_id`) REFERENCES `notification_modules` (`id`),
      CONSTRAINT `FK_notifications_users_rel_3` FOREIGN KEY (`service_id`) REFERENCES `notification_services` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET='utf8';

-- history log
CREATE TABLE `notification_history` (
      `id` int(10) unsigned auto_increment NOT NULL,
      `module_id` int(10) unsigned NOT NULL,
      `service_id` int(10) unsigned NOT NULL,
      `date_sent` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
      `trigger_user` int(10) unsigned NOT NULL,
      `target_user` int(10) unsigned NOT NULL,
      PRIMARY KEY (`id`),
      KEY `FK_notification_history_1` (`trigger_user`),
      KEY `FK_notification_history_2` (`target_user`),
      CONSTRAINT `FK_notification_history_1` FOREIGN KEY (`trigger_user`) REFERENCES `users` (`ID`) ON UPDATE CASCADE ON DELETE CASCADE ,
      CONSTRAINT `FK_notification_history_2` FOREIGN KEY (`target_user`) REFERENCES `users` (`ID`) ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- basic notification service
INSERT INTO notification_services (service) VALUES
('email_text');

-- Pre-implemented notifications
INSERT INTO notification_modules (module_name, operation_type, as_admin, template_file, description) VALUES
  ('media', 'upload', 'N', 'notifier_media_upload.tpl', 'Media: New File Uploaded'),
  ('media', 'download', 'N', 'notifier_media_download.tpl', 'Media: File Downloaded'),
  ('document_repository', 'new_category', 'N', 'notifier_document_repository_new_category.tpl', 'Document Repository: New Category'),
  ('document_repository', 'upload', 'N', 'notifier_document_repository_upload.tpl', 'Document Repository: New Document Uploaded'),
  ('document_repository', 'delete', 'N', 'notifier_document_repository_delete.tpl', 'Document Repository: Document Deleted'),
  ('document_repository', 'edit', 'N', 'notifier_document_repository_edit.tpl', 'Document Repository: Document Edited');

-- enable doc repo basic text emails
INSERT INTO notification_modules_services_rel SELECT nm.id, ns.id FROM notification_modules nm JOIN notification_services ns WHERE nm.module_name='document_repository' AND ns.service='email_text';

-- Transfer Document repository notifications to new system
INSERT INTO users_notifications_rel SELECT u.ID, nm.id, ns.id FROM users u JOIN notification_modules nm JOIN notification_services ns WHERE nm.module_name='document_repository' AND ns.service='email_text' AND u.Doc_Repo_Notifications='Y';

-- permissions for each notification module
CREATE TABLE `notification_modules_perm_rel` (
      `notification_module_id` int(10) unsigned NOT NULL,
      `perm_id` int(10) unsigned NOT NULL default '0',
      CONSTRAINT `FK_notification_modules_perm_rel_1` FOREIGN KEY (`notification_module_id`) REFERENCES `notification_modules` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
      CONSTRAINT `FK_notification_modules_perm_rel_2` FOREIGN KEY (`perm_id`) REFERENCES `permissions` (`permID`) ON DELETE CASCADE ON UPDATE CASCADE,
      PRIMARY KEY (`notification_module_id`,`perm_id`)
) ENGINE=InnoDB DEFAULT CHARSET='utf8';

-- populate notification perm table
INSERT INTO notification_modules_perm_rel SELECT nm.id, p.permID FROM notification_modules nm JOIN permissions p WHERE nm.module_name='media' AND (p.code='media_write' OR p.code='media_read');
INSERT INTO notification_modules_perm_rel SELECT nm.id, p.permID FROM notification_modules nm JOIN permissions p WHERE nm.module_name='document_repository' AND (p.code='document_repository_view' OR p.code='document_repository_delete');
ALTER TABLE issues DROP FOREIGN KEY `fk_issues_5`;
ALTER TABLE issues ADD CONSTRAINT `fk_issues_5` FOREIGN KEY (`centerID`) REFERENCES `psc` (`CenterID`);
WARNINGS;
SET SQL_NOTES=1;

SELECT 'Delete duplicate entries' as 'Step #1';
DELETE 
FROM 
	instrument_subtests 
USING 
	instrument_subtests,
	instrument_subtests to_keep 
WHERE 
	instrument_subtests.ID < to_keep.ID 
	AND instrument_subtests.Test_name = to_keep.Test_name
	AND instrument_subtests.Subtest_name = to_keep.Subtest_name;

SELECT 'Alter instrument_subtests to force unique Subtest_name' as 'Step #2';
ALTER TABLE `instrument_subtests`
ADD UNIQUE KEY `unique_index` (`Test_name`, `Subtest_name`);

SELECT 'Patch complete' as 'Status';
CREATE TEMPORARY TABLE
    project_rel_tmp
AS
    SELECT DISTINCT
        ProjectID, SubprojectID
    FROM
        project_rel;

DELETE FROM project_rel;

INSERT INTO
    project_rel (ProjectID, SubprojectID)
SELECT
    ProjectID, SubprojectID
FROM
    project_rel_tmp;

ALTER TABLE `project_rel` ADD PRIMARY KEY( `ProjectID`, `SubprojectID`);
ALTER table parameter_file MODIFY Value LONGTEXT;

-- The OneTimePassword storage capacity should be extended according to new key generation logic

ALTER TABLE participant_accounts MODIFY COLUMN OneTimePassword VARCHAR(16) ;
-- Removing reliability statistics as it is more project specific
DELETE FROM `StatisticsTabs`  WHERE `SubModuleName`='stats_reliability';ALTER TABLE project_rel MODIFY COLUMN ProjectID int(2) NOT NULL;
ALTER TABLE project_rel MODIFY COLUMN SubprojectID int(2) NOT NULL;
