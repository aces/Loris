<?php
namespace LORIS\dataquery;
use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;

class VisitList extends \NDB_Page {
    protected $itemmodule;
    protected $dictionaryitem;

    public function handle(ServerRequestInterface $request) : ResponseInterface
    {
        if ($this->dictionaryitem === null) {
            return new \LORIS\Http\Response\JSON\OK(
              [
                'Visits' => array_values(\Utility::getVisitList()),
              ],
            );
        }

        if ($this->dictionaryitem->getScope()->__toString() !== 'session') {
            return new \LORIS\Http\Response\JSON\BadRequest(
               'Visit list only applicable to session scoped variables'
            );
        }

        return new \LORIS\Http\Response\JSON\OK(
            [
                'Visits' => $this->itemmodule->getQueryEngine()->getVisitList($this->itemcategory, $this->dictionaryitem),
            ],
        );
    }

    public function loadResources(
        \User $user, ServerRequestInterface $request
    ) : void
    {
        $queryparams = $request->getQueryParams();
        if (!isset($queryparams['module']) || !isset($queryparams['item'])) {
            return;
        }
        
        $this->lorisinstance = $request->getAttribute("loris");
        $modules = $this->lorisinstance->getActiveModules();
        $usermodules = [];
        $dict = [];
        $categories = [];

        $this->categoryitems = [];
        foreach ($modules as $module) {
            if($module->getName() !== $queryparams['module']) {
                continue;
            }
            if(!$module->hasAccess($user)) {
                continue;
            }

            $this->itemmodule = $module;
            $mdict = $module->getQueryEngine()->getDataDictionary();

            if(count($mdict) > 0) {
                foreach($mdict as $cat) {
                    foreach($cat->getItems() as $dictitem) {
                        if($dictitem->getName() === $queryparams['item']) {
                            $this->dictionaryitem = $dictitem;
                            $this->itemcategory = $cat;
                        }
                    }
                }
            }
        }
    }
}
