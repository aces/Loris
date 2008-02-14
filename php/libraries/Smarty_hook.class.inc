<?
/**
 * @package main
 */
require('smarty/Smarty.class.php');
class Smarty_neurodb extends Smarty {
    function Smarty_neurodb() {
        $config =& NDB_Config::singleton();
        $paths = $config->getSetting('paths');
        $this->Smarty();
        $this->template_dir = $paths['base']."php/smarty/templates/";
        $this->project_template_dir = $paths['base']."project/templates/";
        $this->compile_dir = $paths['base']."php/smarty/templates_c/";
        $this->config_dir = $paths['base']."php/smarty/configs/";
        $this->cache_dir = $paths['base']."php/smarty/cache/";
        $this->caching = false;
        $this->default_resource_type="neurodb";
        $this->assign('app_name','NeuroDB');

        //Load the default config file (should exist)
        if(file_exists($this->template_dir."default.conf") && is_readable($this->template_dir."default.conf")){
            $this->config_load("file:".$this->template_dir."default.conf");
        }

        //Load the project specific config file if it exists.  this will overwrite any settings from the default.
        if(file_exists($this->project_template_dir."project.conf") && is_readable($this->project_template_dir."project.conf")){
            $this->config_load("file:".$this->project_template_dir."project.conf");
        }
    }
}

?>