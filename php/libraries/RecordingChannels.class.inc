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
 * RecordingChannels value object to allow one to type hint function's
 * parameters.
 *
 * @category Recording
 * @package  Main
 * @author   Cecile Madjar <cecile.madjar@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class RecordingChannels
{
    /**
     * Contructor
     *
     * @param ?string $channelname            Channel Name
     * @param ?string $channeldescription     Channel Description
     * @param ?string $channeltype            Channel Type
     * @param ?string $channeltypedescription Channel Type Description
     * @param ?string $channelstatus          Channel Status
     * @param ?string $statusdescription      Status Description
     * @param ?string $samplingfrequency      Sampling Frequency
     * @param ?string $lowcutoff              Low Cutoff
     * @param ?string $highcutoff             High Cutoff
     * @param ?string $manualflag             Manual Flag
     * @param ?string $notch                  Notch
     * @param ?string $reference              Reference
     * @param ?string $unit                   Unit
     * @param ?string $filepath               Channels BIDS File Path
     */
    public function __construct(
        ?string $channelname,
        ?string $channeldescription,
        ?string $channeltype,
        ?string $channeltypedescription,
        ?string $channelstatus,
        ?string $statusdescription,
        ?string $samplingfrequency,
        ?string $lowcutoff,
        ?string $highcutoff,
        ?string $manualflag,
        ?string $notch,
        ?string $reference,
        ?string $unit,
        ?string $filepath
    ) {
        $this->_channelname            = $channelname;
        $this->_channeldescription     = $channeldescription;
        $this->_channeltype            = $channeltype;
        $this->_channeltypedescription = $channeltypedescription;
        $this->_channelstatus          = $channelstatus;
        $this->_statusdescription      = $statusdescription;
        $this->_samplingfrequency      = $samplingfrequency;
        $this->_lowcutoff  = $lowcutoff;
        $this->_highcutoff = $highcutoff;
        $this->_manualflag = $manualflag;
        $this->_notch      = $notch;
        $this->_reference  = $reference;
        $this->_unit       = $unit;
        $this->_filepath   = $filepath;
    }

    /**
     * Accessor for channel name
     *
     * @return ?string
     */
    public function getChannelName(): ?string
    {
        return $this->_channelname;
    }

    /**
     * Accessor for channel description
     *
     * @return ?string
     */
    public function getChannelDescription(): ?string
    {
        return $this->_channeldescription;
    }

    /**
     * Accessor for channel type
     *
     * @return ?string
     */
    public function getChannelType(): ?string
    {
        return $this->_channeltype;
    }

    /**
     * Accessor for channel type description
     *
     * @return ?string
     */
    public function getChannelTypeDescription(): ?string
    {
        return $this->_channeltypedescription;
    }

    /**
     * Accessor for channel status
     *
     * @return ?string
     */
    public function getChannelStatus(): ?string
    {
        return $this->_channelstatus;
    }

    /**
     * Accessor for status description
     *
     * @return ?string
     */
    public function getStatusDescription(): ?string
    {
        return $this->_statusdescription;
    }

    /**
     * Accessor for sampling frequency
     *
     * @return ?string
     */
    public function getSamplingFrequency(): ?string
    {
        return $this->_samplingfrequency;
    }

    /**
     * Accessor for low cutoff
     *
     * @return ?string
     */
    public function getLowCutoff(): ?string
    {
        return $this->_lowcutoff;
    }

    /**
     * Accessor for high cutoff
     *
     * @return ?string
     */
    public function getHighCutoff(): ?string
    {
        return $this->_highcutoff;
    }

    /**
     * Accessor for manual flag
     *
     * @return ?string
     */
    public function getManualFlag(): ?string
    {
        return $this->_manualflag;
    }

    /**
     * Accessor for notch
     *
     * @return ?string
     */
    public function getNotch(): ?string
    {
        return $this->_notch;
    }

    /**
     * Accessor for reference
     *
     * @return ?string
     */
    public function getReference(): ?string
    {
        return $this->_reference;
    }

    /**
     * Accessor for unit
     *
     * @return ?string
     */
    public function getUnit(): ?string
    {
        return $this->_unit;
    }

    /**
     * Accessor for filepath
     *
     * @return \SplFileInfo
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