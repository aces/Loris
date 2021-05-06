<?php declare(strict_types=1);

namespace LORIS\dqt\Views;
use \LORIS\dqt\Models\CategoriesInstance;

class Categories
{
    public function __construct(\Traversable $iter)
    {
        $this->_iterator = $iter;
    }

    /**
     * Mapper function to transform a CategoryInstance into an element
     * of the "Categories" array return by toArray.
     *
     * @param CategoryInstance $cat
     *
     * @return array
     */
    private static function _mapper(CategoriesInstance $cat): array
    {
        $name = $cat->getName();
        return [
            'name' => $name,
            'link' => "/dqt/categories/${name}"
        ];
    }

    /**
     * Creates an serializable array of this object's data
     *
     * @return array
     */
    public function toArray(): array
    {
        $categories = array_map(
            '\LORIS\dqt\Views\Categories::_mapper',
            iterator_to_array($this->_iterator)
        );
        return ['categories' => $categories];
    }
}
