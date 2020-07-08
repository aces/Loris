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

namespace LORIS\api\Views\Visit;

use \LORIS\Data\Models\ImageDTO;
/**
 * Creates a representation of a visit images following the api response
 * specifications.
 *
 * @category ApiViews
 * @package  Loris
 * @author   Xavier Lecours Boucher <xavier.lecours@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */

class Images
{
    private $_timepoint;
    private $_images;

    /**
     * Constructor which sets the instance variables based on the provided timepoint
     *
     * @param \Timepoint $timepoint The timepoint to represent
     * @param ImageDTO   ...$images An array of images
     */
    public function __construct(\Timepoint $timepoint, ImageDTO ...$images)
    {
        $this->_timepoint = $timepoint;
        $this->_images    = $images;
    }

    /**
     * Creates an serializable array of this object's data
     *
     * @return array
     */
    public function toArray(): array
    {
        $meta = array(
            'CandID' => $this->_timepoint->getCandID(),
            'Visit'  => $this->_timepoint->getVisitLabel(),
        );

        $imagesdata = array_map(
            function ($image) {
                return array(
                    'OutputType'      => $image->getOutputType(),
                    'Filename'        => $image->getFilename(),
                    'AcquisitionType' => $image->getAcquisitionprotocol(),
                );
            },
            $this->_images
        );

        return array(
            'Meta'  => $meta,
            'Files' => $imagesdata,
        );
    }
}
