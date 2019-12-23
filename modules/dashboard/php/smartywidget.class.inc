<?php
namespace LORIS\dashboard;

class SmartyWidget implements DashboardWidget {
    public function __construct(string $title, string $body, string $size, int $order=10) {
        //FIXME: Validate size is a valid value.
        if (!in_array($size, ["small", "normal", "huge"])) {
            throw new \DomainException("Invalid value for size");
        }
        $this->title = $title;
        $this->size = $size;
        $this->body = $body;
        $this->order = $order;
    }

    public function getSize() : string {
        return $this->size;
    }

    public function getOrder() : int {
        return $this->order;

    }
    public function __toString() {
        $renderer = new \Smarty_NeuroDB("dashboard");
        $renderer->assign([
            'title' => $this->title,
            'body' => $this->body,
        ]);
        return $renderer->fetch("panel.tpl");
    }
}
