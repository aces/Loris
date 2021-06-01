import * as React from 'react';
import {
  SliderItem,
  GetHandleProps,
} from 'react-compound-slider';

// *******************************************************
// HANDLE COMPONENT
// *******************************************************
interface IHandleProps {
  domain: number[];
  handle: SliderItem;
  getHandleProps: GetHandleProps;
}

export const Handle: React.SFC<IHandleProps> = ({
  domain: [min, max],
  handle: {id, value, percent},
  getHandleProps,
}) => (
  <div
    role="slider"
    aria-valuemin={min}
    aria-valuemax={max}
    aria-valuenow={value}
    style={{
      left: `${percent}%`,
      position: 'absolute',
      marginLeft: '-9px',
      marginTop: '-9px',
      zIndex: 2,
      width: 18,
      height: 18,
      cursor: 'pointer',
      boxShadow: '1px 1px 1px 1px rgba(0, 0, 0, 0.2)',
      border: '3px solid #064785',
      background: '#fff',
      borderRadius: '50%',
    }}
    {...getHandleProps(id)}
  />
);

// *******************************************************
// TICK COMPONENT
// *******************************************************
interface ITickProps {
  key: string;
  tick: SliderItem;
  count: number;
}

export const Tick: React.FC<ITickProps> = ({tick, count}) => (
  <div>
    <div
      style={{
        position: 'absolute',
        marginTop: 0,
        width: 1,
        height: 10,
        backgroundColor: 'rgb(0,0,0)',
        left: `${tick.percent}%`,
      }}
    />
    <div
      style={{
        position: 'absolute',
        marginTop: 8,
        fontSize: 10,
        textAlign: 'center',
        marginLeft: `${-(100 / count) / 2}%`,
        width: `${100 / count}%`,
        left: `${tick.percent}%`,
      }}
    >
      {tick.value}
    </div>
  </div>
);
