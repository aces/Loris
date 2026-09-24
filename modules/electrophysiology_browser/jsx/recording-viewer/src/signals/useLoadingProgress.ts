import {useEffect, useState} from 'react';

/** Coordinate the visibility of the channel loading bar. */
export function useLoadingProgress(
  loadedChannels: number,
  channelsToLoad: number
) {
  const [visible, setVisible] = useState(false);
  const progress = channelsToLoad === 0
    ? 0
    : 100 * loadedChannels / channelsToLoad;

  useEffect(() => {
    if (channelsToLoad === 0) {
      setVisible(false);
      return;
    }

    if (loadedChannels < channelsToLoad) {
      setVisible(true);
      return;
    }

    // Keep the completed bar visible for its one-second width transition.
    const timeout = window.setTimeout(() => setVisible(false), 1000);
    return () => window.clearTimeout(timeout);
  }, [channelsToLoad, loadedChannels]);

  return {visible, progress};
}
