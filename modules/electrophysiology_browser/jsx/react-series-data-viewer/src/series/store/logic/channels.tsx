import {ChannelTypeState} from '../../components/SeriesRenderer';
import {Channel, ChannelInfo, ChannelMetadata} from '../types';

/**
 * Create the channel types dictionary that maps each channel type found in the dataset
 * to its state.
 */
export function createChannelTypesDict(
  channels: ChannelInfo[],
): Record<string, ChannelTypeState> {
  const channelTypes: Record<string, ChannelTypeState> = {};
  for (const channel of channels) {
    if (channelTypes[channel.ChannelType] === undefined) {
      channelTypes[channel.ChannelType] = {
        visible: true,
        channelsCount: 0,
      };
    }

    channelTypes[channel.ChannelType].channelsCount++;
  }

  return channelTypes;
}
/**
 * Filter the list of all channels to keep only those whose channel types are visible.
 */
export function filterSelectedChannels(
  channels: ChannelMetadata[],
  channelInfos: ChannelInfo[],
  channelTypes: Record<string, ChannelTypeState>,
): ChannelMetadata[] {
  return channels.filter((channelMeta) => {
    const channelInfo = channelInfos.find((_, channelIndex) =>
      channelMeta.index === channelIndex
    );

    if (channelInfo === undefined) {
      return false;
    }

    const channelType = channelTypes[channelInfo.ChannelType];
    if (channelType === undefined) {
      return true;
    }

    return channelTypes[channelInfo.ChannelType].visible;
  });
}

/**
 * Filter the list of selected channels to keep only those that should be displayed on the current
 * page.
 */
export function filterDisplayedChannels(
  selectedChannels: ChannelMetadata[],
  offsetIndex: number,
  pageLimit: number,
  previousChannels: Channel[],
): Channel[] {
  // Index of of the first displayed channel among the selected channels.
  let selectedChannelIndex = offsetIndex - 1;

  const maxSelectedChannelIndex = Math.min(
    offsetIndex + pageLimit - 1,
    selectedChannels.length
  );

  const newChannels = [];
  while (selectedChannelIndex < maxSelectedChannelIndex) {
    // Get the channel index of the selected channel.
    const channelIndex = selectedChannels[selectedChannelIndex].index;

    // Re-use previous channels if possible.
    // TODO: need to handle multiple traces using shapes
    const channel = previousChannels.find((pastChannel) =>
      pastChannel.index === channelIndex
    ) ?? {
      index: channelIndex,
      traces: [{chunks: [], type: 'line'}],
    };

    newChannels.push(channel);
    selectedChannelIndex++;
  }

  return newChannels;
}
