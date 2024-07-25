<?php
namespace LORIS\dictionary;
use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;

/**
 * The ModuleDict page returns the dictionary for a single module.
 *
 * @license http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */
class ModuleDict extends \NDB_Page
{
    protected $module;

    /**
     * Override the handle to return a dictionary for a given module
     *
     * @param ServerRequestInterface $request the incoming PSR7 request
     *
     * @return ResponseInterface
     */
    public function handle(ServerRequestInterface $request) : ResponseInterface
    {
        if ($request->getMethod() !== 'GET') {
            return new \LORIS\Http\Response\JSON\MethodNotAllowed(['GET']);
        }

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
            // if the path doesn't contain "module" we shouldn't have
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
        $loris  = $this->loris;
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

        assert($this->Module instanceof Module);

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
            $scope     = $row->getScope();
            $organized[$cat][$fieldname] = [
                'description' => $row->getDescription(),
                'scope'       => $scope,
                'type'        => $row->getDataType(),
                'cardinality' => $row->getCardinality(),
            ];
            if ($datatype instanceof \LORIS\Data\Types\Enumeration) {
                $organized[$cat][$fieldname]['options'] = $datatype->getOptions();
                $labels = $datatype->getLabels();
                if (!empty($labels)) {
                    $organized[$cat][$fieldname]['labels'] = $datatype->getLabels();
                }
            }
            if ($scope->__toString() == "session") {
                $organized[$cat][$fieldname]['visits'] = $row->getVisits();
            }
        }
        return new \LORIS\Http\Response\JSON\OK($organized);
    }


}
