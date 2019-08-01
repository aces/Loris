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
}
