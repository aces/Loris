<?php
function smarty_resource_neurodb_source($rsrc_name, &$source, $smarty) {
    if(strpos($rsrc_name, '/')===0) $filename = $rsrc_name;
    else {
        $default_name=$smarty->template_dir.$rsrc_name;
        $custom_name=$smarty->project_template_dir.$rsrc_name;
        $module_name = $smarty->modules_dir 
            . $smarty->ModuleName . "/templates/$rsrc_name";
        if (is_file($module_name)) {
            $filename=$module_name;
        } else if (is_file($custom_name)) {
            $filename=$custom_name;
        } else if (is_file($default_name)) {
            $filename=$default_name;
        } else {
            return false;
        }
    }
    $fp=fopen($filename,"r");
    $source=fread($fp,filesize($filename));
    fclose($fp);
    return true;
}

function smarty_resource_neurodb_timestamp($rsrc_name, &$timestamp, $smarty) {
    if(strpos($rsrc_name, '/')===0) $filename = $rsrc_name;
    else {
        $default_name=$smarty->template_dir.$rsrc_name;
        $custom_name=$smarty->project_template_dir.$rsrc_name;
        $module_name = $smarty->modules_dir 
            . $smarty->ModuleName . "/templates/$rsrc_name";
        if (is_file($module_name)) {
            $filename=$module_name;
        } else if (is_file($custom_name)) {
            $filename=$custom_name;
        } else if(is_file($default_name)) {
            $filename=$default_name;
        } else {
            return false;
        }
    }
    $timestamp=filectime($filename);
    return true;
}

function smarty_resource_neurodb_secure($rsrc_name, &$smarty) {
  return true;  
}

function smarty_resource_neurodb_trusted($rsrc_name, &$smarty) {
    return true;    
}


?>
