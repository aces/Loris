<?php
namespace LORIS\dashboard;

class Widget implements \LORIS\GUI\Widget {
    public function __construct(
        string $title, string $body, string $size, int $order=10, string $footer="", array $extracss = [], array $extrajs = [],
        array $menus = []
    ) {
        // FIXME: Find a better way to handle all these parameters. There's a definition separation of concerns missing
        // Maybe a content object (title, body, footer), a display object (size, order, menus), and a dependencies object
        // (extra css/js)?
        if (!in_array($size, ["small", "normal", "huge"])) {
            throw new \DomainException("Invalid value for size");
        }
        $this->title = $title;
        $this->size = $size;
        $this->body = $body;
        $this->order = $order;
        $this->footer = $footer;
        $this->css = $extracss;
        $this->js = $extrajs;
        $this->menus = $menus;
    }

    public function getSize() : string {
        return $this->size;
    }

    public function getOrder() : int {
        return $this->order;

    }

    public function getCSSDependencies() {
        return $this->css;
    }

    public function getJSDependencies() {
        return $this->js;
    }

    public function __toString() {
        $renderer = new \Smarty_NeuroDB("dashboard");
        $renderer->assign([
            'title' => $this->title,
            'body' => $this->body,
            'footer' => $this->footer,
            'menus' => $this->menus
        ]);
        return $renderer->fetch("panel.tpl");
    }
}
