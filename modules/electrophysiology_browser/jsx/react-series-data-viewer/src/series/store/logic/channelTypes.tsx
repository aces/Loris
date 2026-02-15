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
 * Filter the list of channels to only keep channels whose types are visible.
 */
export function filterVisibleChannelTypes(
  channels: Channel[],
  channelMetadatas: ChannelMetadata[],
  channelInfos: ChannelInfo[],
  visibleChannelTypes: Record<string, boolean>,
): Channel[] {
  return channels.filter((channel) => {
    const channelMeta = channelMetadatas[channel.index];
    // TODO: Why do channels have different names im the electrophysiology browser and API?
    const channelInfo = channelInfos.find((channelInfo) =>
      channelInfo.ChannelName.slice(1) === channelMeta.name.slice(1)
    );

    if (channelInfo === undefined) {
      return false;
    }

    return visibleChannelTypes[channelInfo.ChannelType];
  });
}
