import {Channel, ChannelInfo, ChannelMetadata} from '../types';

/**
 * Create the visible channel types dictionary map from a list of channels.
 * Channel types are configured to be visible by default.
 */
export function createVisibleChannelsDict(
  channels: ChannelInfo[],
): Record<string, boolean> {
  const visibleChannels: Record<string, boolean> = {};
  channels.forEach((channel) => {
    visibleChannels[channel.ChannelType] = true;
  });

  return visibleChannels;
}
/**
 * Filter the list of channel metadatas to only keep channels whose types are visible.
 */
export function filterSelectedChannels(
  channelMetadatas: ChannelMetadata[],
  channelInfos: ChannelInfo[],
  visibleChannelTypes: Record<string, boolean>,
): ChannelMetadata[] {
  return channelMetadatas.filter((channelMeta) => {
    const channelInfo = channelInfos.find((channelInfo) =>
      // TODO: Why do channels have different names im the electrophysiology browser and API?
      channelMeta.name.includes(channelInfo.ChannelName)
    );

    if (channelInfo === undefined) {
      return false;
    }

    return visibleChannelTypes[channelInfo.ChannelType];
  });
}

/**
 * Filter the list of channels to only keep channels whose types are visible.
 */
export function filterDisplayedChannels(
  selectedChannels: ChannelMetadata[],
  offsetIndex: number,
  limit: number,
  pastChannels: Channel[],
): Channel[] {
  let channelIndex = offsetIndex - 1;

  const newChannels = [];
  const hardLimit = Math.min(
    offsetIndex + limit - 1,
    selectedChannels.length
  );

  while (channelIndex < hardLimit) {
    // TODO: need to handle multiple traces using shapes
    const channel =
      pastChannels.find((pastChannel) => pastChannel.index === channelIndex)
      || {
        index: channelIndex,
        traces: [{chunks: [], type: 'line'}],
      };

    newChannels.push(channel);
    channelIndex++;
  }

  return newChannels;
}
