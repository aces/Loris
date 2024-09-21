<?php declare(strict_types=1);
namespace LORIS\electrophysiology_browser\Models;
use DatabaseException;
use Psr\Log\LoggerAwareTrait;

/**
 * This object contains the methods to get
 * Dataset-wide HED tags from the DB
 *
 * @category Electrophysiology
 * @package  Electrophysiology
 * @author   Loris Team <loris.mni@bic.mni.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class DatasetTags
{
    use LoggerAwareTrait;

    private int $_physioFileID;
    private ?int $_projectID;
    private array $_data = [];
    private array $_hedSchema;
    private \LORIS\LorisInstance $loris;

    /**
     * Construct an Event object
     *
     * @param \LORIS\LorisInstance $loris        The LORIS instance that the module
     *                                           is serving.
     * @param integer              $physioFileID Electrophysiological file ID
     *                                           to collect event data from
     */
    function __construct(\LORIS\LorisInstance $loris, int $physioFileID)
    {
        $loglevel     = $loris->getConfiguration()
            ->getLogSettings()
            ->getRequestLogLevel();
        $this->logger = new \LORIS\Log\ErrorLogLogger($loglevel);

        $this->loris         = $loris;
        $this->_physioFileID = $physioFileID;
        $db = $this->loris->getDatabaseConnection();

        // TODO: Instead use schemas in project_schema_rel?
        $this->_hedSchema = iterator_to_array(
            $db->pselect(
                'SELECT * FROM hed_schema_nodes AS hsn
              LEFT JOIN hed_schema AS hs
              ON hsn.SchemaID = hs.ID',
                []
            )
        );

        $this->_projectID = $db->pselectOneInt(
            'SELECT ProjectID FROM session AS s WHERE s.ID = (
              SELECT SessionID FROM physiological_file
              WHERE PhysiologicalFileID=:PFID
          )',
            ['PFID' => $this->_physioFileID]
        );
    }

    /**
     * Fetch and set data for the DatasetTags
     *
     * @return void
     */
    function setData(): void
    {
        $db = $this->loris->getDatabaseConnection();

        $extraColumns = $db->pselect(
            'SELECT
            opt.PropertyName as columnName,
            opt.PropertyValue as columnValue,
            sm.*
        FROM physiological_task_event_opt AS opt
        LEFT JOIN bids_event_dataset_mapping AS sm
        ON sm.PropertyName = opt.PropertyName
        AND sm.PropertyValue = opt.PropertyValue
        WHERE opt.PhysiologicalTaskEventID IN (
          SELECT te.PhysiologicalTaskEventID
          FROM physiological_task_event AS te
          WHERE te.PhysiologicalFileID IN (
            SELECT pf.PhysiologicalFileID
            FROM physiological_file AS pf
            WHERE pf.SessionID IN (
              SELECT ID FROM session
              WHERE ProjectID=:PID
            )
          )
        )
        GROUP BY sm.ID, opt.PropertyValue
        ORDER BY opt.PropertyValue ASC, ID DESC',
            ['PID' => $this->_projectID]
        );

        $trialTypes = $db->pselect(
            'SELECT pte.TrialType, sm.*
        FROM (
            SELECT PhysiologicalFileID, TrialType
            FROM physiological_task_event
            WHERE PhysiologicalFileID IN (
              SELECT pf.PhysiologicalFileID
              FROM physiological_file AS pf
              WHERE pf.SessionID IN (
                SELECT ID FROM session
                WHERE ProjectID=:PID
              )
            )
            GROUP BY TrialType
        ) AS pte
        LEFT JOIN bids_event_dataset_mapping AS sm
        ON sm.PropertyName = "TrialType"
        AND sm.PropertyValue = pte.TrialType
        AND sm.ProjectID=:PID
        ORDER BY pte.TrialType ASC, sm.ID DESC',
            ['PID' => $this->_projectID]
        );

        $eventValues = $db->pselect(
            'SELECT pte.EventValue, sm.*
        FROM (
            SELECT PhysiologicalFileID, EventValue
            FROM physiological_task_event
            WHERE PhysiologicalFileID IN (
              SELECT pf.PhysiologicalFileID
              FROM physiological_file AS pf
              WHERE pf.SessionID IN (
                SELECT ID FROM session
                WHERE ProjectID=:PID
              )
            )
            GROUP BY EventValue
        ) AS pte
        LEFT JOIN bids_event_dataset_mapping AS sm
        ON sm.PropertyName = "EventValue"
        AND sm.PropertyValue = pte.EventValue
        AND sm.ProjectID=:PID
        ORDER BY pte.EventValue ASC, sm.ID DESC',
            ['PID' => $this->_projectID]
        );

        $columnMapping = [];
        foreach ($extraColumns as $column) {
            $propertyTags   = [];
            $propertyValues = [];
            if (array_key_exists(strval($column['columnName']), $columnMapping)) {
                $propertyValues = $columnMapping[strval($column['columnName'])];
            }
            if (array_key_exists(strval($column['columnValue']), $propertyValues)) {
                $propertyTags = $propertyValues[strval($column['columnValue'])];
            }
            $propertyTags[] = $column;
            $propertyValues[strval($column['columnValue'])] = $propertyTags;
            $columnMapping[strval($column['columnName'])]   = $propertyValues;
        }

        $trialTypeList = [];
        foreach ($trialTypes as $trialType) {
            $trialTypeTags  = [];
            $trialTypeValue = strval($trialType['TrialType']);
            if (array_key_exists($trialTypeValue, $trialTypeList)) {
                $trialTypeTags = $trialTypeList[$trialTypeValue];
            }
            $trialTypeTags[] = $trialType;
            $trialTypeList[$trialTypeValue] = $trialTypeTags;
        }

        $eventValueList = [];
        foreach ($eventValues as $eventValue) {
            $eventValueTags = [];
            $eventValueStr  = strval($eventValue['EventValue']);
            if (array_key_exists($eventValueStr, $eventValueList)) {
                $eventValueTags = $eventValueList[$eventValueStr];
            }
            $eventValueTags[] = $eventValue;
            $eventValueList[$eventValueStr] = $eventValueTags;
        }

        // This would overwrite customs
        $columnMapping['TrialType']  = $trialTypeList;
        $columnMapping['EventValue'] = $eventValueList;

        $this->_data = $columnMapping;
    }

    /**
     * Get data for the DatasetTags
     *
     * @return array The data array
     */
    function getData(): array
    {
        if (!$this->_data) {
            $this->setData();
        }
        return $this->_data;
    }

    /**
     * Updates bids_event_dataset_mapping table when there is a POST request.
     *
     * @param array $addedTags   Added tag data
     * @param array $deletedTags Deleted tag data
     * @param array $editedTags  Edited tag data
     *
     * @return array ID mapping for addedTags
     * @throws DatabaseException
     */
    function update(
        array $addedTags,
        array $deletedTags,
        array $editedTags,
    ): array {
        $user = \User::singleton();
        $db   = $this->loris->getDatabaseConnection();

        $addedTagIDs = [];
        if ($user->hasPermission('electrophysiology_browser_edit_annotations')) {

            // TODO: VALIDATE HED

            // TODO: FIRST RESOLVE RESOLVED TAGS [new field] -- assume all individual

            foreach ($deletedTags as $deletedTag) {
                try {
                    if (is_null($deletedTag['PairRelID'])) {
                        $db->delete(
                            'bids_event_dataset_mapping',
                            ['ID' => $deletedTag['ID']]
                        );
                    } else {
                        throw new \LorisException(
                            "Tried deleting tag from " .
                            "an undissolved group. Tag ID: {$deletedTag['ID']}"
                        );
                    }
                } catch (\LorisException $le) {
                    $this->logger->log(
                        \Psr\Log\LogLevel::ERROR,
                        "Failed to delete HED tag: {$le->getMessage()}"
                    );
                }
            }

            // Tags arrive pre-sorted so that PairRelIDs always exist
            foreach ($addedTags as $addedTag) {
                if (true) { // TODO: Some validation
                    $freshPairRelID = null;
                    if ($this->arrayAny(
                        $addedTagIDs,
                        function ($t) use ($addedTag, &$freshPairRelID) {
                            if ($t['AddID'] == $addedTag['PairRelID']) {
                                $freshPairRelID = $t['RelID'];
                                return true;
                            }
                            return false;
                        }
                    )
                    ) {
                        $addedTag['PairRelID'] = $freshPairRelID;
                    }
                    $db->insert(
                        'bids_event_dataset_mapping',
                        [
                            'ProjectID'         => $this->_projectID,
                            'PropertyName'      => $addedTag['PropertyName'],
                            'PropertyValue'     => $addedTag['PropertyValue'],
                            'HEDTagID'          => $addedTag['HEDTagID'],
                            'TagValue'          => $addedTag['TagValue'],
                            'Description'       => $addedTag['Description'],
                            'HasPairing'        => $addedTag['HasPairing']
                                                    ? '1' : '0',
                            'AdditionalMembers' => $addedTag['AdditionalMembers'],
                            'PairRelID'         => $addedTag['PairRelID'],
                        ],
                    );
                    $addedTagIDs[] = [
                        'RelID' => $db->getLastInsertId(),
                        'AddID' => $addedTag['ID'],
                    ];
                }
            }

            foreach ($editedTags as $editedTag) {
                if (is_null($editedTag['HEDTagID'])
                    && is_null($editedTag['PairRelID'])
                ) {
                    $db->delete(
                        'bids_event_dataset_mapping',
                        ['ID'  => $editedTag['ID']]
                    );
                } else {
                    // Replace PairRelID with DB ID if tag was freshly added
                    foreach ($addedTagIDs as $addedTagID) {
                        if ($addedTagID['AddID'] == $editedTag['PairRelID']) {
                            $editedTag['PairRelID'] = $addedTagID['RelID'];
                            break;
                        }
                    }
                    $db->update(
                        'bids_event_dataset_mapping',
                        [
                            'HasPairing'        => $editedTag['HasPairing'],
                            'AdditionalMembers' => $editedTag['AdditionalMembers'],
                            'PairRelID'         => $editedTag['PairRelID'],
                        ],
                        ['ID'  => $editedTag['ID']]
                    );
                }
            }

            // TODO: Separate update function?
            $db->update(
                'physiological_event_file',
                ['LastUpdate' => date("Y-m-d H:i:s")],
                ['PhysiologicalFileID' => $this->_physioFileID]
            );
        }
        return $addedTagIDs;
    }


    /**
     * Deletes one event's HED tag
     *
     * @param int $physiologicalTaskEventID PhysiologicalTaskEventID
     * @param int $hedTagID                 HEDTagID
     *
     * @return void
     */
    function deleteHEDTag(int $physiologicalTaskEventID, int $hedTagID): void
    {
        $db =  $this->loris->getDatabaseConnection();

        $physioFileID = $db->pselectone(
            'SELECT PhysiologicalFileID
              FROM physiological_task_event
              WHERE PhysiologicalTaskEventID=:taskEventID',
            ['taskEventID' => $physiologicalTaskEventID]
        );

        // TODO: Check that this cascades properly to rel tables
        if ($this->_physioFileID == $physioFileID) {
            $db->delete(
                "physiological_task_event_hed_rel",
                [
                    'PhysiologicalTaskEventID' => $physiologicalTaskEventID,
                    'HEDTagID'                 => $hedTagID
                ]
            );
        }
    }

    /**
     * Build HED string from HED tags
     *
     * @param array $instance_data          Event instance data
     * @param array $instance_extra_columns Extra columns belonging to instance
     * @param array $instance_tags          HED tags belonging to instance
     * @param array $dataset_tags           HED tags belonging to dataset
     *
     * @return string
     */
    function buildHEDString(
        array $instance_data,
        array $instance_extra_columns,
        array $instance_tags,
        array $dataset_tags
    ): string {
        // TODO: Add bids_event_file_mapping
        // Get tags from IDs -- Limited support currently
        $hed_tags = $this->buildHEDTags($instance_tags);

        if (count($instance_data) > 0) {
            // Extra Columns
            foreach ($instance_extra_columns as $extra_column) {
                if (array_key_exists($extra_column['PropertyName'], $dataset_tags)) {
                    $column_values = $dataset_tags[$extra_column['PropertyName']];
                    if (array_key_exists(
                        $extra_column['PropertyValue'],
                        $column_values
                    )
                    ) {
                        $hed_tags = array_merge(
                            $hed_tags,
                            $this->buildHEDTags(
                                $column_values[$extra_column['PropertyValue']]
                            )
                        );
                    }
                }
            }

            // trial_type
            $trial_type_values = $dataset_tags['TrialType'];
            if (array_key_exists($instance_data['TrialType'], $trial_type_values)) {
                $hed_tags = array_merge(
                    $hed_tags,
                    $this->buildHEDTags(
                        $trial_type_values[$instance_data['TrialType']]
                    )
                );
            }

            // value
            $event_values = $dataset_tags['EventValue'];
            if (array_key_exists($instance_data['EventValue'], $event_values)) {
                $hed_tags = array_merge(
                    $hed_tags,
                    $this->buildHEDTags($event_values[$instance_data['EventValue']])
                );
            }
        }

        // Get root tags
        $root_tags = array_filter(
            $hed_tags,
            function ($tag) use ($hed_tags) {
                return !is_null($tag['rel_id']) && !$this->arrayAny(
                    $hed_tags,
                    function ($t) use ($tag) {
                        return $tag['rel_id'] == $t['pair_rel_id'];
                    }
                );
            }
        );

        $tag_names  = [];
        $tag_string = '';

        foreach ($root_tags as $root_tag) {
            $tag_group    = [];
            $group_member = $root_tag;

            while ($group_member && !is_null($group_member['rel_id'])) {
                $tag_group[]  = $group_member;
                $member_pair  = array_values(
                    array_filter(
                        $hed_tags,
                        function ($hed_tag) use ($group_member) {
                            return !is_null($hed_tag['rel_id']) &&
                            $hed_tag['rel_id'] == $group_member['pair_rel_id'];
                        }
                    )
                );
                $group_member = (count($member_pair) == 1)
                ? $member_pair[0]
                : null;
            }

            $subgroup_string = '';

            foreach (array_reverse($tag_group) as $group_tag) {
                if (is_null($group_tag['pair_rel_id'])) {
                    $tag_string = $group_tag['name'] ?? 'n/a';
                } else {
                    try {
                        if ($group_tag['has_pairing'] == 1) {
                            if ($group_tag['additional_members'] > 0
                                || strlen($subgroup_string) == 0
                            ) {
                                $comma_index     = $this
                                    ->getNthTrailingMemberCommaIndex(
                                        $tag_string,
                                        $group_tag['additional_members'] + (
                                        strlen($subgroup_string) > 0 ? 0 : 1
                                        )
                                    );
                                $tag_string      = '(' .
                                    (is_null($group_tag['id'])
                                        ? ''
                                        : ($group_tag['name'] . ', ')
                                    ) .
                                    (strlen($subgroup_string) > 0
                                        ? "$subgroup_string, "
                                        : ''
                                    ) .
                                    substr($tag_string, 0, $comma_index) . ')' .
                                    substr($tag_string, $comma_index);
                                $subgroup_string = '';
                            } else {
                                if (is_null($group_tag['id'])) {
                                    if (strlen($subgroup_string) > 0) {
                                        $subgroup_string = "($subgroup_string)";
                                    } else {
                                        throw new \LorisException(
                                            "Tag not found: " .
                                            json_encode($group_tag)
                                        );
                                    }
                                } else {
                                    if (strlen($subgroup_string) > 0) {
                                        $subgroup_string
                                            = '(' . $group_tag['name'] .
                                            ", $subgroup_string)";
                                    } else {
                                        $tag_string
                                            = '(' . $group_tag['name'] .
                                            ", $tag_string)";
                                    }
                                }
                            }
                        } else {
                            if (strlen($subgroup_string) > 0) {
                                $tag_string = "$subgroup_string, $tag_string";
                            }
                            // Intentional overwrite
                            $subgroup_string = $group_tag['name'];
                        }
                    } catch (\LorisException $le) {
                        $this->logger->log(
                            \Psr\Log\LogLevel::ERROR,
                            "Fatal HED tag error: {$le->getMessage()}"
                        );
                    }
                }
            }
            $tag_names[] = $tag_string;
        }
        // Build String
        return count($tag_names) > 0
        ? implode(', ', $tag_names)
        : 'n/a';
    }


    /**
     * Build HED tags from schema
     *
     * @param array $tags List of tags to build from schema
     *
     * @return array
     */
    function buildHEDTags(array $tags): array
    {
        return array_map(
            function ($tag) {
                $hed_tag = null;
                if (!is_null($tag['HEDTagID'])) {
                    $hed_tag = array_values(
                        array_filter(
                            $this->_hedSchema,
                            function ($node) use ($tag) {
                                return $node['ID'] == $tag['HEDTagID'];
                            }
                        )
                    );
                }
                return [
                    'id'                 => $hed_tag
                                                ? $hed_tag[0]['ID']
                                                : null,
                    'parent_id'          => $hed_tag
                                                ? $hed_tag[0]['ParentID']
                                                : null,
                    'schema_id'          => $hed_tag
                                                ? $hed_tag[0]['SchemaID']
                                                : null,
                    'name'               => $hed_tag
                                                ? $hed_tag[0]['Name']
                                                : '',
                    'long_mame'          => $hed_tag
                                                ? $hed_tag[0]['LongName']
                                                : '',
                    'description'        => $hed_tag
                                                ? $hed_tag[0]['Description']
                                                : '',
                    'value'              => $tag['TagValue'],
                    'has_pairing'        => $tag['HasPairing'],
                    'additional_members' => $tag['AdditionalMembers'],
                    'rel_id'             => $tag['ID'],
                    'pair_rel_id'        => $tag['PairRelID']
                ];
            },
            $tags
        );
    }


    /**
     * Returns true if at least one element satisfies the function's criteria
     *
     * @param array    $array List of elements
     * @param callable $fn    Function which determines criteria satisfaction
     *
     * @return bool
     */
    function arrayAny(array $array, callable $fn): bool
    {
        foreach ($array as $value) {
            if ($fn($value)) {
                return true;
            }
        }
        return false;
    }


    /**
     * Returns index of the Nth member
     *
     * @param string $tag_string HED Tag string
     * @param int    $n          Member index
     *
     * @return int
     */
    public function getNthTrailingMemberCommaIndex(
        string $tag_string,
        int $n
    ): int {
        if ($n < 1) {
            return strlen($tag_string);
        }

        $members_to_find        = $n;
        $open_parentheses_count = 0;
        $comma_index            = 0;
        $tag_string_split       = str_split($tag_string);
        for ($i = 0; $i < count($tag_string_split); $i++) {
            if ($tag_string_split[$i] === '(') {
                $open_parentheses_count++;
            } else if ($tag_string_split[$i] === ')') {
                $open_parentheses_count--;
            }
            if ($open_parentheses_count === 0 && $tag_string_split[$i] === ',') {
                if (--$members_to_find === 0) {
                    break;
                }
            }
            $comma_index = $i;
        }
        return $comma_index + 1;
    }
}
