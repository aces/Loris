<?php declare(strict_types=1);
/**
 * PHP Version 7
 *
 * @category ApiViews
 * @package  Loris
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */

namespace LORIS\api\Views;

/**
 * This class formats a Subproject object into arrays following the API
 * specifications.
 *
 * @category ApiViews
 * @package  Loris
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */

class Subproject
{
    /**
     * The project to format
     *
     * @var string
     */
    protected $_subproject;

    /**
     * Constructor
     *
     * @param string $subproject The subproject to format
     */
    public function __construct(string $subproject)
    {
        $this->_subproject = $subproject;
    }

    /**
     * Produce an array representation of this project.
     *
     * @return array
     */
    public function toArray(): array
    {
        $meta = ['Subproject' => $this->_subproject];

        return [
            'Meta'   => $meta,
            'Visits' => $this->getVisits(),
        ];
    }

    /**
     * Generates the list of valid visit_labels for the subproject
     * as defined in the config settings
     *
     * @return array
     */
    protected function getVisits(): array
    {
        $visits = [];

        $subprojectID = array_search(
            $this->_subproject,
            \Utility::getSubprojectList()
        );

        $config =& \NDB_Config::singleton();
        $visitLabelSettings = $config->getSetting('visitLabel');
        foreach (\Utility::associativeToNumericArray($visitLabelSettings)
                 as $visitLabelSetting) {
            if ($visitLabelSetting['@']['subprojectID'] == $subprojectID) {

                $items = \Utility::associativeToNumericArray(
                    $visitLabelSetting['labelSet']['item']
                );
                foreach ($items as $item) {
                    $visits[] = $item['@']['value'];
                }
                break;
            }
        }

        return $visits;
    }
}

