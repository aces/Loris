// @flow

import * as R from 'ramda';
import React from 'react';
import type {Node} from 'react';
import {scaleLinear} from 'd3-scale';
import {withParentSize} from '@visx/responsive';
import type {Vector2} from '../../vector';

type Props = {
  parentWidth: number,
  parentHeight: number,
  mouseDown: Vector2 => void,
  mouseMove: Vector2 => void,
  mouseUp: Vector2 => void,
  mouseLeave: Vector2 => void,
  children: Node
};

const ResponsiveViewer = ({
  parentWidth,
  parentHeight,
  mouseDown,
  mouseMove,
  mouseUp,
  mouseLeave,
  children,
}: Props) => {
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
