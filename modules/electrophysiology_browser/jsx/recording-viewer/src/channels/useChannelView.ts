import {useCallback, useContext, useEffect, useMemo, useState} from 'react';
import {
  ChannelInfosContext,
  ChannelMetadataContext,
} from '../recording/RecordingDataProvider';
import {DEFAULT_MAX_CHANNELS, DEFAULT_VIEWER_HEIGHT} from '../shared/constants';
import {createChannelTypesDict, filterSelectedChannels}
  from './channelLogic';
import {ChannelTypeState} from '../domain/types';
import {useRecording} from '../recording/RecordingContext';
import {useViewedChannels} from '../signals/useViewedChannels';

/** Own channel filtering, pagination, loading, and viewer sizing. */
export function useChannelView() {
  const {limit, setLimit} = useRecording();
  const channelMetadata = useContext(ChannelMetadataContext);
  const bidsChannels = useContext(ChannelInfosContext);
  const [channelTypes, setChannelTypes] =
    useState<Record<string, ChannelTypeState>>({});
  const [offsetIndex, setOffsetIndex] = useState(1);
  const [displayedChannelsLimit, setDisplayedChannelsLimit] =
    useState(DEFAULT_MAX_CHANNELS);
  const [viewerHeight, setViewerHeight] = useState(DEFAULT_VIEWER_HEIGHT);

  useEffect(() => {
    setChannelTypes(createChannelTypesDict(channelMetadata, bidsChannels));
  }, [channelMetadata, bidsChannels]);

  const selectedChannels = useMemo(
    () => filterSelectedChannels(channelMetadata, bidsChannels, channelTypes),
    [channelMetadata, bidsChannels, channelTypes]
  );
  const displayedChannelIndexes = useMemo(
    () => selectedChannels
      .map(({index}) => index)
      .slice(offsetIndex - 1, offsetIndex - 1 + limit),
    [selectedChannels, offsetIndex, limit]
  );
  const {channels, loadedChannels} = useViewedChannels(displayedChannelIndexes);

  const updateOffsetIndex = useCallback((nextOffsetIndex: number) => {
    if (
      Number.isNaN(nextOffsetIndex)
      || nextOffsetIndex < 1
      || nextOffsetIndex > selectedChannels.length - limit + 1
    ) return;
    setOffsetIndex(nextOffsetIndex);
  }, [selectedChannels.length, limit]);

  const changeDisplayedChannelsLimit = useCallback((channelCount: number) => {
    setDisplayedChannelsLimit(channelCount);
    setLimit(channelCount);
    setViewerHeight(
      channelCount > 4 ? DEFAULT_VIEWER_HEIGHT : DEFAULT_VIEWER_HEIGHT * 0.8
    );
  }, [setLimit]);

  return {
    bidsChannels,
    channelMetadata,
    channelTypes,
    setChannelTypes,
    selectedChannels,
    channels,
    loadedChannels,
    channelsToLoad: displayedChannelIndexes.length,
    limit,
    offsetIndex,
    updateOffsetIndex,
    displayedChannelsLimit,
    changeDisplayedChannelsLimit,
    viewerHeight,
  };
}
