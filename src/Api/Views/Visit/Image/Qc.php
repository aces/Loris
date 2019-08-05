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

namespace LORIS\Api\Views\Visit\Image;

/**
 * Creates a representation of an image qc following the api response
 * specifications.
 *
 * @category ApiViews
 * @package  Loris
 * @author   Xavier Lecours Boucher <xavier.lecours@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */

class Qc
{
    private $_timepoint;

    private $_image;

    /**
     * Constructor which sets the instance variables based on the provided timepoint
     * and image qc status.
     *
     * @param \Timepoint   $timepoint The timepoint to represent
     * @param \LORIS\Image $image     The requested image
     */
    public function __construct(\Timepoint $timepoint, \LORIS\Image $image)
    {
        $this->_timepoint = $timepoint;
        $this->_image     = $image;
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
                 'File'   => $this->_image->getFileInfo()->getFilename(),
                );

        $imageqcstatus = $this->_image->getQcStatus();

        $qc       = $imageqcstatus->getQcStatus();
        $selected = $imageqcstatus->isSelected();

        $caveats = array_map(
            function ($caveat) {
                return array(
                        'Severity'   => $caveat->getSeverity(),
                        'Header'     => $caveat->getHeader(),
                        'Value'      => $caveat->getValue(),
                        'ValidRange' => $caveat->getValidRange(),
                        'ValidRegex' => $caveat->getValidRegex(),
                       );
            },
            $this->_image->getCaveats()
        );

        return array(
                'Meta'     => $meta,
                'QC'       => $qc,
                'Selected' => $selected,
                'Caveats'  => $caveats,
               );
    }
}

