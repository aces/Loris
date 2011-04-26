<?
/**
* Calculates/derives bvl vars from a timepoint's battery of instruments
* each instrument has a method to calculate/derive a value
* so that it could be dropped into the instrument's class and used to update values
* as the data changes and the instrument is rescored
* each method provides value extraction/abnstarction/calculation and the update/replace into the paramter_session table
*
* to use this class:
* $bvlVarsObject =& TimePoint_BVL_Variables::singleton($sessionID);
* $success = $bvlVarsObject->extractVars($sessionID);
*
* The class extends the TimePoint class using singeton
*  Method extractVars logic:
*
* create Database object
* SELECT the list of completed Instruments from flag
* foreach instrument
*   save commentID
*   check is the corresponding method exists
*   use the <instrument> method to get the list of bvlVars and values
*   foreach bvlVar
*     get varID from paramtere_type table
*     if no varID skip 1
*     else save bvlVar value into parameter_session table
*   end
* end  
*
* save method insert a new records or updates an existing one in the paramter_session table
* This class is not logging events currently, but echos messages
*   
* @package garbage
*/
Class TimePoint_BVL_Variables extends TimePoint 
{
    var $commentID;
    
    function &singleton($sessionID)
    {
        // instantiate new TimePoint_BVL object
        $BVLVarsList =& $GLOBALS['__timePointBVLVariablesObjects'];
        if(!isset($BVLVarsList[$sessionID])) {
            $BVLVarsList[$sessionID] = new TimePoint_BVL_Variables();
            
            // setup data in the TimePoint class
            $success = $BVLVarsList[$sessionID]->select($sessionID);
            if (PEAR::isError($success)) {
                return PEAR::raiseError($success->getMessage());
            }
        }
        return $BVLVarsList[$sessionID];
    }

    function getCommentID()
    {
        return $this->commentID;
    }
    

    function setCommentID($commentID)
    {
        $this->commentID = $commentID;
    }
    
    /**
    * selects completed instruments from the battery and stores and calls each instrument's scoring
    *
    * @param int $sessionID  field session.ID
    * @return string $log w/ log content
    * @access public
    * @todo complete log function, needs to log to the file as it runs, not only to return at the end
    */
    function extractVars($sessionID)
    {
        // new DB Object
        $db =& Database::singleton();
        if(PEAR::isError($db)) {
            return PEAR::raiseError ("Could not connect to database: ".$db->getMessage());
        }
        
        //check data entry completion
        $query = "SELECT Test_name, CommentID FROM flag where Data_entry = 'Complete' AND SessionID = '".$this->getSessionID()."' ORDER BY Test_name";
        
        $db->select($query, $result);
        if (PEAR::isError($result)) {
            return PEAR::raiseError("Db Error: ".$result->getMessage());
        }
        
        // log the sessionID
        $log .= "SessionID: ". $this->getSessionID()."\n";
        
        // if the timepoint has no Completed instrument raise an error
        if (!is_array($result)) {
            $log .= "The timepoint has no completed instruments\n";
            return;
        }
        
        // loop the battery of instruments to extract and store BVL vars
        foreach ($result AS $instrument) {
            
            // log the instrument and commentID
            $log .= "\n Instrument: ".$instrument["Test_name"]."\n";
            $log .= "CommentID: ".$instrument["CommentID"]."\n";
            
            // save CommentID so that they can be accessed by other methods
            $this->setCommentID($instrument["CommentID"]);
            
            // if the method _(instrument["test_name"]) does not exist raise an error
            // and skip to the next instrument
            if (!method_exists($this, $instrument["Test_name"])) {
                $log .= "Missing method: ".$instrument["Test_name"]."\n\n";
                continue;
            }
            
            // call the method to get the list of bvlVars values
            $bvlVarList = $this->$instrument["Test_name"]();
            if (PEAR::isError($bvlVarList)) {
                // if error, return PEAR Error and deal w/ it :-)
                return PEAR::raiseError("Method ".$instrument["Test_name"]." error: " . $bvlVarList->getMessage());
            }

            // loop the result set, validate and save each bvl var
            if (!is_array($bvlVarList)) {
                // if no values were returned log an error and skip to the next instrument
                $log .= "Empty list of vars for: ".$instrument["Test_name"]." @ CommentID: " . $this->commentID . "\n\n";
                continue;
            }
            
            $log .= "list of results: \n";
            
            foreach ($bvlVarList as $bvlVar=>$bvlVarValue) {
                
                // get ParameterTypeID of the var
                // it also verifies that they are registered in the paramter_type
                $varID = $this->getVarID($bvlVar);
                if (PEAR::isError($varID)) {
                    // return the Error
                    return PEAR::raiseError("Method validation".$instrument["Test_name"]." error: " . $varID->getMessage());
                }
                
                if (empty($varID)) {
                    
                    //log the error - bvlVar DNE
                    $log .= "DNE :: BVLVar: $bvlVar w/ Value: $bvlVarValue\n";
                    continue;
                    
                } else {
                    
                    $log .= "Will save :: BVLVar: $bvlVar w/ Value: $bvlVarValue\n";
                    // save the new bvlVar value into the table
                    $success = $this->save($varID, $bvlVarValue);
                    if (PEAR::isError($success)) {
                        return PEAR::raiseError("Method validation".$instrument["Test_name"]." :: $bvlVar error: " . $success->getMessage());
                    }
                }
            }
        }
        return $log;
    }

    /**
    * check whether the variable is registered in the parameter_type table
    */
    function getVarID($bvlVar)
    {
       // new DB Object
        $db =& Database::singleton();
        if(PEAR::isError($db)) {
            return PEAR::raiseError ("Could not connect to database: ".$db->getMessage());
        }
        
        $query = "SELECT ParameterTypeID FROM parameter_type WHERE Name = '$bvlVar'";

        $result = $db->selectOne($query);
        if (PEAR::isError($result)) {
            return PEAR::raiseError("Db Error: ".$result->getMessage());
        }
        
        return $result;
    }
    
    function save($varID, $bvlVarValue)
    {
        // new DB Object
        $db =& Database::singleton();
        if(PEAR::isError($db)) {
            return PEAR::raiseError ("Could not connect to database: ".$db->getMessage());
        }
        
        // create the array of values to set
        if (empty($bvlVarValue)) {
            $setArray = array_merge($setArray, array("Value"=>"NULL"));
        } else {
            $setArray = array_merge($setArray, array("Value"=>$bvlVarValue));
        }
        
        // check if the value exists in the parameter_session table.
        $query = "SELECT count(*) FROM parameter_session WHERE SessionID = '".$this->getSessionID()."' AND ParameterTypeID = '".$varID."'";
        $result = $db->selectOne($query);
        if (PEAR::isError($result)) {
            return PEAR::raiseError("Db Error: ".$result->getMessage());
        }

        // if there are no records, INSERT a new record otherwise UPDATE the existing one
        if ($result > 0) {
            // create the array of values to set
            if (empty($bvlVarValue)) {
                $setArray = array_merge($setArray, array("Value"=>"NULL"));
            } else {
                $setArray = array_merge($setArray, array("Value"=>$bvlVarValue));
            }
            // create a where array
            $whereArray = array("SessionID"=>$this->getSessionID(), "ParameterTypeID"=>$varID);
            
            // update the var vaue in parameter_session table
            $success = $db->update('parameter_session', $setArray, $whereArray);
            
        } else {
            // create the array of values to set
            $setArray = array("ParameterSessionID"=>"NULL", "SessionID"=>$this->getSessionID(), "ParameterTypeID"=>$varID);
            if (empty($bvlVarValue)) {
                $setArray = array_merge($setArray, array("Value"=>"NULL"));
            } else {
                $setArray = array_merge($setArray, array("Value"=>$bvlVarValue));
            }
            
            // create new record
            $success = $db->insert('parameter_session', $setArray);
        }
        
        if (PEAR::isError($success)) {
            return PEAR::raiseError("Db Error: ".$success->getMessage());
        }
    }

    function wasi()
    {
        // new DB Object
        $db =& Database::singleton();
        if(PEAR::isError($db)) {
            return PEAR::raiseError ("Could not connect to database: ".$db->getMessage());
        }

        // get the data
        $query = "SELECT
                  wasi.IQ_full4     AS Wasi_IQ_full,            
                  wasi.IQ_perform   AS Wasi_IQ_performance,   
                  wasi.IQ_verbal    AS Wasi_IQ_verbal,         
                  wasi.Raw_sim      AS Wasi_similarities_raw,    
                  wasi.T_score_sim  AS Wasi_similarities_t,  
                  wasi.Raw_voc      AS Wasi_vocabulary_raw,      
                  wasi.T_score_voc  AS Wasi_vocabulary_t,    
                  wasi.Raw_block    AS Wasi_block_design_raw,  
                  wasi.T_score_block AS Wasi_block_design_t,
                  wasi.Raw_mat      AS Wasi_matrix_reasoning_raw,
                  wasi.T_score_mat  AS Wasi_matrix_reasoning_t
                  FROM
                  wasi
                  WHERE
                  CommentID = '".$this->getCommentID()."'";

        $db->selectRow($query, $result);
        if (PEAR::isError($result)) {
            return PEAR::raiseError("Db Error: ".$result->getMessage());
        }
                  
        return $result;
    }
                      
    function full_telephone_screening_interview_year1()
    {
        // new DB Object
        $db =& Database::singleton();
        if(PEAR::isError($db)) {
            return PEAR::raiseError ("Could not connect to database: ".$db->getMessage());
        }
        
        // get the data
        $query = "SELECT
                  f.Respondent as FtsiY1_respondent, 
                  e1.Hispanic AS Parent1_ethnicity,
                  e2.Hispanic AS Parent2_ethnicity,
                  e3.Race AS Parent1_race,
                  e4.Race AS Parent2_race,
                  s1.Status AS Income,
                  s2.Education AS Parent1_education,
                  s3.Education AS Parent2_education,
                  f.F124 AS Drinking_during_pregnancy_drinks_per_week,
                  f.F127 AS Drinking_during_breastfeed_drinks_per_week,
                  f.F128 AS Smoking_during_pregnancy_cigarettes_per_day,
                  f.F86  AS Weight_at_birth_LBS,
                  f.F87  AS Weight_at_birth_OZ
                  FROM
                  full_telephone_screening_interview_year1 as f,
                  soc_ecc as s1,
                  soc_ecc as s2,
                  soc_ecc as s3,
                  ethnic as e1,
                  ethnic as e2,
                  ethnic as e3,
                  ethnic as e4
                  WHERE
                  F135 = e1.EthnicID
                  AND f.F136 = e2.EthnicID
                  AND f.F137 = e3.EthnicID
                  AND f.F138 = e4.EthnicID
                  AND f.F139 = s1.Soc_eccID
                  AND f.F133 = s2.Soc_eccID
                  AND f.F134 = s3.Soc_eccID
                  AND CommentID = '".$this->getCommentID()."'";
        $db->selectRow($query, $result);
        if (PEAR::isError($result)) {
            return PEAR::raiseError("Db Error: ".$result->getMessage());
        }

        return $result;

    }
                      
    function full_telephone_screening_interview_year3()
    {
        // new DB Object
        $db =& Database::singleton();
        if(PEAR::isError($db)) {
            return PEAR::raiseError ("Could not connect to database: ".$db->getMessage());
        }
        
        // get the data
        $query = "SELECT 
                  MotherEthnic AS Mother_Ethnic,
                  FatherEthnic AS Father_Ethnic,
                  MotherRace AS Mother_Race,
                  FatherRace AS Father_Race,
                  HouseholdIncome AS Household_income,
                  MotherEducation AS Mother_education,
                  FatherEducation AS Father_education
                  FROM
                  full_telephone_screening_interview_year3
                  WHERE
                  CommentID = '".$this->getCommentID()."'";
        $db->selectRow($query, $result);
        if (PEAR::isError($result)) {
            return PEAR::raiseError("Db Error: ".$result->getMessage());
        }

        return $result;

    }
    
    function brief_parent()
    {
        // new DB Object
        $db =& Database::singleton();
        if(PEAR::isError($db)) {
            return PEAR::raiseError ("Could not connect to database: ".$db->getMessage());
        }
        
        // get the data
        $query = "SELECT 
                  Inhibit_raw       AS Brief_inhibit_raw,                 
                  Inhibit_T         AS Brief_inhibit_t,                     
                  Shift_raw         AS Brief_shift_raw,                     
                  Shift_T           AS Brief_shift_t,                         
                  Emotion_raw       AS Brief_emotion_raw,                 
                  Emotion_T         AS Brief_emotion_t,                     
                  Initiate_raw      AS Brief_initiate_raw,               
                  Initiate_T        AS Brief_initiate_t,                   
                  Memory_raw        AS Brief_memory_raw,                   
                  Memory_T          AS Brief_memory_t,                       
                  Plan_raw          AS Brief_plan_raw,                       
                  Plan_T            AS Brief_plan_t,                           
                  Materialorg_raw   AS Brief_material_organization_raw,
                  Materialorg_T     AS Brief_material_organization_t,   
                  Monitor_raw       AS Brief_monitor_raw,                 
                  Monitor_T         AS Brief_monitor_t,                     
                  BRI_raw           AS Brief_behaviour_regulation_index_raw,  
                  BRI_T             AS Brief_behaviour_regulation_index_t,      
                  MI_raw            AS Brief_metacognition_index_raw,          
                  MI_T              AS Brief_metacognition_index_t,              
                  GEC_raw           AS Brief_global_executive_composite_raw,  
                  GEC_T             AS Brief_global_executive_composite_t
                  FROM
                  brief_parent_scores
                  WHERE
                  CommentID = '".$this->getCommentID()."'";
        $db->selectRow($query, $result);
        if (PEAR::isError($result)) {
            return PEAR::raiseError("Db Error: ".$result->getMessage());
        }

        return $result;
    }

    function das()
    {
        // new DB Object
        $db =& Database::singleton();
        if(PEAR::isError($db)) {
            return PEAR::raiseError ("Could not connect to database: ".$db->getMessage());
        }

        // get the data
        $query = "SELECT 
                  Ability_verbal_comprehension  AS Das_verbal_comprehension_raw,
                  T_score_verbal_comprehension  AS Das_verbal_comprehension_t,  
                  Ability_picture_similarities  AS Das_picture_similarities_raw,
                  T_score_picture_similarities  AS Das_picture_similarities_t,  
                  Ability_pattern_construction  AS Das_pattern_construction_raw,
                  T_score_pattern_construction  AS Das_pattern_construction_t,  
                  Ability_early_number          AS Das_early_number_concepts_raw,       
                  T_score_early_number          AS Das_early_number_concepts_t,         
                  Ability_copying               AS Das_copying_raw,                          
                  T_score_copying               AS Das_copying_t,                            
                  Sum_T_score_GCA               AS Das_general_conceptual_ability           
                  FROM
                  das
                  WHERE
                  CommentID = '".$this->getCommentID()."'";
                  
        $db->selectRow($query, $result);
        if (PEAR::isError($result)) {
            return PEAR::raiseError("Db Error: ".$result->getMessage());
        }

        return $result;
    }

    function hand_1235()
    {
        // new DB Object
        $db =& Database::singleton();
        if(PEAR::isError($db)) {
            return PEAR::raiseError ("Could not connect to database: ".$db->getMessage());
        }
        // get the data
        $query = "SELECT Handedness
                  FROM
                  hand_1235
                  WHERE
                  CommentID = '".$this->getCommentID()."'";
        $db->selectRow($query, $result);
        if (PEAR::isError($result)) {
            return PEAR::raiseError("Db Error: ".$result->getMessage());
        }

        return $result;
    }

    function hand_3660()
    {
        // new DB Object
        $db =& Database::singleton();
        if(PEAR::isError($db)) {
            return PEAR::raiseError ("Could not connect to database: ".$db->getMessage());
        }
        // get the data
        $query = "SELECT Handedness
                  FROM
                  hand_3660
                  WHERE
                  CommentID = '".$this->getCommentID()."'";
        $db->selectRow($query, $result);
        if (PEAR::isError($result)) {
            return PEAR::raiseError("Db Error: ".$result->getMessage());
        }

        return $result;
    }

    function hand_obj1a()
    {
        // new DB Object
        $db =& Database::singleton();
        if(PEAR::isError($db)) {
            return PEAR::raiseError ("Could not connect to database: ".$db->getMessage());
        }
        // get the data
        $query = "SELECT Handedness
                  FROM
                  hand_obj1a
                  WHERE
                  CommentID = '".$this->getCommentID()."'";
        $db->selectRow($query, $result);
        if (PEAR::isError($result)) {
            return PEAR::raiseError("Db Error: ".$result->getMessage());
        }

        return $result;
    }

    function hand_obj1b()
    {
        // new DB Object
        $db =& Database::singleton();
        if(PEAR::isError($db)) {
            return PEAR::raiseError ("Could not connect to database: ".$db->getMessage());
        }
        // get the data
        $query = "SELECT Handedness
                  FROM
                  hand_obj1b
                  WHERE
                  CommentID = '".$this->getCommentID()."'";
        $db->selectRow($query, $result);
        if (PEAR::isError($result)) {
            return PEAR::raiseError("Db Error: ".$result->getMessage());
        }

        return $result;
    }

    function jtci_child()
    {
        // new DB Object
        $db =& Database::singleton();
        if(PEAR::isError($db)) {
            return PEAR::raiseError ("Could not connect to database: ".$db->getMessage());
        }
        // get the data
        $query = "SELECT
                  NS_raw AS Child_novelty_seeking_raw,  
                  HA_raw AS Child_harm_avoidance_raw,   
                  RD_raw AS Child_reward_dependence_raw,
                  P_raw AS Child_persistence_raw,       
                  SD_raw AS Child_self_directedness_raw,
                  C_raw AS Child_cooperativeness_raw,   
                  ST1_raw AS Child_self_trancend_raw  
                  FROM
                  jtci_child
                  WHERE
                  CommentID = '".$this->getCommentID()."'";
        $db->selectRow($query, $result);
        if (PEAR::isError($result)) {
            return PEAR::raiseError("Db Error: ".$result->getMessage());
        }

        return $result;
    }

    function jtci_parent1()
    {
        // new DB Object
        $db =& Database::singleton();
        if(PEAR::isError($db)) {
            return PEAR::raiseError ("Could not connect to database: ".$db->getMessage());
        }
        // get the data
        $query = "SELECT
                  NS_raw AS Parent1_novelty_seeking_raw,
                  HA_raw AS Parent1_harm_avoidance_raw, 
                  RD_raw AS Parent1_reward_dependence_raw,
                  P_raw AS Parent1_persistence_raw,     
                  SD_raw AS Parent1_self_directedness_raw,
                  C_raw AS Parent1_cooperativeness_raw, 
                  ST1_raw AS Parent1_self_transcend_raw
                  FROM
                  jtci_parent1
                  WHERE
                  CommentID = '".$this->getCommentID()."'";
        $db->selectRow($query, $result);
        if (PEAR::isError($result)) {
            return PEAR::raiseError("Db Error: ".$result->getMessage());
        }

        return $result;
    }

    function jtci_parent2()
    {
        // new DB Object
        $db =& Database::singleton();
        if(PEAR::isError($db)) {
            return PEAR::raiseError ("Could not connect to database: ".$db->getMessage());
        }
        // get the data
        $query = "SELECT
                  NS_raw AS Parent2_novelty_seeking_raw,
                  NS_t AS Parent2_novelty_seeking_t,    
                  HA_raw AS Parent2_harm_avoidance_raw, 
                  HA_t AS Parent2_harm_avoidance_t,     
                  RD_raw AS Parent2_reward_dependence_raw,
                  RD_t AS Parent2_reward_dependence_t,  
                  P_raw AS Parent2_persistence_raw,     
                  P_t AS Parent2_persistence_t,         
                  SD_raw AS Parent2_self_directedness_raw,
                  SD_t AS Parent2_self_directedness_t,  
                  C_raw AS Parent2_cooperativeness_raw, 
                  C_t AS Parent2_cooperativeness_t,     
                  ST_raw AS Parent2_self_transcend_raw,
                  ST_t AS Parent2_self_transcend_t
                  FROM
                  jtci_parent2
                  WHERE
                  CommentID = '".$this->getCommentID()."'";
        $db->selectRow($query, $result);
        if (PEAR::isError($result)) {
            return PEAR::raiseError("Db Error: ".$result->getMessage());
        }

        return $result;
    }

    function jtci_yadult()
    {
        // new DB Object
        $db =& Database::singleton();
        if(PEAR::isError($db)) {
            return PEAR::raiseError ("Could not connect to database: ".$db->getMessage());
        }
        // get the data
        $query = "SELECT
                  NS_raw AS Yadult_novelty_seeking_raw, 
                  NS_t AS Yadult_novelty_seeking_t,     
                  HA_raw AS Yadult_harm_avoidance_raw,  
                  HA_t AS Yadult_harm_avoidance_t,      
                  RD_raw AS Yadult_reward_dependence_raw,
                  RD_t AS Yadult_reward_dependence_t,   
                  P_raw AS Yadult_persistence_raw,      
                  P_t AS Yadult_persistence_t,          
                  SD_raw AS Yadult_self_directedness_raw,
                  SD_t AS Yadult_self_directedness_t,   
                  C_raw AS Yadult_cooperativeness_raw,  
                  C_t AS Yadult_cooperativeness_t,      
                  ST_raw AS Yadult_self_transcend_raw, 
                  ST_t AS Yadult_self_transcend_t
                  FROM
                  jtci_yadult
                  WHERE
                  CommentID = '".$this->getCommentID()."'";
        $db->selectRow($query, $result);
        if (PEAR::isError($result)) {
            return PEAR::raiseError("Db Error: ".$result->getMessage());
        }

        return $result;
    }

    function tanner()
    {
        // new DB Object
        $db =& Database::singleton();
        if(PEAR::isError($db)) {
            return PEAR::raiseError ("Could not connect to database: ".$db->getMessage());
        }
        // get the data
        $query = "SELECT
                  Girls1 AS Tanner_girls1,
                  Girls2 AS Tanner_girls2,
                  Girls3 AS Tanner_girls3,
                  Girls4 AS Tanner_girls4,
                  Girls5 AS Tanner_girls5,
                  Girls6 AS Tanner_girls6,
                  Girls7 AS Tanner_girls7,
                  Girls8 AS Tanner_girls8,
                  Boys1 AS Tanner_boys1,
                  Boys2 AS Tanner_boys2,
                  Boys3 AS Tanner_boys3,
                  Boys4 AS Tanner_boys4,
                  Boys5 AS Tanner_boys5
                  FROM
                  tanner
                  WHERE
                  CommentID = '".$this->getCommentID()."'";
        $db->selectRow($query, $result);
        if (PEAR::isError($result)) {
            return PEAR::raiseError("Db Error: ".$result->getMessage());
        }

        return $result;
    }

    /**
     * todo: add other vars that were not identified when the method was created
     */
    function cantab()
    {
        // new DB Object
        $db =& Database::singleton();
        if(PEAR::isError($db)) {
            return PEAR::raiseError ("Could not connect to database: ".$db->getMessage());
        }
        // get the data
        $query = "SELECT
                  Larg_no_correct_left  AS Cantab_BLC_correct_right,
                  Larg_no_correct_right AS Cantab_BLC_correct_left,
                  Nedi_stages_completed AS Cantab_IED_stages_completed,
                  Morm_strategy         AS Cantab_SWM_strategy
                  FROM
                  cantab
                  WHERE
                  CommentID = '".$this->getCommentID()."'";
        $db->selectRow($query, $result);
        if (PEAR::isError($result)) {
            return PEAR::raiseError("Db Error: ".$result->getMessage());
        }

        return $result;
    }

    function nepsy_fas()
    {
        // new DB Object
        $db =& Database::singleton();
        if(PEAR::isError($db)) {
            return PEAR::raiseError ("Could not connect to database: ".$db->getMessage());
        }
        // get the data
        $query = "SELECT
                  Sum_score_phonemic AS Nepsy_fas_phonemic_total,
                  Sum_score_semantic AS Nepsy_fas_semantic_total,
                  Sum_score_semphone AS Nepsy_fas_total
                  FROM
                  nepsy_fas
                  WHERE
                  CommentID = '".$this->getCommentID()."'";
        $db->selectRow($query, $result);
        if (PEAR::isError($result)) {
            return PEAR::raiseError("Db Error: ".$result->getMessage());
        }

        return $result;
    }


    function neuro_obj1()
    {
        // new DB Object
        $db =& Database::singleton();
        if(PEAR::isError($db)) {
            return PEAR::raiseError ("Could not connect to database: ".$db->getMessage());
        }
        // get the data
        $query = "SELECT
                  Q007 AS Height_cm,
                  Q009 AS Weight_kg
                  FROM
                  neuro_obj1
                  WHERE
                  CommentID = '".$this->getCommentID()."'";
        $db->selectRow($query, $result);
        if (PEAR::isError($result)) {
            return PEAR::raiseError("Db Error: ".$result->getMessage());
        }

        return $result;
    }

    function purdue_obj1()
    {
        // new DB Object
        $db =& Database::singleton();
        if(PEAR::isError($db)) {
            return PEAR::raiseError ("Could not connect to database: ".$db->getMessage());
        }
        // get the data
        $query = "SELECT
                  Pegs_right    AS Purdue_fullboard_left_sec,
                  Pegs_left     AS Purdue_fullboard_right_sec,
                  Pegs_both     AS Purdue_fullboard_Bimanual_sec
                  FROM
                  purdue_obj1
                  WHERE
                  CommentID = '".$this->getCommentID()."'";
        $db->selectRow($query, $result);
        if (PEAR::isError($result)) {
            return PEAR::raiseError("Db Error: ".$result->getMessage());
        }

        return $result;
    }

    function purdue_obj2()
    {
        // new DB Object
        $db =& Database::singleton();
        if(PEAR::isError($db)) {
            return PEAR::raiseError ("Could not connect to database: ".$db->getMessage());
        }
        // get the data
        $query = "SELECT
                  Pegs_right AS Purdue_halfboard_left_sec,
                  Pegs_left  AS Purdue_halfboard_right_sec,
                  Pegs_both  AS Purdue_halfboard_Bimanual_sec
                  FROM
                  purdue_obj2
                  WHERE
                  CommentID = '".$this->getCommentID()."'";
        $db->selectRow($query, $result);
        if (PEAR::isError($result)) {
            return PEAR::raiseError("Db Error: ".$result->getMessage());
        }

        return $result;
    }

    function waisr()
    {
        // new DB Object
        $db =& Database::singleton();
        if(PEAR::isError($db)) {
            return PEAR::raiseError ("Could not connect to database: ".$db->getMessage());
        }
        // get the data
        $query = "SELECT
                  Digit_raw     AS Waisr_digit_Span_raw,
                  Digit_scaled  AS Waisr_digit_Span_t,
                  Coding_raw    AS Waisr_coding_raw,
                  Coding_scaled AS Waisr_coding_t
                  FROM
                  waisr
                  WHERE
                  CommentID = '".$this->getCommentID()."'";
        $db->selectRow($query, $result);
        if (PEAR::isError($result)) {
            return PEAR::raiseError("Db Error: ".$result->getMessage());
        }

        return $result;
    }

    function wisc3()
    {
        // new DB Object
        $db =& Database::singleton();
        if(PEAR::isError($db)) {
            return PEAR::raiseError ("Could not connect to database: ".$db->getMessage());
        }
        // get the data
        $query = "SELECT
                  Digit_total_score   AS Wisc3_digit_span_raw,
                  Digit_scaled_score  AS Wisc3_digit_span_t,
                  CodingA_raw_score   AS Wisc3_codingA_raw,
                  CodingB_raw_score   AS Wisc3_codingB_raw,
                  Coding_scaled_score AS Wisc3_coding_t
                  FROM
                  wisc3
                  WHERE
                  CommentID = '".$this->getCommentID()."'";
        $db->selectRow($query, $result);
        if (PEAR::isError($result)) {
            return PEAR::raiseError("Db Error: ".$result->getMessage());
        }

        return $result;
    }

    function wj3()
    {
        // new DB Object
        $db =& Database::singleton();
        if(PEAR::isError($db)) {
            return PEAR::raiseError ("Could not connect to database: ".$db->getMessage());
        }
        // get the data
        $query = "SELECT
                  norms_type            AS WJ3_scoring_norm_type,
                  norms_value           AS WJ3_scoring_norm_value,
                  passage_comp_raw      AS WJ3_passage_comprehension_raw,
                  calculation_raw       AS WJ3_calculation_raw,
                  letter_word_ident_raw AS WJ3_letter_wordID_raw
                  FROM
                  wj3
                  WHERE
                  CommentID = '".$this->getCommentID()."'";
        $db->selectRow($query, $result);
        if (PEAR::isError($result)) {
            return PEAR::raiseError("Db Error: ".$result->getMessage());
        }

        return $result;
    }

    function dps4()
    {
        // new DB Object
        $db =& Database::singleton();
        if(PEAR::isError($db)) {
            return PEAR::raiseError ("Could not connect to database: ".$db->getMessage());
        }
        // get the data
        $query = "SELECT subtotal_score AS Dps4_SOPH FROM dpsy WHERE subgroup = 'SOPH' AND CommentID = '".$this->getCommentID()."'";
        $db->selectRow($query,$result);
        if (PEAR::isError($result)) return PEAR::raiseError("Db dasError: ".$result->getMessage());
        if (is_array($result)) {
            foreach ($result as $key=>$val) {
                $resultArray[$key] = $val;
            }
        }
        unset($result);

        $query = "SELECT subtotal_score AS Dps4_SAD  FROM dpsy WHERE subgroup = 'SAD' AND CommentID = '".$this->getCommentID()."'";
        $db->selectRow($query,$result);
        if (PEAR::isError($result)) return PEAR::raiseError("Db dasError: ".$result->getMessage());
        if (is_array($result)) {
            foreach ($result as $key=>$val) {
                $resultArray[$key] = $val;
            }
        }
        unset($result);

        $query = "SELECT subtotal_score AS Dps4_AGO  FROM dpsy WHERE subgroup = 'AGO' AND CommentID = '".$this->getCommentID()."'";
        $db->selectRow($query,$result);
        if (PEAR::isError($result)) return PEAR::raiseError("Db dasError: ".$result->getMessage());
        if (is_array($result)) {
            foreach ($result as $key=>$val) {
                $resultArray[$key] = $val;
            }
        }
        unset($result);

        $query = "SELECT subtotal_score AS Dps4_PAN  FROM dpsy WHERE subgroup = 'PAN' AND CommentID = '".$this->getCommentID()."'";
        $db->selectRow($query,$result);
        if (PEAR::isError($result)) return PEAR::raiseError("Db dasError: ".$result->getMessage());
        if (is_array($result)) {
            foreach ($result as $key=>$val) {
                $resultArray[$key] = $val;
            }
        }
        unset($result);

        $query = "SELECT subtotal_score AS Dps4_GAD  FROM dpsy WHERE subgroup = 'GAD' AND CommentID = '".$this->getCommentID()."'";
        $db->selectRow($query,$result);
        if (PEAR::isError($result)) return PEAR::raiseError("Db dasError: ".$result->getMessage());
        if (is_array($result)) {
            foreach ($result as $key=>$val) {
                $resultArray[$key] = $val;
            }
        }
        unset($result);

        $query = "SELECT subtotal_score AS Dps4_SPPH FROM dpsy WHERE subgroup = 'SPPH' AND CommentID = '".$this->getCommentID()."'";
        $db->selectRow($query,$result);
        if (PEAR::isError($result)) return PEAR::raiseError("Db dasError: ".$result->getMessage());
        if (is_array($result)) {
            foreach ($result as $key=>$val) {
                $resultArray[$key] = $val;
            }
        }
        unset($result);

        $query = "SELECT subtotal_score AS Dps4_OCD  FROM dpsy WHERE subgroup = 'OCD' AND CommentID = '".$this->getCommentID()."'";
        $db->selectRow($query,$result);
        if (PEAR::isError($result)) return PEAR::raiseError("Db dasError: ".$result->getMessage());
        if (is_array($result)) {
            foreach ($result as $key=>$val) {
                $resultArray[$key] = $val;
            }
        }
        unset($result);

        $query = "SELECT subtotal_score AS Dps4_EAT  FROM dpsy WHERE subgroup = 'EAT' AND CommentID = '".$this->getCommentID()."'";
        $db->selectRow($query,$result);
        if (PEAR::isError($result)) return PEAR::raiseError("Db dasError: ".$result->getMessage());
        if (is_array($result)) {
            foreach ($result as $key=>$val) {
                $resultArray[$key] = $val;
            }
        }
        unset($result);

        $query = "SELECT subtotal_score AS Dps4_ELIM FROM dpsy WHERE subgroup = 'ELIM' AND CommentID = '".$this->getCommentID()."'";
        $db->selectRow($query,$result);
        if (PEAR::isError($result)) return PEAR::raiseError("Db dasError: ".$result->getMessage());
        if (is_array($result)) {
            foreach ($result as $key=>$val) {
                $resultArray[$key] = $val;
            }
        }
        unset($result);

        $query = "SELECT subtotal_score AS Dps4_MDD  FROM dpsy WHERE subgroup = 'MDD' AND CommentID = '".$this->getCommentID()."'";
        $db->selectRow($query,$result);
        if (PEAR::isError($result)) return PEAR::raiseError("Db dasError: ".$result->getMessage());
        if (is_array($result)) {
            foreach ($result as $key=>$val) {
                $resultArray[$key] = $val;
            }
        }
        unset($result);

        $query = "SELECT subtotal_score AS Dps4_MAN  FROM dpsy WHERE subgroup = 'MAN' AND CommentID = '".$this->getCommentID()."'";
        $db->selectRow($query,$result);
        if (PEAR::isError($result)) return PEAR::raiseError("Db dasError: ".$result->getMessage());
        if (is_array($result)) {
            foreach ($result as $key=>$val) {
                $resultArray[$key] = $val;
            }
        }
        unset($result);

        $query = "SELECT subtotal_score AS Dps4_SCHIZ FROM dpsy WHERE subgroup = 'SCHIZ' AND CommentID = '".$this->getCommentID()."'";
        $db->selectRow($query,$result);
        if (PEAR::isError($result)) return PEAR::raiseError("Db dasError: ".$result->getMessage());
        if (is_array($result)) {
            foreach ($result as $key=>$val) {
                $resultArray[$key] = $val;
            }
        }
        unset($result);

        $query = "SELECT subtotal_score AS Dps4_ADHD FROM dpsy WHERE subgroup = 'ADHD' AND CommentID = '".$this->getCommentID()."'";
        $db->selectRow($query,$result);
        if (PEAR::isError($result)) return PEAR::raiseError("Db dasError: ".$result->getMessage());
        if (is_array($result)) {
            foreach ($result as $key=>$val) {
                $resultArray[$key] = $val;
            }
        }
        unset($result);

        $query = "SELECT subtotal_score AS Dps4_ODD FROM dpsy WHERE subgroup = 'ODD' AND CommentID = '".$this->getCommentID()."'";
        $db->selectRow($query,$result);
        if (PEAR::isError($result)) return PEAR::raiseError("Db dasError: ".$result->getMessage());
        if (is_array($result)) {
            foreach ($result as $key=>$val) {
                $resultArray[$key] = $val;
            }
        }
        unset($result);

        $query = "SELECT subtotal_score AS Dps4_CD FROM dpsy WHERE subgroup = 'CD' AND CommentID = '".$this->getCommentID()."'";
        $db->selectRow($query,$result);
        if (PEAR::isError($result)) return PEAR::raiseError("Db dasError: ".$result->getMessage());
        if (is_array($result)) {
            foreach ($result as $key=>$val) {
                $resultArray[$key] = $val;
            }
        }
        unset($result);

        $query = "SELECT subtotal_score AS Dps4_ALCH FROM dpsy WHERE subgroup = 'ALCH' AND CommentID = '".$this->getCommentID()."'";
        $db->selectRow($query,$result);
        if (PEAR::isError($result)) return PEAR::raiseError("Db dasError: ".$result->getMessage());
        if (is_array($result)) {
            foreach ($result as $key=>$val) {
                $resultArray[$key] = $val;
            }
        }
        unset($result);

        $query = "SELECT subtotal_score AS Dps4_MAJI FROM dpsy WHERE subgroup = 'MAJI' AND CommentID = '".$this->getCommentID()."'";
        $db->selectRow($query,$result);
        if (PEAR::isError($result)) return PEAR::raiseError("Db dasError: ".$result->getMessage());
        if (is_array($result)) {
            foreach ($result as $key=>$val) {
                $resultArray[$key] = $val;
            }
        }
        unset($result);

        $query = "SELECT subtotal_score AS Dps4_OTHERSUB FROM dpsy WHERE subgroup = 'OTHERSUB' AND CommentID = '".$this->getCommentID()."'";
        $db->selectRow($query,$result);
        if (PEAR::isError($result)) return PEAR::raiseError("Db dasError: ".$result->getMessage());
        if (is_array($result)) {
            foreach ($result as $key=>$val) {
                $resultArray[$key] = $val;
            }
        }
        unset($result);

        $query = "SELECT subtotal_score AS Dps4_AGO_Other FROM dpsy WHERE subgroup = 'AGO_Other' AND CommentID = '".$this->getCommentID()."'";
        $db->selectRow($query,$result);
        if (PEAR::isError($result)) return PEAR::raiseError("Db dasError: ".$result->getMessage());
        if (is_array($result)) {
            foreach ($result as $key=>$val) {
                $resultArray[$key] = $val;
            }
        }
        unset($result);

        $query = "SELECT subtotal_score AS Dps4_OCD_Other FROM dpsy WHERE subgroup = 'OCD_Other' AND CommentID = '".$this->getCommentID()."'";
        $db->selectRow($query,$result);
        if (PEAR::isError($result)) return PEAR::raiseError("Db dasError: ".$result->getMessage());
        if (is_array($result)) {
            foreach ($result as $key=>$val) {
                $resultArray[$key] = $val;
            }
        }
        unset($result);

        $query = "SELECT subtotal_score AS Dps4_PAN_Other FROM dpsy WHERE subgroup = 'PAN_Other' AND CommentID = '".$this->getCommentID()."'";
        $db->selectRow($query,$result);
        if (PEAR::isError($result)) return PEAR::raiseError("Db dasError: ".$result->getMessage());
        if (is_array($result)) {
            foreach ($result as $key=>$val) {
                $resultArray[$key] = $val;
            }
        }
        unset($result);

        return $resultArray;
    }
}

?>