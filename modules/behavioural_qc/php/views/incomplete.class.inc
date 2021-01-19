<?php declare(strict_types=1);

namespace LORIS\behavioural_qc\Views;

/**
 * This class formats a form object into array for the behavioural_qc module
 *
 * @category IncompleteViews
 * @package  Loris
 * @author   Alizee Wickenheiser <alizee.wickenheiser@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */

class Incomplete
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
}
