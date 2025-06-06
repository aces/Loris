<?php declare(strict_types=1);

/**
 * PHP Version 7
 *
 * @category ApiViews
 * @package  Loris
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */

namespace LORIS\api\Views\Visit;

use LORIS\Data\Models\RecordingDTO;

/**
 * Creates a representation of a visit images following the api response
 * specifications.
 *
 * @category ApiViews
 * @package  Loris
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */

class Recordings
{
    private $_timepoint;
    private $_recordings;

    /**
     * Constructor which sets the instance variables based on the provide timepoint.
     *
     * @param \Timepoint   $timepoint     The timepoint to represent
     * @param RecordingDTO ...$recordings An array of recordings
     */
    public function __construct(\Timepoint $timepoint, RecordingDTO ...$recordings)
    {
        $this->_timepoint  = $timepoint;
        $this->_recordings = $recordings;
    }

    /**
     * Creates an serializable array of this object's data.
     *
     * @return array
     */
    public function toArray(): array
    {
        $meta = [
            'CandID' => $this->_timepoint->getCandID(),
            'Visit'  => $this->_timepoint->getVisitLabel(),
        ];

        $recordingsdata = array_map(
            function ($recording) {
                return [
                    'OutputType'          => $recording->getOutputType(),
                    'Filename'            => $recording->getFilename(),
                    'AcquisitionModality' => $recording->getAcquisitionmodality(),
                ];
            },
            $this->_recordings
        );

        return [
            'Meta'  => $meta,
            'Files' => $recordingsdata,
        ];
    }
}
