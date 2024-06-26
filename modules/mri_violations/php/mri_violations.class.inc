<?php
namespace LORIS\mri_violations;
use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;

/**
 * This page implements a front end which is used to unify all
 * of the different MRI violation types (could not identify scan,
 * header violation in the scan after identifying scan type, mislabeled
 * scan, etc) to investigate why a scan was excluded by the imaging
 * pipeline scripts.
 *
 * @license http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */
class Mri_Violations extends \DataFrameworkMenu
{
    private string $seriesUID;
    private string $violationType = 'default';

    /**
     * Check if user should be allowed to see this page.
     *
     * @param \User $user The user whose access is being checked
     *
     * @return boolean true if the user is permitted to see violated scans
     */
    function _hasAccess(\User $user) : bool
    {
        return $user->hasAnyPermission(
            [
                'violated_scans_view_allsites',
                'violated_scans_view_ownsite'
            ]
        );
    }

    /**
     * Tells the base class that this page's provisioner can support the
     * HasAnyPermissionOrUserSiteMatch filter.
     *
     * @return ?array of site permissions or null
     */
    public function allSitePermissionNames() : ?array
    {
        return ['violated_scans_view_allsites'];
    }

    /**
     * We do not use the base project filter because since it's a violated
     * scan, it's possible that the project will be null. Instead we add
     * our own UserProjectMatchOrNull filter.
     *
     * @return bool false
     */
    public function useProjectFilter() : bool
    {
        return false;
    }

    /**
     * {@inheritDoc}
     *
     * @return array
     */
    protected function getFieldOptions() : array
    {
        // Build a list of existing problem types based on data in db
        $db           = $this->loris->getDatabaseConnection();
        $problemTypes = array_column(
            $db->pselect(
                "SELECT DISTINCT MRICandidateErrors.Reason FROM MRICandidateErrors
                    UNION
                 SELECT DISTINCT 'Could not identify scan type'
                      FROM mri_protocol_violated_scans
                    UNION
                 SELECT DISTINCT 'Protocol Violation' FROM mri_violations_log",
                []
            ),
            'Reason'
        );

        $protocols = $db->pselect(
            "SELECT p.ID, mpg.Name as 'Protocol Group',
                    site.Name as Center_name, ScannerID,
                    s.Scan_type, TR_min, TR_max, TE_min, TE_max, TI_min,
                    TI_max, slice_thickness_min, slice_thickness_max,
                    xspace_min, xspace_max, yspace_min, yspace_max, zspace_min,
                    zspace_max, xstep_min, xstep_max, ystep_min, ystep_max,
                    zstep_min, zstep_max, time_min, time_max,
                    series_description_regex,
                    image_type, PhaseEncodingDirection, EchoNumber
             FROM mri_protocol as p
             LEFT JOIN mri_protocol_group mpg
                 ON (mpg.MriProtocolGroupID=p.MriProtocolGroupID)
             LEFT JOIN mri_scan_type as s
                 ON p.MriScanTypeID=s.ID
             LEFT JOIN psc site ON (p.CenterID=site.CenterID)
             ORDER BY mpg.MriProtocolGroupID ASC, p.MriScanTypeID ASC",
            []
        );
        return [
            'projects'     => \Utility::getProjectList(),
            'cohorts'      => \Utility::getCohortList(),
            'sites'        => \Utility::getSiteList(),
            'problemtypes' => $problemTypes,
            'protocols'    => $protocols,
        ];
    }

    /**
     * Extract the appropriate provisioner to use for the JSON format
     *
     * @param ServerRequestInterface $request The incoming request
     *
     * @return ResponseInterface
     */
    public function handle(ServerRequestInterface $request) : ResponseInterface
    {
        $params = $request->getQueryParams();
        if (isset($params['seriesUID'])) {
            $this->seriesUID = $params['seriesUID'];
        }

        $this->violationType = $params['violationtype'] ?? 'default';
        return parent::handle($request);
    }

    /**
     * {@inheritDoc}
     *
     * @return \LORIS\Data\Provisioner
     */
    public function getBaseDataProvisioner(): \LORIS\Data\Provisioner
    {
        switch ($this->violationType) {
        case 'protocolviolation':
            return (new ProtocolViolationProvisioner($this->seriesUID));
        case 'protocolcheck':
            return (new ProtocolCheckViolationProvisioner($this->seriesUID))
            ->filter(
                new UserCenterMatchOrNullOrAnyPermission(
                    $this->allSitePermissionNames(),
                )
            );
        default:
            return (new Provisioner())
                ->filter(new UserCenterMatchOrNull())
                ->filter(new UserProjectMatchOrNull());
        }
    }

    /**
     * Overload filters to allow posssibility of a null CenterID. Filters are
     * added in getBaseDataProvisioner depending on the type
     *
     * @return \LORIS\Data\Provisioner
     */
    public function getDataProvisionerWithFilters() : \LORIS\Data\Provisioner
    {
        return $this->getBaseDataProvisioner();
    }

    /**
     * Include additional JS files
     *
     * @return array of javascript to be inserted
     */
    function getJSDependencies() : array
    {
        $factory = \NDB_Factory::singleton();
        $baseURL = $factory->settings()->getBaseURL();
        $deps    = parent::getJSDependencies();
        return array_merge(
            $deps,
            [
                $baseURL . "/mri_violations/js/mriViolationsIndex.js",
            ]
        );
    }

    /**
     * Include additional CSS files:
     *
     * @return array of css to be inserted
     */
    function getCSSDependencies() : array
    {
        $factory = \NDB_Factory::singleton();
        $baseURL = $factory->settings()->getBaseURL();
        $deps    = parent::getCSSDependencies();
        return array_merge(
            $deps,
            [
                $baseURL . "/mri_violations/css/mri_violations.css",
            ]
        );
    }
}

