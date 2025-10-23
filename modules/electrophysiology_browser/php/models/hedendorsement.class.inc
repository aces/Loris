<?php declare(strict_types=1);

namespace LORIS\electrophysiology_browser\Models;

/**
 * This class obtains HED endorsements
 *
 * @category Electrophysiology
 * @package  Electrophysiology
 * @author   Loris Team <loris.mni@bic.mni.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class HEDEndorsement
{
    protected int $_physioFileID;

    /**
     * Construct an HEDEndorsement object
     *
     * @param integer $physioFileID Electrophysiological file ID
     *                              to collect HED endorsements
     */
    function __construct(int $physioFileID)
    {
        $this->_physioFileID = $physioFileID;
    }

    /**
     * Get instance-level HED endorsements
     *
     * @return array
     */
    public function getIntanceLevelEndorsements(): array
    {
        $db = \NDB_Factory::singleton()->database();

        $hed_endorsements = $db->pselect(
            'SELECT hte.*, endorser.ID AS EndorsedByID,
       endorser.First_name AS FirstName, endorser.Last_name AS LastName
        FROM hed_tag_endorsement AS hte
        LEFT JOIN users AS endorser ON hte.EndorsedBy = endorser.ID
        LEFT JOIN physiological_task_event_hed_rel AS ptehr
         ON hte.HEDRelID = ptehr.ID
        WHERE hte.HEDTable = "physiological_task_event_hed_rel"
        AND EXISTS (
          SELECT 1
            FROM physiological_task_event AS te
            JOIN physiological_event_file AS f
              USING (EventFileID)
            WHERE ptehr.PhysiologicalTaskEventID = te.PhysiologicalTaskEventID
              AND f.PhysiologicalFileID=:PFID
              AND f.FileType="tsv"
        )',
            ['PFID' => $this->_physioFileID]
        );
        return iterator_to_array($hed_endorsements);
    }

    /**
     * Get dataset-level HED endorsements – Note: Session-level not supported
     *
     * @return array
     */
    public function getDatasetLevelEndorsements(): array
    {
        $db = \NDB_Factory::singleton()->database();

        $hed_endorsements = $db->pselect(
            'SELECT hte.*, endorser.ID AS EndorsedByID,
       endorser.First_name AS FirstName, endorser.Last_name AS LastName
        FROM hed_tag_endorsement AS hte
        LEFT JOIN users AS endorser ON hte.EndorsedBy = endorser.ID
        LEFT JOIN bids_event_dataset_mapping AS bedm
         ON hte.HEDRelID = bedm.ID
        WHERE hte.HEDTable = "bids_event_dataset_mapping"
        AND EXISTS (
          SELECT 1
            FROM physiological_task_event AS te
            JOIN physiological_event_file AS f
              USING (EventFileID)
            WHERE bedm.ProjectID = f.ProjectID
              AND f.PhysiologicalFileID=:PFID
              AND f.FileType="tsv"
        )',
            ['PFID' => $this->_physioFileID]
        );
        return iterator_to_array($hed_endorsements);
    }

    /**
     * Insert entry in history table
     *
     * @param array  $insertionFields HED Fields
     * @param int    $endorsementID   EndorsementID
     * @param string $action          DB Action
     *
     * @return void
     */
    protected static function insertHEDEndorsementHistory(
        array  $insertionFields,
        int    $endorsementID,
        string $action,
    ): void {
        $db = \NDB_Factory::singleton()->database();
        $insertionFields['EndorsementID'] =  $endorsementID;
        $insertionFields['Action']        = $action;
        $db->insert('hed_tag_endorsement_history', $insertionFields);
    }

    /**
     * Insert HED tag endorsement
     *
     * @param int           $hedRelID           HedRelID
     * @param string        $hedTable           HedTable
     * @param int           $endorsedBy         EndorsedBy
     * @param string        $endorsementStatus  EndorsementStatus
     * @param string | null $endorsementComment EndorsementComment
     *
     * @return array
     */
    public static function insertHEDEndorsement(
        int           $hedRelID,
        string        $hedTable,
        int           $endorsedBy,
        string        $endorsementStatus,
        string | null $endorsementComment
    ): array {
        $db = \NDB_Factory::singleton()->database();
        $insertionFields = [
            'HEDRelID'           => $hedRelID,
            'HEDTable'           => $hedTable,
            'EndorsedBy'         => $endorsedBy,
            'EndorsementStatus'  => $endorsementStatus,
            'EndorsementComment' => $endorsementComment,
        ];
        $db->insert('hed_tag_endorsement', $insertionFields);
        $endorsementID =  (int) $db->getLastInsertId();
        HEDEndorsement::insertHEDEndorsementHistory(
            $insertionFields,
            $endorsementID,
            'INSERT'
        );
        $endorsementTime = HEDEndorsement::getEndorsementTime($endorsementID);
        return [
            'endorsementID'   => $endorsementID,
            'endorsementTime' => $endorsementTime,
        ];
    }

    /**
     * Insert Dataset tag endorsements
     *
     * @param int           $physioFileID       PhysioFileID
     * @param string        $propertyName       PropertyName
     * @param string        $propertyValue      PropertyValue
     * @param int           $endorserID         EndorserID
     * @param string        $endorsementStatus  EndorsementStatus
     * @param string | null $endorsementComment EndorsementComment
     *
     * @return array
     */
    public static function insertDatasetTagEndorsements(
        int           $physioFileID,
        string        $propertyName,
        string        $propertyValue,
        int           $endorserID,
        string        $endorsementStatus,
        string | null $endorsementComment
    ): array {
        $hedRelIDs       = DatasetTags::getAllHEDTagIDs(
            $physioFileID,
            $propertyName,
            $propertyValue
        );
        $lastEndorsement = [];
        array_map(
            function ($hedRelID) use (
                &$lastEndorsement, $endorserID,
                $endorsementStatus, $endorsementComment
            ) {
                $lastEndorsement = HEDEndorsement::insertHEDEndorsement(
                    (int) $hedRelID['ID'],
                    'bids_event_dataset_mapping',
                    $endorserID,
                    $endorsementStatus,
                    $endorsementStatus === 'Comment'
                    ? $endorsementComment
                    : null
                );
            },
            $hedRelIDs
        );
        return $lastEndorsement;
    }

    /**
     * Get EndorsementTime
     *
     * @param int $endorsementID `hed_tag_endorsement`.ID
     *
     * @return string
     */
    public static function getEndorsementTime(int $endorsementID): string
    {
        $db = \NDB_Factory::singleton()->database();

        return $db->pselectOne(
            'SELECT EndorsedAt
              FROM hed_tag_endorsement
              WHERE ID=:eID',
            ['eID' => $endorsementID]
        ) ?? '';
    }

    /**
     * Delete HED tag endorsement
     *
     * @param int $endorsementID `hed_tag_endorsement`.ID
     *
     * @return void
     */
    public static function deleteHEDEndorsement(int $endorsementID): void
    {
        $db = \NDB_Factory::singleton()->database();

        $endorsement = $db->pselectRow(
            'SELECT *
              FROM hed_tag_endorsement
              WHERE ID=:eID',
            ['eID' => $endorsementID]
        );

        if (!is_null($endorsement)) {
            $insertionFields =  [
                'HEDRelID'           => $endorsement['HEDRelID'],
                'HEDTable'           => $endorsement['HEDTable'],
                'EndorsedBy'         => $endorsement['EndorsedBy'],
                'EndorsementStatus'  => $endorsement['EndorsementStatus'],
                'EndorsementComment' => $endorsement['EndorsementComment'],
            ];

            $db->delete(
                "hed_tag_endorsement",
                ['ID' => $endorsementID]
            );
            HEDEndorsement::insertHEDEndorsementHistory(
                $insertionFields,
                $endorsementID,
                'DELETE'
            );
        }
    }

    /**
     * Get an event's HED endorsements
     *
     * @param string $physiologicalTaskEventID PhysiologicalTaskEventID
     *
     * @return array
     */
    public static function getHEDEndorsements(
        string $physiologicalTaskEventID
    ): array {
        $db = \NDB_Factory::singleton()->database();

        $hed_endorsements = $db->pselect(
            'SELECT hte.*, endorser.ID AS EndorsedByID,
       endorser.First_name AS FirstName, endorser.Last_name AS LastName
        FROM hed_tag_endorsement AS hte
        LEFT JOIN users AS endorser ON hte.EndorsedBy = endorser.ID
        LEFT JOIN physiological_task_event_hed_rel AS ptehr
         ON hte.HEDRelID = ptehr.ID
        WHERE hte.HEDTable = "physiological_task_event_hed_rel"
        AND ptehr.PhysiologicalTaskEventID=:PTEID',
            ['PTEID' => $physiologicalTaskEventID]
        );
        return iterator_to_array($hed_endorsements);
    }
}
