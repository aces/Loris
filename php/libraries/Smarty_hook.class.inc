<?php
/**
 * @package main
 */
require_once('smarty3/Smarty.class.php');
class Smarty_neurodb extends Smarty {
    var $template_dir;
    var $project_template_dir;
    var $modules_dir;

    function Smarty_neurodb($moduleName = null) {
        $config =& NDB_Config::singleton();
        $paths = $config->getSetting('paths');
        $this->__construct();

        // NeuroDB plugin is no longer needed now that Smarty3 supports
        // multiple template directories
        //$this->addPluginsDir($paths['base']."php/libraries/smarty/plugins");

        $this->template_dir = $paths['base']."smarty/templates/";
        $this->project_template_dir = $paths['base']."project/templates/";
        $this->modules_dir = $paths['base'] . 'modules/' . $moduleName;

        // These are probably not needed anymore and can use the smarty
        // defaults, but keep them for now to ensure that Loris doesn't
        // change..
        $this->compile_dir = $paths['base']."smarty/templates_c/";
        $this->config_dir = $paths['base']."smarty/configs/";
        $this->cache_dir = $paths['base']."smarty/cache/";

        $this->assign('app_name','NeuroDB');

        // Set the template directories. First check for project overrides,
        // then check for modules, then check for old Loris jumbled together
        // templates
        $this->addTemplateDir($this->project_template_dir);
        $this->addTemplateDir($this->modules_dir . "/templates");
        $this->addTemplateDir($this->template_dir);

        $currentDir = $this->getConfigDir();
        $newdir = array_merge(
            $currentDir, 
            array(
                'template' => $this->template_dir,
                'project'  => $this->project_template_dir
            )
        );
        $this->setConfigDir($newdir);

        // addConfigDir seems to only be in smarty3.1+, but Ubuntu 
        // 12.04 has 3.0, so we need to use setConfigDir instead
        //$this->addConfigDir($this->template_dir);
        //$this->addConfigDir($this->project_template_dir);
    }
}

?>
