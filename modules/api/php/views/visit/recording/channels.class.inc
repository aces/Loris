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
 * Creates a representation of a recording's channels information
 * the api response specifications.
 *
 * @category ApiViews
 * @package  LORIS
 * @author   Cecile Madjar <cecile.madjar@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class Channels
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
     * Creates a serializable array of this object's data
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

        $channels = array_map(
            function ($channel) {
                $channelfileinfo = $channel->getFileInfo();
                $filename        = $channelfileinfo->getFilename();

                return array(
                    'ChannelName'            => $channel->getChannelName(),
                    'ChannelDescription'     => $channel->getChannelDescription(),
                    'ChannelType'            => $channel->getChannelType(),
                    'ChannelTypeDescription' => $channel->getChannelTypeDescription(),
                    'ChannelStatus'          => $channel->getChannelStatus(),
                    'StatusDescription'      => $channel->getStatusDescription(),
                    'SamplingFrequency'      => $channel->getSamplingFrequency(),
                    'LowCutoff'              => $channel->getLowCutoff(),
                    'HighCutoff'             => $channel->getHighCutoff(),
                    'ManualFlag'             => $channel->getManualFlag(),
                    'Notch'                  => $channel->getNotch(),
                    'Reference'              => $channel->getReference(),
                    'Unit'                   => $channel->getUnit(),
                    'ChannelFilePath'        => $filename,
                );
            },
            $this->_recording->getChannels()
        );

        return array(
            'Meta'     => $meta,
            'Channels' => $channels,
        );
    }
}