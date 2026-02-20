import {ChannelTypeState} from "./SeriesRenderer";

/**
 * Component that displays the list of channel types present in the acquisition and
 * allows to configure which ones should be displayed or not.
 */
const ChannelTypesSelector = ({channelTypes, setChannelTypes}: {
  channelTypes: Record<string, ChannelTypeState>,
  setChannelTypes: React.Dispatch<React.SetStateAction<Record<string, ChannelTypeState>>>,
}) => {
  return (
    <div style={{position: 'relative'}}>
      <button className="btn btn-primary dropdown" data-toggle="dropdown">
        Channel types
      </button>
      <ul className="dropdown-menu">
        {Object.entries(channelTypes).map(([name, {visible, channelsCount}]) => (
          <li key={name} style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '0.75rem 1.5rem',
          }}>
            <span>{name} ({channelsCount})</span>
            <input
              type="checkbox"
              checked={visible || false}
              onClick={
                // Do not collapse the dropdown on click.
                (e) => e.stopPropagation()
              }
              onChange={(e) => {
                setChannelTypes((channelTypes) => ({
                  ...channelTypes,
                  [name]: {
                    ...channelTypes[name],
                    visible: e.target.checked,
                  },
                }));
              }}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ChannelTypesSelector;
