// @flow

import * as R from 'ramda';
import {vec2} from 'gl-matrix';
import {Group} from '@visx/group';
import {connect} from 'react-redux';
import {scaleLinear} from 'd3-scale';
import {
  startDragInterval,
  continueDragInterval,
  endDragInterval,
} from '../store/logic/dragBounds';
import ResponsiveViewer from './ResponsiveViewer';
import Axis from './Axis';
import React, {useCallback, useEffect, useState} from 'react';
import {setInterval} from '../store/state/bounds';
import {updateFilteredEpochs} from '../store/logic/filterEpochs';

type Props = {
  viewerHeight: number,
  seriesViewerWidth: number,
  domain: [number, number],
  interval: [number, number],
  setInterval: [number, number] => void,
  dragStart: number => void,
  dragContinue: number => void,
  dragEnd: number => void,
  updateFilteredEpochs: void => void,
};

const IntervalSelect = ({
  viewerHeight,
  seriesViewerWidth,
  domain,
  interval,
  setInterval,
  dragStart,
  dragContinue,
  dragEnd,
  updateFilteredEpochs,
}: Props) => {
  const [refNode, setRefNode] = useState<?HTMLDivElement>(null);
  const [bounds, setBounds] = useState<?ClientRect>(null);

  useEffect(() => {
    if (refNode) {
      setBounds(refNode.getBoundingClientRect());
    }
  }, [seriesViewerWidth]);

  const getNode = useCallback((domNode) => {
    if (domNode) {
      setRefNode(domNode);
    }
  }, []);

  const topLeft = vec2.fromValues(
    -seriesViewerWidth/2,
    viewerHeight/2
  );
  const bottomRight = vec2.fromValues(
    seriesViewerWidth/2,
    -viewerHeight/2
  );

  const scale = scaleLinear()
    .domain(domain)
    .range([-seriesViewerWidth/2, seriesViewerWidth/2]);

  const ySlice = (x) => ({
    p0: vec2.fromValues(x, topLeft[1]),
    p1: vec2.fromValues(x, bottomRight[1]),
  });

  const start = ySlice(scale(interval[0])).p1[0];
  const end = ySlice(scale(interval[1])).p0[0];
  const width = Math.abs(end - start);
  const center = (start + end) / 2;

  const BackShadowLayer = ({interval}) => (
    <rect
      fill='#ECF1F6'
      stroke='#E4EBF2'
      width={width}
      height={'100%'}
      x={center - width/2}
      y={-viewerHeight/2}
    />
  );

  const AxisLayer = ({viewerWidth, viewerHeight, domain}) => (
    <Group top={viewerHeight/2} left={-viewerWidth/2}>
      <Axis domain={domain} range={[0, viewerWidth]} orientation='top' />
    </Group>
  );

  const onMouseMove = (v : MouseEvent) => {
    if (bounds === null || bounds === undefined) return;
    const x = Math.min(1, Math.max(0, (v.pageX - bounds.left)/bounds.width));
    dragContinue(x);
  };

  const onMouseUp = (v : MouseEvent) => {
    if (bounds === null || bounds === undefined) return;
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
    const x = Math.min(100, Math.max(0, (v.pageX - bounds.left)/bounds.width));

    dragEnd(x);
    updateFilteredEpochs();
  };

  return (
    <div className='row'>
      <h5
        className='col-xs-offset-1 col-xs-11'
        style={{
          color: '#064785',
          fontWeight: 'bold',
          paddingLeft: '15px',
          marginBottom: '10px',
        }}
      >
        Timeline Range View
        <input
            type='button'
            className='btn btn-primary btn-xs'
            onClick={() => {
              setInterval([domain[0], domain[1]]);
              updateFilteredEpochs();
            }}
            value='Reset'
            style={{marginLeft: '15px'}}
          />
      </h5>
      <div
        className='col-xs-offset-1 col-xs-11'
        style={{height: viewerHeight}}
        ref={getNode}
      >
        <ResponsiveViewer
          mouseDown={(v) => {
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
            R.compose(dragStart, R.nth(0))(v);
          }}
        >
          <BackShadowLayer interval={interval} />
          <AxisLayer
            viewerWidth={0}
            viewerHeight={0}
            domain={domain}
          />
        </ResponsiveViewer>
      </div>
    </div>
  );
};

IntervalSelect.defaultProps = {
  viewerHeight: 50,
  seriesViewerWidth: 400,
  domain: [0, 1],
  interval: [0.25, 0.75],
};

export default connect(
  (state) => ({
    domain: state.bounds.domain,
    interval: state.bounds.interval,
    seriesViewerWidth: state.bounds.viewerWidth,
  }),
  (dispatch: any => void) => ({
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
    updateFilteredEpochs: R.compose(
      dispatch,
      updateFilteredEpochs
    ),
    setInterval: R.compose(
      dispatch,
      setInterval
    ),
  })
)(IntervalSelect);
