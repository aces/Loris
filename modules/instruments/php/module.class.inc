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

        $pathComponents = array();

        $breakdown = preg_match(
            "#(/*)([a-zA-Z0-9_-]+)(/*)(.*)#",
            $request->getURI()->getPath(),
            $pathComponents
        );

        $instrumentName = $pathComponents[2];
        $page           = $pathComponents[4];

        $params    = $request->getQueryParams();
        $commentID = $params['commentID'] ?? null;
        if (empty($commentID)) {
            return (new \Zend\Diactoros\Response())
                ->withBody(new \LORIS\Http\StringStream("Missing CommentID"))
                ->withStatus(400);
        }
        $instrument = \NDB_BVL_Instrument::factory(
            $instrumentName,
            $commentID,
            $page
        );

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
     * @param string $type The type of widgets to get
     * @param \User  $user The user widgets are being retrieved for.
     *
     * @return \LORIS\GUI\Widget[]
     */
    public function getWidgets(string $type, \User $user) : array
    {
        switch($type) {
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
                    $baseURL . "/statistics/statistics_site/",
                    ""
                ),

            ];
        }
        return [];
    }
}
