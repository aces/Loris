<?php declare(strict_types=1);

namespace LORIS\imaging_browser;
use \LORIS\candidate_profile\CandidateWidget;

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
     * @return ?\LORIS\GUI\MenuCategory
     */
    public function getMenuCategory() : ?\LORIS\GUI\MenuCategory
    {
        return \LORIS\GUI\MenuCategory::singleton("Imaging");
    }

    /**
     * {@inheritDoc}
     *
     * @return string The human readable name for this module
     */
    public function getLongName() : string
    {
        return dgettext("imaging_browser", "Imaging Browser");
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
                    new \LORIS\GUI\LocalizableString(
                        "imaging_browser",
                        "New and pending imaging session",
                        "New and pending imaging sessions",
                    ),
                    $DB,
                    "SELECT COUNT(DISTINCT s.ID)
                     FROM files f
                         LEFT JOIN session s ON (s.ID=f.SessionID)
                         LEFT JOIN candidate c ON (s.CandidateID=c.ID)
                     WHERE (MRIQCStatus='' OR MRIQCPending='Y')
                         AND s.Active='Y' AND c.Active='Y'
                         AND s.CenterID <> 1",
                    'imaging_browser_view_allsites',
                    's.CenterID',
                    's.ProjectID',
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
                    mst.MriScanTypeName as ScanType,
                    COALESCE(fqc.QCStatus, '') as QC,
                    COUNT(*) as nfiles
                FROM files f JOIN session s ON (s.ID=f.sessionID)
                    JOIN candidate c ON c.ID=s.CandidateID
                    JOIN mri_scan_type mst ON (f.MriScanTypeID=mst.MriScanTypeID)
                    LEFT JOIN files_qcstatus fqc ON (fqc.FileID=f.FileID)
                WHERE c.CandID=:cid AND f.OutputType='native'
                GROUP BY s.Visit_label, mst.MriScanTypeName, QC",
                ['cid' => $candidate->getCandID()],
            );

            if (count($scansummary) === 0) {
                return [];
            }
            return [
                new CandidateWidget(
                    dgettext("imaging_browser", "Imaging QC Summary"),
                    $baseURL. "/imaging_browser/js/CandidateScanQCSummaryWidget.js",
                    "lorisjs.imaging_browser.CandidateScanQCSummaryWidget.default",
                    [ 'Files' => iterator_to_array($scansummary)],
                    2,
                    1,
                )
            ];
        case 'study-progression':
            $DB   = $factory->database();
            $data = $DB->pselectWithIndexKey(
                "SELECT 
                    p.ProjectID,
                    p.Name AS ProjectName,
                    COUNT(s.ID) AS count,
                    '".$baseURL."/imaging_browser' as url
                FROM session s
                JOIN Project p ON p.ProjectID = s.ProjectID
                JOIN mri_upload mu ON mu.SessionID = s.ID
                WHERE s.Active <> 'N' 
                AND s.CenterID <> 1
                GROUP BY p.Name",
                [],
                'ProjectID'
            );
            return [
                new \LORIS\dashboard\DataWidget(
                    new \LORIS\GUI\LocalizableString(
                        "imaging_browser",
                        "Imaging Session",
                        "Imaging Sessions"
                    ),
                    $data,
                    "",
                    'rgb(235, 255, 254)',
                )
            ];
        }
        return [];
    }

    /**
     * {@inheritDoc}
     *
     * @return \LORIS\Data\Query\QueryEngine
     */
    public function getQueryEngine() : \LORIS\Data\Query\QueryEngine
    {
        return new QueryEngine($this->loris);
    }
}
