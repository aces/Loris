<?php
declare(strict_types=1);
namespace LORIS\Data\Dictionary;

/**
 * A \LORIS\Data\Dictionary\Category represents a grouping of
 * DictionaryItems.
 *
 * @license http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */
class Category
{
    protected $name;
    protected $description;
    protected $items = null;

    /**
     * Construct a dictionary Category
     *
     * @param string $name             The machine name of the category
     * @param string $desc             The human readable description of
     *                                 the category
     * @param ?DictionaryItem[] $items An optional iterable of items which
     *                                 the category contains.
     */
    public function __construct(string $name, string $desc, ?iterable $items = null)
    {
        $this->name        = $name;
        $this->description = $desc;
        $this->items       = $items;
    }

    /**
     * Return the name of the Category
     *
     * @return string
     */
    public function getName() : string
    {
        return $this->name;
    }

    /**
     * Return the human readable description of the Category
     *
     * @return string
     */
    public function getDescription() : string
    {
        return $this->description;
    }

    /**
     * Return the items which belong to the Category
     *
     * @return ?DictionaryItem[]
     */
    public function getItems() : ?iterable
    {
        return $this->items;
    }

    /**
     * Returns a new Category identical to this category, but with
     * the items populated with $items. This can be used when the items
     * were not yet known at the time the constructor was called.
     *
     * @param DictionaryItem[] $items The items to add to the new Category
     *
     * @return Category
     */
    public function withItems(iterable $items) : Category
    {
        $c        = clone($this);
        $c->items = $items;
        return $c;
    }
}
