<?php declare(strict_types=1);

/**
 * Implements the ViewDetails subpage of the dicom_archive module.
 *
 * PHP version 5
 *
 * @category   Behavioural
 * @package    Main
 * @subpackage Imaging
 * @author     Olga Tsibulevskaya <olgatsib@gmail.com>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris-Trunk/
 */
namespace LORIS\dicom_archive;

/**
 * Implements the ViewDetails subpage of the dicom_archive module.
 *
 * @category   Behavioural
 * @package    Main
 * @subpackage Imaging
 * @author     Olga Tsibulevskaya <olgatsib@gmail.com>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris-Trunk/
 */
class ViewDetails extends \NDB_Form
{
    /**
     * Render the page with React instead of Smarty.
     *
     * @var bool
     */
    public $skipTemplate = true;

    /**
     * ID of the tarchive for which the details should be displayed.
     */
    public $tarchiveID;

    /**
     * A Database connection to a LORIS DB
     *
     * @var \Database
     */
    protected $DB;

    /**
     * Keeps array of protocols from mri_protocol
     */
    public $protocols;

    /**
     * Archive metadata displayed on the page.
     *
     * @var array<string, mixed>
     */
    private array $archive = [];

    /**
     * Series metadata displayed on the page.
     *
     * @var list<array<string, mixed>>
     */
    private array $archiveSeries = [];

    /**
     * File metadata displayed on the page.
     *
     * @var list<array<string, mixed>>
     */
    private array $archiveFiles = [];

    /**
     * Determine whether the user has permission to view this page
     *
     * @param \User $user The user whose access is being checked
     *
     * @return bool whether the user has access
     */
    #[\Override]
    public function isAccessibleBy(\User $user) : bool
    {
        // Permission of access to this page needs to match the module's filters
        $config           = \NDB_Factory::singleton()->config();
        $siteprojectperms = $config->getSetting(
            'useAdvancedPermissions'
        );
        $DB  = $this->loris->getDatabaseConnection();
        $row = $DB->pselectRow(
            "SELECT CenterID, ProjectID, SessionID, CreatingUser
            FROM tarchive t 
                JOIN session s ON s.ID = t.SessionID 
            WHERE TarchiveID = :ID",
            ['ID' => $_REQUEST['tarchiveID']]
        );

        $hasCenterAccess    = false;
        $hasNoSessionAccess = false;
        $hasProjectAccess   = false;
        $isCreator          = false;

        if (isset($row['CenterID'])) {
            $hasCenterAccess = $user->hasCenter(
                \CenterID::singleton(intval($row['CenterID']))
            );
        }
        if (!isset($row['SessionID'])) {
            $hasNoSessionAccess = $user->hasPermission("dicom_archive_nosessionid");
        }
        if (isset($row['ProjectID'])) {
            $hasProjectAccess = $user->hasProject(
                \ProjectID::singleton(intval($row['ProjectID']))
            );
        }
        if (isset($row['CreatingUser'])) {
            $isCreator = $row['CreatingUser'] === $user->getUsername();
        }

        // Assume project match is turned off first (as module filter does)
        // User site match
        // OR resource has no session but user has the no session permission
        // OR user has access to all sites data
        $access = $hasCenterAccess || $hasNoSessionAccess
            || ($user->hasPermission('dicom_archive_view_allsites'));

        // If the site project permissions are enabled
        if ($siteprojectperms === 'true') {
            // User has basic center access
            // AND
            // Either User has the project
            // OR resource has no session but user has the no session permission
            $access = $access && ($hasProjectAccess || $hasNoSessionAccess);
        }

        // User is the creator of the data
        $access = $access || $isCreator;

        return $access;
    }

    /**
     * Sets up main parameters
     *
     * @return void
     */
    function setup()
    {
        $this->DB = $this->loris->getDatabaseConnection();

        $user = \User::singleton();
        if ((!empty($_REQUEST['tarchiveID'])) && ($this->isAccessibleBy($user))) {
            $this->tarchiveID    = intval($_REQUEST['tarchiveID']);
            $this->archive       = $this->_getArchive($this->tarchiveID);
            $this->archiveSeries = $this->_getArchiveSeries($this->tarchiveID);
            $this->archiveFiles  = $this->_getArchiveFiles($this->tarchiveID);

            $this->_validateNamesIDs();
        }
    }

    /**
     * Return the metadata displayed by the React page.
     *
     * @return array{
     *     archive: array<string, mixed>,
     *     archiveSeries: list<array<string, mixed>>,
     *     archiveFiles: list<array<string, mixed>>
     * }
     */
    #[\Override]
    function toArray(): array
    {
        return [
            'archive'       => $this->archive,
            'archiveSeries' => $this->archiveSeries,
            'archiveFiles'  => $this->archiveFiles,
        ];
    }

    /**
     * Get the archive metadata displayed on the page.
     *
     * @param int $tarchiveID Archive identifier
     *
     * @return array<string, mixed>
     */
    private function _getArchive(int $tarchiveID): array
    {
        $archive = $this->DB->pselectRow(
            "SELECT DicomArchiveID, PatientID, PatientName, PatientDoB,
                PatientSex, DateAcquired, ScannerManufacturer, ScannerModel,
                ScannerSerialNumber, ScannerSoftwareVersion, CenterName,
                AcquisitionCount, CreatingUser, LastUpdate, sumTypeVersion,
                SourceLocation, tarTypeVersion, ArchiveLocation, CreateInfo,
                md5sumArchive, md5sumDicomOnly
            FROM tarchive
            WHERE TarchiveID = :ID",
            ['ID' => $tarchiveID]
        );

        return $archive ?? [];
    }

    /**
     * Get the series metadata displayed on the page.
     *
     * @param int $tarchiveID Archive identifier
     *
     * @return list<array<string, mixed>>
     */
    private function _getArchiveSeries(int $tarchiveID): array
    {
        /**
         * Series rows returned by the database.
         *
         * @var list<array<string, mixed>> $seriesData
         */
        $seriesData = iterator_to_array(
            $this->DB->pselect(
                "SELECT SeriesNumber, SeriesDescription, SequenceName,
                    EchoTime, RepetitionTime, InversionTime, SliceThickness,
                    PhaseEncoding, NumberOfFiles, SeriesUID
                FROM tarchive_series
                WHERE TarchiveID = :ID
                ORDER BY TarchiveSeriesID",
                ['ID' => $tarchiveID]
            ),
            false
        );

        if (!$this->_setProtocols()) {
            return $seriesData;
        }

        $previousSeriesDescription = '';
        $previousProtocolName      = '';
        foreach ($seriesData as &$series) {
            $seriesDescription = $series['SeriesDescription'];
            // If the same series, reuse the previously computed protocol name.
            if ($previousSeriesDescription === $seriesDescription) {
                $series['ProtocolName'] = $previousProtocolName;
            } else {
                $protocolName           = $this->_getProtocolName($series);
                $series['ProtocolName'] = $protocolName;
                $previousSeriesDescription = $seriesDescription;
                $previousProtocolName      = $protocolName;
            }
        }
        unset($series);

        return $seriesData;
    }

    /**
     * Get the file metadata displayed on the page.
     *
     * @param int $tarchiveID Archive identifier
     *
     * @return list<array<string, mixed>>
     */
    private function _getArchiveFiles(int $tarchiveID): array
    {
        /**
         * File rows returned by the database.
         *
         * @var list<array<string, mixed>> $fileData
         */
        $fileData = iterator_to_array(
            $this->DB->pselect(
                "SELECT SeriesNumber, FileNumber, EchoNumber,
                    SeriesDescription, Md5Sum, FileName
                FROM tarchive_files
                WHERE TarchiveID = :ID
                ORDER BY TarchiveFileID",
                ['ID' => $tarchiveID]
            ),
            false
        );

        return $fileData;
    }

    /**
     * Validates PatientName and PatientID,
     * sets INVALID - HIDDEN if not validated.
     *
     * @return void
     */
    function _validateNamesIds(): void
    {
        $config =& \NDB_Config::singleton();
        $db     = $this->loris->getDatabaseConnection();
        $dicomArchiveSettings = $config->getSetting('imaging_modules');
        assert(is_array($dicomArchiveSettings));

        $patientNameRegex   = $dicomArchiveSettings['patientNameRegex'] ?? null;
        $legoPhantomRegex   = $dicomArchiveSettings['LegoPhantomRegex'] ?? null;
        $livingPhantomRegex
            = $dicomArchiveSettings['LivingPhantomRegex'] ?? null;
        $patientIDRegex     = $dicomArchiveSettings['patientIDRegex'] ?? null;
        assert(is_string($patientNameRegex));
        assert(is_string($legoPhantomRegex));
        assert(is_string($livingPhantomRegex));
        assert(is_string($patientIDRegex));

        // escape any forward slashes
        $pNameRegex      = preg_replace(
            '/\//',
            '\/',
            $patientNameRegex
        );
        $legoPhanRegex   = preg_replace(
            '/\//',
            '\/',
            $legoPhantomRegex
        );
        $livingPhanRegex = preg_replace(
            '/\//',
            '\/',
            $livingPhantomRegex
        );
        $pIDRegex        = preg_replace(
            '/\//',
            '\/',
            $patientIDRegex
        );
        assert(is_string($pNameRegex));
        assert(is_string($legoPhanRegex));
        assert(is_string($livingPhanRegex));
        assert(is_string($pIDRegex));

        $query     = "SELECT IsPhantom "
                   . "FROM mri_upload m "
                   . "JOIN tarchive t USING(TarchiveID) "
                   . "WHERE t.TarchiveID =:tid "
                   . "AND t.archivelocation LIKE CONCAT("
                   .     "'%', "
                   .     "substring_index(m.decompressedlocation, '/', -1), "
                   .     " '.tar'"
                   . ")";
        $isPhantom = $db->pselectRow(
            $query,
            ['tid' => $this->tarchiveID]
        )['IsPhantom'] ?? null;

        $patientName = $this->archive['PatientName'] ?? null;
        assert(is_string($patientName));
        if ($isPhantom === 'Y') {
            $isValid = preg_match(
                "/$legoPhanRegex/",
                $patientName
            ) || preg_match(
                "/$livingPhanRegex/",
                $patientName
            );
        } else if ($isPhantom === 'N') {
            $isValid = preg_match(
                "/$pNameRegex/",
                $patientName
            );
        } else {
            // if scan was uploaded via non-imaging uploader method
            // run patient name through all regex validations
            $isValid = (preg_match(
                "/$pNameRegex/",
                $patientName
            )) || (preg_match(
                "/$legoPhanRegex/",
                $patientName
            )) || (preg_match(
                "/$livingPhanRegex/",
                $patientName
            ));
        }

        $this->archive['patientNameValid'] = $isValid ? 1 : 0;
        if (!$isValid) {
            $this->archive['PatientName']
                = dgettext('dicom_archive', 'INVALID - HIDDEN');
        }

        $patientID = $this->archive['PatientID'] ?? null;
        if (is_string($patientID)) {
            if (preg_match(
                "/$pIDRegex/",
                $patientID
            )
            ) {
                $this->archive['patientIDValid'] = 1;
            } else {
                $this->archive['patientIDValid'] = 0;

                $this->archive['PatientID']
                    = dgettext('dicom_archive', 'INVALID - HIDDEN');
            }
        }
    }

    /**
     * Gets protocol data from mri_protocol table and
     * registers it into class variable $protocols.
     *
     * @return bool false if couldn't retrieve data from the table, else true
     */
    function _setProtocols()
    {
        try {
            $query           = "SELECT MriScanTypeID, TR_min, TR_max, TE_min, TE_max,
                TI_min, TI_max, slice_thickness_min, slice_thickness_max FROM
                mri_protocol";
            $this->protocols = $this->DB->pselect($query, []);
            return true;
        } catch (\LorisException $e) {
            return false;
        }
    }

    /**
     * Finds the protocol name by comparing parameters of a series.
     *
     * @param array $series series for which the protocol is to be found
     *
     * @return string name of the protocol, "Unknown" if protocol for
     *         series parameters doesn't exist
     */
    function _getProtocolName($series)
    {
        $tr = $series['RepetitionTime'];
        $te = $series['EchoTime'];
        $ti = $series['InversionTime'];
        $sliceThickness = $series['SliceThickness'];

        foreach ($this->protocols as $protocol) {
            if (($this->_inRange($tr, $protocol['TR_min'], $protocol['TR_max']))
                && ($this->_inRange($te, $protocol['TE_min'], $protocol['TE_max']))
                && ($this->_inRange($ti, $protocol['TI_min'], $protocol['TI_max']))
                && ($this->_inRange(
                    $sliceThickness,
                    $protocol['slice_thickness_min'],
                    $protocol['slice_thickness_max']
                ))
            ) {
                return $this->_getProtocolNameFromID($protocol['MriScanTypeID']);
            }
        }
        return "Unknown";
    }

    /**
     * Compares parameters of a series and of the protocols
     *
     * @param string $seriesRange series parameter to be compared
     * @param string $protocolMin minimum value of protocol's parameter
     *                            to be compared with
     * @param string $protocolMax maximum value of protocol's parameter
     *                            to be compared with
     *
     * @return bool true if series parameter is in range with
     *         the protocol's one, false otherwise
     */
    function _inRange($seriesRange, $protocolMin, $protocolMax)
    {
        if (!isset($seriesRange)) {
            return true;
        }
        if (!isset($protocolMin) && !isset($protocolMax)) {
            return true;
        } elseif (isset($protocolMin) && $protocolMax == null) {
            return $protocolMin <= $seriesRange;
        } elseif (isset($protocolMax) && $protocolMin == null) {
            return $seriesRange <= $protocolMax;
        } else {
            return $protocolMin <= $seriesRange && $seriesRange <= $protocolMax;
        }
    }

    /**
     * Retrieves the protocol name given the protocol ID
     * from mri_scan_table table
     *
     * @param string $id id of the protocol
     *
     * @return string name of the protocol, "Unknown" if
     *         protocol with the given id doesn't exist.
     */
    function _getProtocolNameFromID($id): string
    {
        try {
            $query = "SELECT MriScanTypeName FROM mri_scan_type
                WHERE MriScanTypeID=:ID";
            $array = $this->DB->pselectRow($query, ['ID' => $id]);
            return $array['MriScanTypeName'] ?? 'Unknown';
        } catch (\LorisException $e) {
            return "Unknown";
        }
    }

    /**
     * Add the React entry point for the view-details page.
     *
     * @return array of JavaScript dependencies
     */
    #[\Override]
    function getJSDependencies()
    {
        $factory = \NDB_Factory::singleton();
        $baseURL = $factory->settings()->getBaseURL();
        $deps    = parent::getJSDependencies();
        return array_merge(
            $deps,
            [$baseURL . '/dicom_archive/js/viewDetails.js']
        );
    }

    /**
     * Adds custom CSS for the viewdetails table styling.
     *
     * @return array of CSS to include in the page
     */
    function getCSSDependencies()
    {
        $depends = parent::getCSSDependencies();
        $factory = \NDB_Factory::singleton();
        $baseURL = $factory->settings()->getBaseURL();
        return array_merge(
            $depends,
            [$baseURL . "/dicom_archive/css/dicom_archive.css"]
        );
    }

    /**
     * Generate a breadcrumb trail for this page.
     *
     * @return \LORIS\BreadcrumbTrail
     */
    public function getBreadcrumbs(): \LORIS\BreadcrumbTrail
    {
        return new \LORIS\BreadcrumbTrail(
            new \LORIS\Breadcrumb(
                dgettext('dicom_archive', "DICOM Archive"),
                "/$this->name",
            ),
            new \LORIS\Breadcrumb(
                dgettext('dicom_archive', 'View Details'),
                "/dicom_archive/viewDetails?tarchiveID=$this->tarchiveID"
            )
        );
    }
}
