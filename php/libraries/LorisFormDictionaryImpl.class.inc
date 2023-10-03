<?php declare(strict_types=1);
use \LORIS\instruments\DictionaryItem;
use \LORIS\Data\Dictionary\Category;
use \LORIS\Data\Scope;
use \LORIS\Data\Cardinality;
/**
 * Helper to extract a dictionary from a LorisForm, primarily
 * used by instruments. This is based on lorisform_parser.php
 *
 * @license http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */
trait LorisFormDictionaryImpl
{
    /**
     * Variable from NDB_Page. Must be included in trait to avoid
     * PhanUndeclaredProperty errors.
     */
    public $page;

    /**
     * Variable from NDB_Page. Must be included in trait to avoid
     * PhanUndeclaredProperty errors.
     *
     * @var \LorisForm
     */
    public $form;

    /**
     * Variable from NDB_BVL_Instrument. Must be included in trait
     * to avoid PhanUndeclaredProperty errors.
     */
    public $testName;

    /**
     * Variable from NDB_Page. Must be included in trait
     * to avoid PhanUndeclaredProperty errors.
     */
    protected \LORIS\LorisInstance $loris;

    /**
     * Recursively extract non-group elements from $elements, and
     * return the dictionary of the items.
     *
     * @param string   $prefix     The prefix for recursive groups
     * @param Category $cat        The dictionary category to use for the
     *                             items
     * @param array    $elements   The LorisForm elements in the format
     *                             of LorisForm->toElementArray().
     * @param string   $groupLabel The quickform group being recursively
     *                             extracted
     *
     * @return DictionaryItem[]
     */
    private function _getDataDictionaryGroup(
        string $prefix,
        \LORIS\Data\Dictionary\Category $cat,
        array $elements,
        string $groupLabel=''
    ) : array {
        $items = [];
        $scope = new Scope(Scope::SESSION);
        foreach ($elements AS $element) {
            $card = new Cardinality(Cardinality::SINGLE);
            if (!empty($element['label'])) {
                $label = str_replace("&nbsp;", "", $element['label']);
                $label = trim(preg_replace('/\s+/', ' ', $label));
            } else {
                $label = trim(preg_replace('/\s+/', ' ', $groupLabel));
            }

            if ($element['type'] === 'group') {
                $items = array_merge(
                    $items,
                    $this->_getDataDictionaryGroup(
                        $prefix,
                        $cat,
                        $element['elements'] ?? [],
                        $label,
                    ),
                );
                continue;
            }

            if (!array_key_exists('name', $element)) {
                continue;
            }

            $t = null;

            switch ($element['type']) {
            case 'select':
                // The values of the enumeration are the keys of the
                // options, but when the key is something like "0" or
                // "1" array_keys turns it into an int and we want to
                // ignore null/empty, so instead we just walk through
                // the array and coerce things to a string.
                $keys = [];
                foreach (array_keys($element['options']) as $key) {
                    if ($key === '' || $key === null) {
                        continue;
                    }

                    // Coerce it to a string
                    $keys[] = "$key";
                }
                if (array_key_exists('multiple', $element)) {
                    $card = new Cardinality(Cardinality::MANY);
                }

                $t = new \LORIS\Data\Types\Enumeration(...$keys);
                break;
            case 'text':
                $t = new \LORIS\Data\Types\StringType(255);
                break;
            case 'file':
                $t = new \LORIS\Data\Types\URI();
                break;
            case 'textarea':
                $t = new \LORIS\Data\Types\StringType();
                break;
            case 'date':
                $t = new \LORIS\Data\Types\DateType();
                break;
            case 'time':
                $t = new \LORIS\Data\Types\TimeType();
                break;
            case 'advcheckbox':
                $t = new \LORIS\Data\Types\Enumeration("true", "false");
                break;
            case 'static':
                $t = new \LORIS\Data\Types\StringType(255);
                break;
            case 'header':
            case 'hidden':
                continue 2;
            default:
                throw new \LorisException(
                    "Unknown element type: " . $element['type']
                );
            }
            $items[] = new DictionaryItem(
                $prefix . $element['name'],
                $label,
                $scope,
                $t,
                $card,
                $element['name'],
            );
        }
        return $items;
    }

    /**
     * Extract the data dictionary from an instrument as per the LorisForm.
     *
     * @return DictionaryItem[]
     */
    public function getDataDictionary() : iterable
    {
        // Create new instance of the same instrument to avoid altering variables
        // in $this instrument
        $instrument = \NDB_BVL_Instrument::factory(
            $this->loris,
            $this->testName
        );
        $subtests   = array_merge(
            [
                ["Name"=>"","Description"=>""]
            ],
            $instrument->getSubtestList()
        );
        foreach ($subtests as $subtest) {
            $instrument->page = $subtest['Name'];

            if (method_exists($this, '_setupForm')) {
                // False positive from phan. We're inside a
                // method_exists check
                /* @phan-suppress-next-line PhanUndeclaredMethod */
                $instrument->_setupForm();
            }
        }

        $formElements = $instrument->form->toElementArray();
        $cat          = new Category(
            $instrument->testName,
            $instrument->getFullName()
        );
        return $instrument->_getDataDictionaryGroup(
            $instrument->testName . "_",
            $cat,
            $formElements["elements"],
            ''
        );
    }

    /**
     * Function from NDB_BVL_Instrument used by trait
     *
     * @return array
     */
    abstract function getSubtestList(): array;

    /**
     * Function from NDB_BVL_Instrument used by trait
     *
     * @return ?string
     */
    abstract public function getFullName(): ?string;
}
