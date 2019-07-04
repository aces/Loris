<?php declare(strict_types=1);
/**
 * File that describe the Image QC Status class
 *
 * PHP Version 7
 *
 *  @category Imaging
 *  @package  Main
 *  @author   Xavier Lecours <xavier.lecours@mcin.ca>
 *  @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 *  @link     https://www.github.com/aces/Loris/
 */
namespace LORIS;

/**
 * This class defines an Image QC Stagtus to allow one to type hint function's
 * parameters
 *
 *  @category Imaging
 *  @package  Main
 *  @author   Xavier Lecours <xavier.lecours@mcin.ca>
 *  @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 *  @link     https://www.github.com/aces/Loris/
 */
class ImageQcStatus
{
    /**
     * The label to display to the frontend user
     *
     * @var string
     */
    private $_qcstatus;

    /**
     * The selected value
     *
     * @var bool
     */
    private $_selected;

    /**
     * Constructor
     *
     * @param string $qcstatus Either "Pass" or "Fail"
     * @param bool   $selected If not set to true, will default to false
     *
     * @throws \DomainException When $qcstatus is not one of PASS or FAIL
     */
    public function __construct(string $qcstatus = null, bool $selected = false)
    {
        if (!in_array($qcstatus, ['Pass', 'Fail'], true)) {
            throw new \DomainException('Invalid value for QCStatus');
        }
        $this->_qcstatus = $qcstatus;
        $this->_selected = $selected;
    }

    /**
     * Accessor for QcStatus
     *
     * @return string
     */
    public function getQcStatus(): string
    {
        return $this->_qcstatus;
    }

    /**
     * Accessor for selected
     *
     * @return bool
     */
    public function isSelected(): bool
    {
        return $this->_selected;
    }
}

