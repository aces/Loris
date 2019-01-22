<?php
/**
 * The validateIDs endpoint is used to verify whether or not
 * a candidate PSCID and CandID match
 *
 * It takes two parameters (PSCID and CandID) and returns either
 * "1" or "0".
 *
 * PHP Version 7
 *
 * @category Main
 * @package  Candidate_List
 * @author   Loris Team <loris.mni@bic.mni.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
namespace LORIS\document_repository;
use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;

/**
 * Implements the ValidateIDs endpoint
 *
 * @category Main
 * @package  Candidate_List
 * @author   Loris Team <loris.mni@bic.mni.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class Files extends \NDB_Page
{
    public $skipTemplate = true;

    /**
     * Same as the permissions for the main menu filter page.
     *
     * @param \User $user The user whose access is being checked
     *
     * @return bool true iff the user has access to this page.
     */
    function _hasAccess(\User $user) : bool
    {
        return (
            $user->hasPermission('access_all_profiles')
            || ($user->hasStudySite() && $user->hasPermission('data_entry'))

        );
    }

    /**
     * This acts as an AJAX endpoint that only returns a "0" or "1" depending
     * on whether the candidate passed exists.
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return ResponseInterface The outgoing PSR7 response
     */
    public function handle(ServerRequestInterface $request) : ResponseInterface
    {
        if ($request->getMethod() == "GET") {
            return (new \LORIS\Http\Response())
                ->withHeader("Content-Type", "text/plain")
                ->withStatus(200)
                ->withHeader("Allow", "GET")
                ->withBody(
                    new \LORIS\Http\StringStream(
                        json_encode($this->getUploadDocFields())
                    )
                );
        }
    }
/**
 * Returns a list of fields from database
 *
 * @return array
 * @throws DatabaseException
 */
  function getUploadDocFields(): array
  {
    $db    = \Database::singleton();
    $query = $db->pselect(
        "SELECT * FROM document_repository_categories",
        array()
    );
    //categories
    $categoriesList = array();
    foreach ($query as $value) {
           $arr = $this->parseCategory($value);
           $categoriesList[$arr['id']] =$arr['name'];
    }
    //site
    $siteList = \Utility::getSiteList(false);
    //instrument
    $instruments     = $db->pselect(
        "SELECT Test_name FROM test_names ORDER BY Test_name",
        array()
    );
    $instrumentsList = $this->toDocSelect($instruments, "Test_name", null);
    //docFile
    $docData = null;
    if (isset($_GET['idDocFile'])) {
        $idDocFile = $_GET['idDocFile'];
        $docData   = $db->pselectRow(
            "SELECT " .
            "record_id as id, " .
            "PSCID as pscid, " .
            "File_category as category," .
            "visitLabel, " .
            "Instrument as instrument, " .
            "For_site as forSite, " .
            "comments, " .
            "File_Name as fileName, " .
            "version " .
            "FROM document_repository " .
            " WHERE record_id = $idDocFile",
            array()
        );
    }
    $result = array(
               'categories'  => $categoriesList,
               'sites'       => $siteList,
               'instruments' => $instrumentsList,
               'docData'     => $docData,
              );
    return $result;
  }
/**
 * Handler of parsing category
 *
 * @param string $value the value
 *
 * @return array
 */
function parseCategory($value): array
{
        $id    = $value['id'];
        $depth = 0;
        $DB    = \Database::singleton();
            $categoryName = $value['category_name'];
    do {
        if ($value['parent_id'] != 0) {
            $depth       += 1;
            $parent_id    = $value['parent_id'];
            $query        = "SELECT * FROM document_repository_categories".
                            " where id=$parent_id";
            $value        = $DB->pselectRow($query, array());
            $categoryName = $value['category_name'] . ">" . $categoryName;
        }
    } while ($value['parent_id'] != 0);
         return array(
                 "name" => $categoryName,
                 "id"   => $id,
                );
}
/**
 * Utility function to convert data from database to a
 * (select) dropdown friendly format
 *
 * @param array  $options array of options
 * @param string $item    key
 * @param string $item2   value
 *
 * @return array
 */
function toDocSelect($options, $item, $item2): array
{
    $selectOptions = array();
    $optionsValue = $item;
    if (isset($item2)) {
        $optionsValue = $item2;
    }
    foreach ($options as $key => $value) {
        $selectOptions[$options[$key][$optionsValue]] = $options[$key][$item];
    }
    return $selectOptions;
}
}

