<?php declare(strict_types=1);
/**
 * This class features the code that enables access to the LORIS Biobank Module.
 *
 * PHP Version 7.2
 *
 * @category   Page
 * @package    Loris
 * @subpackage Biobank
 * @author     Henri Rabalais <henri.rabalais@mcin.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.text GPLv3
 * @link       http://www.github.com/aces/Loris/
 */
namespace LORIS\biobank;
use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;

/**
 * This class features the code that enables access to the LORIS Biobank Module.
 *
 * PHP Version 7.2
 *
 * @category   Page
 * @package    Loris
 * @subpackage Biobank
 * @author     Henri Rabalais <henri.rabalais@mcin.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.text GPLv3
 * @link       http://www.github.com/aces/Loris/
 */
class Biobank extends \NDB_Menu_Filter
{
    /**
     * Determine whether the user has permission to view this page.
     *
     * @param User $user to be checked.
     *
     * @return bool whether the user has access.
     */
    function _hasAccess(\User $user) : bool
    {
        return $user->hasPermission('biobank_access');
    }

    /**
     * Set up the variables required by for construction of page
     *
     * @return void
     */
    function _setupVariables()
    {
        $this->skipTemplate = true;
        $this->AjaxModule   = true;
    }

    // TODO: Revisit file downloading mechanism. This should likely be done
    // somewhere else using different code. Perhaps John S. can provide some
    // clarity.
    /**
     * Allows files to be downloaded
     *
     * @param file $file File to be downloaded
     * @param user $user User to be checked for permission
     *
     * @return ResponseInterface the outgoing PSR7 response.
     */
    function downloadFile($file, $user) : ResponseInterface
    {
        if (!$user->hasPermission('biobank_specimen_view')) {
            throw new \Forbidden('Permission to download file is denied');
        }

        $fileName = basename($file);
        $config   = \NDB_Config::singleton();
        $path     = $config->getSetting('mediaPath');
        $filePath = $path . $fileName;

        if (!file_exist($filePath)) {
            error_log('ERROR: File'.$filePath.' does not exist');
            throw new \NotFound('File was not found');
        }

        return (new \LORIS\Http\Response())
            ->withHeader('Content-Type', 'image/jpeg')
            ->withHeaer('Content-Length', (string) filesize($file))
            ->withBody(new \LORIS\Http\StringStream($filePath));
    }

    /**
     * Include additional CSS files:
     *
     * @return array of javascript to be inserted
     */
    function getCSSDependencies()
    {
        $factory = \NDB_Factory::singleton();
        $baseURL = $factory->settings()->getBaseURL();
        $deps    = parent::getCSSDependencies();
        return array_merge(
            $deps,
            [$baseURL . "/biobank/css/biobank.css"]
        );
    }

    /**
     * Include additional JS files
     *
     * @return array of javascript to be inserted
     */
    function getJSDependencies()
    {
        $factory = \NDB_Factory::singleton();
        $baseURL = $factory->settings()->getBaseURL();
        $deps    = parent::getJSDependencies();
        return array_merge(
            $deps,
            [$baseURL . "/biobank/js/biobankIndex.js"]
        );
    }
}

