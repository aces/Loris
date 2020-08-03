<?php
namespace LORIS\datadict;
use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;

class Categories extends \NDB_Page {

    public function handle(ServerRequestInterface $request) : ResponseInterface
    {
        $queryparams = $request->getQueryParams();
        if (isset($queryparams['module'])) {
            return $this->moduleDictionary($request, $queryparams['module']);
        }

        $modulesandcats = $this->Module->getUserModuleCategories(
            $request->getAttribute("user"),
            $request->getAttribute("loris")
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

    public function moduleDictionary(ServerRequestInterface $request, string $modulename) : ResponseInterface
    {
        $loris = $this->lorisinstance;
        $module = null;
        foreach ($loris->getActiveModules() as $m) {
            if ($m->getName() == $modulename) {
                $module = $m;
                break;
            }
        }

        if($module === null) {
            return new \LORIS\Http\Response\JSON\NotFound('module not found');
        }
        $mdict = $module->getDataDictionary($loris);
        $dict  = [];
        /*
        [
            'module'        => $module->getName(),
            'category'     => $cat->getName(),
            'field'              => $item->getName(),
            'description'        => $desc,
            'description_status' => $status,
            'datascope' => $item->getScope(),
            'type' => $item->getDataType(),
            'cardinality' => $item->getCardinality(),
        ]
            );
    }
         */

    foreach ($mdict as $cat) {
        $catdict = [];

        foreach($cat->getItems() as $item) {
            $catdict[$item->getName()] = [
                'description' => $item->getDescription(),
                'scope' => $item->getScope(),
                'type' => $item->getDataType(),
                'cardinality' => $item->getCardinality(),
            ];
        }
        $dict[$cat->getName()] = $catdict;
    }
    return new \LORIS\Http\Response\JSON\OK($dict);
}
}
