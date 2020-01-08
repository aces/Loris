<?php
namespace LORIS\dashboard;

/**
 * A TaskWidget is a type of dashboard widget which displays a task in
 * the "My Tasks" widget on the dashboard. It contains a number, a link,
 * and a label describing what the task is.
 */
class TaskWidget implements \LORIS\GUI\Widget
{
    protected $label;
    protected $number;
    protected $link;

    public function __construct(string $label, int $number, string $link)
    {
        $this->label  = $label;
        $this->number = $number;
        $this->link   = $link;
    }

    public function label() : string
    {
        return $this->label;
    }

    public function number() : int
    {
        return $this->number;
    }

    public function link() : string
    {
        return $this->link;
    }

    public function siteLabel() : string
    {
        return "";
    }

    public function __toString()
    {
        // The dashboard module just uses the methods on this
        // to get metadata, it handles the rendering itself.
        return "";
    }
}
