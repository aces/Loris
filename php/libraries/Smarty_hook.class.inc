<?php
/**
 * @package main
 */
require_once('smarty3/Smarty.class.php');
class Smarty_neurodb extends Smarty {
    var $template_dir;
    var $project_template_dir;

    function Smarty_neurodb() {
        $config =& NDB_Config::singleton();
        $paths = $config->getSetting('paths');
        $this->__construct();
        $this->addPluginsDir($paths['base']."php/libraries/smarty/plugins");
        $this->template_dir = $paths['base']."smarty/templates/";
        $this->project_template_dir = $paths['base']."project/templates/";
        $this->compile_dir = $paths['base']."smarty/templates_c/";
        $this->config_dir = $paths['base']."smarty/configs/";
        $this->cache_dir = $paths['base']."smarty/cache/";
        $this->caching = false;
        $this->default_resource_type="neurodb";
        $this->assign('app_name','NeuroDB');

        $this->addConfigDir($this->template_dir);
        $this->addConfigDir($this->project_template_dir);
    }
}

?>
