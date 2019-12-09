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

namespace LORIS\api\Views\Visit\Image\Headers;

/**
 * Creates a representation of an image specific header format following the api
 * response specifications.
 *
 * @category ApiViews
 * @package  Loris
 * @author   Xavier Lecours Boucher <xavier.lecours@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */

class Specific
{

    /**
     * The requested Image
     *
     * @var \LORIS\Image
     */
    private $_image;

    /**
     * The requested Visit
     *
     * @var \Timepoint
     */
    private $_visit;

    /**
     * The requested Visit
     *
     * @var string
     */
    private $_headername;

    /**
     * Constructor which sets the instance variables based on the provided image.
     *
     * @param \Timepoint   $visit      The requested visit
     * @param \LORIS\Image $image      The requested image
     * @param string       $headername The requested header
     */
    public function __construct(
        \Timepoint $visit,
        \LORIS\Image $image,
        string $headername
    ) {
        $this->_visit      = $visit;
        $this->_image      = $image;
        $this->_headername = $headername;
    }

    /**
     * Creates an serializable array of this object's data
     *
     * @return array
     */
    public function toArray(): array
    {
        return  array(
            'Meta'  => $this->_formatMeta(),
            'Value' => $this->_image->getHeader($this->_headername),
        );
    }

    /**
     * Creates an array of this image metadata
     *
     * @return array
     */
    private function _formatMeta(): array
    {
        $candid     = (string) $this->_visit->getCandID();
        $visitlabel = $this->_visit->getVisitLabel();
        $filename   = $this->_image->getFileInfo()->getFilename();

        return array(
            'CandID' => $candid,
            'Visit'  => $visitlabel,
            'File'   => $filename,
            'Header' => $this->_headername,
        );
    }
}

