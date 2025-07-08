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
     * @param MenuCategory $category The category (dropdown section) for the
     *                               menu item.
     * @param string $label          The label to use for the menu item.
     * @param string $link           The URL that the menu should point to.
     */
    public function __construct(
        public readonly MenuCategory $category,
        public readonly string $label,
        public readonly string $link
    ) {
    }
}
