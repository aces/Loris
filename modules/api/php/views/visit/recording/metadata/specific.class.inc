<?php declare(strict_types=1);
/**
 * PHP Version 7
 *
 * @category ApiViews
 * @package  LORIS
 * @author   Cecile Madjar <cecile.madjar@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */

namespace LORIS\api\Views\Visit\Recording\Metadata;

/**
 * Creates a representation of an image specific header format following the api
 * response specifications.
 *
 * @category ApiViews
 * @package  LORIS
 * @author   Cecile Madjar <cecile.madjar@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */

class Specific
{

    /**
     * The requested Recording
     *
     * @var \LORIS\Recording
     */
    private $_recording;

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
     * Constructor which sets the instance variables based on the provided recording.
     *
     * @param \Timepoint       $visit      The requested visit
     * @param \LORIS\Recording $recording  The requested recording
     * @param string           $headername The requested header
     */
    public function __construct(
        \Timepoint $visit,
        \LORIS\Recording $recording,
        string $headername
    ) {
        $this->_visit      = $visit;
        $this->_recording  = $recording;
        $this->_headername = $headername;
    }

    /**
     * Creates an serializable array of this object's data.
     *
     * @return array
     */
    public function toArray(): array
    {
        return  array(
            'Meta'  => $this->_formatMeta(),
            'Value' => $this->_recording->getMetadata($this->_headername),
        );
    }

    /**
     * Creates an array of this recording metadata.
     *
     * @return array
     */
    private function _formatMeta(): array
    {
        $candid     = (string) $this->_visit->getCandID();
        $visitlabel = $this->_visit->getVisitLabel();
        $filename   = $this->_recording->getFileInfo()->getFilename();

        return array(
            'CandID' => $candid,
            'Visit'  => $visitlabel,
            'File'   => $filename,
            'Header' => $this->_headername,
        );
    }
}

