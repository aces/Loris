<?php

namespace LORIS\GUI;

class SmartyWidget {
    protected $renderer;
    protected $tpl_data;
    protected $template;

    public function __construct(\Module $module, string $template, array $data) {
        $this->renderer = new \Smarty_neurodb($module->getName());
        $this->tpl_data = $data;
        $this->template = $template;
    }

    public function __toString() {
        $this->renderer->assign($this->tpl_data);
        $html = $this->renderer->fetch($this->template);
        return $html;
    }
}
