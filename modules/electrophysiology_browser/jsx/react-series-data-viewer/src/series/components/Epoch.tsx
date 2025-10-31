import React from 'react';
import {vec2} from 'gl-matrix';
import {MIN_EPOCH_WIDTH} from '../../vector';
import {ScaleLinear} from 'd3-scale';
import {connect} from "react-redux";
import {RootState} from "../store";
import {Channel, ChannelMetadata} from "../store/types";

type CProps = {
  key: string,
  parentHeight: number,
  onset: number,
  duration: number,
  scales: [
    ScaleLinear<number, number, never>,
    ScaleLinear<number, number, never>,
  ],
  color: string,
  opacity: number,
  minWidth: number,
  epochChannels?: string[],
  channels: Channel[],
  channelMetadata: ChannelMetadata[],
};

/**
 *
 * @param root0
 * @param root0.parentHeight
 * @param root0.onset
 * @param root0.duration
 * @param root0.scales
 * @param root0.color
 * @param root0.opacity
 * @param root0.minWidth
 * @param root0.epochChannels
 * @param root0.channels
 * @param root0.channelMetadata
 */
const Epoch = (
  {
    key,
    parentHeight,
    onset,
    duration,
    scales,
    color,
    opacity,
    minWidth,
    epochChannels,
    channels,
    channelMetadata,
  }: CProps) => {
  onset = isNaN(onset) ? 0 : onset;
  duration = isNaN(duration) ? 0 : duration;

  const start = vec2.fromValues(
    scales[0](onset),
    scales[1](-parentHeight/2),
  );

  const end = vec2.fromValues(
    scales[0](onset + Math.max(duration, minWidth)),
    scales[1](parentHeight/2)
  );

  const width = Math.abs(end[0] - start[0]);
  const height = Math.abs(end[1] - start[1]);
  const center = (start[0] + end[0]) / 2;

  if (epochChannels && epochChannels.length > 0) {
    const indicesToDraw = epochChannels.map((channelName) => {
      return channels.findIndex((channel) => {
        return channel.index === channelMetadata.findIndex((channel) => {
          return channel.name === channelName;
        });
      })
    }).filter(index => index !== -1);

    const rectHeight = height / channels.length;

    return (
      <React.Fragment key={key}>
        {
          indicesToDraw.map((channelIndex) => {
            return (
              <rect
                key={`rect-${key}-${channelIndex}`}
                fill={color}
                fillOpacity={opacity}
                width={width}
                height={rectHeight}
                x={center - width / 2}
                y={(-height / 2) + (channelIndex * rectHeight)}
              />
            );
          })
        }
      </React.Fragment>
    );
  }

  return (
    <rect
      fill={color}
      fillOpacity={opacity}
      width={width}
      height={height}
      x={center - width/2}
      y={-height/2}
    />
  );
};

Epoch.defaultProps = {
  color: '#dae5f2',
  opacity: 1,
  minWidth: MIN_EPOCH_WIDTH,
};

export default connect(
  (state: RootState)=> ({
    channels: state.channels,
    channelMetadata: state.dataset.channelMetadata,
  }))(Epoch);
