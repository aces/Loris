<?php declare(strict_types=1);
/**
 * PHP Version 7
 *
 * @category SnpViews
 * @package  Loris
 * @author   Alizee Wickenheiser <alizee.wickenheiser@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */

namespace LORIS\genomic_browser\Views;

/**
 * This class formats a form object into array for the genomic_browser module
 *
 * @category SnpViews
 * @package  Loris
 * @author   Alizee Wickenheiser <alizee.wickenheiser@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */

class SNP
{
    /**
     * The formElement
     *
     * @var array
     */
    private $_formElement;

    /**
     * Constructor
     *
     * @param array $sites            The list_of_sites for form element
     * @param array $cohorts          The cohorts for form element
     * @param array $platform_options The platform_options for form element
     */
    public function __construct($sites, $cohorts, $platform_options)
    {
        $this->_formElement = [
            'Sites'    => $sites,
            'Cohorts'  => $cohorts,
            'Platform' => $platform_options,
            'Sex'      => \Utility::getSexList(),
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
