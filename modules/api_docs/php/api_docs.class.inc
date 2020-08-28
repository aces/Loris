<?php declare(strict_types=1);
/**
 * PHP Version 7
 *
 * @category Documentation
 * @package  Main
 * @author   Xavier Lecours <xavier.lecours@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris-Trunk/
 */
namespace LORIS\api_docs;
use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;

/**
 * This class list the schema files of this LORIS instance modules
 * for the swagger-ui app to present. It is a public module but will only
 * show specification (schemas) of module that the user can access.
 *
 * @category Documentation
 * @package  Main
 * @author   Xavier Lecours <xavier.lecours@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris-Trunk/
 */

class API_Docs extends \NDB_Page
{
    /**
     * Determine whether the user has permission to view this page
     *
     * @param \User $user The user whose access is being checked
     *
     * @return bool whether the user has access
     */
    public function hasAccess(\User $user): bool
    {
        return $user->hasPermission('superuser');
    }

    /**
     * This handler populates tmp_data before calling display on itself.
     *
     * The `schema_urls` template variable is meant to provide a value to the
     * urls property of the SwaggerUIBundle constructor. It must be an array
     * of objects with the following shape:
     *   {
     *     name: "api spec name",
     *     url:  "url of the schema.yml file"
     *   }
     *
     * @param ServerRequestInterface $request The PSR15 Request being handled
     *
     * @return ResponseInterface The PSR15 response for the page.
     */
    public function handle(ServerRequestInterface $request) : ResponseInterface
    {
        $loris   = $request->getAttribute('loris');
        $user    = $request->getAttribute('user');
        $baseurl = $request->getAttribute('baseurl');

        // Instanciate all modules that the user has access to.
        $activemodules = array_filter(
            $loris->getActiveModules(),
            function ($module) use ($user) {
                return $module->hasAccess($user) && $module->hasAPISpecification();
            }
        );

        // Build a spec object from each remaining modules
        // Using array_values to get rid of the array keys. json_encode default to
        // an object when the array keys do not start at zero or are not
        // consecutives.
        $api_specs = array_map(
            function ($module) use ($baseurl) {
                $chunks = [
                    $baseurl,
                    $module->getName(),
                    'static/schema.yml'
                ];

                $tmp_array = [
                    'url'  => implode('/', $chunks),
                    'name' => $module->getLongName(),
                ];

                return (object) $tmp_array;
            },
            array_values($activemodules)
        );

        $this->tpl_data['schema_urls'] = json_encode($api_specs);

        return (new \LORIS\Http\Response())
            ->withBody(new \LORIS\Http\StringStream($this->display()));
    }
}
