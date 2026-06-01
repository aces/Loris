import {useContext} from 'react';
import {ChannelTypeState} from '../../components/SeriesRenderer';
import {Channel, ChannelInfo, ChannelMetadata} from '../types';
import {DEFAULT_SIGNAL_UNIT} from '../../../vector';
import {
  ChannelInfosContext,
  ChannelMetasContext,
} from '../../../eeglab/EEGLabSeriesProvider';

/**
 * Get the information about a channel from the context.
 */
export function useChannelMetadata(channel: Channel): ChannelMetadata | null {
  const channelMetadatas = useContext(ChannelMetasContext);
  return channelMetadatas[channel.index] ?? null;
}

/**
 * Get the BIDS metadata of a channel from the context.
 */
export function useChannelInfo(channel: Channel): ChannelInfo | null {
  const channelMetadata = useChannelMetadata(channel);
  const channelInfos = useContext(ChannelInfosContext);

  if (channelMetadata === null) {
    return null;
  }

  return findBidsChannel(channelMetadata, channelInfos) ?? null;
}

/**
 * Get the unit of a channel from its BIDS metadata, or fall back to the default
 * unit if that metadata or unit is not available.
 */
export function getChannelUnit(channelInfo: ChannelInfo | null): string {
  return channelInfo?.Unit ?? DEFAULT_SIGNAL_UNIT;
}

/**
 * Create the channel types dictionary that maps each channel type found in the dataset
 * to its state.
 */
export function createChannelTypesDict(
  rawChannels: ChannelMetadata[],
  bidsChannels: ChannelInfo[],
): Record<string, ChannelTypeState> {
  // A mapping of channel types indexed by their names.
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
export function findBidsChannel(
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
