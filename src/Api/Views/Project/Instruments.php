<?php declare(strict_types=1);
/**
 * PHP Version 7
 *
 * @category ApiViews
 * @package  Loris
 * @author   Xavier Lecours Boucher <xavier.lecours@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */

namespace LORIS\Api\Views\Project;

/**
 * Creates a representation of a project instrument following the api response
 * specifications.
 *
 * @category ApiViews
 * @package  Loris
 * @author   Xavier Lecours Boucher <xavier.lecours@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */

class Instruments
{
    protected $meta        = array();
    protected $instruments = array();

    /**
     * Contructor that initialize this instance variables
     *
     * @param \Project $project     The requested project
     * @param array    $instruments An array of ProjectInstrumentRow
     */
    public function __construct(\Project $project, array $instruments)
    {
        $this->meta['Project'] = $project->getName();
        foreach ($instruments as $instrument) {
            $shortname = $instrument['shortname'];
            $item      = array(
                          'Fullname'               => $instrument['fullname'],
                          'Subgroup'               => $instrument['subgroup'],
                          'DoubleDataEntryEnabled' => $instrument['ddeenable'],
                         );
            $this->instruments[$shortname] = $item;
        }
    }

    /**
     * Returns this view as an array
     *
     * @return array
     */
    public function toArray(): array
    {
        return array(
                'Meta'        => $this->meta,
                'Instruments' => $this->instruments,
               );
    }
}
