<?php declare(strict_types=1);

namespace LORIS\behavioural_qc\Views;

/**
 * This class formats a form object into array for the behavioural_qc module
 *
 * @category BehaviouralViews
 * @package  Loris
 * @author   Alizee Wickenheiser <alizee.wickenheiser@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */

class Behavioural
{
    /**
     * The formElement
     *
     * @var array
     */
    private $_formElement = [];

    /**
     * Constructor
     *
     * @param array $visits      The visits for form element
     * @param array $instruments The instruments for form element
     * @param array $projects    The projects for form element
     * @param array $sites       The sites for form element
     */
    public function __construct($visits, $instruments, $projects, $sites)
    {
        $this->_formElement = [
            'instruments' => $instruments,
            'visits'      => $visits,
            'projects'    => $projects,
            'sites'       => $sites,
        ];
    }

    /**
     * Generates the array
     *
     * @return array
     */
    public function toArray() : array
    {
        return $this->_formElement;
    }

    /**
     * Used to create (select, text, ...) element for form filter.
     *
     * @param string     $name   for element
     * @param string     $type   for element
     * @param string     $label  for element
     * @param bool       $hidden for element
     * @param array|null $values for element
     *
     * @return object
     */
    private function _formElementObjectCreator(
        string $name,
        string $type,
        string $label,
        bool   $hidden,
        ?array $values
    ) : object {
        $element         = new \stdClass();
        $element->name   = $name;
        $element->type   = $type;
        $element->label  = $label;
        $element->hidden = !$hidden;
        if (isset($values)) {
            $element->options = $values;
        }
        return $element;
    }
}
