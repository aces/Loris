<?php
namespace LORIS\dictionary;
use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;

/**
 * Categories page returns a list of valid module and their categories
 * which both have a valid data dictionary and the user accessing the
 * page has access to.
 *
 * @license http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */
class ModuleDict extends \NDB_Page
{
    protected $module;

    /**
     * Override the hndle to return a list of valid modules and categories
     * that the user has access to.
     *
     * @param ServerRequestInterface $request the incoming PSR7 request
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
        if (strpos($path, "module/") === false) {
            // if the path doesn't contain "fields" we shouldn't have
            // delegated to this class..
            throw new \LorisException("Invalid internal LORIS state");
        }

        $name = substr($path, strpos($path, "module/") + strlen("module/"));
        return $this->moduleDictionary($request, $user, $name);
    }

    /**
     * Return a response corresponding to the dictionary for the module named
     * modulename
     *
     * @param ServerRequestInterface $request    The request
     * @param \User                  $user       The user accessing the dictionary
     * @param string                 $modulename The module whose dictionary should
     *                                           be retrieved
     *
     * @return ResponseInterface
     */
    public function moduleDictionary(
        ServerRequestInterface $request,
        \User $user,
        string $modulename
    ) : ResponseInterface {
        $loris  = $this->lorisinstance;
        $module = null;

        foreach ($loris->getActiveModules() as $m) {
            if ($m->getName() == $modulename) {
                $module = $m;
                break;
            }
        }

        if ($module === null) {
            return new \LORIS\Http\Response\JSON\NotFound('module not found');
        }

        $data = $this->Module->getUserModuleCategories($user, $loris, $modulename);
        $prov = (new DataDictRowProvisioner($loris, $data['CategoryItems']))
            ->filter(new \LORIS\Data\Filters\AccessibleResourceFilter());

        $organized = [];
        foreach ($prov->execute($user) as $row) {
            $cat = $row->getCategory()->getName();
            if (!isset($organized[$cat])) {
                $organized[$cat] = [];
            }
            $fieldname = $row->getFieldName();
            $datatype  = $row->getDataType();
            $organized[$cat][$fieldname] = [
                'description' => $row->getDescription(),
                'scope'       => $row->getScope(),
                'type'        => $row->getDataType(),
                'cardinality' => $row->getCardinality(),
            ];
            if ($datatype instanceof \LORIS\Data\Types\Enumeration) {
                $organized[$cat][$fieldname]['options'] = $datatype->getOptions();
            }
        }
        return new \LORIS\Http\Response\JSON\OK($organized);
    }


}