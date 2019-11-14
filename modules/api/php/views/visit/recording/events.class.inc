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

namespace LORIS\api\Views\Visit\Recording;

/**
 * Creates a representation of a recording's events information
 * the api response specifications.
 *
 * @category ApiViews
 * @package  LORIS
 * @author   Cecile Madjar <cecile.madjar@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class Events
{
    private $_timepoint;

    private $_recording;

    /**
     * Constructor which sets the instance variables based on the provided
     * timepoint and recording.
     *
     * @param \TimePoint       $timepoint The timepoint to represent
     * @param \LORIS\Recording $recording The recording requested
     */
    public function __construct(\Timepoint $timepoint, \LORIS\Recording $recording)
    {
        $this->_timepoint = $timepoint;
        $this->_recording = $recording;
    }

    /**
     * Creates a serializable array of this object's data.
     *
     * @return array
     */
    public function toArray(): array
    {
        $meta = array(
            'CandID' => $this->_timepoint->getCandID(),
            'Visit'  => $this->_timepoint->getVisitLabel(),
            'File'   => $this->_recording->getFileInfo()->getFilename(),
        );

        $events = array_map(
            function ($event) {
                $fileinfo = $event->getFileInfo();
                $filename = $fileinfo->getFilename();

                return array(
                    'Onset'         => $event->getOnset(),
                    'Duration'      => $event->getDuration(),
                    'EventCode'     => $event->getEventCode(),
                    'EventSample'   => $event->getEventSample(),
                    'EventType'     => $event->getEventType(),
                    'TrialType'     => $event->getTrialType(),
                    'ResponseTime'  => $event->getResponseTime(),
                    'EventFilePath' => $filename,
                );
            },
            $this->_recording->getEvents()
        );

        return array(
            'Meta'       => $meta,
            'TaskEvents' => $events,
        );
    }
}
