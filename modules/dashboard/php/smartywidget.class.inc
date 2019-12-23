<?php
namespace LORIS\dashboard;

class SmartyWidget implements DashboardWidget {
    public function __construct(\Module $module, string $template, array $data, string $title, string $size, int $order=10) {
        //FIXME: Validate size is a valid value.
        $this->renderer = new \Smarty_NeuroDB($module->getName());
        $this->template = $template;
        $this->tpl_data = $data;

        $this->title = $title;
        $this->size = $size;
        $this->order = $order;
    }

    public function getSize() : string {
        return $this->size;
    }

    public function getOrder() : int {
        return $this->order;

    }
    public function __toString() {
        $this->renderer->assign($this->tpl_data);
        $data = $this->renderer->fetch($this->template);
        $prenderer = new \Smarty_NeuroDB("dashboard");
        $prenderer->assign([
            'title' => $this->title,
            'body' => $data,
        ]);
        return $prenderer->fetch("panel.tpl");
    }
}
