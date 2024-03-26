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

/**
 *
 * @param root0
 * @param root0.domain
 * @param root0.domain.0
 * @param root0.domain.1
 * @param root0.handle
 * @param root0.handle.id
 * @param root0.handle.value
 * @param root0.handle.percent
 * @param root0.getHandleProps
 */

export const Handle: React.FC<IHandleProps> = ({
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
      marginLeft: '-5px',
      marginTop: '-5px',
      zIndex: 2,
      width: 10,
      height: 10,
      cursor: 'pointer',
      boxShadow: '1px 1px 1px 1px rgba(0, 0, 0, 0.2)',
      border: '2px solid #064785',
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

/**
 *
 * @param root0
 * @param root0.tick
 * @param root0.count
 */
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


// *******************************************************
// INFO ICON COMPONENT
// *******************************************************
interface IInfoIcon {
  title: string;
  url: string;
}

/**
 *
 * @param root0
 * @param root0.title
 * @param root0.url
 */
export const InfoIcon: React.FC<IInfoIcon> = ({
  title,
  url,
}) => (
  <a
    href={url}
    target="_blank"
    style={{
      cursor: 'help',
      marginLeft: '5px',
      color: '#A9A9A9',
    }}
    title={title}
  >
    <i className='glyphicon glyphicon-info-sign'/>
  </a>
);

