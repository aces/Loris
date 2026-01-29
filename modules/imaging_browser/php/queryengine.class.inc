<?php declare(strict_types=1);

namespace LORIS\imaging_browser;

use \LORIS\Data\Dictionary\DictionaryItem;
use \LORIS\Data\Scope;
use \LORIS\Data\Cardinality;

/**
 * {@inheritDoc}
 *
 * @license http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */
class QueryEngine extends \LORIS\Data\Query\SQLQueryEngine
{
    // Index of the data type in the arrays contained in $FILE_DICTIONARY_ITEMS
    const FDI_DATA_TYPE_IDX = 0;
    // Index of the info to select in the arrays contained in $FILE_DICTIONARY_ITEMS
    const FDI_SELECT_IDX = 1;
    // Index of the description in the arrays contained in $FILE_DICTIONARY_ITEMS
    const FDI_DESCRIPTION_IDX = 2;

    // Properties of all fields that are stored in the data dictionary as
    // LocationDictionaryItem. The information in this array is used to create the
    // item and to build the SQL query used to fetch the field value in the DB.
    const FILE_DICTIONARY_ITEMS = [
        'file'            => [
            'StringType', 'File', 'acquisition file path'
        ],
        'OutputType'      => [
            'StringType', 'OutputType', 'acquisition output type'
        ],
        'Pipeline'        => [
            'StringType', 'SourcePipeline', 'acquisition source pipeline'
        ],
        'ScannerID'       => [
            'IntegerType', 'ScannerID', 'acquisition scanner ID'
        ],
        'FileInsertDate'  => [
            'DateType',
            'FROM_UNIXTIME(InsertTime,"%Y-%m-%d")',
            'acquisition file insert date'
        ],
        'Caveat'          => [
            'IntegerType', 'Caveat', 'acquisition caveat'
        ],
        'url'             => [
            'URI', 'File', 'acquisition file URL'
        ],
        'CoordinateSpace' => [
            'StringType', 'CoordinateSpace', 'acquisition coordinate space'
        ]
    ];

    // Index of the data type in the arrays contained in
    // $PARAMETER_DICTIONARY_ITEMS
    const PDI_DATA_TYPE_IDX = 0;
    // Index of the parameter name in the arrays contained in
    // $PARAMETER_DICTIONARY_ITEMS
    const PDI_PARAMETER_NAME_IDX = 1;
    // Index of the info to select in the arrays contained in
    // $PARAMETER_DICTIONARY_ITEMS
    const PDI_SELECT_IDX = 2;
    // Index of the description in the arrays contained in
    // $PARAMETER_DICTIONARY_ITEMS
    const PDI_DESCRIPTION_IDX = 3;

    // Properties of all fields that are stored in the data dictionary as
    // ParameterDictionaryItem. The information in this array is used to create the
    // item and to build the SQL query used to fetch the field value in the DB.
    const PARAMETER_DICTIONARY_ITEMS = [
        'AcquisitionDate'       => [
            'StringType',
            'acquisition_date',
            'DATE_FORMAT(pf.value, "%Y-%m-%d")',
            'acquisition date'
        ],
        // CouchDB_MRI_Importer gets this from table files but I think
        // it's better to get it from table parameter_file
        'AcquisitionProtocol'   => [
            'StringType', 'acquisition:protocol', 'pf.value', 'acquisition protocol'
        ],
        'Algorithm'             => [
            'StringType', 'Algorithm', 'pf.value', 'algorithm'
        ],
        'SeriesDescription'     => [
            'StringType', 'series_description', 'pf.value', 'series description'
        ],
        'SeriesNumber'          => [
            'IntegerType', 'series_number', 'pf.value', 'series number'
        ],
        'EchoTime'              => [
            'DecimalType', 'echo_time', 'ROUND(1000 * pf.value, 2)', 'echo time'
        ],
        'RepetitionTime'        => [
            'DecimalType',
            'repetition_time',
            'ROUND(1000 * pf.value, 2)',
            'repetition time (TR)'
        ],
        'SliceThickness'        => [
            'DecimalType',
            'slice_thickness',
            'ROUND(1000 * pf.value, 2)',
            'slice thickness'
        ],
        'Time'                  => [
            'DecimalType',
            'time',
            'ROUND(1000 * pf.value, 2)',
            'time (No of volumes)'
        ],
        // I put 'acquisition:comment' as the parameter name but
        // CouchDB_MRI_Importer has 'Comment' which does not seem to exist
        // anywhere...
        'Comment'               => [
            'StringType', 'acquisition:comment', 'pf.value', 'acquisition comment'
        ],
        // List of directions obtained for SlicewiseRejected is not sorted as in
        // CouchDB_MRI_Importer
        'SlicewiseRejected'     => [
            'StringType',
            'processing:slicewise_rejected',
            'IF(
                 pf.Value LIKE "%(%",
                 SUBSTR(pf.Value, 1, POSITION("(" in pf.Value) - 1),
                 pf.Value
            )',
            'slicewise rejected'
        ],
        // List of directions obtained for InterlaceRejected is not sorted as in
        // CouchDB_MRI_Importer
        'InterlaceRejected'     => [
            'StringType',
            'processing:interlace_rejected',
            'IF(
                 pf.Value LIKE "%(%",
                 SUBSTR(pf.Value, 1, POSITION("(" in pf.Value) - 1),
                 pf.Value
            )',
            'interlace rejected'
        ],
        // List of directions obtained for IntergradientRejected is not sorted as in
        // CouchDB_MRI_Importer
        'IntergradientRejected' => [
            'StringType',
            'processing:intergradient_rejected',
            'IF(
                 pf.Value LIKE "%(%",
                 SUBSTR(pf.Value, 1, POSITION("(" in pf.Value) - 1),
                 pf.Value
            )',
            'intergradient rejected'
        ],
        // List of directions obtained for TotalRejected is not sorted as in
        // CouchDB_MRI_Importer
        'TotalRejected'         => [
            'StringType',
            'processing:total_rejected',
            'IF(
                 pf.Value LIKE "%(%",
                 SUBSTR(pf.Value, 1, POSITION("(" in pf.Value) - 1),
                 pf.Value
            )',
            'total rejected'
        ],
        'ProcessingPipeline'    => [
            'StringType', 'processing:pipeline', 'pf.value', 'processing pipeline'
        ]
    ];

    protected $baseURL;

    /**
     * {@inheritDoc}
     *
     * @param \LORIS\LorisInstance $loris The LORIS instance being queried
     */
    public function __construct(protected \LORIS\LorisInstance $loris)
    {
        $factory       = \NDB_Factory::singleton();
        $this->baseURL = $factory->settings()->getBaseURL();
    }

    /**
     * {@inheritDoc}
     *
     * @return \LORIS\Data\Dictionary\Category[]
     */
    public function getDataDictionary() : iterable
    {
        $scope  = new Scope(Scope::SESSION);
        $images = new \LORIS\Data\Dictionary\Category(
            "Images",
            "Image Acquisitions",
        );
        $items  = [
            new DictionaryItem(
                "ScanDone",
                "Does the session have any imaging scan done?",
                $scope,
                new \LORIS\Data\Types\BooleanType(),
                new Cardinality(Cardinality::SINGLE),
            ),
        ];

        $scantypes = \Utility::getScanTypeList();
        foreach ($scantypes as $ScanType) {
            foreach (self::FILE_DICTIONARY_ITEMS as $field => $properties) {
                $fullyQualifiedType
                    = '\LORIS\Data\Types\\' . $properties[self::FDI_DATA_TYPE_IDX];
                $items[]            = new LocationDictionaryItem(
                    sprintf("%s_%s", $ScanType, $field),
                    sprintf(
                        "%s %s",
                        $ScanType,
                        $properties[self::FDI_DESCRIPTION_IDX]
                    ),
                    $scope,
                    new $fullyQualifiedType(),
                    new Cardinality(Cardinality::MANY),
                    $ScanType,
                );
            }

            foreach (self::PARAMETER_DICTIONARY_ITEMS as $fieldName => $properties) {
                $fullyQualifiedType
                    = '\LORIS\Data\Types\\' . $properties[self::PDI_DATA_TYPE_IDX];
                $items[]            = new ParameterDictionaryItem(
                    sprintf('%s_%s', $ScanType, $fieldName),
                    sprintf(
                        '%s %s',
                        $ScanType,
                        $properties[self::PDI_DESCRIPTION_IDX]
                    ),
                    $scope,
                    new $fullyQualifiedType(),
                    new Cardinality(Cardinality::MANY),
                    $ScanType,
                );
            }
            // TODO: Investigate adding a file scope instead of having this apply
            // on a session scope with a Many cardinality.
            $items[] = new QCDictionaryItem(
                $ScanType  . "_QCStatus",
                "Quality control status for $ScanType acquisition",
                $scope,
                new \LORIS\Data\Types\Enumeration("Pass", "Fail"),
                new Cardinality(Cardinality::MANY),
                $ScanType,
            );
            $items[] = new QCDictionaryItem(
                $ScanType . "_Selected",
                "Selected file for $ScanType for session",
                $scope,
                new \LORIS\Data\Types\Enumeration("true", "false"),
                new Cardinality(Cardinality::MANY),
                $ScanType,
            );

            // All MRI comment types
            $allCommentTypes
                = \FeedbackMRI::getAllCommentTypesForObjectType('volume');
            foreach ($allCommentTypes as $commentTypeID => $commentProperties) {
                if ($commentProperties['name'] != 'Overall') {
                    //--------------------------------------------------//
                    // Value of feedback for that specific comment type //
                    //--------------------------------------------------//
                    $items[] = new MRIFeedbackDictionaryItem(
                        "{$ScanType}_feedback_{$commentProperties['field']}",
                        "Value for {$commentProperties['name']} in the MRI"
                        . " feedback form for $ScanType acquisitions",
                        $scope,
                        new \LORIS\Data\Types\Enumeration(
                            ...$commentProperties['values']
                        ),
                        new Cardinality(Cardinality::MANY),
                        $ScanType,
                        $commentProperties['field']
                    );

                    //--------------------------------------------------------//
                    // Values of all the predefined comments for this comment //
                    // type.                                                  //
                    //--------------------------------------------------------//
                    $predefinedComments
                        = \FeedbackMRI::getAllPredefinedComments($commentTypeID);
                    foreach ($predefinedComments as $ID => $predefinedComment) {
                        $items[] = new MRIPredefinedCommentDictionaryItem(
                            "{$ScanType}_{$predefinedComment['Comment']}",
                            "'{$predefinedComment['FullComment']}' in the MRI "
                            . "feedback form is checked for $ScanType acquisitions",
                            $scope,
                            new \LORIS\Data\Types\Enumeration('Yes', 'No'),
                            new Cardinality(Cardinality::MANY),
                            $ScanType,
                            $ID
                        );
                    }
                }

                //------------------------------------------------//
                // Free form text comment for  this comment type  //
                //------------------------------------------------//
                $itemDescription = "Comment in section"
                                 . "'{$commentProperties['name']}' of the MRI"
                                 . " feedback form for $ScanType acquisitions";
                $items[]         = new MRICommentDictionaryItem(
                    "{$ScanType}_comment_{$commentProperties['field']}",
                    $itemDescription,
                    $scope,
                    new \LORIS\Data\Types\StringType(),
                    new Cardinality(Cardinality::MANY),
                    $ScanType,
                    $commentProperties['name']
                );
            }
        }

        $images = $images->withItems($items);

        return [$images];
    }

    /**
     * {@inheritDoc}
     *
     * @param \LORIS\Data\Dictionary\Category       $inst The item category
     * @param \LORIS\Data\Dictionary\DictionaryItem $item The item itself
     *
     * @return string[]
     */
    public function getVisitList(
        \LORIS\Data\Dictionary\Category $inst,
        \LORIS\Data\Dictionary\DictionaryItem $item
    ) : iterable {
        if ($item->getScope()->__toString() !== 'session') {
            return [];
        }

        if ($item instanceof ImagingDictionaryItem) {
            $DB     = \NDB_Factory::singleton()->database();
            $visits = $DB->pselectCol(
                "SELECT DISTINCT s.Visit_label
                FROM files f
                    JOIN session s ON (f.SessionID=s.ID)
                    JOIN candidate c ON (c.ID=s.CandidateID)
                    JOIN mri_scan_type mst ON (mst.MriScanTypeID=f.MriScanTypeID)
                WHERE
                    c.Active='Y' AND
                    s.Active='Y' AND
                    mst.MriScanTypeName=:scantype AND
                    c.Entity_Type='Human'
                ORDER BY s.Visit_label",
                ['scantype' => $item->getModality()],
            );
            return $visits;
        }

        $user = \NDB_Factory::singleton()->user();

        // Fall back on user visits if something ends up getting
        // added that we can't derive the modality of.
        return array_keys($user->getVisits());
    }

    /**
     * {@inheritDoc}
     *
     * @param \LORIS\Data\Dictionary\DictionaryItem $item - the field
     *
     * @return string
     */
    protected function getFieldNameFromDict(
        \LORIS\Data\Dictionary\DictionaryItem $item
    ): string {
        if ($item->getName() == 'ScanDone') {
            $this->addTable('LEFT JOIN session s ON (s.CandidateID=c.ID)');
            return "(
                EXISTS (SELECT 1 FROM files      f2 WHERE f2.SessionID = s.ID)
             OR EXISTS (SELECT 1 FROM mri_upload m2 WHERE m2.SessionID = s.ID)
             OR EXISTS (SELECT 1 FROM tarchive   t2 WHERE t2.SessionID = s.ID)
            )";
        }

        if (!($item instanceof ImagingDictionaryItem)) {
            throw new \DomainException(
                "Item is not an instance of ImagingDictionaryItem"
            );
        }

        $modality = $item->getModality();

        // $field = whatever's after the first underscore
        $field = substr($item->getName(), strpos($item->getName(), '_') + 1);

        $this->addTable('LEFT JOIN session s ON (s.CandidateID=c.ID)');
        $this->addTable("LEFT JOIN files ON (s.ID=files.SessionID)");

        if ($item instanceof LocationDictionaryItem) {
            if ($field == 'url') {
                return "(SELECT CONCAT(
                            \"$this->baseURL\",
                            \"/api/v0.0.3/candidates/\",
                            c.CandID,
                            \"/\",
                            s.Visit_label,
                            \"/images/\",
                            SUBSTRING_INDEX(files.File, '/', -1)
                            ) FROM files as files2
                            JOIN mri_scan_type mst
                                ON (files2.MriScanTypeID=mst.MriScanTypeID)
                            WHERE files2.FileID=files.FileID
                                AND mst.MriScanTypeName='{$modality}')";
            } else {
                $fdi = self::FILE_DICTIONARY_ITEMS[$field];
                // Because of complex interactions between joins that get
                // out of hand when a scan type that doesn't exist is selected
                // alongside one that does, we use a subselect here.
                return sprintf(
                    "(SELECT %s FROM files as files2
                      JOIN mri_scan_type mst
                          ON (files2.MriScanTypeID=mst.MriScanTypeID)
                      WHERE files2.FileID=files.FileID
                          AND mst.MriScanTypeName='%s')
                    ",
                    $fdi[self::FDI_SELECT_IDX],
                    $modality
                );
            }
        }

        if ($item instanceof QCDictionaryItem) {
            return "(SELECT $field FROM files_qcstatus fqs
                     JOIN files as files2
                         ON (fqs.FileID=files2.FileID)
                     JOIN mri_scan_type mst
                         ON (files2.MriScanTypeID=mst.MriScanTypeID)
                     WHERE files2.FileID=files.FileID
                         AND mst.MriScanTypeName='{$modality}')";
        }

        if ($item instanceof ParameterDictionaryItem) {
            $pdi = self::PARAMETER_DICTIONARY_ITEMS[$field];
            return sprintf(
                "(SELECT %s FROM files as files2
                  JOIN mri_scan_type mst
                      ON (files2.MriScanTypeID=mst.MriScanTypeID)
                  JOIN parameter_file pf
                      ON (pf.FileID=files2.FileID)
                  JOIN parameter_type pt
                      ON (pt.ParameterTypeID=pf.ParameterTypeID AND pt.name='%s')
                  WHERE files2.FileID=files.FileID
                      AND mst.MriScanTypeName='%s'
                )",
                $pdi[self::PDI_SELECT_IDX],
                $pdi[self::PDI_PARAMETER_NAME_IDX],
                $modality,
            );
        }

        if ($item instanceof MRIFeedbackDictionaryItem) {
            return sprintf(
                "(SELECT pf.Value FROM files AS files2
                  JOIN parameter_file pf
                      ON (pf.FileID=files2.FileID)
                  JOIN parameter_type pt
                      ON (pt.ParameterTypeID=pf.ParameterTypeID AND pt.Name='%s')
                  JOIN mri_scan_type mst
                      ON (files2.MriScanTypeID=mst.MriScanTypeID)
                  WHERE files2.FileID=files.FileID
                      AND mst.MriScanTypeName='%s'
                )",
                $item->getParameterTypeName(),
                $modality
            );
        }

        if ($item instanceof MRICommentDictionaryItem) {
            return sprintf(
                "(SELECT fmc.Comment FROM files AS files2
                  JOIN feedback_mri_comments fmc
                      ON (fmc.FileID=files2.FileID)
                  JOIN feedback_mri_comment_types fmct
                      ON (fmc.CommentTypeID=fmct.CommentTypeID)
                  JOIN mri_scan_type mst
                      ON (files2.MriScanTypeID=mst.MriScanTypeID)
                  WHERE files2.FileID=files.FileID
                      AND fmct.CommentName='%s'
                      AND mst.MriScanTypeName='%s'
                      AND fmc.Comment IS NOT NULL
                )",
                $item->getCommentName(),
                $modality
            );
        }

        if ($item instanceof MRIPredefinedCommentDictionaryItem) {
            return sprintf(
                "(SELECT 'Yes' FROM files AS files2
                  JOIN feedback_mri_comments fmc
                      ON (fmc.FileID=files2.FileID)
                  JOIN feedback_mri_predefined_comments fmpc
                      ON (fmc.PredefinedCommentID=fmpc.PredefinedCommentID)
                  JOIN mri_scan_type mst
                      ON (files2.MriScanTypeID=mst.MriScanTypeID)
                  WHERE files2.FileID=files.FileID
                      AND mst.MriScanTypeName='%s'
                      AND fmpc.PredefinedCommentID=%d
                )",
                $modality,
                $item->getPredefinedCommentID()
            );
        }

        throw new \DomainException("Invalid field " . $item->getName());
    }

    /**
     * {@inheritDoc}
     *
     * @param \LORIS\Data\Dictionary\DictionaryItem $item - The field
     *
     * @return string
     */
    public function getCorrespondingKeyFieldType(
        \LORIS\Data\Dictionary\DictionaryItem $item
    ) : string {
        return "Imaging Filename";
    }

    /**
     * {@inheritDoc}
     *
     * @param \LORIS\Data\Dictionary\DictionaryItem $item - The field
     *
     * @return string
     */
    public function getCorrespondingKeyField(
        \LORIS\Data\Dictionary\DictionaryItem $item
    ) {
        if ($item instanceof LocationDictionaryItem
            || $item instanceof QCDictionaryItem
            || $item instanceof ParameterDictionaryItem
            || $item instanceof MRIFeedbackDictionaryItem
            || $item instanceof MRICommentDictionaryItem
            || $item instanceof MRIPredefinedCommentDictionaryItem
        ) {
            $this->addTable('LEFT JOIN session s ON (s.CandidateID=c.ID)');
            $this->addTable("LEFT JOIN files ON (s.ID=files.SessionID)");
            return "SUBSTRING_INDEX(files.File, '/', -1)";
        }
        throw new \Exception(
            "Unhandled Cardinality::MANY field " . $item->getName()
        );
    }
}
