SELECT count(DISTINCT cr.ResolvedID)
FROM conflicts_resolved cr
JOIN (
    SELECT f.CommentID
    FROM flag f
    JOIN session s ON f.SessionID = s.ID
    WHERE s.Visit_label IN (
        'Initial_Assessment_Screening',
        'Initial_MRI',
        'Repeat_Initial_Assessment_Screening',
        'Clinical_Assessment',
        'Neuropsychology_Assessment'
    )
    -- AND s.SubprojectID IN (1,2,3,4,5,6,7,8,9,10,14,17,18)
    AND Test_name NOT IN (
'Annual_Follow_up_Phone_Call',
'Autopsy_Banked_Tissue_Inventory',
'Autopsy_Neuropathology_Report',
'Clinical_Current_Medication',
'Clinical_Current_Medication_FU',
'Clinical_Diagnosis_Confirmation',
'Clinical_Family_History',
'Clinical_Family_History_FU',
'Clinical_Hobbies_And_Leisure_Activities',
'Clinical_Initial_Symptoms',
'Clinical_Lumbar_Puncture_Procedure_Report',
'Clinical_Medical_History',
'Clinical_Medical_History_FU',
'Clinical_Mental_Health_History',
'Clinical_Mental_Health_History_FU',
'Clinical_Past_Medications',
'Clinical_Past_Medications_FU',
'Clinical_Pre_Gait_Assessment',
'Clinical_Signs_Symptoms',
'Clinical_Sleep_Work_Diary',
'Clinical_Smoking',
'Clinical_Surgical_History',
'Clinical_Surgical_History_FU',
'Clinical_UPDRS_III_IV',
'General_Health_Alcohol_Consumption',
'General_Health_Biosample_Collection',
'General_Health_Caregiving_Assessment',
'General_Health_Falls_Balance',
'General_Health_Gait_Assessment',
'General_Health_Grip_Strength',
'General_Health_Nutrition',
'General_Health_Physical_Activity',
'General_Health_Physical_Activity_FU',
'General_Health_Sleep',
'General_Health_Vision',
'mri_parameter_form',
'PI_Caregiving_Assessment',
'PI_General_Information',
'PI_General_Information_FU',
'Reappraisal_Initial_Diagnosis_Reappraisal',
'Reappraisal_Initial_Diagnosis_Reappraisal_IMPACT_AD',
'Screening_CERAD_Recog',
'Screening_Driving_History',
'Screening_Driving_History_FU',
'Screening_Education',
'Screening_Education_FU',
'Screening_Employment_History',
'Screening_Employment_History_FU',
'Screening_Languages',
'Screening_Logical_Memory_Delayed',
'Screening_MOCA',
'Screening_Reproductive_History'
)
) fs ON fs.CommentID = cr.CommentID1;

SELECT count(*)
FROM information_schema.columns
WHERE table_name NOT IN (
'Annual_Follow_up_Phone_Call',
'Autopsy_Banked_Tissue_Inventory',
'Autopsy_Neuropathology_Report',
'Clinical_Current_Medication',
'Clinical_Current_Medication_FU',
'Clinical_Diagnosis_Confirmation',
'Clinical_Family_History',
'Clinical_Family_History_FU',
'Clinical_Hobbies_And_Leisure_Activities',
'Clinical_Initial_Symptoms',
'Clinical_Lumbar_Puncture_Procedure_Report',
'Clinical_Medical_History',
'Clinical_Medical_History_FU',
'Clinical_Mental_Health_History',
'Clinical_Mental_Health_History_FU',
'Clinical_Past_Medications',
'Clinical_Past_Medications_FU',
'Clinical_Pre_Gait_Assessment',
'Clinical_Signs_Symptoms',
'Clinical_Sleep_Work_Diary',
'Clinical_Smoking',
'Clinical_Surgical_History',
'Clinical_Surgical_History_FU',
'Clinical_UPDRS_III_IV',
'General_Health_Alcohol_Consumption',
'General_Health_Biosample_Collection',
'General_Health_Caregiving_Assessment',
'General_Health_Falls_Balance',
'General_Health_Gait_Assessment',
'General_Health_Grip_Strength',
'General_Health_Nutrition',
'General_Health_Physical_Activity',
'General_Health_Physical_Activity_FU',
'General_Health_Sleep',
'General_Health_Vision',
'mri_parameter_form',
'PI_Caregiving_Assessment',
'PI_General_Information',
'PI_General_Information_FU',
'Reappraisal_Initial_Diagnosis_Reappraisal',
'Reappraisal_Initial_Diagnosis_Reappraisal_IMPACT_AD',
'Screening_CERAD_Recog',
'Screening_Driving_History',
'Screening_Driving_History_FU',
'Screening_Education',
'Screening_Education_FU',
'Screening_Employment_History',
'Screening_Employment_History_FU',
'Screening_Languages',
'Screening_Logical_Memory_Delayed',
'Screening_MOCA',
'Screening_Reproductive_History'
)

SELECT count(DISTINCT cr.ConflictID)
FROM conflicts_unresolved cr
JOIN (
    SELECT f.CommentID
    FROM flag f
    JOIN session s ON f.SessionID = s.ID
    WHERE s.Visit_label LIKE '%Time_3%'
    -- AND s.SubprojectID IN (1,2,3,4,5,6,7,8,9,10,14,17,18)
--     AND Test_name NOT IN (
-- 'Annual_Follow_up_Phone_Call',
-- 'Autopsy_Banked_Tissue_Inventory',
-- 'Autopsy_Neuropathology_Report',
-- 'Clinical_Current_Medication',
-- 'Clinical_Current_Medication_FU',
-- 'Clinical_Diagnosis_Confirmation',
-- 'Clinical_Family_History',
-- 'Clinical_Family_History_FU',
-- 'Clinical_Hobbies_And_Leisure_Activities',
-- 'Clinical_Initial_Symptoms',
-- 'Clinical_Lumbar_Puncture_Procedure_Report',
-- 'Clinical_Medical_History',
-- 'Clinical_Medical_History_FU',
-- 'Clinical_Mental_Health_History',
-- 'Clinical_Mental_Health_History_FU',
-- 'Clinical_Past_Medications',
-- 'Clinical_Past_Medications_FU',
-- 'Clinical_Pre_Gait_Assessment',
-- 'Clinical_Signs_Symptoms',
-- 'Clinical_Sleep_Work_Diary',
-- 'Clinical_Smoking',
-- 'Clinical_Surgical_History',
-- 'Clinical_Surgical_History_FU',
-- 'Clinical_UPDRS_III_IV',
-- 'General_Health_Alcohol_Consumption',
-- 'General_Health_Biosample_Collection',
-- 'General_Health_Caregiving_Assessment',
-- 'General_Health_Falls_Balance',
-- 'General_Health_Gait_Assessment',
-- 'General_Health_Grip_Strength',
-- 'General_Health_Nutrition',
-- 'General_Health_Physical_Activity',
-- 'General_Health_Physical_Activity_FU',
-- 'General_Health_Sleep',
-- 'General_Health_Vision',
-- 'mri_parameter_form',
-- 'PI_Caregiving_Assessment',
-- 'PI_General_Information',
-- 'PI_General_Information_FU',
-- 'Reappraisal_Initial_Diagnosis_Reappraisal',
-- 'Reappraisal_Initial_Diagnosis_Reappraisal_IMPACT_AD',
-- 'Screening_CERAD_Recog',
-- 'Screening_Driving_History',
-- 'Screening_Driving_History_FU',
-- 'Screening_Education',
-- 'Screening_Education_FU',
-- 'Screening_Employment_History',
-- 'Screening_Employment_History_FU',
-- 'Screening_Languages',
-- 'Screening_Logical_Memory_Delayed',
-- 'Screening_MOCA',
-- 'Screening_Reproductive_History'
-- )
) fs ON fs.CommentID = cr.CommentID1;

SELECT count(f.CommentID)
    FROM flag f
    JOIN session s ON f.SessionID = s.ID
    WHERE s.Visit_label IN (
        'Initial_Assessment_Screening',
        'Initial_MRI',
        'Repeat_Initial_Assessment_Screening',
        'Clinical_Assessment',
        'Neuropsychology_Assessment'
    )
    AND CommentID LIKE 'DDE_%'
    AND Data_entry IS NOT NULL
    -- AND s.SubprojectID IN (1,2,3,4,5,6,7,8,9,10,14,17,18)
    AND Test_name NOT IN (
    'Annual_Follow_up_Phone_Call',
    'Autopsy_Banked_Tissue_Inventory'
    'Autopsy_Neuropathology_Report',
    'Clinical_Current_Medication',
    'Clinical_Current_Medication_FU',
    'Clinical_Diagnosis_Confirmation',
    'Clinical_Family_History',
    'Clinical_Family_History_FU',
    'Clinical_Hobbies_And_Leisure_Activities',
    'Clinical_Initial_Symptoms',
    'Clinical_Lumbar_Puncture_Procedure_Report',
    'Clinical_Medical_History',
    'Clinical_Medical_History_FU',
    'Clinical_Mental_Health_History',
    'Clinical_Mental_Health_History_FU',
    'Clinical_Past_Medications',
    'Clinical_Past_Medications_FU',
    'Clinical_Pre_Gait_Assessment',
    'Clinical_Signs_Symptoms',
    'Clinical_Sleep_Work_Diary',
    'Clinical_Smoking',
    'Clinical_Surgical_History',
    'Clinical_Surgical_History_FU',
    'Clinical_UPDRS_III_IV',
    'General_Health_Alcohol_Consumption',
    'General_Health_Biosample_Collection',
    'General_Health_Caregiving_Assessment',
    'General_Health_Falls_Balance',
    'General_Health_Gait_Assessment',
    'General_Health_Grip_Strength',
    'General_Health_Nutrition',
    'General_Health_Physical_Activity',
    'General_Health_Physical_Activity_FU',
    'General_Health_Sleep',
    'General_Health_Vision',
    'mri_parameter_form',
    'PI_Caregiving_Assessment',
    'PI_General_Information',
    'PI_General_Information_FU',
    'Reappraisal_Initial_Diagnosis_Reappraisal',
    'Reappraisal_Initial_Diagnosis_Reappraisal_IMPACT_AD',
    'Screening_CERAD_Recog',
    'Screening_Driving_History',
    'Screening_Driving_History_FU',
    'Screening_Education',
    'Screening_Education_FU',
    'Screening_Employment_History',
    'Screening_Employment_History_FU',
    'Screening_Languages',
    'Screening_Logical_Memory_Delayed',
    'Screening_MOCA',
    'Screening_Reproductive_History'
    );

    SELECT count(f.CommentID)
    FROM flag f
    JOIN session s ON f.SessionID = s.ID
    WHERE s.Visit_label LIKE '%Time_3%'
    AND Data_entry IS NOT NULL
    AND CommentID LIKE 'DDE_%'
    -- AND s.SubprojectID IN (1,2,3,4,5,6,7,8,9,10,14,17,18)
    AND Test_name NOT IN (
    'Annual_Follow_up_Phone_Call',
    'Autopsy_Banked_Tissue_Inventory',
    'Autopsy_Neuropathology_Report',
    'Clinical_Current_Medication',
    'Clinical_Current_Medication_FU',
    'Clinical_Diagnosis_Confirmation',
    'Clinical_Family_History',
    'Clinical_Family_History_FU',
    'Clinical_Hobbies_And_Leisure_Activities',
    'Clinical_Initial_Symptoms',
    'Clinical_Lumbar_Puncture_Procedure_Report',
    'Clinical_Medical_History',
    'Clinical_Medical_History_FU',
    'Clinical_Mental_Health_History',
    'Clinical_Mental_Health_History_FU',
    'Clinical_Past_Medications',
    'Clinical_Past_Medications_FU',
    'Clinical_Pre_Gait_Assessment',
    'Clinical_Signs_Symptoms',
    'Clinical_Sleep_Work_Diary',
    'Clinical_Smoking',
    'Clinical_Surgical_History',
    'Clinical_Surgical_History_FU',
    'Clinical_UPDRS_III_IV',
    'General_Health_Alcohol_Consumption',
    'General_Health_Biosample_Collection',
    'General_Health_Caregiving_Assessment',
    'General_Health_Falls_Balance',
    'General_Health_Gait_Assessment',
    'General_Health_Grip_Strength',
    'General_Health_Nutrition',
    'General_Health_Physical_Activity',
    'General_Health_Physical_Activity_FU',
    'General_Health_Sleep',
    'General_Health_Vision',
    'mri_parameter_form',
    'PI_Caregiving_Assessment',
    'PI_General_Information',
    'PI_General_Information_FU',
    'Reappraisal_Initial_Diagnosis_Reappraisal',
    'Reappraisal_Initial_Diagnosis_Reappraisal_IMPACT_AD',
    'Screening_CERAD_Recog',
    'Screening_Driving_History',
    'Screening_Driving_History_FU',
    'Screening_Education',
    'Screening_Education_FU',
    'Screening_Employment_History',
    'Screening_Employment_History_FU',
    'Screening_Languages',
    'Screening_Logical_Memory_Delayed',
    'Screening_MOCA',
    'Screening_Reproductive_History'
    )


SELECT med_name, COUNT(*) AS total_count
FROM (
    SELECT med_name_1 AS med_name FROM Clinical_Current_Medication WHERE med_name_1 IS NOT NULL
    UNION ALL
    SELECT med_name_2 FROM Clinical_Current_Medication WHERE med_name_2 IS NOT NULL
    UNION ALL
    SELECT med_name_3 FROM Clinical_Current_Medication WHERE med_name_3 IS NOT NULL
    UNION ALL
    SELECT med_name_4 FROM Clinical_Current_Medication WHERE med_name_4 IS NOT NULL
    UNION ALL
    SELECT med_name_5 FROM Clinical_Current_Medication WHERE med_name_5 IS NOT NULL
    UNION ALL
    SELECT med_name_6 FROM Clinical_Current_Medication WHERE med_name_6 IS NOT NULL
    UNION ALL
    SELECT med_name_7 FROM Clinical_Current_Medication WHERE med_name_7 IS NOT NULL
    UNION ALL
    SELECT med_name_8 FROM Clinical_Current_Medication WHERE med_name_8 IS NOT NULL
    -- Continue this pattern up to med_name_32
    UNION ALL
    SELECT med_name_9 FROM Clinical_Current_Medication WHERE med_name_9 IS NOT NULL
    UNION ALL
    SELECT med_name_10 FROM Clinical_Current_Medication WHERE med_name_10 IS NOT NULL
    UNION ALL
    SELECT med_name_11 FROM Clinical_Current_Medication WHERE med_name_11 IS NOT NULL
    UNION ALL
    SELECT med_name_12 FROM Clinical_Current_Medication WHERE med_name_12 IS NOT NULL
    UNION ALL
    SELECT med_name_13 FROM Clinical_Current_Medication WHERE med_name_13 IS NOT NULL
    UNION ALL
    SELECT med_name_14 FROM Clinical_Current_Medication WHERE med_name_14 IS NOT NULL
    UNION ALL
    SELECT med_name_15 FROM Clinical_Current_Medication WHERE med_name_15 IS NOT NULL
    UNION ALL
    SELECT med_name_16 FROM Clinical_Current_Medication WHERE med_name_16 IS NOT NULL
    UNION ALL
    SELECT med_name_17 FROM Clinical_Current_Medication WHERE med_name_17 IS NOT NULL
    UNION ALL
    SELECT med_name_18 FROM Clinical_Current_Medication WHERE med_name_18 IS NOT NULL
    UNION ALL
    SELECT med_name_19 FROM Clinical_Current_Medication WHERE med_name_19 IS NOT NULL
    UNION ALL
    SELECT med_name_20 FROM Clinical_Current_Medication WHERE med_name_20 IS NOT NULL
    UNION ALL
    SELECT med_name_21 FROM Clinical_Current_Medication WHERE med_name_21 IS NOT NULL
    UNION ALL
    SELECT med_name_22 FROM Clinical_Current_Medication WHERE med_name_22 IS NOT NULL
    UNION ALL
    SELECT med_name_23 FROM Clinical_Current_Medication WHERE med_name_23 IS NOT NULL
    UNION ALL
    SELECT med_name_24 FROM Clinical_Current_Medication WHERE med_name_24 IS NOT NULL
    UNION ALL
    SELECT med_name_25 FROM Clinical_Current_Medication WHERE med_name_25 IS NOT NULL
    UNION ALL
    SELECT med_name_26 FROM Clinical_Current_Medication WHERE med_name_26 IS NOT NULL
    UNION ALL
    SELECT med_name_27 FROM Clinical_Current_Medication WHERE med_name_27 IS NOT NULL
    UNION ALL
    SELECT med_name_28 FROM Clinical_Current_Medication WHERE med_name_28 IS NOT NULL
    UNION ALL
    SELECT med_name_29 FROM Clinical_Current_Medication WHERE med_name_29 IS NOT NULL
    UNION ALL
    SELECT med_name_30 FROM Clinical_Current_Medication WHERE med_name_30 IS NOT NULL
    UNION ALL
    SELECT med_name_31 FROM Clinical_Current_Medication WHERE med_name_31 IS NOT NULL
    UNION ALL
    SELECT med_name_32 FROM Clinical_Current_Medication WHERE med_name_32 IS NOT NULL
) AS all_meds
GROUP BY med_name
ORDER BY total_count DESC;
