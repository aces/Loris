<?php declare(strict_types=1);
namespace LORIS\dictionary;

use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;
/**
 * The dictionary/fields endpoint handles requests to update a specific
 * field description
 *
 * @license http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
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
     * The modules class overrides the default behaviour to handle PUT
     * requests for the fields endpoint.
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
        $name = substr($path, strpos($path, "fields/") + strlen("fields/"));
        switch ($request->getMethod()) {
        case 'PUT':
            $status = $this->_replaceDescription(
                $name,
                $request->getBody()->__toString()
            );
            return (new \LORIS\Http\Response())
                ->withStatus(204)
                ->withHeader("Content-Type", "text/plain")
                ->withHeader("X-StatusDesc", $status)
                ->withBody(
                    new \LORIS\Http\StringStream("")
                );
        default:
            return new \LORIS\Http\Response\JSON\MethodNotAllowed(
                ['PUT']
            );
        }
    }

    /**
     * Get the original, non-overridden description for field named $name
     *
     * @param string $name The field name
     *
     * @return string
     */
    private function _getOriginalDescription(string $name) : string
    {
        $modules = $this->lorisinstance->getActiveModules();

        // Brute force finding the name since we don't know what module
        // the dictionary item came from.
        foreach ($modules as $module) {
            $mdict = $module->getDataDictionary($this->lorisinstance);
            foreach ($mdict as $cat) {
                foreach ($cat->getItems() as $item) {
                    $iname = $cat->getName() . '_' . $item->getName();
                    if ($name === $iname) {
                        return $item->getDescription();
                    }
                }
            }
        }
        return '';
    }

    /**
     * Override the description for field named $name and save it in the
     * database.
     *
     * @param string $name        The field being overridden
     * @param string $description The new description
     *
     * @return string The status of the description after overriding
     */
    private function _replaceDescription(string $name, string $description) : string
    {
        $DB       = $this->lorisinstance->getDatabaseConnection();
        $origdesc = $this->_getOriginalDescription($name);

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
