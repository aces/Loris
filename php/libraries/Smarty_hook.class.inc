<?php declare(strict_types=1);
/**
 * This provides the implementation of the Smarty_neurodb class
 *
 * PHP Version 7
 *
 * @category Main
 * @package  Main
 * @author   Loris Team <loris.mni@bic.mni.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */


/**
 * This overrides the Smarty base class in order to look into module/templates,
 * project/templates AND smarty/templates in order to retrieve the template from the
 * correct Loris location.
 *
 * @category Main
 * @package  Main
 * @author   Loris Team <loris.mni@bic.mni.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class Smarty_NeuroDB extends Smarty
{
    var $loristemplate_dir;
    var $project_template_dir;
    var $modules_dir;
    var $ModuleName;

    /**
     * Constructor for the NeuroDB Smarty hook class.
     *                           the templates directory for.
     *
     * @param ?string $moduleName The name of the module to search through
     */
    function __construct(?string $moduleName = null)
    {
        parent::__construct();

        $factory = NDB_Factory::singleton();
        $config  = $factory->config();

        $paths = $config->getSetting('paths');

        $basePath = $paths['base'];

        // NeuroDB plugin is no longer needed now that Smarty3 supports
        // multiple template directories
        //$this->addPluginsDir($paths['base']."php/libraries/smarty/plugins");

        $this->loristemplate_dir    = $basePath . "smarty/templates/";
        $this->project_template_dir = $basePath . "project/templates/";

        $this->modules_dir = is_dir($basePath . "project/modules/$moduleName")
            ? $basePath . "project/modules/$moduleName"
            : $basePath . "modules/$moduleName" ;

        // These are probably not needed anymore and can use the smarty
        // defaults, but keep them for now to ensure that Loris doesn't
        // change..
        $this->setCompileDir($paths['base']."smarty/templates_c/");

        $this->setConfigDir($paths['base']."smarty/configs/");
        $this->setCacheDir($paths['base']."smarty/cache/");

        // Behave like smarty2 used to. This should be
        // removed after all the warnings/notices from the PHP
        // side of Loris are fixed, and then the templates can be
        // updated..
        $this->error_reporting = E_ALL & ~E_NOTICE;
        $sandbox = $config->getSetting("sandbox");

        if ($sandbox === '1') {
            $this->setForceCompile(true);
        }

        $this->assign('app_name', 'NeuroDB');

        // Set the template directories. First check for project overrides,
        // then check for modules, then check for old Loris jumbled together
        // templates
        $this->setTemplateDir($this->modules_dir . "/templates");
        $this->addTemplateDir($this->project_template_dir);
        $this->addTemplateDir($this->loristemplate_dir);

        $currentDir = $this->getConfigDir();

        if (!is_array($currentDir)) {
            $currentDir = array('base' => $this->loristemplate_dir);
        }

        $newdir = array_merge(
            $currentDir,
            array(
             'template' => $this->loristemplate_dir,
             'project'  => $this->project_template_dir,
            )
        );
        $this->setConfigDir($newdir);

        // addConfigDir seems to only be in smarty3.1+, but Ubuntu
        // 12.04 has 3.0, so we need to use setConfigDir instead
        //$this->addConfigDir($this->template_dir);
        //$this->addConfigDir($this->project_template_dir);
    }
}

