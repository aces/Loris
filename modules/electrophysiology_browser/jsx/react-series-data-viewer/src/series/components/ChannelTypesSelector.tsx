import {useCallback} from "react";
import {useTranslation} from "react-i18next";
import {ChannelTypeState} from "./SeriesRenderer";
import MultiSelectDropdownButton
  from "../../../../common/MultiSelectDropdownButton";

/**
 * Component that displays the list of channel types present in the acquisition and
 * allows to configure which ones should be displayed or not.
 */
const ChannelTypesSelector = ({channelTypes, setChannelTypes}: {
  channelTypes: Record<string, ChannelTypeState>,
  setChannelTypes: React.Dispatch<React.SetStateAction<Record<string, ChannelTypeState>>>,
}) => {
  const {t} = useTranslation();

  // Toggle the visibility of a channel type.
  const toggleChannelType = useCallback((channelTypeName: string) => {
    setChannelTypes((channelTypes) => {
        const channelType = channelTypes[channelTypeName];
        return ({
        ...channelTypes,
        [channelTypeName]: {
          ...channelType,
          visible: !channelType.visible,
        },
      });
    });
  }, [setChannelTypes]);

  return (
    <MultiSelectDropdownButton
      label={t('Channel Types')}
      align="right"
      options={Object.entries(channelTypes).map(([name, {visible, channelsCount}]) => ({
        key: name,
        value: name,
        label: `${name} (${channelsCount})`,
        selected: visible || false,
      }))}
      onToggle={toggleChannelType}
    />
  );
}

export default ChannelTypesSelector;
