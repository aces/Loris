<?php
/**
 * This file contains the Loris Page Element Formatter.
 * This class is used to format a form element into the
 * format outline in the LORIS Instrument API documentation.
 *
 * PHP Version 7
 *
 * @category Main
 * @package  Behavioural
 * @author   Jordan Stirling <jstirling91@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris-Trunk/
 */

/**
 * This class is used to format a form element into the
 * format outline in the LORIS Instrument API documentation.
 *
 * @category Main
 * @package  Behavioural
 * @author   Jordan Stirling <jstirling91@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris-Trunk/
 */
class PageElementsFormatter
{

    /**
     * Base method to format an form element
     *
     * @param array  $element the form element to format
     * @param string $elName  the element name
     *
     * @return array the formatted element
     */
    static function formatElement($element, $elName)
    {
        $tempElement = array(
                        "Type"        => $element['type'],
                        "Name"        => $elName,
                        "Description" => $element['label'],
                       );
        switch ($tempElement['Type']) {
        case 'select':
            $tempElement = self::_formatSelect($element, $tempElement);
            break;
        case 'textarea':
        case 'text':
            $tempElement = self::_formatText($element, $tempElement);
            break;
        case 'date':
            $tempElement = self::_formatDate($element, $tempElement);
            break;
        case 'static':
            $tempElement['Type'] = 'label';
            break;
        case 'header':
            $tempElement['Options'] = array("Level" => 1);
            break;
        case 'group':
            $tempElement = self::_formatGroup($element, $tempElement);
            break;
        }
        return $tempElement;
    }

    /**
     * Format a select element
     *
     * @param array $oldElem the form element to format
     * @param array $newElem the new element which is partially
     *                       formatted in the caller function
     *
     * @return array the formatted element
     */
    private function _formatSelect($oldElem, $newElem)
    {
        $newElem['Options'] = array(
                               'Values'          => array(),
                               'AllowMultiple'   => false,
                               'RequireResponse' => false,
                              );
        foreach ($oldElem['options'] as $key => $value) {
            $newElem['Options']['Values'][$key] = $value;
        }

        return $newElem;
    }

    /**
     * Format a text element
     *
     * @param array $oldElem the form element to format
     * @param array $newElem the new element which is partially
     *                       formatted in the caller function
     *
     * @return array the formatted element
     */
    private function _formatText($oldElem, $newElem)
    {
        $newElem['Options'] = array(
                               'Type'            => "small",
                               'RequireResponse' => false,
                              );

        if ($oldElem['type'] === 'textarea') {
            $newElem['Type']            = 'text';
            $newElem['Options']['Type'] = 'large';
        }

        return $newElem;
    }


    /**
     * Format a date element
     *
     * @param array $oldElem the form element to format
     * @param array $newElem the new element which is partially
     *                       formatted in the caller function
     *
     * @return array the formatted element
     */
    private function _formatDate($oldElem, $newElem)
    {
        $newElem['Options'] = array('RequireResponse' => false);
        if ($oldElem['options']['minYear']) {
            $newElem['Options']['MinDate']
                = $oldElem['options']['minYear'] . "-01-01";
        }
        if ($oldElem['options']['maxYear']) {
            $newElem['Options']['MaxDate']
                = $oldElem['options']['maxYear'] . "-12-31";
        }

        return $newElem;
    }

    /**
     * Format a group element
     *
     * @param array $oldElem the form element to format
     * @param array $newElem the new element which is partially
     *                       formatted in the caller function
     *
     * @return array the formatted element
     */
    private function _formatGroup($oldElem, $newElem)
    {
        $newElem['Type']      = "ElementGroup";
        $newElem['GroupType'] = "Element";
        $newElem['Elements']  = array();

        foreach ($oldElem['elements'] as $value) {
            $newElem['Elements'][] = self::formatElement($value, $value['name']);
        }

        return $newElem;
    }

}

?>
