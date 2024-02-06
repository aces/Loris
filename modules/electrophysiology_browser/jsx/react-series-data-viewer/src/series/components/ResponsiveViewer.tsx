import * as R from 'ramda';
import React, {FunctionComponent, MutableRefObject} from 'react';
import {scaleLinear} from 'd3-scale';
import {withParentSize} from '@visx/responsive';

type CProps = {
  ref: MutableRefObject<any>,
  parentWidth?: number,
  parentHeight?: number,
  mouseDown?: (_: any) => void,
  mouseMove?: (_: any) => void,
  mouseUp?: (_: any) => void,
  mouseLeave?: (_: any) => void,
  children: any,
  showOverflow: boolean,
};

/**
 *
 * @param root0
 * @param root0.ref
 * @param root0.parentWidth
 * @param root0.parentHeight
 * @param root0.mouseDown
 * @param root0.mouseMove
 * @param root0.mouseUp
 * @param root0.mouseLeave
 * @param root0.children
 * @param root0.showOverflow
 */
const ResponsiveViewer : FunctionComponent<CProps> = ({
  ref,
  parentWidth,
  parentHeight,
  mouseDown,
  mouseMove,
  mouseUp,
  mouseLeave,
  children,
  showOverflow
}) => {
  /**
   *
   * @param layer
   */
  const provision = (layer) =>
    React.cloneElement(
      layer,
      {viewerWidth: parentWidth, viewerHeight: parentHeight}
    );

  const layers = React.Children.toArray(children).map(provision);

  const domain = window.EEGLabSeriesProviderStore.getState().bounds.domain;
  const amplitude = [0, 1];
  const eventScale = [
    scaleLinear()
      .domain(domain)
      .range([-parentWidth/2, parentWidth/2]),
    scaleLinear()
      .domain(amplitude)
      .range([-parentHeight/2, parentHeight/2]),
  ];

  /**
   *
   * @param e
   */
  const eventToPosition = (e) => {
    const {
      top,
      left,
      width,
      height,
    } = e.currentTarget.getBoundingClientRect();
    return [
      Math.min(
        1,
        Math.max(
          0,
          eventScale[0].invert(
            eventScale[0]((e.clientX - left) / width)
          )
        )
      ),
      eventScale[1].invert(eventScale[1]((e.clientY - top) / height)),
    ];
  };

  return (
    <svg
      viewBox={[
        -parentWidth/2,
        -parentHeight/2,
        parentWidth,
        parentHeight,
      ].join(' ')}
      style={{overflowY: showOverflow ? 'visible' : 'hidden'}}
      width={parentWidth}
      height={parentHeight}
      onMouseDown={R.compose(
        mouseDown,
        eventToPosition
      )}
      onMouseMove={R.compose(
        mouseMove,
        eventToPosition
      )}
      onMouseUp={R.compose(
        mouseUp,
        eventToPosition
      )}
      onMouseLeave={R.compose(
        mouseLeave,
        eventToPosition
      )}
    >
      {layers}
    </svg>
  );
};

ResponsiveViewer.defaultProps = {
  parentWidth: 400,
  parentHeight: 300,
  /**
   *
   */
  mouseMove: () => {
    // do nothing
  },
  /**
   *
   */
  mouseDown: () => {
    // do nothing
  },
  /**
   *
   */
  mouseUp: () => {
    // do nothing
  },
  /**
   *
   */
  mouseLeave: () => {
    // do nothing
  },
};

export default withParentSize(ResponsiveViewer);
