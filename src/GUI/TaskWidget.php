<?php
namespace LORIS\GUI;

class TaskWidget implements \LORIS\GUI\Widget {
    protected $label;
    protected $number;
    protected $link;

    public function __construct(string $label, int $number, string $link) {
        $this->label = $label;
        $this->number = $number;
        $this->link = $link;
    }

    public function Label() : string {
        return $this->label;
    }

    public function Number() : int {
        return $this->number;
    }

    public function Link() : string {
        return $this->link;
    }
    public function __toString() {
        // The dashboard module just uses the methods on this
        // to get metadata, it handles the rendering itself.
        return "";
    }
}
