<?php
/**
 * This serves as a hint to LORIS that this module is a real module.
 * It does nothing but implement the module class in the module's namespace.
 *
 * PHP Version 5
 *
 * @category   Behavioural
 * @package    Main
 * @subpackage Behavioural
 * @author     Dave MacFarlane <david.macfarlane2@mcgill.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris-Trunk/
 */
namespace LORIS\timepoint_list;

/**
 * Class module implements the basic LORIS module functionality
 *
 * @category   Behavioural
 * @package    Main
 * @subpackage Behavioural
 * @author     Dave MacFarlane <david.macfarlane2@mcgill.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris-Trunk/
 */
class Module extends \Module
{
    /**
     * The timepoint_list module overrides the default routing to ensure that
     * the "timepoint_list" subpage is loaded when called with an unknown
     * page. This makes it possible to provide routes which fallback on loading
     * the timepoint in the module.
     */
    public function handle(\Psr\Http\Message\ServerRequestInterface $request) : \Psr\Http\Message\ResponseInterface {
        try {
         $resp = parent::handle($request);
         if ($resp->getStatusCode() != 404) {
               return $resp;
        }
        } catch (\NotFound $e) {
        }
        $page = $this->loadPage("timepoint_list");
        return $page->process($request, $page);
    }
}
