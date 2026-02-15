import { ChannelInfo } from "../store/types";

/**
 * Component that displays the list of channel types present in the acquisition and
 * allows to configure which ones should be displayed or not.
 */
const ChannelTypesSelector = ({channels, visibleChannelTypes, setVisibleChannelTypes}: {
  channels: ChannelInfo[],
  visibleChannelTypes: Record<string, boolean>,
  setVisibleChannelTypes: (_: Record<string, boolean>) => void,
}) => {
  const channelTypes: Record<string, ChannelInfo[]> = {};
  channels.forEach((channel) => {
    if (channelTypes[channel.ChannelType]) {
      channelTypes[channel.ChannelType].push(channel);
    } else {
      channelTypes[channel.ChannelType] = [channel];
    }
  });

  return (
    <div style={{position: 'relative'}}>
      <button className="btn btn-primary dropdown" data-toggle="dropdown">
        Channel types
      </button>
      <ul className="dropdown-menu">
        {Object.entries(channelTypes).map(([type, channels]) => (
          <li key={type} style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '0.75rem 1.5rem',
          }}>
            <span>{type} ({channels.length})</span>
            <input
              type="checkbox"
              checked={visibleChannelTypes[type] || false}
              onClick={
                // Do not collapse the dropdown on click.
                (e) => e.stopPropagation()
              }
              onChange={(e) => {
                setVisibleChannelTypes({
                  ...visibleChannelTypes,
                  [type]: e.target.checked,
                });
              }}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ChannelTypesSelector;
