import * as R from 'ramda';
import {connect} from 'react-redux';
import {
  startDragInterval,
  continueDragInterval,
  endDragInterval,
} from '../store/logic/dragBounds';
import {setInterval} from '../store/state/bounds';
import {Slider, Rail, Handles, Ticks} from 'react-compound-slider';
import {Handle, Tick} from './components';
import React, {useState, FunctionComponent, useRef} from 'react';
import {RootState} from '../store';
import {DEFAULT_TIME_INTERVAL} from '../../vector';
import {roundTime} from '../store/logic/timeSelection';

type CProps = {
  viewerHeight?: number,
  domain: [number, number],
  interval: [number, number],
  setInterval: (_: [number, number]) => void,
  dragStart: (_: [number, number]) => void,
  dragContinue: (_: [number, number]) => void,
  dragEnd: (_: [number, number]) => void,
};

/**
 *
 * @param root0
 * @param root0.viewerHeight
 * @param root0.domain
 * @param root0.interval
 * @param root0.setInterval
 * @param root0.dragStart
 * @param root0.dragContinue
 * @param root0.dragEnd
 */
const IntervalSelect: FunctionComponent<CProps> = ({
  viewerHeight,
  domain,
  interval,
  setInterval,
  dragStart,
  dragContinue,
  dragEnd,
}) => {
  const [isDragging, setIsDragging] = useState(false);

  const sliderStyle = {
    position: 'relative',
  };

  const railStyle = {
    position: 'absolute',
    width: '100%',
    height: 10,
    marginTop: -9,
    borderBottom: '1px solid #000',
    cursor: 'pointer',
  };

  const lowerBoundInputRef = useRef(null);
  const upperBoundInputRef = useRef(null);

  /**
   *
   * @param increment
   */
  const increaseIntervalBy = (increment: number) => {
    const intervalSize = interval[1] - interval[0];
    setInterval([
      Math.min(domain[1] - intervalSize, interval[0] + increment),
      Math.min(domain[1], interval[1] + increment),
    ]);
  };

  /**
   *
   * @param decrement
   */
  const decreaseIntervalBy = (decrement: number) => {
    const intervalSize = interval[1] - interval[0];
    setInterval([
      Math.max(domain[0], interval[0] - decrement),
      Math.max(domain[0] + intervalSize, interval[1] - decrement),
    ]);
  };

  /**
   *
   * @param event
   */
  const handleIntervalChange = (event) => {
    const value = roundTime(parseFloat(event.target.value));

    if (isNaN(value)) {
      if (event.target.value === '') {
        if (event.target === lowerBoundInputRef.current) {
          setInterval([0, interval[1]]);
        } else if (event.target === upperBoundInputRef.current) {
          setInterval([interval[0], 0]);
        }
      }
      return;
    }

    if (event.target === lowerBoundInputRef.current) {
      if (value > interval[1]) { // This condition causes a swap
        upperBoundInputRef.current.focus();
      }

      if (value === roundTime(interval[1])) {
        return;
      } // do nothing if change causes overlap

      // Prevent exceeding max, which causes render
      setInterval([Math.min(value, domain[1]), interval[1]]);
    } else if (event.target === upperBoundInputRef.current) {
      if (value < interval[0]) { // This condition causes a swap
        lowerBoundInputRef.current.focus();
      }

      if (value === roundTime(interval[0])) {
        return;
      } // do nothing if change causes overlap

      setInterval([interval[0], value]);
    }
  };

  /**
   *
   * @param event
   */
  const handleIntervalBlur = (event) => {
    const value = roundTime(parseFloat(event.target.value));

    if (isNaN(value)) {
      setInterval(interval); // Reset
      return;
    }

    if (interval[0] > interval[1] || interval[1] < interval[0]) {
      setInterval([interval[1], interval[0]]); // Invert
    }
  };

  return (
    <div className='row'>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <h5
          className='col-xs-offset-1 col-xs-11 col-xs-title'
          style={{
            paddingLeft: '15px',
            marginBottom: '15px',
          }}
        >
          Timeline Range View
        </h5>
        <div
          className='col-xs-offset-1 col-xs-11'
          style={{
            marginBottom: '20px',
            display: 'flex',
            justifyContent: 'center',
            zIndex: '1',
          }}
        >
          <div className='btn-group'>
            <input
              type='button'
              className='btn btn-primary btn-xs'
              onClick={() => {
                decreaseIntervalBy(interval[1] - interval[0]);
              }}
              value='<<'
            />
            <input
              type='button'
              className='btn btn-primary btn-xs'
              onClick={() => {
                decreaseIntervalBy(1);
              }}
              value='<'
            />
            <input
              ref={lowerBoundInputRef}
              className='input-interval-bound'
              type='number'
              value={roundTime(interval[0])}
              min={domain[0]}
              max={domain[1]}
              onChange={handleIntervalChange}
              onBlur={handleIntervalBlur}
              onFocus={(e) => e.target.select()}
              step={0.1}
            />
            <input
              ref={upperBoundInputRef}
              className='input-interval-bound'
              type='number'
              value={roundTime(interval[1])}
              min={domain[0]}
              max={domain[1]}
              onChange={handleIntervalChange}
              onBlur={handleIntervalBlur}
              onFocus={(e) => e.target.select()}
              step={0.1}
            />
            <input
              type='button'
              className='btn btn-primary btn-xs'
              onClick={() => {
                increaseIntervalBy(1);
              }}
              value='>'
            />
            <input
              type='button'
              className='btn btn-primary btn-xs'
              onClick={() => {
                increaseIntervalBy(interval[1] - interval[0]);
              }}
              value='>>'
            />
          </div>
          <div style={{marginLeft: '15px'}}>
            <input
              type='button'
              className='btn btn-primary btn-xs'
              onClick={() => {
                setInterval(DEFAULT_TIME_INTERVAL);
              }}
              value='Reset'
            />
            <input
              type='button'
              className='btn btn-primary btn-xs'
              onClick={() => {
                setInterval([domain[0], domain[1]]);
              }}
              value='Show All'
            />
          </div>
        </div>
      </div>
      <div
        className='col-xs-offset-1 col-xs-11'
        style={{height: viewerHeight}}
      >
        <Slider
          mode={2}
          rootStyle={sliderStyle}
          domain={[domain[0], domain[1]]}
          values={[interval[0], interval[1]]}
          onUpdate={(values) => {
            if (!isDragging) {
              dragStart([values[0], values[1]]);
              setIsDragging(true);
            } else {
              dragContinue([values[0], values[1]]);
            }
          }}
          onChange={(values) => {
            dragStart([values[0], values[1]]);
            dragEnd([values[0], values[1]]);
            setIsDragging(false);
          }}
        >
          {/* @ts-ignore */}
          <Rail>
            {({getRailProps}) => (
              <div style={railStyle} {...getRailProps()} />
            )}
          </Rail>

          {/* @ts-ignore */}
          <Handles>
            {({handles, getHandleProps}) => (
              <div className="slider-handles">
                {handles.map((handle) => (
                  <Handle
                    key={handle.id}
                    handle={handle}
                    domain={domain}
                    getHandleProps={getHandleProps}
                  />
                ))}
              </div>
            )}
          </Handles>

          {/* @ts-ignore */}
          <Ticks count={20}>
            {({ticks}) => (
              <div
                className="slider-ticks"
                style={{
                  position: 'relative',
                  zIndex: 1,
                  pointerEvents: 'none',
                }}
              >
                {ticks.map((tick) => (
                  <Tick key={tick.id} tick={tick} count={ticks.length} />
                ))}
              </div>
            )}
          </Ticks>
        </Slider>

        <div
          style={{
            fontSize: 10,
            top: '-25px',
            right: '15px',
            position: 'absolute',
          }}
        >
          Time (s)
        </div>
      </div>
    </div>
  );
};

IntervalSelect.defaultProps = {
  viewerHeight: 20,
  domain: [0, 1],
  interval: [0.25, 0.75],
};

export default connect(
  (state: RootState) => ({
    domain: state.bounds.domain,
    interval: state.bounds.interval,
  }),
  (dispatch: (_: any) => void) => ({
    dragStart: R.compose(
      dispatch,
      startDragInterval
    ),
    dragContinue: R.compose(
      dispatch,
      continueDragInterval
    ),
    dragEnd: R.compose(
      dispatch,
      endDragInterval
    ),
    setInterval: R.compose(
      dispatch,
      setInterval
    ),
  })
)(IntervalSelect);
