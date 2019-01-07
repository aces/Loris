<?php
/**
 * Handles API requests for the candidate's visit
 *
 * PHP Version 5.5+
 *
 * @category Main
 * @package  API
 * @author   Dave MacFarlane <david.macfarlane2@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
namespace Loris\API\Candidates\Candidate\Visit\Imaging\Format;
require_once __DIR__ . '/../Image.php';
/**
 * Handles API requests for the candidate's visit. Extends
 * Candidate so that the constructor will validate the candidate
 * portion of URL automatically.
 *
 * @category Main
 * @package  API
 * @author   Dave MacFarlane <david.macfarlane2@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class Thumbnail extends \Loris\API\Candidates\Candidate\Visit\Imaging\Image
{
    /**
     * Construct a visit class object to serialize candidate visits
     *
     * @param string $method     The method of the HTTP request
     * @param string $CandID     The CandID to be serialized
     * @param string $VisitLabel The visit label to be serialized
     * @param string $Filename   The file whose thumbnail we want
     */
    public function __construct($method, $CandID, $VisitLabel, $Filename)
    {
        $requestDelegationCascade = $this->AutoHandleRequestDelegation;

        $this->AutoHandleRequestDelegation = false;

        if (empty($this->AllowedMethods)) {
            $this->AllowedMethods = ['GET'];
        }

        parent::__construct($method, $CandID, $VisitLabel, $Filename);

        if ($requestDelegationCascade) {
            $this->handleRequest();
        }

    }

    /**
     * Handles a GET request
     *
     * @return void but populates $this->JSON
     */
    public function handleGET()
    {
        $FullPath = $this->getFullPath();
        $fp       = fopen($FullPath, 'r');
        if ($fp !== false) {
            $this->Header("Content-Type: image/jpeg");
            fpassthru($fp);
            fclose($fp);
            $this->safeExit(0);
        } else {
            $this->header("HTTP/1.1 500 Internal Server Error");
            $this->error("Could not load thumbnail file");
            $this->safeExit(1);
        }
    }

    /**
     * Calculate the entity tag for this URL
     *
     * @return ?string
     */
    public function calculateETag()
    {
        return null;
    }

    /**
     * Get the root directory that images are stored under.
     *
     * @return string a directory on the server
     */
    protected function getAssemblyRoot()
    {
        $factory = \NDB_Factory::singleton();
        $config  = $factory->Config();
        return $config->getSetting("imagePath") . "/pic/";
    }

    /**
     * Get the filename under the assemblyRoot that the image
     * is stored at.
     *
     * @return string
     */
    protected function getDatabaseDir()
    {
        return $this->getHeader("check_pic_filename");
    }

}

if (isset($_REQUEST['PrintThumbnailFormat'])) {
    $obj = new Thumbnail(
        $_SERVER['REQUEST_METHOD'],
        $_REQUEST['CandID'],
        $_REQUEST['VisitLabel'],
        $_REQUEST['Filename']
    );
}

