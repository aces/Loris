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
        $user = $request->getAttribute("user");

        // getUserModuleCategories enforces permissions and strips out modules
        // that don't have any dictionary.
        //
        // We need to ensure that $this->Module is a Module descriptor for this
        // type of module, not a generic \Module in order for static analysis tools
        // to realize the function is defined.
        assert($this->Module instanceof Module);
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
}
