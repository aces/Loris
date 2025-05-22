<?php declare(strict_types=1);

namespace LORIS\GUI;

/**
 * A MenuCategory represents a dropdown group of MenuItems in the LORIS
 * menu (top bar) to be displayed in the GUI.
 */
class MenuCategory implements \Stringable
{
    /**
     * Constructs a menu category. Should only be loaded via singleton.
     *
     * @param string $name  The label for the menu category
     * @param int    $label The relative ordering of the category
     */
    private function __construct(
        public readonly string $name,
        public readonly int $order
    ) {
    }

    private static array $cache = [];

    /**
     * Bulk load all menu categories so that they are available for singleton.
     * This should only be called once.
     */
    public static function bulkLoad(\LORIS\LorisInstance $loris)
    {
        $DB   = $loris->getDatabaseConnection();
        $cats = $DB->pselect("SELECT name, orderby FROM menu_categories", []);
        foreach ($cats as $cat) {
            assert(!isset(self::$cache[$cat['name']]));
            self::$cache[$cat['name']] = new self($cat['name'], $cat['orderby']);
        }
    }
    public static function singleton(string $name) : MenuCategory
    {
        if (isset(self::$cache[$name])) {
            return self::$cache[$name];
        }
        throw new \LorisException("Menu category $name not found");
    }

    public function __toString() : string
    {
	    return dgettext("loris", $this->name);
    }
}
