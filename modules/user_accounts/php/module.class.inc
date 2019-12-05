<?php
/**
 * This serves as a hint to LORIS that this module is a real module.
 * It does nothing but implement the module class in the module's namespace.
 *
 * PHP Version 5
 *
 * @category Behavioural
 * @package  Main
 * @author   Xavier Lecours Boucher <xavier.lecoursboucher@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris-Trunk/
 */

namespace LORIS\user_accounts;
use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;
/**
 * Class module implements the basic LORIS module functionality
 *
 * @category Behavioural
 * @package  Main
 * @author   Xavier Lecours Boucher <xavier.lecoursboucher@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris-Trunk/
 */
class Module extends \Module
{
    /**
     * The edit_user page overrides the default handler in order to delegate
     * edit_user/$identifeir to the edit_user page.
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return ResponseInterface The outgoing PSR15 response
     */
    public function handle(ServerRequestInterface $request) : ResponseInterface
    {
        if (strpos($request->getUri()->getPath(), "/edit_user/") === 0) {
            $page = $this->loadPage("edit_user");
            return $page->process($request, $page);
        }
        return parent::handle($request);
    }

    public function getMenuCategory() : string {
        return "Admin";
    }
    public function getLongName() : string {
        return "User Accounts";
    }
}
