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
        $baseurl = \NDB_Factory::singleton()
            ->config()
            ->getSetting('base');

        /*
         *  The pattern to find schema.yml files will scan the static directory
         *  of all modules and project's modules. The pattern is ment to be used by
         *  the glob() function.
         *
         *  Note: The GLOB_BRACE flag will be expended {project,} to match '' or
         *        'project' . This is equivalent to /(project)?/ in perl regex.
         */
        $pattern = $baseurl . '{project,}/modules/*/static/schema.yml' ;

        $urls = array_map(
            function ($f) {
                preg_match('/\/([a-z_]*)\/static\/schema.yml$/', $f, $matches);
                $tmp_array = array(
                              'url'  => $matches[0],
                              'name' => $matches[1],
                             );
                return (object) $tmp_array;
            },
            glob($pattern, GLOB_BRACE)
        );

        $this->tpl_data['schema_urls'] = json_encode($urls);
    }
}
