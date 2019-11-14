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
 * Creates a representation of a recording metadata.class format following the API
 * response specifications.
 *
 * @category ApiViews
 * @package  LORIS
 * @author   Cecile Madjar <cecile.madjar@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */

class Full
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
     * Constructor which sets the instance variables based on the provided recording.
     *
     * @param \Timepoint   $visit     The requested visit
     * @param \LORIS\Image $recording The requested recording
     */
    public function __construct(\Timepoint $visit, \LORIS\Recording $recording)
    {
        $this->_visit     = $visit;
        $this->_recording = $recording;
    }

    /**
     * Creates an serializable array of this object's data
     *
     * @return array
     */
    public function toArray(): array
    {
        $data = $this->_recording->getAllMetadata();

        // There's a few headers.class that get magically created which
        // aren't header fields, so we manually exclude them.
        unset($data['electrode_file_blake2b_hash']);
        unset($data['channel_file_blake2b_hash']);
        unset($data['event_file_blake2b_hash']);
        unset($data['json_file']);
        unset($data['physiological_json_file_blake2b_hash']);
        unset($data['physiological_file_blake2b_hash']);

        return  array(
            'Meta' => $this->_formatMeta(),
            'Data' => $data,
        );
    }

    /**
     * Creates an array of this recording metadata.class
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
        );
    }
}

