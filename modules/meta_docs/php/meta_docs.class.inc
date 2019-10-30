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
        $urls = array_map(
            function ($m) {
                preg_match('/\/([a-z_]*)\/static\/schema.yml$/', $m, $matches);
                error_log(print_r($matches, true));
                return (object) array(
                                 'url'  => $matches[0],
                                 'name' => $matches[1],
                                );
            },
            glob(__DIR__ . '/../../*/static/schema.yml')
        );

        $this->tpl_data['schema_urls'] = json_encode($urls);
    }
}
