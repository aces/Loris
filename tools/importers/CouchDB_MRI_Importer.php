#!/usr/bin/env php
<?php
/**
 * Wrapper around CouchDB MRI functions
 *
 * @category CouchDB_Import_Script
 * @package  Main
 * @author   Dave MacFarlane <david.macfarlane2@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class CouchDBMRIImporter
{
    var $SQLDB; // reference to the database handler
    var $CouchDB; // reference to the CouchDB database handler


    // this is just in an instance variable to make
    // the code a little more readable.
    private $_Dictionary = [];
    var $FeedbackMRICommentTypes;

    var $mri_header_fields;// reference to list of mri header fields

    /**
     * Constructor for CouchDBMRIImporter
     */
    function __construct()
    {
        $factory       = \NDB_Factory::singleton();
        $config        = \NDB_Config::singleton();
        $couchConfig   = $config->getSetting('CouchDB');
        $this->SQLDB   = $factory->Database();
        $this->CouchDB = $factory->couchDB(
            $couchConfig['dbName'],
            $couchConfig['hostname'],
            intval($couchConfig['port']),
            $couchConfig['admin'],
            $couchConfig['adminpass']
        );
    }

    /**
     * Runs the script
     *
     * @return void
     */
    function run()
    {
        $ScanTypes = $this->getScanTypes();
        if (empty($ScanTypes)) {
            fwrite(STDERR, "No scan types found to import.\n");
            exit(1);
        }
        $this->updateDataDict($ScanTypes);

        $CandidateData = $this->getCandidateData($ScanTypes);
        $this->updateCandidateDocs($CandidateData, $ScanTypes);
    }

    /**
     * Builds and returns the data dictionary.
     *
     * @param $types list of scan types.
     *
     * @return the computed data dictionary.
     */
    public function getDataDictionary($types)
    {
        $this->_buildDataDictionary($types);
        return $this->_Dictionary;
    }

    /**
     * Add data dictionary for all selected types in DQT
     *
     * @param array $types The different selected types in the database
     *
     * @return void
     */
    function updateDataDict($types)
    {
        $this->CouchDB->replaceDoc(
            "DataDictionary:mri_data",
            [
                'Meta'           => ['DataDict' => true],
                'DataDictionary' => [
                    'mri_data' => $this->getDataDictionary($types)
                ]
            ]
        );
    }

    /**
     * Generates query for each of Scan types
     *
     * @param array $ScanTypes all selected scan types in the database
     *
     * @return string $Query
     */
    function _generateCandidatesQuery($ScanTypes)
    {

        $s     = $ScanTypes;
        $Query = "SELECT c.PSCID, s.Visit_label, s.ID as SessionID, fmric.Comment
          as QCComment";

        foreach ($s as $scan) {
            $scantype = $scan['ScanType'];

            //--------------------------------------------------------------------//
            // Add to the query a subselect that will compute the selected file
            // for the given session/modality. If more than one selected file
            // exists, the subquery will return 'Multiple Selected files'.
            // If no selected file exists, the subselect will return 'No selected
            // file'. Otherwise the file path of the selected file is returned
            // by the subselect.
            //-------------------------------------------------------------------//
            $Query .= ', '
                    . '('
                    . ' CASE ('.
                        $this->_getQueryForSelectedFiles(
                            'count(*)',
                            $scantype
                        )
                    . ') '
                    . '  WHEN 1 '
                    . '    THEN (' .
                        $this->_getQueryForSelectedFiles(
                            'f.File',
                            $scantype
                        )
                    . ') '
                    . '  WHEN 0 '
                    . '    THEN "No selected file" '
                    . '  ELSE "Multiple selected files"'
                    . ' END'
                    . ") as `Selected_$scantype`";

            //----------------------------------------------------------------------//
            // Add to the query a subselect that will compute the Qc status of the
            // selected file for the given session/modality. If more than one
            // selected file exists, the subquery will return 'Unknown:
            // multiple Selected files'. If no selected file exists, the subselect
            // will return 'No selected file'. Otherwise the subselect will return
            // the Qc status of the selected file (or 'No Qc on selected file'
            // if the file has not been Qced)
            //---------------------------------------------------------------------//
            $Query .= ', '
                    . '('
                    . ' CASE (' .
                            $this->_getQueryForSelectedFiles(
                                'count(*)',
                                $scantype
                            )
                    . ') '
                    . '  WHEN 1 '
                    . '    THEN ('
                    .        $this->_getQueryForSelectedFiles(
                        'COALESCE(fqs.QCStatus, "No QC on selected file")',
                        $scantype
                    )
                    .     ') '
                    . '  WHEN 0 '
                    . '    THEN "No selected file" '
                    . '  ELSE "Unknown: multiple selected files"'
                    . ' END'
                    . ") as `{$scantype}_QCStatus`";
        }

        $Query .= " FROM session s"
                . " JOIN candidate c USING (CandID)"
                . " LEFT JOIN feedback_mri_comments fmric"
                . " ON (fmric.SessionID=s.ID)"
                . " LEFT JOIN feedback_mri_comment_types fmct"
                . " ON (fmric.CommentTypeID=fmct.CommentTypeID"
                . " AND fmct.CommentType='visit')"
                . " WHERE c.Entity_type != 'Scanner'"
                . " AND c.Active='Y' AND s.Active='Y' AND s.CenterID <> 1";

        return $Query;
    }

    /**
     * Build a query to find specific information on the MRI files that were selected
     * for a given session/scan type.
     *
     * @param string $whatToSelect the comma separated list of fields to select.
     * @param string $scanType     name of the scan type.
     *
     * @return string built query.
     */
    function _getQueryForSelectedFiles($whatToSelect, $scanType)
    {
        return "SELECT $whatToSelect "
             . 'FROM files f '
             . 'LEFT JOIN mri_scan_type msc ON (f.AcquisitionProtocolID=msc.ID) '
             . 'LEFT JOIN files_qcstatus fqs USING (FileID) '
             . 'WHERE f.SessionID=s.ID '
             . "AND msc.Scan_type='$scanType' "
             . 'AND fqs.selected=\'true\'';
    }

    /**
     * Add mri header information  to each selected scan
     *
     * @param file object $FileObj   File object
     * @param string      $scan_type Scan type of the selected file
     *
     * @return array      $header    Array of mri header info for the given
     *                                     file
     */
    function _addMRIHeaderInfo($FileObj, $scan_type)
    {
        $header    = [];
        $type      = $scan_type;
        $coord     = 'CoordinateSpace';
        $ser_desc  = 'series_description';
        $ser_num   = 'series_number';
        $tot_rej   = 'processing:total_rejected';
        $inter_rej = 'IntergradientRejected_'.$type;
        $pipeline  = 'processing:pipeline';

        $header['ScannerID_'.$type]           = $this->_getScannerID(
            (int)$FileObj->getParameter('FileID')
        );
        $header['Pipeline_'.$type]            = $FileObj->getParameter('Pipeline');
        $header['OutputType_'.$type]          = $FileObj->getParameter('OutputType');
        $header['AcquisitionProtocol_'.$type] = $FileObj->getAcquisitionProtocol();
        $header['CoordinateSpace_'.$type]     = $FileObj->getParameter($coord);
        $header['Algorithm_'.$type]           = $FileObj->getParameter('Algorithm');
        $header['AcquisitionDate_'.$type]     = $this->_getDate(
            $FileObj,
            'acquisition_date'
        );
        $header['FileInsertDate_'.$type]      = date(
            'Y-m-d',
            $FileObj->getParameter('InsertTime')
        );
        $header['SeriesDescription_'.$type]   = $FileObj->getParameter($ser_desc);
        $header['SeriesNumber_'.$type]        = $FileObj->getParameter($ser_num);
        $header['EchoTime_'.$type]            = number_format(
            $FileObj->getParameter('echo_time')*1000,
            2
        );
        $header['RepetitionTime_'.$type]      = number_format(
            $FileObj->getParameter('repetition_time')*1000,
            2
        );
        $header['SliceThickness_'.$type]      = number_format(
            $FileObj->getParameter('slice_thickness'),
            2
        );
        $header['Time_'.$type]          = number_format(
            $FileObj->getParameter('time'),
            2
        );
        $header['Comment_'.$type]       = $FileObj->getParameter('Comment');
        $header['TotalRejected_'.$type] = $FileObj->getParameter($tot_rej);
        $header['SlicewiseRejected_'.$type] = $this->_getRejected(
            $FileObj,
            'slicewise'
        );
        $header['InterlaceRejected_'.$type] = $this->_getRejected(
            $FileObj,
            'interlace'
        );
        $header[$inter_rej]      = $this->_getRejected(
            $FileObj,
            'intergradient'
        );
        $header['Caveat_'.$type] = $FileObj->getParameter('Caveat');
        $header['ProcessingPipeline_'.$type] = $FileObj->getParameter($pipeline);
        return $header;
    }

    /**
     * Gets the date according to the type
     *
     * @param MRIFile $file file object
     * @param string  $type type of the date
     *
     * @return date if exists, if not an empty string
     */
    function _getDate($file, $type)
    {
        $date = $file->getParameter($type);
        if (preg_match("/(\d{4})-?(\d{2})-?(\d{2})/", $date, $array)) {
            return (mktime(12, 0, 0, $array[2], $array[3], $array[1]));
        } else {
            return "";
        }
    }

    /**
     * Gets the scannerID associated to a given scan
     *
     * @param $FileID ID of the file containing the scan.
     *
     * @return scannerID.
     */
    function _getScannerID($FileID)
    {
        $scannerID = $this->SQLDB->pselectOne(
            "SELECT ScannerID FROM files WHERE FileID =:FileID",
            ['FileID' => $FileID]
        );

        return $scannerID;
    }

    /**
     * Gets a rejected parameter according to its type
     *
     * @param MRIFile $file file object
     * @param string  $type type of the rejected
     *
     * @return parameter of the rejected
     */
    function _getRejected($file, $type)
    {
        $parameterName = 'processing:' . $type . '_rejected';
        $param         = $file->getParameter($parameterName);
        if (preg_match("/(Directions)([^\(]+)(\(\d+\))/", $param, $array)) {
            $dirList = preg_split('/\,/', $array[2]);
            if (count($dirList) > 1) {
                sort($dirList);
            }
            return "Directions " . join(", ", $dirList) . " " . $array[3];
        } else {
            return $param;
        }
    }

    /**
     * Add saved mri feedback to each of the selected scan
     *
     * @param array       $current_feedback Saved feedback for a particular
     *                                      scan
     * @param array       $scan_type        All selected scan types in the
     *                                      database
     * @param FeedbackMRI $mri_feedback     feedback object
     *
     * @return array $CandidateData Array of feedback and value for a particular
     *                              scan
     */
    function _addMRIFeedback($current_feedback, $scan_type, $mri_feedback)
    {
        $CandidateData = [];
        $commentTypes  = $this->_getFeedbackMRICommentTypes();
        //setting default values for mri feedback
        foreach (array_keys($commentTypes) as $CommentTypeID) {
            if ($this->_getFeedbackMRICommentTypesStatusField($CommentTypeID)) {
                $dictionaryID = $this->_getDictionaryID(
                    'COMMENT_STATUS_FIELD',
                    $CommentTypeID,
                    $scan_type
                );
                $CandidateData[$dictionaryID] = $mri_feedback->getMRIValue(
                    $this->_getFeedbackMRICommentTypesStatusField($CommentTypeID)
                );
            }

            // Overall comment field for each CommentTypeID
            $dictionaryID = $this->_getDictionaryID(
                'COMMENT',
                $CommentTypeID,
                $scan_type
            );
            $CandidateData[$dictionaryID] = '';

            // Set default for all the predefined comments as well
            $predefinedCommentIDs
                = array_keys($this->_getPredefinedComments($CommentTypeID));
            foreach ($predefinedCommentIDs as $predefinedCommentID) {
                $dictionaryID = $this->_getDictionaryID(
                    'PREDEFINED_COMMENT',
                    $CommentTypeID,
                    $scan_type,
                    $predefinedCommentID
                );
                $CandidateData[$dictionaryID] = 'No'; //no is default
            }
        }

        foreach ($current_feedback as $CommentTypeID=>$comment) {
            if (array_key_exists("predefined", $comment)) {
                $predefined = $comment['predefined'];
                foreach ($predefined as $key=>$val) {
                    $dictionaryID = $this->_getDictionaryID(
                        'PREDEFINED_COMMENT',
                        $CommentTypeID,
                        $scan_type,
                        $key
                    );
                    $CandidateData[$dictionaryID] = 'Yes';
                }
            }
            if (array_key_exists("text", $comment)) {
                $dictionaryID = $this->_getDictionaryID(
                    'COMMENT',
                    $CommentTypeID,
                    $scan_type
                );
                $CandidateData[$dictionaryID] = $comment['text'];
            }
        }

        return $CandidateData;
    }

    /**
     * Updates DQT with the new data
     *
     * @param array $data      Candidate data to be updated
     * @param array $ScanTypes All selected scan types in the database
     *
     * @return void
     */
    function updateCandidateDocs($data, $ScanTypes)
    {
        foreach ($data as $row) {
            $doc        = $row;
            $identifier = [
                $row['PSCID'],
                $row['Visit_label'],
            ];
            $docid      = 'MRI_Files:' . join('_', $identifier);
            unset($doc['PSCID']);
            unset($doc['Visit_label']);
            unset($doc['SessionID']);

            $success = $this->CouchDB->replaceDoc(
                $docid,
                [
                    'Meta' => [
                        'DocType'    => 'mri_data',
                        'identifier' => $identifier,
                    ],
                    'data' => $doc,
                ]
            );
            print $docid . ": " . $success . "\n";

        }
        return;
    }

    /**
     * Get Scan types
     *
     * @return array
     */
    public function getScanTypes()
    {

        $ScanTypes = $this->SQLDB->pselect(
            "SELECT DISTINCT msc.Scan_type as ScanType, f.AcquisitionProtocolID
             FROM mri_scan_type msc
             JOIN files f ON msc.ID= f.AcquisitionProtocolID
             JOIN files_qcstatus fqc ON f.FileID=fqc.FileID
             ORDER BY f.AcquisitionProtocolID",
            []
        );

        return $ScanTypes;
    }

    /**
     * Get Candidate Data
     *
     * @param array $ScanTypes list of scan types
     *
     * @return array
     */
    public function getCandidateData($ScanTypes)
    {
        $query         = $this->_generateCandidatesQuery($ScanTypes);
        $CandidateData = $this->SQLDB->pselect($query, []);
        foreach ($CandidateData as &$row) {
            foreach ($ScanTypes as $scanType) {
                $scan_type = $scanType['ScanType'];
                if (!empty($row['Selected_' . $scan_type])) {
                    $fileID = $this->SQLDB->pselectOne(
                        "SELECT FileID FROM files WHERE BINARY File=:fname",
                        ['fname' => $row['Selected_' . $scan_type]]
                    );
                    if (!empty($fileID)) {
                        $FileObj            = new MRIFile($fileID);
                        $mri_header_results = $this->_addMRIHeaderInfo(
                            $FileObj,
                            $scan_type
                        );

                        $row = array_merge(
                            $row,
                            $mri_header_results
                        );

                        // instantiate feedback mri object

                        $mri_feedback     = new FeedbackMRI(
                            $fileID,
                            new \SessionID($row['SessionID'])
                        );
                        $current_feedback = $mri_feedback->getComments();
                        $mri_qc_results   = $this->_addMRIFeedback(
                            $current_feedback,
                            $scan_type,
                            $mri_feedback
                        );

                        $row = array_merge($row, $mri_qc_results);
                    }
                }
            }
        }
        return $CandidateData;
    }

    /**
     * Builds data dictionary for given scan types
     *
     * Every kind of information that be entered via the MRI feedback panel has to go
     * into the data dictionary. The MRI feedback panel allows a user to enter
     * various types of comments for a given scan. For each of these comment types
     * (listed in table feedback_mri_comment_types), we have:
     *
     * - A comment status field (column CommentStatusField in table
     *   feedback_mri_comment_types) which can have a fixed set of values.
     *   For example, for comments of types 'Dominant Direction Artifact (DWI ONLY)'
     *   the status field is 'Color_Artifact' and can have values "Good", "Fair",
     *   "Poor" or "Unacceptable"
     * - A free form text comment that can be entered for that comment type
     *   (these go into column Comment of table feedback_mri_comment). On the
     *   feedback panel, you enter these in the various multi-line text fields, one
     *   for each comment type.
     * - Various predefined comments associated to that comment type
     *   (these are defined in feedback_mri_predefined_comment_types). These
     *   are the numerous checkboxes that you find on the feedback panel. For
     *   example, for comments of type 'Dominant Direction Artifact (DWI ONLY)', you
     *   have predefined comments 'red artifact', 'green artifact' and
     *   'blue artifact'. These are either turned on or off via a checkbox to
     *   indicate whether that predefined comment applies to that comment type.
     *
     * @param array $types list of scan types
     *
     * @return void
     */
    private function _buildDataDictionary($types)
    {
        $this->_Dictionary = [
            'QCComment' => [
                'Type'        => 'varchar(255)',
                'Description' => 'QC Comment for Session',
            ]
        ];

        foreach ($types as $type) {
            $ScanType = $type['ScanType'];

            $SelectedArray = [
                'Type'        => 'varchar(255)',
                'Description' => "Selected $ScanType file for session",
                'IsFile'      => true,
            ];
            $QCStatusArray = [
                'Type'        => "enum('Pass', 'Fail')",
                'Description' => "QC Status for $ScanType file",
            ];

            $this->_Dictionary["Selected_$ScanType"]    = $SelectedArray;
            $this->_Dictionary[$ScanType . "_QCStatus"] = $QCStatusArray;

            foreach ($this->_getFeedbackMRICommentTypes() as
                     $CommentTypeID => $comments
            ) {
                $commentStatusField
                    = $this->_getFeedbackMRICommentTypesStatusField($CommentTypeID);
                if ($commentStatusField) {
                    $commentsValues       = !is_array($comments['values'])
                        ? [$comments['values']] : $comments['values'];
                    $dictionaryType       = sprintf(
                        "enum ('%s')",
                        implode("','", $commentsValues)
                    );
                    $dictionaryID         = $this->_getDictionaryID(
                        'COMMENT_STATUS_FIELD',
                        $CommentTypeID,
                        $ScanType
                    );
                    $dictionaryProperties = [
                        'Type'        => $dictionaryType,
                        'Description' => "$commentStatusField $ScanType",
                    ];

                    $this->_Dictionary[$dictionaryID] = $dictionaryProperties;
                }

                $dictionaryID         = $this->_getDictionaryID(
                    'COMMENT',
                    $CommentTypeID,
                    $ScanType
                );
                $dictionaryProperties = [
                    'Type'        => 'varchar(255)',
                    'Description' => "Comment $commentStatusField $ScanType",
                ];
                $this->_Dictionary[$dictionaryID] = $dictionaryProperties;

                $preDefinedComments = $this->_getPredefinedComments($CommentTypeID);
                foreach (
                    $preDefinedComments as
                    $preDefinedCommentTypeID => $preDefinedComment
                ) {
                    // This is the actual text associated with the predefined comment
                    $preDefCmt = $preDefinedComment['Comment'];

                    // ID in the dictionary for this predefined comment
                    $dictionaryID = $this->_getDictionaryID(
                        'PREDEFINED_COMMENT',
                        $CommentTypeID,
                        $ScanType,
                        $preDefinedCommentTypeID
                    );

                    // Properties in the dictionary for this predefined comment
                    $dictionaryProperties = [
                        'Type'        => "enum('Yes', 'No')",
                        'Description' => "$preDefCmt $ScanType",
                    ];

                    // Update the dictionary
                    $this->_Dictionary[$dictionaryID] = $dictionaryProperties;
                }
            }

            $mri_array = [
                'ScannerID'           => 'Scanner ID',
                'Pipeline'            => 'Pipeline',
                'OutputType'          => 'Output Type',
                'AcquisitionProtocol' => 'Protocol',
                'CoordinateSpace'     => 'Space',
                'Algorithm'           => 'Algorithm',
                'AcquisitionDate'     => 'Acquisition Date',
                'FileInsertDate'      => 'Insert date',
                'SeriesDescription'   => 'Series Description',
                'SeriesNumber'        => 'Series Number',
                'EchoTime'            => 'Echo Time',
                'RepetitionTime'      => 'Repetition Time',
                'SliceThickness'      => 'Slice Thickness',
                'Time'                => 'No of volumes',
                'Comment'             => 'Comment',
                'SlicewiseRejected'   => 'Slicewise correlations (Nb)',
                'InterlaceRejected'   => 'Interlace correlations (Nb)',
                'IntergradientReject' => 'Gradient-wise correlations (Nb)',
                'TotalRejected'       => 'No. of rejected directions',
                'Caveat'              => 'Caveat',
                'ProcessingPipeline'  => 'Processing Pipleline',
            ];

            $this->mri_header_fields = $mri_array;
            foreach ($this->mri_header_fields as $field => $desc) {
                $mri_field = $field . "_$ScanType";
                $this->_Dictionary[$mri_field] = [
                    'Type'        => "varchar(255)",
                    'Description' => $desc . " $ScanType",
                ];
            }
        }
    }

    /**
     * Gets the ID in $this->_Dictionary for a database entity of a given type.
     *
     * @param $type                string one of 'COMMENT_STATUS_FIELD', 'COMMENT'
     *                             or 'PREDEFINED_COMMENT'.
     * @param $commentTypeID       int    the comment type ID associated
     *                             to the entity.
     * @param $scanType            string scan type associated to the dictionary
     *                             object.
     * @param $predefinedCommentID int    ID of the predefined comment type, if any.
     *
     * @return string the computed dictionary ID.
     */
    function _getDictionaryID(
        string $type,
        int $commentTypeID,
        string $scanType,
        int $predefinedCommentID = null
    ) : string {
        switch ($type) {
        case 'COMMENT_STATUS_FIELD':
            $statusField = $this-> _getFeedbackMRICommentTypesStatusField(
                $commentTypeID
            );
            return "{$statusField}_$scanType";
        case 'COMMENT':
            $statusField = $this-> _getFeedbackMRICommentTypesStatusField(
                $commentTypeID
            );
            return $statusField
                ? "Comment_{$statusField}_$scanType" : "Comment_overall_$scanType";
        case 'PREDEFINED_COMMENT':
            $predefinedComments = $this->_getPredefinedComments($commentTypeID);
            $predefinedComment  = $predefinedComments[$predefinedCommentID];
            return "PredefinedComment_{$predefinedComment['Comment']}_$scanType";
        }

        // If we end up here, the type passed as argument is invalid
        throw new LorisException(
            "Cannot compute dictionary ID: Unknown entity type $type.\n"
        );
    }

    /**
     * Gets the status field for an entry in table feedback_mri_comment_type.
     *
     * @param $commentTypeID int ID of the comment type.
     *
     * @return string status field for the comment type passed in argument.
     */
    function _getFeedbackMRICommentTypesStatusField(int $commentTypeID) : string
    {
        $feedbackMRIComment = $this->_getFeedbackMRICommentTypes()[$commentTypeID];

        return $feedbackMRIComment['name'] != 'Overall'
            ? $feedbackMRIComment['field'] : '';
    }

    /**
     * Gets all records in table feedback_mri_comment_type.
     *
     * @return array all comment types.
     */
    function _getFeedbackMRICommentTypes() : array
    {
        if (!$this->FeedbackMRICommentTypes) {
            $feedbackMRI = new FeedbackMRI(1, null);
            $this->FeedbackMRICommentTypes = $feedbackMRI->getAllCommentTypes();
        }

        return $this->FeedbackMRICommentTypes;
    }

    /**
     * Gets all the predefined comments for a specific comment type.
     *
     * @param $commentTypeID int ID of the comment type.
     *
     * @return array all predefined comments for the comment ID.
     */
    function _getPredefinedComments(int $commentTypeID) : array
    {
        $feedbackMRI = new FeedbackMRI(1, null);
        return $feedbackMRI->getAllPredefinedComments($commentTypeID);
    }
}
