import {ChannelTypeState} from '../../components/SeriesRenderer';
import {Channel, ChannelInfo, ChannelMetadata} from '../types';

/**
 * Create the channel types dictionary that maps each channel type found in the dataset
 * to its state.
 */
export function createChannelTypesDict(
  rawChannels: ChannelMetadata[],
  bidsChannels: ChannelInfo[],
): Record<string, ChannelTypeState> {
  const channelTypes: Record<string, ChannelTypeState> = {};

  for (const rawChannel of rawChannels) {
    const bidsChannel = findBidsChannel(rawChannel, bidsChannels);
    const channelTypeName = bidsChannel?.ChannelType ?? 'Unknown';
    if (channelTypes[channelTypeName] === undefined) {
      channelTypes[channelTypeName] = {
        visible: true,
        channelsCount: 0,
      };
    }

    channelTypes[channelTypeName].channelsCount++;
  }

  return channelTypes;
}
/**
 * Filter the list of all channels to keep only those whose channel types are visible.
 */
export function filterSelectedChannels(
  rawChannels: ChannelMetadata[],
  bidsChannels: ChannelInfo[],
  channelTypes: Record<string, ChannelTypeState>,
): ChannelMetadata[] {
  // If no channel types are loaded, do not filter any channel out.
  if (Object.keys(channelTypes).length === 0) {
    return rawChannels;
  }

  return rawChannels.filter((rawChannel) => {
    const bidsChannel = findBidsChannel(rawChannel, bidsChannels);

    // If there is a mismatch between the BIDS channels and the raw channels,
    // display the channel by default.
    if (bidsChannel === undefined) {
      return channelTypes['Unknown'].visible;
    }

    const channelType = channelTypes[bidsChannel.ChannelType];
    if (channelType === undefined) {
      return true;
    }

    return channelTypes[bidsChannel.ChannelType].visible;
  });
}

/**
 * Find the BIDS channel corresponding to a raw channel among a list of BIDS channels.
 */
function findBidsChannel(
  rawChannel: ChannelMetadata,
  bidsChannels: ChannelInfo[]
): ChannelInfo | undefined {
  return bidsChannels.find((bidsChannel) =>
    bidsChannel.ChannelName === rawChannel.name
  );
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
