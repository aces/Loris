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
    private $_meta = array();
    private $_qc;
    private $_selected;
    private $_caveats = array();

    /**
     * Constructor which sets the instance variables based on the provided timepoint
     * and image qc status.
     *
     * @param \Timepoint $timepoint The timepoint to represent
     */
    public function __construct(\Timepoint $timepoint, \LORIS\Image $image)
    {
        $this->_meta['CandID'] = $timepoint->getCandID();
        $this->_meta['Visit']  = $timepoint->getVisitLabel();
        $this->_meta['File']   = $image->asDTO()->getFilename();

        $imageqcstatus  = $image->getQcStatus();

        $this->_qc       = $imageqcstatus->getQcStatus();
        $this->_selected = $imageqcstatus->isSelected();
        $this->_caveats  = $image->getCaveats(); 
    }

    /**
     * Creates an serializable array of this object's data
     *
     * @return array
     */
    public function toArray(): array
    {
        $caveats = array_map(function ($caveat) {
            return array(
                'Severity' => $caveat->getSeverity(),
                'Header' => $caveat->getHeader(),
                'Value' => $caveat->getValue(),
                'ValidRange' => $caveat->getValidRange(),
                'ValidRegex' => $caveat->getValidRegex(),
            );
        }, $this->_caveats);

        return array(
                'Meta'     => $this->_meta,
                'QC'       => $this->_qc,
                'Selected' => $this->_selected,
                'Caveats'  => $caveats,
               );
    }
}

