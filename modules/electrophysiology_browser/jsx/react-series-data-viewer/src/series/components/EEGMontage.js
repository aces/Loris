// @flow

import * as R from 'ramda';
import {connect} from 'react-redux';
import {_3d} from 'd3-3d';
import {Group} from '@visx/group';
import ResponsiveViewer from './ResponsiveViewer';
import type {Electrode} from '../../series/store/types';
import {setHidden} from '../../series/store/state/montage';
import React, {useState} from 'react';
import Panel from 'jsx/Panel';

type Props = {
  electrodes: Electrode[],
  hidden: number[],
  drag: bool,
  mx: number,
  my: number,
  mouseX: number,
  mouseY: number,
  setHidden: (number[]) => void,
};

const EEGMontage = (
  {
    electrodes,
    hidden,
    setHidden,
  }: Props) => {
  if (electrodes.length === 0) return null;

  const [angleX, setAngleX] = useState(0);
  const [angleZ, setAngleZ] = useState(0);
  const [drag, setDrag] = useState(false);
  const [mx, setMx] = useState(0);
  const [my, setMy] = useState(0);
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);
  const [view3D, setView3D] = useState(false);
  const [selectedElectrode, setSelectedElectrode] = useState(null);

  const scale = 1200;
  let scatter3D = [];
  let scatter2D = [];
  const startAngle = 0;
  const color = '#000000';

  let point3D = _3d()
    .x((d) => d.x)
    .y((d) => d.y)
    .z((d) => d.z)
    .rotateZ( startAngle)
    .rotateX(-startAngle)
    .scale(scale);

  const dragStart = (v) => {
    setDrag(true);
    setMx(v[0]);
    setMy(v[1]);
  };

  const dragged = (v) => {
    if (!drag) return;
    const beta = (v[0] - mx + mouseX) * -2 * Math.PI;
    const alpha = (v[1] - my + mouseY) * -2 * Math.PI;

    const angleX = Math.min(Math.PI/2, Math.max(0, alpha - startAngle));
    setAngleX(angleX);

    const angleZ = (beta + startAngle);
    setAngleZ(angleZ);
  };

  const dragEnd = (v) => {
    setDrag( false);
    setMouseX( v[0] - mx + mouseX);
    setMouseY(v[1] - my + mouseY);
  };

  /**
   * Compute the stereographic projection.
   *
   * Given a unit sphere with radius r = 1 and center at The origin.
   * Project the point p = (x, y, z) from the sphere's South pole (0, 0, -1)
   * on a plane on the sphere's North pole (0, 0, 1).
   *
   * P' = P * (2r / (r + z))
   *
   * @param {number} x - x coordinate of electrodes on a unit sphere scale
   * @param {number} y - x coordinate of electrodes on a unit sphere scale
   * @param {number} z - x coordinate of electrodes on a unit sphere scale
   * @param {number} scale - Scale to change the projection point.Defaults to 1, which is on the sphere
   *
   * @return {number[]} : x, y positions of electrodes as projected onto a unit circle.
   */
  const stereographicProjection = (x, y, z, scale=1.0) => {
    const mu = 1.0 / (scale + z);
    return [x * mu, y * mu];
  };

  electrodes.map((electrode, i) => {
    scatter3D.push({
      x: electrode.position[0],
      y: electrode.position[1],
      z: electrode.position[2],
    });
    const [x, y] = stereographicProjection(
      electrode.position[0] * 10,
      electrode.position[1] * 10,
      electrode.position[2] * 10
    );
    scatter2D.push({x: x * 150, y: y * 150 / 0.8});
  });

  const Montage3D = () => (
    <Group>
      {point3D.rotateZ(angleZ).rotateX(angleX)(scatter3D).map((point, i) => {
        return (
          <circle
            key={i}
            cx={point.projected.x}
            cy={point.projected.y}
            r='4'
            fill={color}
            fillOpacity='0.3'
            opacity='1'
          />
        );
      })}
    </Group>
  );

  const Montage2D = () => (
    <Group>
      <line
        x1="25" y1="-135"
        x2="0" y2="-155"
        stroke="black"
      />
      <line
        x1="-25" y1="-135"
        x2="0" y2="-155"
        stroke="black"
      />
      <ellipse
        cx="140" cy="0"
        rx="15" ry="40"
        stroke="black"
        fillOpacity='0'
      />
      <ellipse
        cx="-140" cy="0"
        rx="15" ry="40"
        stroke="black"
        fillOpacity='0'
      />
      <circle
        r='140'
        stroke="black"
        fill='white'
      />
      {scatter2D.map((point, i) =>
        <Group
          className={(selectedElectrode == i ? 'hover ' : '') + 'electrode'}
          key={i}
        >
          <circle
            transform='rotate(-90)'
            cx={point.x}
            cy={point.y}
            r='8'
            fill='white'
            stroke={color}
          >
            <title>{electrodes[i].name}</title>
          </circle>
          <text
            transform={
              'rotate(-90) rotate(90, '
              + point.x
              + ', '
              + point.y
              + ')'
            }
            x={point.x}
            y={point.y}
            dominantBaseline="central"
            textAnchor="middle"
            fontSize="8px"
          >
            {i + 1}
            <title>{electrodes[i].name}</title>
          </text>
        </Group>
        )}
    </Group>
  );

  return (
    <div className='col-sm-5'>
      <Panel
        id='electrode-montage'
        title={'Electrode Map'}
      >
        <div
          className="row"
          style={{
            padding: 0,
            height: '300px',
          }}
        >
          <div
            className={'col-xs-4'}
            style={{height: '100%'}}
          >
            <div
              className="list-group"
              style={{
                maxHeight: '100%',
                overflowY: 'scroll',
                marginBottom: 0,
              }}
            >
              {electrodes.map((electrode, i) => {
                return (
                  <div
                    key={i}
                    data-key={i}
                    className='list-group-item list-group-item-action'
                    style={{
                      position: 'relative',
                    }}
                    onMouseEnter={(e) => setSelectedElectrode(
                      e.currentTarget.getAttribute('data-key')
                    )}
                    onMouseLeave={(e) => setSelectedElectrode(null)}
                  >
                    <small>{i+1}. </small>
                    <strong
                      style={{color: 'rgb(7, 71, 133)'}}
                    >{electrode.name}</strong>
                  </div>
                );
              })}
            </div>
          </div>
          <div className={'col-xs-8'} style={{height: '100%'}}>
            {view3D ?
              <div className={'col-xs-12'} style={{height: '100%'}}>
                <ResponsiveViewer
                  mouseMove={dragged}
                  mouseDown={dragStart}
                  mouseUp={dragEnd}
                  mouseLeave={dragEnd}
                >
                  <Montage3D />
                </ResponsiveViewer>
              </div>
            :
              <div className={'col-xs-12'} style={{height: '100%'}}>
                <ResponsiveViewer>
                  <Montage2D />
                </ResponsiveViewer>
              </div>
            }
            <div
              className="btn-group"
              style={{
                top: '15px',
                left: 0,
                position: 'absolute',
              }}
            >
              <button
                className={
                  'btn btn-xs btn-default' + (!view3D ? ' active' : '')
                }
                onClick={() =>setView3D(false)}
              >2D</button>
              <button
                className={'btn btn-xs btn-default' + (view3D ? ' active' : '')}
                onClick={() => setView3D(true)}
              >3D</button>
            </div>
          </div>
        </div>
      </Panel>
    </div>
  );
};

EEGMontage.defaultProps = {
  montage: [],
  hidden: [],
};

export default connect(
  (state) => ({
    hidden: state.montage.hidden,
    electrodes: state.montage.electrodes,
  }),
  (dispatch: any => void) => ({
    setHidden: R.compose(
      dispatch,
      setHidden,
    ),
  })
)(EEGMontage);
