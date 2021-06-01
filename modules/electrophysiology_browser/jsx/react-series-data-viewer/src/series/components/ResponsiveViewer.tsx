import * as R from 'ramda';
import React, { FunctionComponent, ReactNode, Children } from 'react';
import {scaleLinear} from 'd3-scale';
import {withParentSize} from '@visx/responsive';
import { WithParentSizeProps } from '@visx/responsive/lib/enhancers/withParentSizeModern';

type CProps = {
  parentWidth?: number,
  parentHeight?: number,
  mouseDown?: (_: any) => void,
  mouseMove?: (_: any) => void,
  mouseUp?: (_: any) => void,
  mouseLeave?: (_: any) => void
};

const ResponsiveViewer : FunctionComponent<CProps> = ({
  parentWidth,
  parentHeight,
  mouseDown,
  mouseMove,
  mouseUp,
  mouseLeave,
  children
}) => {
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
      style={{overflow: 'hidden'}}
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
  mouseMove: () => {},
  mouseDown: () => {},
  mouseUp: () => {},
  mouseLeave: () => {},
};

export default withParentSize(ResponsiveViewer);
