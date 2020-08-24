<?php declare(strict_types=1);
/**
 * Datadict module
 *
 * PHP version 7
 *
 * @category Datadict
 * @package  Main
 * @author   Ted Strauss <ted.strauss@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris-Trunk
 */
namespace LORIS\dictionary;

use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;
/**
 * Datadict module
 *
 * PHP version 7
 *
 * @category Datadict
 * @package  Main
 * @author   Ted Strauss <ted.strauss@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris-Trunk
 */

class Fields extends \NDB_Page
{
    /**
     * {@inheritDoc}
     *
     * @param \User $user The user whose access is being checked
     *
     * @return bool
     */
    function _hasAccess(\User $user) : bool
    {
        return $user->hasPermission('data_dict_edit');
    }

        /**
     * The modules class overrides the default behaviour to handle PATCH
     * requests for module_manager/modules/$modulename.
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return ResponseInterface
     */
    public function handle(ServerRequestInterface $request) : ResponseInterface
    {
        $user = $request->getAttribute("user");
        if ($user === null && !($user instanceof \User)) {
            return new \LORIS\Http\Response\JSON\InternalServerError(
                "No valid user"
            );
        }
        if (!($this->_hasAccess($user))) {
            return new \LORIS\Http\Response\JSON\Forbidden();
        }

        $path = $request->getURI()->getPath();
        if (strpos($path, "fields/") === false) {
            // if the path doesn't contain "fields" we shouldn't have
            // delegated to this class..
            throw new \LorisException("Invalid internal LORIS state");
        }
        $name = substr($path, strpos($path,"fields/") + strlen("fields/"));
        $origdesc = $this->getOriginalDescription($name);
        switch ($request->getMethod()) {
        case 'PUT':
            $status = $this->replaceDescription($name, $request->getBody()->__toString());
            return (new \LORIS\Http\Response())
                ->withHeader("Content-Type", "text/plain")
                ->withHeader("X-StatusDesc", $status)
                ->withStatus(201)
                ->withBody(
                    new \LORIS\Http\StringStream("")
                );
        default:
            return new \LORIS\Http\Response\JSON\MethodNotAllowed(
                ['PUT']
            );
        }
    }

    private function getOriginalDescription(string $name) : string {
        $modules = $this->lorisinstance->getActiveModules();

        // Brute force finding the name since we don't know what module
        // the dictionary item came from.
        foreach ($modules as $module) {
            $mdict = $module->getDataDictionary($this->lorisinstance);
            foreach($mdict as $cat) {
                foreach($cat->getItems() as $item) {
                    $iname   = $cat->getName() . '_' . $item->getName();
                    if ($name === $iname) {
                        return $item->getDescription();
                    }
                }
            }
        }
        return '';
    }

    private function replaceDescription(string $name, string $description) : string {
        $DB      = $this->lorisinstance->getDatabaseConnection();
        $origdesc = $this->getOriginalDescription($name);

        if ($description == $origdesc) {
            $DB->delete(
                'parameter_type_override',
                ['Name' => $name]
            );
            return "Unchanged";
        } else {
            $DB->replace(
                'parameter_type_override',
                [
                    'Description' => $description,
                    'Name'        => $name,
                ]
            );
            return "Modified";
        }
    }
}
