<?php declare(strict_types=1);

/**
 * This serves as a hint to LORIS that this module is a real module.
 * It does nothing but implement the module class in the module's namespace.
 *
 * PHP Version 8.2
 *
 * @category   Module
 * @package    Main
 * @subpackage Biobank
 * @author     Dave MacFarlane <david.macfarlane2@mcgill.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris-Trunk/
 */
namespace LORIS\biobank;
use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;

/**
 * Class module implements the basic LORIS module functionality
 *
 * @category   Module
 * @package    Main
 * @subpackage Biobank
 * @author     Henri Rabalais <henri.rabalais@mcgill.ca>
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
        return parent::hasAccess($user) &&
            $user->hasAnyPermission(
                [
                    'biobank_specimen_view',
                    'biobank_container_view',
                    'biobank_pool_view',
                ]
            );
    }

    /**
     * The default handler for a module routes to a page of the first component of
     * the URL's name, or the same name as the module if serving the root of the
     * module.
     *
     * Modules extend PrefixRouter, so that the parent handler knows that the
     * css, static, and js routes should be routed through the file system to
     * retrieve the files before trying to load any specific pages.
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return ResponseInterface the outgoing PSR7 response
     */
    public function handle(ServerRequestInterface $request) : ResponseInterface
    {
        $this->logger->debug("Module handle function called");
        $resp = parent::handle($request);
        $path = $request->getAttribute("unhandledURI")->getPath();
        if ($resp->getStatusCode() != 404) {
            if (preg_match('/(\.css)$/', $path) == 1) {
                $resp = $resp->withHeader(
                    "Content-Type",
                    "text/css"
                );
            }
            if (preg_match('/(\.js)$/', $path) == 1) {
                $resp = $resp->withHeader(
                    "Content-Type",
                    "application/javascript"
                );
            }
            return $resp;
        }

        $this->loris = $request->getAttribute("loris");
        $pagename    = $this->getName();
        $path        = trim($path, "/");
        if ($path == 'optionsendpoint'
            || $path == 'poolendpoint'
            || $path == 'containerendpoint'
            || $path == 'specimenendpoint'
            || $path == 'barcodes'
        ) {
            // There is a subpage
            $pagename = explode("/", $path)[0];
        }

        $user  = $request->getAttribute("user") ?? new \LORIS\AnonymousUser();
        $loris = $request->getAttribute("loris");

        try {
            $page = $this->loadPage($loris, $pagename);
        } catch (\NotFound $e) {
            $this->logger->debug("Page $pagename not found");
            return $resp->withStatus(404);
        }
        // FIXME: Hack required for breadcrumbs. This should be removed,
        // but some tests depend on it.
        if ($this->getName() === $pagename) {
            $_REQUEST['test_name'] = $pagename;
        } else {
            $_REQUEST['subtest'] = $pagename;
        }

        $page->loadResources($user, $request);
        if ($page->isAccessibleBy($user) !== true) {
            return (new \LORIS\Middleware\PageDecorationMiddleware(
                $user
            ))->process(
                $request,
                new \LORIS\Router\NoopResponder(
                    new \LORIS\Http\Error(
                        $request,
                        403,
                        "You do not have access to this page."
                    )
                )
            );
        }
        return $page->process($request, $page);
    }

    /**
     * {@inheritDoc}
     *
     * @return ?\LORIS\GUI\MenuCategory
     */
    public function getMenuCategory() : ?\LORIS\GUI\MenuCategory
    {
        return \LORIS\GUI\MenuCategory::singleton("Biobank");
    }

    /**
     * {@inheritDoc}
     *
     * @return string
     */
    public function getLongName() : string
    {
        return "Biospecimens";
    }
}
