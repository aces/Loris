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
namespace LORIS\dashboard;

use Database;
use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;

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
class AjaxChartHelper extends \NDB_Page
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
        /**
         * Ensure it's a POST request.
         */
        if ($request->getMethod() != 'POST') {
            return (new \LORIS\Http\Response())
                ->withHeader('Content-Type', 'application/json')
                ->withStatus(405)
                ->withHeader('Allow', 'POST')
                ->withBody(
                    new \LORIS\Http\StringStream(
                        'Only POST requests are allowed'
                    )
                );
        }
        /**
         * Parse POST request body.
         */
        $requestBody = $request->getParsedBody();

        /**
         * Response to reply.
         */
        $response = $this->processRequest($requestBody);
        return (new \LORIS\Http\Response())
            ->withHeader('Content-Type', 'application/json')
            ->withStatus(200)
            ->withHeader('Allow', 'POST')
            ->withBody(
                new \LORIS\Http\StringStream(
                    json_encode($response)
                )
            );
    }
    /**
     * Processes the values and saves to database
     *
     * @param array $values the user data received.
     *
     * @return array
     */
    function processRequest(array $values) : array
    {
        if (isset($values['command'])
            && $values['command'] == 'get_scan_line_data'
        ) {
            $response           = $this->populateDataForScanLineChart($values);
            $response['status'] = 'success';
        } else if (isset($values['command'])
            && $values['command'] == 'get_recruitment_pie_data'
        ) {
            $response           = $this->populateDataForPieChart($values);
            $response['status'] = 'success';
        } else if (isset($values['command'])
            && $values['command'] == 'get_recruitment_bar_data'
        ) {
            $response           = $this->populateDataForBarChart($values);
            $response['status'] = 'success';
        } else {
            $response['status'] = 'error';
        }
        return $response;
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

        $DB = Database::singleton();

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
     * @param string $siteID ID of a site
     * @param array  $labels chart labels (months to query)
     *
     * @return array
     */
    function getScanData($siteID, $labels)
    {
        $DB   = Database::singleton();
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
    function populateDataForPieChart($values) : array
    {
        $DB =& Database::singleton();

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
    function populateDataForBarChart($values) : array
    {
        $DB            = Database::singleton();
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

}
