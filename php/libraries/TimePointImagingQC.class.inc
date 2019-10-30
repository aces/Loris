<?php declare(strict_types=1);
/**
 * File implements the TimepointImagingQC class.
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
 * This class defines a TimepointImagingQC to allows one to type hint
 * function's parameters.
 *
 * @category Imaging
 * @package  Main
 * @author   Xavier Lecours <xavier.lecours@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */

class TimePointImagingQC
{
    /**
     * The QC value
     *
     * @var string
     */
    private $_qc;

    /**
     * A flag to tell if the QC is still pending
     *
     * @var string
     */
    private $_qcpending;

    /**
     * A flag to indicate if there is a caveat
     *
     * @var string
     */
    private $_hascaveat;

    /**
     * Constructor
     *
     * @param ?string $qc        This should be one of enum('','Pass','Fail').
     * @param ?string $qcpending This should be one of enum('Y','N')
     * @param ?string $hascaveat This should be one of enum('true','false')
     */
    public function __construct(?string $qc, ?string $qcpending, ?string $hascaveat)
    {
        $this->_qc        = $qc;
        $this->_qcpending = $qcpending;
        $this->_hascaveat = $hascaveat;
    }

    /**
     * Accessor for qc
     *
     * @return ?string
     */
    public function getQC(): ?string
    {
        return $this->_qc;
    }

    /**
     * Accessor for qcpending
     *
     * @return ?string
     */
    public function getQCPending(): ?string
    {
        return $this->_qcpending;
    }

    /**
     * Accessor for hascaveat
     *
     * @return ?string
     */
    public function getHasCaveat(): ?string
    {
        return $this->_hascaveat;
    }
}
