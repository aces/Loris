<?php declare(strict_types=1);
/**
 * PHP Version 7
 *
 *  @category Recording
 *  @package  Main
 *  @author   Cecile Madjar <cecile.madjar@mcin.ca>
 *  @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 *  @link     https://www.github.com/aces/Loris/
 */

namespace LORIS;

/**
 * RecordingEvents value object to allow one to type hint function's
 * parameters.
 *
 *  @category Recording
 *  @package  Main
 *  @author   Cecile Madjar <cecile.madjar@mcin.ca>
 *  @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 *  @link     https://www.github.com/aces/Loris/
 */
class RecordingEvents
{
    /**
     * Contructor
     *
     * @param ?string $onset       Onset
     * @param ?string $duration    Duration
     * @param ?string $eventcode   Event Code
     * @param ?string eventsample  Event Sample
     * @param ?string eventtype    Event Type
     * @param ?string trialtype    Trial Type
     * @param ?string responsetime Response time
     * @param ?string $filepath    Events BIDS File Path
     */
    public function __construct(
        ?string $onset,
        ?string $duration,
        ?string $eventcode,
        ?string $eventsample,
        ?string $eventtype,
        ?string $trialtype,
        ?string $responsetime,
        ?string $filepath
    ) {
        $this->_onset        = $onset;
        $this->_duration     = $duration;
        $this->_eventcode    = $eventcode;
        $this->_eventsample  = $eventsample;
        $this->_eventtype    = $eventtype;
        $this->_trialtype    = $trialtype;
        $this->_responsetime = $responsetime;
        $this->_filepath     = $filepath;
    }

    /** Accessor for onset
     *
     * @return ?string
     */
    public function getOnset(): ?string
    {
        return $this->_onset;
    }

    /** Accessor for duration
     *
     * @return ?string
     */
    public function getDuration(): ?string
    {
        return $this->_duration;
    }

    /** Accessor for event code
     *
     * @return ?string
     */
    public function getEventCode(): ?string
    {
        return $this->_eventcode;
    }

    /** Accessor for event sample
     *
     * @return ?string
     */
    public function getEventSample(): ?string
    {
        return $this->_eventsample;
    }

    /** Accessor for event type
     *
     * @return ?string
     */
    public function getEventType(): ?string
    {
        return $this->_eventtype;
    }

    /** Accessor for trial type
     *
     * @return ?string
     */
    public function getTrialType(): ?string
    {
        return $this->_trialtype;
    }

    /** Accessor for impedance
     *
     * @return ?string
     */
    public function getResponseTime(): ?string
    {
        return $this->_responsetime;
    }

    /** Accessor for filepath
     *
     * @return ?string
     */
    public function getFileInfo(): \SplFileInfo
    {
        $imagepath = \NDB_Factory::singleton()
            ->config()
            ->getSetting('imagePath');

        $fullpath = $imagepath . $this->_filepath;

        $info = new \SplFileInfo($fullpath);

        return $info;
    }
}
