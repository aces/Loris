<?php declare(strict_types=1);
namespace LORIS\GUI;

/**
 * A MenuItem represents a row in the LORIS menu (top bar) to be displayed
 * in the GUI.
 */
class MenuItem
{
    /**
     * Constructs a menu item in a given category.
     *
     * @param string $category The category (dropdown section) for the menu item.
     * @param string $label    The label to use for the menu item.
     * @param string $link     The URL that the menu should point to.
     */
    public function __construct(string $category, string $label, string $link)
    {
        $this->category = $category;
        $this->label    = $label;
        $this->link     = $link;
    }

    /**
     * Returns the category that the menu item should appear in
     *
     * @return string the category
     */
    public function getCategory() : string
    {
        return $this->category;
    }

    /**
     * Returns the label that should be used for the menu item
     *
     * @return string the label
     */
    public function getLabel() : string
    {
        return $this->label;
    }

    /**
     * Returns the URL to use for the menu item
     *
     * @return string the URL.
     */
    public function getLink() : string
    {
        return $this->link;
    }
}
