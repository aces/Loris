<?php
namespace LORIS\datadict;
use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;

class Categories extends \NDB_Page {

    public function handle(ServerRequestInterface $request) : ResponseInterface
    {
        $queryparams = $request->getQueryParams();
        $user = $request->getAttribute("user");
        if (isset($queryparams['module'])) {
            return $this->moduleDictionary($request, $user, $queryparams['module']);
        }

        $modulesandcats = $this->Module->getUserModuleCategories(
            $user,
            $request->getAttribute("loris"),
        );

        $modulesassoc = [];

        foreach($modulesandcats['Modules'] as $module) {
            $modulesassoc[$module->getName()] = $module->getLongName();
        }

        return new \LORIS\Http\Response\JSON\OK( [
            'modules' => $modulesassoc,
            'categories' => $modulesandcats['Categories'],
        ]);
    }

    public function moduleDictionary(ServerRequestInterface $request, \User $user, string $modulename) : ResponseInterface
    {

        $loris = $this->lorisinstance;
        foreach ($loris->getActiveModules() as $m) {
            if ($m->getName() == $modulename) {
                $module = $m;
                break;
            }
        }

        if($module === null) {
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
            $datatype = $row->getDataType();
            $organized[$cat][$fieldname] = [
                        'description' => $row->getDescription(),
                        'scope' => $row->getScope(),
                        'type' => $row->getDataType(),
                        'cardinality' => $row->getCardinality(),
                ];
            if ($datatype instanceof \LORIS\Data\Types\Enumeration) {
                $organized[$cat][$fieldname]['options'] = $datatype->getOptions();
            }
        }
        return new \LORIS\Http\Response\JSON\OK($organized);
    }
}
