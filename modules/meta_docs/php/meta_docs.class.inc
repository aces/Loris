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
namespace LORIS\meta_docs;

use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;

/**
 * Class module implements the basic LORIS module functionality
 *
 * @category Documentation
 * @package  Main
 * @author   Xavier Lecours <xavier.lecours@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris-Trunk/
 */

class Meta_Docs extends \NDB_Page
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
        return true;
    }

    /**
     * Sets the template variable for the schema file to load.
     *
     * @return void
     */
    function setup()
    {
        //TODO :: This list should be dynamic
        $modules_with_specs = array(
                               'api',
                              );

        $urls = array_map(
            function ($modulename) {
                return (object) array(
                                 'url'  => "/$modulename/static/schema.yml",
                                 'name' => $modulename,
                                );
            },
            $modules_with_specs
        );

        $this->tpl_data['schema_urls'] = json_encode($urls);
        error_log(print_r($this->tpl_data['schema_urls'], true));
    }
}
