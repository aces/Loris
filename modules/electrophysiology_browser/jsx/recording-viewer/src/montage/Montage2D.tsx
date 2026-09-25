import React from 'react';
import {Group} from '@visx/group';
import {Sensor} from '../domain/types';

export type ColorMap = {
  color: string,
  mode: 'fill' | 'outline',
  ids: number[],
};

type Point = {
  x: number,
  y: number,
};

type Montage2DProps = {
  cssClass: string,
  points: Point[],
  sensors: Sensor[],
  selectedSensors: boolean[],
  colorMap?: ColorMap,
  isSensorSelectable: (sensor: Sensor) => boolean,
  showChannelIndices: boolean,
  isSensorVisible: (sensor: Sensor) => boolean,
  onSensorClick: (index: number) => void,
};

/** Montage2 d component. */
function Montage2D({
  cssClass,
  points,
  sensors,
  selectedSensors,
  colorMap,
  isSensorSelectable,
  showChannelIndices,
  isSensorVisible,
  onSensorClick,
}: Montage2DProps) {
  return (
    <Group className={cssClass}>
      <line x1="25" y1="-135" x2="0" y2="-150" stroke="black"/>
      <line x1="-25" y1="-135" x2="0" y2="-150" stroke="black"/>
      <ellipse
        cx="135"
        cy="0"
        rx="15"
        ry="40"
        stroke="black"
        fillOpacity="0"
      />
      <ellipse
        cx="-135"
        cy="0"
        rx="15"
        ry="40"
        stroke="black"
        fillOpacity="0"
      />
      <circle r="138" stroke="black" fill="white"/>
      {points.map((point, index) => {
        const sensor = sensors[index];
        if (!isSensorVisible(sensor)) return null;
        const selectable = isSensorSelectable(sensor);

        const textColor = colorMap?.mode === 'outline'
          && selectedSensors[index]
          ? colorMap.color
          : '#000';
        const fillColor = colorMap?.mode === 'fill'
          && selectedSensors[index]
          ? colorMap.color
          : 'white';
        const channelLabel = showChannelIndices
          ? index + 1
          : sensor.name;
        const channelTitle = showChannelIndices
          ? sensor.name
          : index + 1;

        return (
          <Group
            className={`electrode ${
              selectable ? 'cursor-pointer' : 'cursor-default'
            }`}
            key={`${sensor.type}-${sensor.channelIndex ?? sensor.name}-${index}`}
            onClick={() => selectable && onSensorClick(index)}
          >
            <circle
              transform="rotate(-90)"
              cx={point.x}
              cy={point.y}
              r="8"
              fill={fillColor}
              stroke={textColor}
            >
              <title>{channelTitle}</title>
            </circle>
            <text
              transform={`rotate(-90) rotate(90, ${point.x}, ${point.y})`}
              x={point.x}
              y={point.y}
              dominantBaseline="central"
              textAnchor="middle"
              fontSize="8px"
              fill={textColor}
            >
              {channelLabel}
              <title>{channelTitle}</title>
            </text>
          </Group>
        );
      })}
    </Group>
  );
}

export default Montage2D;
