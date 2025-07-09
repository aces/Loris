<?php declare(strict_types=1);

namespace LORIS\dataquery;
use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;

/**
 * Handles the /dataquery/visitlist endpoint which gets
 * a list of visits that are available for a specific
 * dictionary item and returns it to the client
 *
 * @license http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */
class VisitList extends \NDB_Page
{
    protected $itemmodule;
    protected $itemcategory;
    protected $dictionaryitem;
    protected $user;

    /**
     * {@inheritDoc}
     *
     * @param ServerRequestInterface $request - The incoming request
     *
     * @return ResponseInterface
     */
    public function handle(ServerRequestInterface $request) : ResponseInterface
    {
        if ($this->dictionaryitem === null) {
            return new \LORIS\Http\Response\JSON\OK(
                ['Visits' => array_values($this->user->getVisits())],
            );
        }

        if ($this->dictionaryitem->getScope()->__toString() !== 'session') {
            return new \LORIS\Http\Response\JSON\BadRequest(
                'Visit list only applicable to session scoped variables'
            );
        }

        return new \LORIS\Http\Response\JSON\OK(
            [
                'Visits' =>
                    $this->itemmodule
                        ->getQueryEngine()
                        ->getVisitList($this->itemcategory, $this->dictionaryitem),
            ],
        );
    }

    /**
     * {@inheritDoc}
     *
     * @param \User                  $user    - The user loading the page
     * @param ServerRequestInterface $request - The page to load resources for
     *
     * @return void
     */
    public function loadResources(
        \User $user,
        ServerRequestInterface $request,
    ) : void {
        $this->user  = $user;
        $queryparams = $request->getQueryParams();
        if (!isset($queryparams['module']) || !isset($queryparams['item'])) {
            return;
        }

        $modules = $this->loris->getActiveModules();

        foreach ($modules as $module) {
            if ($module->getName() !== $queryparams['module']) {
                continue;
            }
            if (!$module->hasAccess($user)) {
                continue;
            }

            $this->itemmodule = $module;
            $mdict            = $module->getQueryEngine()->getDataDictionary();

            if (count($mdict) > 0) {
                foreach ($mdict as $cat) {
                    foreach ($cat->getItems() as $dictitem) {
                        if ($dictitem->getName() === $queryparams['item']) {
                            $this->dictionaryitem = $dictitem;
                            $this->itemcategory   = $cat;
                        }
                    }
                }
            }
        }
    }
}
