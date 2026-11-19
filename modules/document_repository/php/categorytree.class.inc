<?php declare(strict_types=1);

/**
 * Indexes the document repository category hierarchy.
 *
 * PHP Version 8
 *
 * @category Main
 * @package  Document_Repository
 * @author   LORIS Developers <loris-dev@bic.mni.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
namespace LORIS\document_repository;

/**
 * Builds category labels and branches from the same category rows.
 *
 * @category Main
 * @package  Document_Repository
 * @author   LORIS Developers <loris-dev@bic.mni.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
class CategoryTree
{
    private array $categories = [];
    private array $children   = [];

    /**
     * Index the categories while preserving their input order.
     *
     * @param iterable $rows Category rows from the database
     */
    public function __construct(iterable $rows)
    {
        foreach ($rows as $row) {
            $this->categories[$row['id']] = $row;
            $this->children[(int) $row['parent_id']][] = $row['id'];
        }
    }

    /**
     * Return the full category labels in input order.
     *
     * @return array Category labels indexed by ID
     */
    public function getLabels(): array
    {
        $labels = [];
        $paths  = [];
        foreach ($this->categories as $id => $row) {
            $path     = [];
            $category = $row;
            while (!isset($paths[$category['id']])) {
                if (isset($path[$category['id']])) {
                    throw new \LorisException('Cycle in document categories.');
                }
                $path[$category['id']] = $category['category_name'];
                $parent = (int) $category['parent_id'];
                if ($parent === 0) {
                    break;
                }
                $category = $this->categories[$parent] ?? throw new \LorisException(
                    'No parent category found for specified parentID. '
                    . 'Cannot parse categories.'
                );
            }
            $label = $paths[$category['id']] ?? null;
            foreach (array_reverse($path, true) as $categoryId => $name) {
                $label = $label === null ? $name : $label . '>' . $name;
                $paths[$categoryId] = $label;
            }
            $labels[$id] = $paths[$id];
        }
        return $labels;
    }

    /**
     * Return the category tree response for a selected ID.
     *
     * @param string|int $id The selected category ID
     *
     * @return array
     */
    public function getBranch(string|int $id): array
    {
        $key      = is_numeric($id) && (int) $id == $id ? (int) $id : $id;
        $current  = $this->categories[$key] ?? null;
        $children = $this->children[$key] ?? [];
        $all      = [['id' => $id]];
        $stack    = array_reverse($children);
        $seen     = [$key => true];
        while ($stack !== []) {
            $child = array_pop($stack);
            if (isset($seen[$child])) {
                continue;
            }
            $seen[$child] = true;
            $all[]        = ['id' => $child];
            foreach (array_reverse($this->children[$child] ?? []) as $descendant) {
                $stack[] = $descendant;
            }
        }

        $parents  = [];
        $category = $current;
        while ($category !== null && !isset($parents[$category['id']])) {
            $parents[$category['id']] = $category;
            $parent   = (int) $category['parent_id'];
            $category = $parent === 0 ? null : ($this->categories[$parent] ?? null);
        }

        $fields        = ['id' => true, 'category_name' => true, 'comments' => true];
        $subcategories = [];
        foreach ($children as $child) {
            $subcategories[] = array_intersect_key(
                $this->categories[$child],
                $fields
            );
        }
        return [
            'allsubcategories' => $all,
            'currentcategory'  => $current === null
                ? [] : [array_intersect_key($current, $fields)],
            'parentcategory'   => array_reverse(array_values($parents)),
            'subcategories'    => $subcategories,
        ];
    }
}
