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
class Categories extends \NDB_Page
{
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
        $queryparams = $request->getQueryParams();
        $user        = $request->getAttribute("user");
        if (isset($queryparams['module'])) {
            return $this->moduleDictionary($request, $user, $queryparams['module']);
        }

        // getUserModuleCategories enforces permissions and strips out modules
        // that don't have any dictionary.
        $modulesandcats = $this->Module->getUserModuleCategories(
            $user,
            $request->getAttribute("loris"),
        );

        $modulesassoc = [];

        foreach ($modulesandcats['Modules'] as $module) {
            $modulesassoc[$module->getName()] = $module->getLongName();
        }

        return new \LORIS\Http\Response\JSON\OK(
            [
                'modules'    => $modulesassoc,
                'categories' => $modulesandcats['Categories'],
            ]
        );
    }

    /**
     * TODO: Move this
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
            $cat = $row->getCategory();
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
