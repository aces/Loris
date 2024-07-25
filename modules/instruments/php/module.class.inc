<?php
/**
 * This serves as a hint to LORIS that this module is a real module.
 * It does nothing but implement the module class in the module's namespace.
 *
 * PHP Version 7
 *
 * @category   Behavioural
 * @package    Main
 * @subpackage Imaging
 * @author     Dave MacFarlane <david.macfarlane2@mcgill.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris-Trunk/
 */
namespace LORIS\instruments;
use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;

/**
 * Class module implements the basic LORIS module functionality
 *
 * @category   Behavioural
 * @package    Main
 * @subpackage Imaging
 * @author     Dave MacFarlane <david.macfarlane2@mcgill.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris-Trunk/
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
        return parent::hasAccess($user) && $user->hasPermission('data_entry');
    }

    /**
     * The instruments module loads instruments in LORIS.
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return ResponseInterface The outgoing PSR7 response
     */
    public function handle(ServerRequestInterface $request) : ResponseInterface
    {
        $resp = parent::handle($request);
        if ($resp->getStatusCode() != 404) {
            return $resp;
        }

        $path           = $request->getURI()->getPath();
        $pathComponents = [];

        // Breakdown path information from the request.
        preg_match(
            "#(/*)([a-zA-Z0-9_-]+)(/*)(.*)#",
            $path,
            $pathComponents
        );

        $instrumentName = $pathComponents[2];
        $page           = $pathComponents[4];

        $this->logger->debug("Loading $instrumentName $page");
        $params    = $request->getQueryParams();
        $commentID = $params['commentID'] ?? null;
        if (empty($commentID)) {
            return (new \Laminas\Diactoros\Response())
                ->withStatus(400)
                ->withBody(new \LORIS\Http\StringStream("Missing CommentID"));
        }

        $loris      = $request->getAttribute("loris");
        $instrument = \NDB_BVL_Instrument::factory(
            $loris,
            $instrumentName,
            $commentID,
            $page
        );

        $user = $request->getAttribute("user");
        if ($instrument->_hasAccess($user) == false) {
            return (new \Laminas\Diactoros\Response())
                ->withStatus(403)
                ->withBody(new \LORIS\Http\StringStream("Permission denied"));
        }

        $request = $request->withAttribute('pageclass', $instrument);

        return $instrument->process($request, $instrument);
    }

    /**
     * {@inheritDoc}
     *
     * @return string The human readable name for this module
     */
    public function getLongName() : string
    {
        return "Instruments";
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
        switch ($type) {
        case "usertasks":
            $factory = \NDB_Factory::singleton();
            $DB      = $factory->database();
            $baseURL = $factory->settings()->getBaseURL();
            return [
                new \LORIS\dashboard\TaskQueryWidget(
                    $user,
                    "Incomplete form",
                    $DB,
                    "SELECT COUNT(*) FROM flag
                        LEFT JOIN session s ON (s.ID=flag.SessionID)
                        LEFT JOIN candidate c ON (s.CandID=c.CandID)
                    WHERE flag.Data_entry='In Progress'
                        AND s.Active='Y' AND c.Active='Y'",
                    'access_all_profiles',
                    's.CenterID',
                    's.ProjectID',
                    $baseURL . "/statistics/statistics_site/",
                    ""
                ),

            ];
        case 'candidate':
            $factory = \NDB_Factory::singleton();
            $baseurl = $factory->settings()->getBaseURL();

            return [
                new \LORIS\candidate_profile\CandidateWidget(
                    "Behavioural Data",
                    $baseurl . "/instruments/js/CandidateInstrumentList.js",
                    'lorisjs.instruments.CandidateInstrumentList.default',
                    [],
                    2,
                    2,
                ),
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
        return new InstrumentQueryEngine($this->loris);
    }
}
