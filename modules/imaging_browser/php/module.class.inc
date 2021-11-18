<?php
namespace LORIS\imaging_browser;
use \LORIS\candidate_profile\CandidateWidget;

use \LORIS\Data\Dictionary\DictionaryItem;
use \LORIS\Data\Scope;
use \LORIS\Data\Cardinality;

/**
 * {@inheritDoc}
 *
 * @license http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */
class Module extends \Module
{
    /**
     * {@inheritDoc}
     *
     * @param \User $user The user whose access is being checked.
     *
     * @return bool whether access is granted
     */
    public function hasAccess(\User $user) : bool
    {
        return parent::hasAccess($user) &&
            $user->hasAnyPermission(
                [
                    'imaging_browser_view_site',
                    'imaging_browser_view_allsites',
                    'imaging_browser_phantom_allsites',
                    'imaging_browser_phantom_ownsite'
                ]
            );
    }

    /**
     * {@inheritDoc}
     *
     * @return string The menu category for this module
     */
    public function getMenuCategory() : string
    {
        return "Imaging";
    }

    /**
     * {@inheritDoc}
     *
     * @return string The human readable name for this module
     */
    public function getLongName() : string
    {
        return "Imaging Browser";
    }

    /**
     * {@inheritDoc}
     *
     * @param string $type    The type of widgets to get.
     * @param \User  $user    The user widgets are being retrieved for.
     * @param array  $options A type dependent list of options to provide
     *                        to the widget.
     *
     * @return \LORIS\GUI\Widget[]
     */
    public function getWidgets(string $type, \User $user, array $options) : array
    {
        $factory = \NDB_Factory::singleton();
        $DB      = $factory->database();
        $baseURL = $factory->settings()->getBaseURL();
        switch ($type) {
        case 'usertasks':
            return [
                new \LORIS\dashboard\TaskQueryWidget(
                    $user,
                    "New and pending imaging session",
                    $DB,
                    "SELECT COUNT(DISTINCT s.ID)
                     FROM files f
                         LEFT JOIN session s ON (s.ID=f.SessionID)
                         LEFT JOIN candidate c ON (s.CandID=c.CandID)
                     WHERE (MRIQCStatus='' OR MRIQCPending='Y')
                         AND s.Active='Y' AND c.Active='Y'
                         AND s.CenterID <> 1",
                    'imaging_browser_view_allsites',
                    's.CenterID',
                    $baseURL . "/imaging_browser/?pendingNew=N&pendingNew=P",
                    "new-scans"
                )
            ];
        case 'candidate':
            $candidate = $options['candidate'];
            if ($candidate === null) {
                return [];
            }

            $scansummary = $DB->pselect(
                "SELECT s.Visit_label,
                    mst.Scan_type,
                    COALESCE(fqc.QCStatus, '') as QC,
                    COUNT(*) as nfiles
                 FROM files f JOIN session s ON (s.ID=f.sessionID)
                    JOIN mri_scan_type mst ON (f.AcquisitionProtocolID=mst.ID)
                    LEFT JOIN files_qcstatus fqc ON (fqc.FileID=f.FileID)
                WHERE CandID=:cid AND f.OutputType='native'
                GROUP BY s.Visit_label, mst.Scan_type, QC",
                ['cid' => $candidate->getCandID()],
            );
            if (empty($scansummary)) {
                return [];
            }
            foreach ($scansummary as &$summary) {
                $summary['nfiles'] = (int )$summary['nfiles'];
            }
            return [
                new CandidateWidget(
                    "Imaging QC Summary",
                    $baseURL. "/imaging_browser/js/CandidateScanQCSummaryWidget.js",
                    "lorisjs.imaging_browser.CandidateScanQCSummaryWidget.default",
                    [ 'Files' => $scansummary],
                    2,
                    1,
                )
            ];
        }
        return [];
    }

    /**
     * {@inheritDoc}
     *
     * @param \LORIS\LorisInstance $loris The Loris instance from which the
     *                                    data dictionary for this module
     *                                    should be retrieved.
     *
     * @return \LORIS\Data\Dictionary\Category[]
     */
    public function getDataDictionary(\LORIS\LorisInstance $loris) : iterable
    {
        $scope  = new Scope(Scope::SESSION);
        $images = new \LORIS\Data\Dictionary\Category(
            "Images",
            "Image Acquisitions",
        );
        $items  = [];

        $scantypes = \Utility::getScanTypeList();
        foreach ($scantypes as $ScanType) {
            $items[] = new DictionaryItem(
                $ScanType,
                "$ScanType acquisition location",
                $scope,
                new \LORIS\Data\Types\URI(),
                new Cardinality(Cardinality::MANY),
            );
            $items[] = new DictionaryItem(
                $ScanType  . "_QCStatus",
                "Quality Control status for $ScanType acquisition",
                $scope,
                new \LORIS\Data\Types\Enumeration("Pass", "Fail"),
                new Cardinality(Cardinality::MANY),
            );
        }
        $images = $images->withItems($items);

        return [$images];
    }
}
