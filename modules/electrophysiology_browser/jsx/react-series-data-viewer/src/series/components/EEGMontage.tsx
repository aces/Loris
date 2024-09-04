import * as R from 'ramda';
import {connect} from 'react-redux';
import {_3d} from 'd3-3d';
import {Group} from '@visx/group';
import ResponsiveViewer from './ResponsiveViewer';
import {Electrode} from '../../series/store/types';
import {setHidden} from '../../series/store/state/montage';
import React, {useState} from 'react';
import Panel from 'Panel';
import {RootState} from '../store';

type CProps = {
  electrodes: Electrode[],
  hidden: number[],
  drag: boolean,
  mx: number,
  my: number,
  mouseX: number,
  mouseY: number,
  setHidden: (_: number[]) => void,
  physioFileID: number,
  chunksURL: string,
  colorMap?: {
    color: string,
    ids: Number[]
  },
};

/**
 *
 * @param root0
 * @param root0.electrodes
 * @param root0.physioFileID
 */
const EEGMontage = (
  {
    electrodes,
    physioFileID,
    chunksURL,
    colorMap,
  }: CProps) => {
  if (electrodes.length === 0) return null;

  const [angleX, setAngleX] = useState(0);
  const [angleZ, setAngleZ] = useState(0);
  const [drag, setDrag] = useState(false);
  const [mx, setMx] = useState(0);
  const [my, setMy] = useState(0);
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);
  const [view3D, setView3D] = useState(false);

  const scatter3D = [];
  const scatter2D = [];
  const startAngle = 0;
      
  const point3D = _3d()
    .x((d) => d.x)
    .y((d) => d.y)
    .z((d) => d.z)
    .rotateZ( startAngle)
    .rotateX(-startAngle);

  /**
   *
   * @param v
   */
  const dragStart = (v: any) => {
    setDrag(true);
    setMx(v[0]);
    setMy(v[1]);
  };

  /**
   *
   * @param v
   */
  const dragged = (v: any) => {
    if (!drag) return;
    const beta = (v[0] - mx + mouseX) * -2 * Math.PI;
    const alpha = (v[1] - my + mouseY) * -2 * Math.PI;

    const angleX = Math.min(Math.PI/2, Math.max(0, alpha - startAngle));
    setAngleX(angleX);

    const angleZ = (beta + startAngle);
    setAngleZ(angleZ);
  };

  /**
   *
   * @param v
   */
  const dragEnd = (v: any) => {
    setDrag(false);
    setMouseX(v[0] - mx + mouseX);
    setMouseY(v[1] - my + mouseY);
  };

  /**
   * Compute the stereographic projection.
   *
   * Given a unit sphere with radius r = 1 and center at the origin.
   * Project the point p = (x, y, z) from the sphere's South pole (0, 0, -1)
   * on a plane on the sphere's North pole (0, 0, 1).
   *
   * P' = P * (2r / (r + z))
   *
   * @param {number} x - x coordinate of electrodes on a unit sphere scale
   * @param {number} y - y coordinate of electrodes on a unit sphere scale
   * @param {number} z - z coordinate of electrodes on a unit sphere scale
   * @param {number} scale - Scale to change the projection point.
   *                         Defaults to 1, which is on the sphere
   * @return {number[]} : x, y positions of electrodes
   *                      as projected onto a unit circle.
   */
  const stereographicProjection = (x, y, z, scale=1.0) => {
    const mu = (2 * scale) / (scale + z);
    return [x * mu, y * mu];
  };

  /**
   * Computes an axis aligned bounding box for a set of points
   *
   * @param {number[][]} points - an array of nD points
   * @return {[number, number]} : a pair of lower and upper bounds
   */
  const boundingBox = (points) => {
    if (points.length === 0) return [];
    const dim = points[0].length;

    return points.reduce(
      (boundingBox, point) => {
        for (let j=0; j < dim; ++j) {
          boundingBox[0][j] = Math.min(boundingBox[0][j], point[j]);
          boundingBox[1][j] = Math.max(boundingBox[1][j], point[j]);
        }
        return boundingBox;
      },
      [points[0].slice(), points[0].slice()]
    );
  };

  // Remove points with no data
  electrodes = electrodes.filter(e => e.position[0] && e.position[1]);

  // Determine if the points are in an ALS or RAS coordinate system
  // and the head ratio
  let ALSOrientation = false;
  let headRatio = 1;
  let montageRadius = 100;

  // === This value may need to be adjusted
  //     if not automatically computed (see below)
  let headRadius = 1;
  // ===

  // Find the enclosing rectangle
  const bb = boundingBox(
    electrodes.map(
      (electrode) => electrode.position.slice(0, 2)
    )
  );

  if (bb.length > 0) {
    // Determine if the points are in an ALS or RAS coordinate system
    const bbw = Math.abs(bb[0][0]) + Math.abs(bb[1][0]);
    const bbh = Math.abs(bb[0][1]) + Math.abs(bb[1][1]);
    if (bbw > bbh) ALSOrientation = true;

    // Scale the sphere used for projection
    // with the radius of the enclosing sphere
    headRadius = Math.max(bbw, bbh)/2;
    headRatio = Math.max(bbw, bbh) / Math.min(bbw, bbh);
  }

  const scale3D = montageRadius / headRadius;
  const scale2D = montageRadius / stereographicProjection(headRadius, 0, 0, headRadius)[0];

  electrodes.map((electrode, i) => {
    let electrodeCoords = electrode.position.slice();

    // SVG Y axis points toward bottom
    // Rotate the points to have the nose up
    electrodeCoords[1] *= -1;

    // We want the electrodes in the RAS orientation
    // Convert from ALS if necessary
    if (ALSOrientation) {
      electrodeCoords = [
        electrodeCoords[1],
        -electrodeCoords[0],
        electrodeCoords[2],
      ];
    }

    scatter3D.push({
      x: electrodeCoords[0] * scale3D,
      y: electrodeCoords[1] * scale3D,
      z: electrodeCoords[2] * scale3D,
    });

    const [x, y] = stereographicProjection(
      electrodeCoords[0] * headRatio,
      electrodeCoords[1],
      electrodeCoords[2],
      headRadius
    );
    scatter2D.push({x: x * scale2D, y: y * scale2D});
  });

  /**
   *
   */
  const Montage3D = () => (
    <Group>
      {point3D.rotateZ(angleZ).rotateX(angleX)(scatter3D).map((point, i) => {
        const color = colorMap?.ids?.includes(i) ? colorMap?.color : '#000';
        return (
          <circle
            key={i}
            cx={point.projected.x}
            cy={point.projected.y}
            r='4'
            fill={color}
            fillOpacity='0.3'
            opacity='1'
          >
            <title>{electrodes[i].name}</title>
          </circle>
        );
      })}
    </Group>
  );

  /**
   *
   */
  const Montage2D = () => (
    <Group>
      <line
        x1="20" y1={-montageRadius+5}
        x2="0" y2={-montageRadius-10}
        stroke="black"
      />
      <line
        x1="-20" y1={-montageRadius+5}
        x2="0" y2={-montageRadius-10}
        stroke="black"
      />
      <ellipse
        cx={montageRadius} cy="0"
        rx="10" ry={montageRadius*0.3}
        stroke="black"
        fillOpacity='0'
      />
      <ellipse
        cx={-montageRadius} cy="0"
        rx="10" ry={montageRadius*0.3}
        stroke="black"
        fillOpacity='0'
      />
      <circle
        r={montageRadius}
        stroke="black"
        fill='white'
      />
      <Group>
        {scatter2D.map((point, i) => {
          const color = colorMap?.ids?.includes(i) ? colorMap?.color : '#000';
          return (
            <Group
              className='electrode'
              key={i}
            >
              <circle
                cx={point.x}
                cy={point.y}
                r='8'
                fill='white'
                stroke={color}
              >
                <title>{electrodes[i].name}</title>
              </circle>
              <text
                x={point.x}
                y={point.y}
                dominantBaseline="central"
                textAnchor="middle"
                fontSize="8px"
                fill={color}
              >
                {i + 1}
                <title>{electrodes[i].name}</title>
              </text>
            </Group>
          );
        })}
      </Group>
    </Group>
  );

  return (
    <div className='col-lg-4 col-md-6'>
      <Panel
        id={'electrode-montage-' + physioFileID}
        title={'Electrode Map'}
      >
        <div
          className="row"
          style={{
            padding: 0,
            height: '300px',
          }}
        >
          <div style={{height: '100%', position: 'relative'}}>
            {view3D ?
              <ResponsiveViewer
                mouseMove={dragged}
                mouseDown={dragStart}
                mouseUp={dragEnd}
                mouseLeave={dragEnd}
                chunksURL={chunksURL}
              >
                <Montage3D />
              </ResponsiveViewer>
            :
              <ResponsiveViewer
                chunksURL={chunksURL}
              >
                <Montage2D />
              </ResponsiveViewer>
            }
            <div
              className="btn-group"
              style={{
                top: '0',
                left: '15px',
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
  chunksURL: '',
};

export default connect(
  (state: RootState) => ({
    hidden: state.montage.hidden,
    electrodes: state.montage.electrodes,
    physioFileID: state.dataset.physioFileID,
    chunksURL: state.dataset.chunksURL,
  }),
  (dispatch: (_: any) => void) => ({
    setHidden: R.compose(
      dispatch,
      setHidden,
    ),
  })
)(EEGMontage);
