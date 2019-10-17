<?php declare(strict_types=1);
/**
 * POST request methods.
 *
 * Used with c3.js for the Dashboard.
 *
 * PHP Version 7
 *
 * @category Loris
 * @package  Dashboard
 * @author   Alizée Wickenheiser <alizee.wickenheiser@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
namespace LORIS\dashboard\endpoints;

use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;
use \LORIS\Api\Endpoint;
use \LORIS\Middleware\ETagCalculator;

/**
 * The NDB_Page for the POST requests.
 *
 * @category Loris
 * @package  Dashboard
 * @author   Tara Campbell <tara.campbell@mail.mcgill.ca>
 *           Alizée Wickenheiser <alizee.wickenheiser@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class ChartHelper extends Endpoint implements ETagCalculator
{
    public $skipTemplate = true;
    /**
     * This function will return a json response.
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return ResponseInterface The outgoing PSR7 response
     */
    public function handle(ServerRequestInterface $request) : ResponseInterface
    {
        // Ensure GET or POST request.
        switch ($request->getMethod()) {
        case 'GET':
            return $this->_handleGET($request);
        default:
            return new \LORIS\Http\Response\MethodNotAllowed(
                $this->allowedMethods()
            );
        }
    }

    /**
     * Initialize setup, the extra values for the
     * create timepoint form. (psc & errors)
     *
     * @param ServerRequestInterface $request The incoming PSR7 request.
     *
     * @return ResponseInterface The outgoing PSR7 response
     */
    private function _handleGET(ServerRequestInterface $request) : ResponseInterface
    {
        // Parse GET query params.
        $values   = $request->getQueryParams();
        $response = array();
        if (isset($values['get'])
            && $values['get'] == 'scan_line_data'
        ) {
            $response           = $this->populateDataForScanLineChart($values);
            $response['status'] = 'success';
        } else if (isset($values['get'])
            && $values['get'] == 'recruitment_pie_data'
        ) {
            $response           = $this->populateDataForPieChart($values);
            $response['status'] = 'success';
        } else if (isset($values['get'])
            && $values['get'] == 'recruitment_bar_data'
        ) {
            $response           = $this->populateDataForBarChart($values);
            $response['status'] = 'success';
        } else {
            $response['status'] = 'error';
        }
        return new \LORIS\Http\Response\JsonResponse(
            $response
        );
    }

    /**
     * Used by Dashboard (AJAX) Post to
     * get the data for scan line chart.
     *
     * @param array $values the user data received.
     *
     * @return array
     */
    function populateDataForScanLineChart($values) : array
    {
        $client = new \NDB_Client;
        $client->makeCommandLine();
        $client->initialize();

        $DB = \NDB_Factory::singleton()->database();

        $scanData           = array();
        $scanStartDate      = $DB->pselectOne(
            "SELECT MIN(pf.Value) 
     FROM parameter_file pf 
     JOIN parameter_type pt USING (ParameterTypeID) 
     WHERE pt.Name='acquisition_date'",
            array()
        );
        $scanEndDate        = $DB->pselectOne(
            "SELECT MAX(pf.Value) 
     FROM parameter_file pf 
     JOIN parameter_type pt USING (ParameterTypeID) 
     WHERE pt.Name='acquisition_date'",
            array()
        );
        $scanData['labels']
            = $this->createLineChartLabels($scanStartDate, $scanEndDate);
        $list_of_sites      = \Utility::getAssociativeSiteList(true, false);
        foreach ($list_of_sites as $siteID => $siteName) {
            $scanData['datasets'][] = array(
                                       'name' => $siteName,
                                       'data' => $this->getScanData(
                                           $siteID,
                                           $scanData['labels']
                                       ),
                                      );
        }
        $values['scanData'] = $scanData;
        return $values;
    }

    /**
     * Create chart labels (dates)
     *
     * @param string $startDate start date of scans
     * @param string $endDate   end date of scans
     *
     * @return array
     */
    function createLineChartLabels($startDate, $endDate)
    {
        $startDateYear  = substr($startDate, 0, 4);
        $endDateYear    = substr($endDate, 0, 4);
        $startDateMonth = substr($startDate, 5, 2);
        $endDateMonth   = substr($endDate, 5, 2);
        $labels         = array();
        for ($year = (int)$startDateYear; $year <= (int)$endDateYear; $year++) {
            $startMonth = ($year == (int)$startDateYear) ? (int)$startDateMonth : 1;
            $endMonth   = ($year == (int)$endDateYear) ? (int)$endDateMonth : 12;
            for ($month = $startMonth; $month <= $endMonth; $month++) {
                $labels[] = $month . "-" . $year;
            }
        }
        return $labels;
    }

    /**
     * Get scan data for each month in the label array
     *
     * @param int   $siteID ID of a site
     * @param array $labels chart labels (months to query)
     *
     * @return array
     */
    function getScanData(int $siteID, array $labels): array
    {
        $DB   = \NDB_Factory::singleton()->database();
        $data = array();
        foreach ($labels as $label) {
            $month  = (strlen($label) == 6)
                ? substr($label, 0, 1) : substr($label, 0, 2);
            $year   = substr($label, -4, 4);
            $data[] = $DB->pselectOne(
                "SELECT COUNT(distinct s.ID) 
             FROM files f
             LEFT JOIN parameter_file pf USING (FileID)
             LEFT JOIN session s ON (s.ID=f.SessionID) 
             JOIN parameter_type pt USING (ParameterTypeID)
             WHERE s.CenterID=:Site
             AND pt.Name='acquisition_date'
             AND MONTH(pf.Value)=:Month 
             AND YEAR(pf.Value)=:Year",
                array(
                 'Site'  => $siteID,
                 'Month' => $month,
                 'Year'  => $year,
                )
            );
        }
        return $data;
    }

    /**
     * Used by Dashboard (AJAX) Post to
     * get the data for pie chart.
     *
     * @param array $values the user data received.
     *
     * @return array
     */
    function populateDataForPieChart(array $values) : array
    {
        $DB = \NDB_Factory::singleton()->database();

        $recruitmentBySiteData = array();
        $list_of_sites         = \Utility::getAssociativeSiteList(true, false);

        foreach ($list_of_sites as $siteID => $siteName) {

            $totalRecruitment = $DB->pselectOne(
                "SELECT COUNT(c.CandID)
         FROM candidate c
         WHERE
           c.RegistrationCenterID=:Site AND
           c.Active='Y' AND
           c.Entity_type='Human'",
                array('Site' => $siteID)
            );

            $recruitmentBySiteData[] = array(
                                        'label' => $siteName,
                                        'total' => $totalRecruitment,
                                       );
        }
        $values['recruitmentBySiteData'] = $recruitmentBySiteData;
        return $values;
    }

    /**
     * Used by Dashboard (AJAX) Post to
     * get the data for bar chart.
     *
     * @param array $values the user data received.
     *
     * @return array
     */
    function populateDataForBarChart(array $values) : array
    {
        $DB            = \NDB_Factory::singleton()->database();
        $sexData       = array();
        $list_of_sites = \Utility::getAssociativeSiteList(true, false);

        foreach ($list_of_sites as $siteID => $siteName) {
            $sexData['labels'][] = $siteName;
            $sexData['datasets']['female'][] = $DB->pselectOne(
                "SELECT COUNT(c.CandID)
         FROM candidate c
         WHERE c.RegistrationCenterID=:Site AND c.Sex='female' AND c.Active='Y'
         AND c.Entity_type='Human'",
                array('Site' => $siteID)
            );
            $sexData['datasets']['male'][]   = $DB->pselectOne(
                "SELECT COUNT(c.CandID)
         FROM candidate c
         WHERE c.RegistrationCenterID=:Site AND c.Sex='male' AND c.Active='Y'
         AND c.Entity_type='Human'",
                array('Site' => $siteID)
            );
        }
        $values['sexData'] = $sexData;
        return $values;
    }

    /**
     * Returns true if the user has permission to access
     * the Genomic Browser module
     *
     * @param \User $user The user whose access is being checked
     *
     * @return bool true if user has permission
     */
    function _hasAccess(\User $user) : bool
    {
        return true;
    }

    /**
     * An ETagCalculator provides the ability to calculate an ETag for
     * an incoming HTTP request.
     *
     * @param ServerRequestInterface $request The incoming PSR7 request.
     *
     * @return string The value to use for the ETag header.
     */
    public function ETag(ServerRequestInterface $request): string
    {
        return md5(json_encode((string) $this->_handleGET($request)->getBody()));
    }

    /**
     * Return an array of valid HTTP methods for this endpoint
     *
     * @return string[] Valid versions
     */
    protected function allowedMethods(): array
    {
        return array('GET');
    }

    /**
     * Return a list of LORIS API versions which this endpoint
     * supports.
     *
     * @return string[] LORIS API Versions
     */
    protected function supportedVersions(): array
    {
        return array('unknown');
    }
}
