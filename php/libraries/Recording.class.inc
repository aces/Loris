<?php declare(strict_types=1);
/**
 * File that describe the Recording class
 *
 * PHP Version 7
 *
 *  @category Recording
 *  @package  Main
 *  @author   Cecile Madjar <cecile.madjar@mcin.ca>
 *  @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 *  @link     https://www.github.com/aces/Loris/
 */
namespace LORIS;

/**
 * This class defines a Recording and business logic related to Recordings.
 *
 * @category Recording
 * @package  Main
 *  @author  Cecile Madjar <cecile.madjar@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class Recording
{
    private $_fileid;

    private $_filename;

    private $_filelocation;

    private $_outputtype;

    private $_acquisitionmodality;

    private $_filetype;

    private $_centerid;

    private $_entitytype;

    /**
     * Constructor
     *
     * @param ?int $fileid This Recording FileID
     */
    public function __construct(?int $fileid)
    {
        if ($fileid !== null) {
            $dbrow = \NDB_Factory::singleton()
                ->database()
                ->pselectRow(
                    '
                     SELECT
                       f.FilePath               as filelocation,
                       pot.OutputTypeName       as outputtype,
                       pm.PhysiologicalModality as acquisitionmodality,
                       FileType                 as filetype,
                       s.CenterID               as centerid,
                       c.Entity_type            as entitytype,
                       pc.FilePath              as channel_file_path,
                       pe.FilePath              as electrode_file_path,
                       pte.FilePath             as event_file_path,
                       pa.FilePath              as archive_file_path
                     FROM
                       physiological_file f 
                     LEFT JOIN session s
                       ON (f.SessionID = s.ID)
                     LEFT JOIN candidate c
                       ON (s.CandID = c.CandID)
                     LEFT JOIN  physiological_output_type pot
                       ON (pot.PhysiologicalOutputTypeID = f.PhysiologicalOutputTypeID)
                     LEFT JOIN physiological_modality pm
                       ON (pm.PhysiologicalModalityID = f.PhysiologicalModalityID)
                     LEFT JOIN (
                       SELECT PhysiologicalFileID, FilePath
                       FROM physiological_channel
                       LIMIT 1
                     ) pc
                       ON (pc.PhysiologicalFileID = f.PhysiologicalFileID)
                     LEFT JOIN (
                       SELECT PhysiologicalFileID, FilePath
                       FROM physiological_electrode
                       LIMIT 1
                     ) pe
                       ON (pe.PhysiologicalFileID = f.PhysiologicalFileID)
                     LEFT JOIN (
                       SELECT PhysiologicalFileID, FilePath
                       FROM physiological_task_event
                       LIMIT 1
                     ) pte
                       ON (pte.PhysiologicalFileID = f.PhysiologicalFileID)
                     LEFT JOIN physiological_archive pa
                       ON (pa.PhysiologicalFileID = f.PhysiologicalFileID)
                     WHERE f.PhysiologicalFileID = :v_fileid
                    ',
                    array('v_fileid' => $fileid)
                );
            if (empty($dbrow)) {
                throw new \NotFound('There is no file with that FileID');
            }
            $this->_fileid       = $fileid;
            $this->_filename     = basename($dbrow['filelocation']);
            $this->_filelocation = $dbrow['filelocation'];
            $this->_outputtype   = $dbrow['outputtype'];
            $this->_acquisitionmodality = $dbrow['acquisitionmodality'];
            $this->_filetype            = $dbrow['filetype'];
            $this->_centerid            = (int) $dbrow['centerid'];
            $this->_entitytype          = $dbrow['entitytype'];
            $this->_channel_file_path   = $dbrow['channel_file_path'];
            $this->_electrode_file_path = $dbrow['electrode_file_path'];
            $this->_event_file_path     = $dbrow['event_file_path'];
            $this->_archive_file_path   = $dbrow['archive_file_path'];
        }
    }

    /**
     * Get a specific file header from physiological_parameter file
     *
     * @param string $headername The parameter name to retrieve
     *
     * @return string The value or an empty string
     */
    public function getMetadata(string $headername): string
    {
        $dbrow = \NDB_Factory::singleton()
            ->database()
            ->pselectRow(
                '
                       SELECT
                         Value
                       FROM
                         physiological_parameter_file pf 
                       JOIN parameter_type pt
                         USING (ParameterTypeID)
                       JOIN physiological_file f
                         USING (PhysiologicalFileID)
                       WHERE
                         f.PhysiologicalFileID = :v_fileid AND
                         pt.Name = :v_headername
                      ',
                array(
                    'v_fileid'     => $this->_fileid,
                    'v_headername' => $headername,
                )
            );
        return $dbrow['Value'] ?? '';
    }

    /**
     * Get all metadata.class from the physiological_parameter files table for that
     * Recording.
     *
     * @return array An associative array of {Name => Value}
     */
    public function getAllMetadata(): array
    {
        $dbrows = \NDB_Factory::singleton()
            ->database()
            ->pselect(
                '
                       SELECT
                         pt.Name as name,
                         pf.Value as value
                       FROM
                         physiological_parameter_file pf 
                       JOIN parameter_type pt
                         USING (ParameterTypeID)
                       JOIN physiological_file f
                         USING (PhysiologicalFileID)
                       WHERE
                         f.PhysiologicalFileID = :v_fileid
                      ',
                array('v_fileid' => $this->_fileid)
            );
        return array_reduce(
            $dbrows,
            function ($carry, $row) {
                $carry[$row['name']] = $row['value'];
                return $carry;
            },
            array()
        );
    }

    /**
     * Return a SPLFileInfo object based on this recording's properties.
     *
     * @return \SplFileInfo
     */
    public function getFileInfo(): \SplFileInfo
    {
        $imagepath = \NDB_factory::singleton()
            ->config()
            ->getSetting('imagePath');

        $fullpath = $imagepath . $this->_filelocation;

        $info = new \SplFileInfo($fullpath);

        return $info;
    }

    /**
     * Return a SPLFileInfo object based on this channels' file's properties
     **
     * @return \SplFileInfo
     */
    public function getChannelsFileInfo(): \SplFileInfo
    {
        $imagepath = \NDB_Factory::singleton()
            ->config()
            ->getSetting('imagePath');

        $fullpath = $imagepath . $this->_channel_file_path;

        $info = new \SplFileInfo($fullpath);

        return $info;
    }

    /**
     * Return a SPLFileInfo object based on this electrodes' file's properties
     *
     * @return \SplFileInfo
     */
    public function getElectrodesFileInfo(): \SplFileInfo
    {
        $imagepath = \NDB_Factory::singleton()
            ->config()
            ->getSetting('imagePath');

        $fullpath = $imagepath . $this->_electrode_file_path;

        $info = new \SplFileInfo($fullpath);

        return $info;
    }

    /**
     * Return a SPLFileInfo object based on this events.class' file's properties
     *
     * @return \SplFileInfo
     */
    public function getEventsFileInfo(): \SplFileInfo
    {
        $imagepath = \NDB_Factory::singleton()
            ->config()
            ->getSetting('imagePath');

        $fullpath = $imagepath . $this->_event_file_path;

        $info = new \SplFileInfo($fullpath);

        return $info;
    }

    /**
     * Return a SPLFileInfo object based on this archive's properties
     *
     * @return \SplFileInfo
     */
    public function getArchiveFileInfo(): \SplFileInfo
    {
        $imagepath = \NDB_Factory::singleton()
            ->config()
            ->getSetting('imagePath');

        $fullpath = $imagepath . $this->_archive_file_path;

        $info = new \SplFileInfo($fullpath);

        return $info;
    }

    /**
     * Get all channels info from the physiological_channel table for that
     * Recording.
     *
     * @return \LORIS\RecordingChannels[]
     */
    public function getChannels(): array
    {
        $dbrows = \NDB_Factory::singleton()
            ->database()
            ->pselect(
                '
                       SELECT
                         pc.Name                as channelname,
                         pc.Description         as channeldescription,
                         pct.ChannelTypeName    as channeltype,
                         pct.ChannelDescription as channeltypedescription,
                         pst.ChannelStatus      as channelstatus,
                         pc.StatusDescription   as statusdescription,
                         pc.SamplingFrequency   as samplingfrequency,
                         pc.LowCutoff           as lowcutoff,
                         pc.HighCutoff          as highcutoff,
                         pc.ManualFlag          as manualflag,
                         pc.Notch               as notch,
                         pc.Reference           as reference,
                         pc.Unit                as unit,
                         pc.FilePath            as filepath
                       FROM
                         physiological_channel pc 
                       JOIN physiological_channel_type pct
                         USING (PhysiologicalChannelTypeID)
                       JOIN physiological_status_type pst
                         USING (PhysiologicalStatusTypeID)
                       JOIN physiological_file f
                         USING (PhysiologicalFileID)
                       WHERE
                         pc.PhysiologicalFileID = :v_fileid
                      ',
                array('v_fileid' => $this->_fileid)
            );
        return array_map(
            function ($row) {
                $values = array_values($row);
                return new \LORIS\RecordingChannels(...$values);
            },
            $dbrows
        );
    }

    /**
     * Get all electrodes info from the physiological_electrode table for that
     * Recording.
     *
     * @return \LORIS\RecordingElectrodes[]
     */
    public function getElectrodes(): array
    {
        $dbrows = \NDB_Factory::singleton()
            ->database()
            ->pselect(
                '
                       SELECT
                         pe.Name                as electrodename,
                         pet.ElectrodeType      as electrodetype,
                         pem.ElectrodeMaterial  as electrodematerial,
                         pe.X                   as x,
                         pe.Y                   as y,
                         pe.Z                   as z,
                         pe.Impedance           as Impedance,
                         pe.FilePath            as filepath
                       FROM
                         physiological_electrode pe 
                       JOIN physiological_electrode_type pet
                         USING (PhysiologicalElectrodeTypeID)
                       JOIN physiological_electrode_material pem
                         USING (PhysiologicalElectrodeMaterialID)
                       JOIN physiological_file f
                         USING (PhysiologicalFileID)
                       WHERE
                         pe.PhysiologicalFileID = :v_fileid
                      ',
                array('v_fileid' => $this->_fileid)
            );
        return array_map(
            function ($row) {
                $values = array_values($row);
                return new \LORIS\RecordingElectrodes(...$values);
            },
            $dbrows
        );
    }

    /**
     * Get all task events from the physiological_task_event table for that
     * Recording.
     *
     * @return \LORIS\RecordingEvents[]
     */
    public function getEvents(): array
    {
        $dbrows = \NDB_Factory::singleton()
            ->database()
            ->pselect(
                '
                       SELECT
                         pte.Onset        as onset,
                         pte.Duration     as duration,
                         pte.EventCode    as eventcode,
                         pte.EventSample  as eventsample,
                         pte.EventType    as eventtype,
                         pte.TrialType    as trialtype,
                         pte.ResponseTime as responsetime,
                         pte.FilePath     as filepath
                       FROM
                         physiological_task_event pte 
                       JOIN physiological_file f
                         USING (PhysiologicalFileID)
                       WHERE
                         pte.PhysiologicalFileID = :v_fileid
                      ',
                array('v_fileid' => $this->_fileid)
            );
        return array_map(
            function ($row) {
                $values = array_values($row);
                return new \LORIS\RecordingEvents(...$values);
            },
            $dbrows
        );
    }

    /**
     * Creates an immutable object representation of this Recording
     *
     * @return \LORIS\Data\Models\RecordingDTO
     */
    public function asDTO(): \LORIS\Data\Models\RecordingDTO
    {
        return new \LORIS\Data\Models\RecordingDTO(
            $this->_fileid,
            $this->_filename,
            $this->_filelocation,
            $this->_outputtype,
            $this->_acquisitionmodality,
            $this->_filetype,
            $this->_centerid,
            $this->_entitytype
        );
    }
}