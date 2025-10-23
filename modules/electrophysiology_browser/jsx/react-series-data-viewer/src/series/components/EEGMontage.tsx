import * as R from 'ramda';
import {connect} from 'react-redux';
import {_3d} from 'd3-3d';
import {Group} from '@visx/group';
import ResponsiveViewer from './ResponsiveViewer';
import {CheckboxElement} from './Form';
import {CoordinateSystem, Electrode} from '../store/types';
import {setHidden} from '../store/state/montage';
import React, {useState, useEffect, SetStateAction, Dispatch} from 'react';
import Panel from './Panel';
import {RootState} from '../store';

type CProps = {
  electrodes: Electrode[],
  hidden: number[],
  coordinateSystem: CoordinateSystem,
  setHidden: (_: number[]) => void,
  chunksURL: string,
  colorMap?: {
    color: string,
    mode: 'fill' | 'outline'
    ids: Number[],
  },
  withPanel: boolean,
  contentHeight: string,
  cssClass: string,
  editChannels: boolean,
  channelDelimiter: string,
  setCancelWarning?: Dispatch<SetStateAction<boolean>>,
  setEventChannels?: Dispatch<SetStateAction<string[]>>,
  eventChannels?: string[],
  setChannelSelectorVisible?: Dispatch<SetStateAction<boolean>>,
  eegMontageName: string,
};

const EEGMontage = (
  {
    electrodes,
    hidden,
    coordinateSystem,
    setHidden,
    chunksURL,
    colorMap,
    withPanel,
    contentHeight,
    cssClass,
    editChannels,
    channelDelimiter,
    setCancelWarning,
    setEventChannels,
    eventChannels,
    setChannelSelectorVisible,
    eegMontageName,
  }: CProps) => {
  // if (electrodes.length === 0 || coordinateSystem === null) return null;

  const [angleX, setAngleX] = useState(0);
  const [angleZ, setAngleZ] = useState(0);
  const [drag, setDrag] = useState(false);
  const [mx, setMx] = useState(0);
  const [my, setMy] = useState(0);
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);
  const [view3D, setView3D] = useState(false);
  const [showChannelIndices, setShowChannelIndices] = useState(false);
  const [selectedElectrodes, setSelectedElectrodes] = useState(
    electrodes.map((e, i) => colorMap?.ids?.includes(i))
  );
  const [clicked3DElectrode, setClicked3DElectrode] = useState(-1);
  const [holdingShift, setHoldingShift] = useState(false);

  const getChannelName = (channelIndex: number) => {
    return electrodes[channelIndex].name;
  }
  const [selectedElectrodesText, setSelectedElectrodesText] = useState(
    selectedElectrodes.map((electrode, index) => {
      return electrode ? index : undefined;
    }).filter(e => e !== undefined).map(getChannelName).join(channelDelimiter)
  );

  let infoMessageTimeout = null;

  const scale = 1200;
  let scatter3D = [];
  let scatter2D = [];
  const startAngle = 0;

  let point3D = _3d()
    .x((d) => d.x)
    .y((d) => d.y)
    .z((d) => d.z)
    .rotateZ( startAngle)
    .rotateX(-startAngle)
    .scale(scale);

  const dragStart = (v: any) => {
    setDrag(true);
    setMx(v[0]);
    setMy(v[1]);
  };

  const dragged = (v: any) => {
    if (!drag) return;
    const beta = (v[0] - mx + mouseX) * -2 * Math.PI;
    const alpha = (v[1] - my + mouseY) * -2 * Math.PI;

    const angleX = Math.min(Math.PI/2, Math.max(0, alpha - startAngle));
    setAngleX(angleX);

    const angleZ = (beta + startAngle);
    setAngleZ(angleZ);
  };

  const dragEnd = (v: any) => {
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

  const get2DMultiplier = (unit: string) => {
    switch (unit) {
      case 'cm':
        return 0.07;
      case 'mm':
        return 0.007;
      case 'm':
      case 'n/a':
      default:
        return 11;
    }
  }

  const get3DMultiplier = (unit: string) => {
    switch (unit) {
      case 'cm':
        return 0.01;
      case 'mm':
        return 0.001;
      case 'm':
      case 'n/a':
      default:
        return 1;
    }
  }

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

  electrodes = electrodes.filter(e => e.position[0] && e.position[1]);

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

  const multiplier2D = get2DMultiplier(coordinateSystem?.units);
  const multiplier3D = get3DMultiplier(coordinateSystem?.units);

  electrodes.map((electrode, i) => {
    let electrodeCoords = electrode.position.slice();

    // SVG Y axis points toward bottom
    // Rotate the points to have the nose up
    // electrodeCoords[1] *= -1;

    // We want the electrodes in the RAS orientation
    // Convert from ALS if necessary
    electrodeCoords = [
      electrodeCoords[1],
      -electrodeCoords[0],
      electrodeCoords[2],
    ];

    if (ALSOrientation) {
      const [x, y] = stereographicProjection(
        electrode.position[0] * multiplier2D,
        electrode.position[1] * multiplier2D,
        electrode.position[2] * multiplier2D,
      );
      scatter2D.push({x: x * 135, y: y * 145 / 0.8});
      scatter3D.push({
        x: electrodeCoords[0] * multiplier3D,
        y: electrodeCoords[1] * multiplier3D,
        z: electrodeCoords[2] * multiplier3D,
      });
    } else {
      const [x, y] = stereographicProjection(
        electrodeCoords[0] * multiplier2D,
        -electrodeCoords[1] * multiplier2D,
        electrodeCoords[2] * multiplier2D,
      );
      scatter2D.push({x: x * 150, y: y * 150 / 0.8});
      scatter3D.push({
        x: electrode.position[0] * multiplier3D,
        y: -electrode.position[1] * multiplier3D,
        z: electrode.position[2] * multiplier3D,
      });
    }
  });

  const getChannelIndex = (channelName: string) => {
    return electrodes.findIndex((electrode) => {
      return electrode.name === channelName;
    });
  }

  const toggleElectrodeSelection = (index: number) => {
    const newElectrodeSelection = [
      ...selectedElectrodes.slice(0, index),
      !selectedElectrodes[index],
      ...selectedElectrodes.slice(index + 1)
    ];
    setSelectedElectrodes(newElectrodeSelection);
    setSelectedElectrodesText(
      newElectrodeSelection.map((electrode, index) => {
        return electrode ? index : undefined;
      }).filter(e => e !== undefined).map(getChannelName).join(channelDelimiter)
    );
  }

  const handleSelectAll = () => {
    const allElectrodes = electrodes.map((_) => true);
    setSelectedElectrodes(allElectrodes);
    setSelectedElectrodesText(
      allElectrodes.map((electrode, index) => {
        return electrode ? index : undefined;
      }).filter(e => e !== undefined).map(getChannelName).join(channelDelimiter)
    );
  }

  const handleSelectNone = () => {
    const allElectrodes = electrodes.map((_) => false);
    setSelectedElectrodes(allElectrodes);
    setSelectedElectrodesText(
      allElectrodes.map((electrode, index) => {
        return electrode ? index : undefined;
      }).filter(e => e !== undefined).map(getChannelName).join(channelDelimiter)
    );
  }

  const setInfoMessage = (message: string, success: boolean) => {
    const footerRef = document.querySelector<HTMLElement>(
      '#channel-selector-montage #info-message'
    );

    footerRef.classList.remove(success ? 'alert-danger' : 'alert-success');
    footerRef.classList.add(success ? 'alert-success' : 'alert-danger');

    clearTimeout(infoMessageTimeout);
    footerRef.style.display = 'block';
    footerRef.innerHTML = message;

    infoMessageTimeout = setTimeout(() => {
      footerRef.style.display = 'none';
      footerRef.innerHTML = '';
    }, 3000);
  }

  const handleReset = () => {
    const initialElectrodes = electrodes.map((e, i) => colorMap?.ids?.includes(i))
    setSelectedElectrodes(initialElectrodes);
    setSelectedElectrodesText(
      initialElectrodes.map((electrode, index) => {
        return electrode ? index : undefined;
      }).filter(e => e !== undefined).map(getChannelName).join(channelDelimiter)
    );
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    const validChannels = validateChannels(selectedElectrodesText, true);
    if (validChannels.success) {
      setEventChannels(
        selectedElectrodesText.length > 0
          ? selectedElectrodesText.split(channelDelimiter)
          : []
      );
      setInfoMessage(validChannels.message, validChannels.success);
    } else {
      setInfoMessage(validChannels.message, validChannels.success);
    }
  }

  const textSameAsInitial = () => {
    return JSON.stringify(eventChannels.sort().join(channelDelimiter)) ===
      JSON.stringify(selectedElectrodesText.split(channelDelimiter).sort().join(channelDelimiter));
  }

  const validateChannels = (channelString: string, validatingForSave: boolean = false) => {
    let trimmedString = channelString.trim();
    const parsedChannels = trimmedString.split(channelDelimiter).map(c => c.trim());

    const result = {
      success: true,
      message: 'Saved successfully',
    }

    if (validatingForSave) {
      if (textSameAsInitial()) {
        result.success = false;
        result.message = 'No electrode changes';
        return result;
      }
      if (
        (new Set(parsedChannels.filter(pc => pc.length > 0))).size !==
        parsedChannels.filter(pc => pc.length > 0).length
      ) {
        result.success = false;
        result.message = 'Duplicates are not allowed';
        return result;
      }
    }

    const validPattern = new RegExp(`^\\s*(\\w+)?(${channelDelimiter}\\s*\\w+)*\\s*$`); // /^\s*(\w+)?(,\s*\w+)*\s*$/;
    if (!validPattern.test(trimmedString)) {
      result.success = false;
      result.message = `Invalid string format. Expected channel names delimited by "${channelDelimiter}"`;
      return result;
    }

    if (
      !parsedChannels
        .filter((channel) => channel.length > 0)
        .every((channel) => getChannelIndex(channel) !== -1)
    ) {
      result.success = false;
      result.message = `String contains one or more unrecognized channels`;
      return result;
    }

    return result;
  }

  useEffect(() => {
    if (!setCancelWarning)
      return;
    setCancelWarning(!textSameAsInitial());
  }, [selectedElectrodesText, eventChannels])

  useEffect(() => {
    if (!editChannels) {
      return;
    }

    function handleKeyDown(e) {
      if (e.key === 'Shift' && !drag) {
        setHoldingShift(true);
      }
    }

    function handleKeyUp(e) {
      if (e.key === 'Shift' && !drag) {
        setHoldingShift(false);
      }
    }

    document.addEventListener("keydown", handleKeyDown, true);
    document.addEventListener("keyup", handleKeyUp, true);

    return () => {
      document.removeEventListener("keydown", handleKeyDown, true);
      document.removeEventListener("keyup", handleKeyUp, true);
    }
  }, []);

  const handle3DMouseDown = (electrodeIndex: number) => {
    setClicked3DElectrode(electrodeIndex);
  }

  const handle3DMouseUp = (electrodeIndex: number) => {
    if (electrodeIndex === clicked3DElectrode) {
      toggleElectrodeSelection(electrodeIndex);
    }
    setClicked3DElectrode(-1);
  }

  const Montage3D = () => (
    <Group className={cssClass + (holdingShift ? ' cursor-pointer' : '')}>
      {point3D.rotateZ(angleZ).rotateX(angleX)(scatter3D).map((point, i) => {
        const color = selectedElectrodes[i] ? colorMap?.color : '#000';
        return (
          <circle
            key={i}
            cx={point.projected.x}
            cy={point.projected.y}
            r='4'
            fill={color}
            fillOpacity={color === '#000' ? '0.3' : '1'}
            opacity='1'
            onMouseDown={() => {
              if (holdingShift) {
                handle3DMouseDown(i);
              }
            }}
            onMouseUp={() => {
              if (holdingShift) {
                handle3DMouseUp(i);
              }
            }}
          />
        );
      })}
    </Group>
  );

  const Montage2D = () => (
    <Group className={cssClass}>
      <line
        x1="25" y1="-135"
        x2="0" y2="-150"
        stroke="black"
      />
      <line
        x1="-25" y1="-135"
        x2="0" y2="-150"
        stroke="black"
      />
      <ellipse
        cx="135" cy="0"
        rx="15" ry="40"
        stroke="black"
        fillOpacity='0'
      />
      <ellipse
        cx="-135" cy="0"
        rx="15" ry="40"
        stroke="black"
        fillOpacity='0'
      />
      <circle
        r='138'
        stroke="black"
        fill='white'
      />
      {scatter2D.map((point, i) => {
        const textColor = (
          colorMap?.mode === 'outline' && selectedElectrodes[i]
        ) ? colorMap?.color : '#000';

        const fillColor = (
          colorMap?.mode === 'fill' && selectedElectrodes[i]
        ) ? colorMap?.color : 'white';

        return (
          <Group
            className={'electrode ' + (editChannels ? ' cursor-pointer' : 'cursor-default')}
            key={i}
            onClick={() => {
              toggleElectrodeSelection(i);
            }}
          >
            <circle
              transform='rotate(-90)'
              cx={point.x}
              cy={point.y}
              r='8'
              fill={fillColor}
              stroke={textColor}
            >
              <title>{showChannelIndices ? electrodes[i].name : (i + 1)}</title>
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
              fill={textColor}
            >
              {showChannelIndices ? (i + 1) : electrodes[i].name}
              <title>{showChannelIndices ? electrodes[i].name : (i + 1)}</title>
            </text>
          </Group>
        );
      })}
    </Group>
  );

  const panelContent = <div
    className="row"
    style={{
      padding: 0,
      height: contentHeight,
    }}
  >
    <div style={{height: '100%', position: 'relative'}}>
      {view3D ?
        <ResponsiveViewer
          // @ts-ignore
          mouseMove={!holdingShift ? dragged : undefined}
          mouseDown={dragStart}
          mouseUp={dragEnd}
          mouseLeave={dragEnd}
          chunksURL={chunksURL}
          cssClass={
            holdingShift
              ? 'cursor-default'
              : drag
                ? 'cursor-grabbing'
                : 'cursor-grab'
          }
        >
          <Montage3D />
        </ResponsiveViewer>
        :
        <ResponsiveViewer
          // @ts-ignore
          chunksURL={chunksURL}
          parentHeight={withPanel ? 300 : 550}
          cssClass={''}
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
          zIndex: 1,
        }}
      >
        <div>
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
      {
        editChannels && (
          <div
            style={{
              top: '0',
              left: '15px',
              width: '100%',
              position: 'absolute',
            }}
          >
            <label
              htmlFor='edit-channels'
              style={{
                position: 'relative',
                bottom: '10px',
              }}
            >
              channels
            </label>
            <textarea
              id='edit-channels'
              value={selectedElectrodesText}
              onChange={(event) => {
                setSelectedElectrodesText(event.target.value);
                // Improves responsiveness on electrode deletion
                const channelString = event.target.value.endsWith(',')
                  ? event.target.value.slice(0, -1) : event.target.value
                if (validateChannels(channelString).success) {
                  const parsedChannels = event.target.value.trim().split(channelDelimiter).map(c => c.trim());
                  const inferredIndices = parsedChannels.map(getChannelIndex);
                  setSelectedElectrodes(electrodes.map((e, i) => inferredIndices.includes(i)))
                }
              }}
              style={{
                marginLeft: '10px',
                height: '50px',
                resize: 'none',
                padding: '5px',
                width: '86%',
              }}
            />
            {
              (eegMontageName && eegMontageName.length > 0) && (
                <>
                  <label htmlFor='channel-montage-name'>
                    Montage
                  </label>
                  &nbsp;
                  <span
                    id={'channel-montage-name'}
                    className='code-mimic'
                    style={{ backgroundColor: '#eff1f2', color: '#1f2329', marginLeft: '5px', }}
                  >
                   {eegMontageName}
                  </span>
                </>
              )
            }
          </div>
        )
      }
      {
        editChannels && (
          <div
            className="btn-group"
            style={{
              bottom: '30px',
              left: '15px',
              position: 'absolute',
            }}
          >
            {
              !view3D && (
                <CheckboxElement
                  name='toggle-channel-indices'
                  offset=''
                  label={<span>Show indices</span>}
                  value={showChannelIndices}
                  onUserInput={() => {
                    setShowChannelIndices(!showChannelIndices);
                  }}
                  outerStyles={{}}
                />
              )
            }
            {
              view3D && (
                <>
                  Hold shift to enable electrode selection
                </>
              )
            }
          </div>
        )
      }
      {
        editChannels && (
          <div
            className=""
            style={{
              bottom: '0',
              left: '15px',
              position: 'absolute',
              zIndex: 1,
            }}
          >
            <div>
              <button
                className={'btn btn-xs btn-default'}
                onClick={handleSelectNone}
              >
                Select None
              </button>
              <button
                className={'btn btn-xs btn-default'}
                onClick={handleSelectAll}
              >
                Select All
              </button>
            </div>
          </div>
        )
      }
      {
        editChannels && (
          <div
            className=""
            style={{
              bottom: '0',
              right: '15px',
              position: 'absolute',
              zIndex: 1,
            }}
          >
            <div
              id="info-message"
              className="alert text-center"
              role="alert"
              style={{display: 'none'}}
            ></div>
            <button
              type="reset"
              disabled={textSameAsInitial()}
              onClick={handleReset}
              className="btn btn-primary float-right"
            >
              Reset
            </button>
            <button
              type="button"
              disabled={textSameAsInitial()}
              onClick={handleSubmit}
              className="btn btn-primary float-right"
            >
              Save
            </button>
          </div>
        )
      }
    </div>
  </div>;

  return withPanel ? (
    <div className='col-lg-4 col-md-6'>
     <Panel
      id='electrode-montage'
      title={
       <>
         Electrode Map
         {
           (eegMontageName && eegMontageName.length > 0) && (
             <>
               &nbsp;&nbsp;
               <span
                 className='code-mimic'
                 style={{ backgroundColor: '#eff1f2', color: '#1f2329', }}
               >
                 {eegMontageName}
               </span>
             </>
           )
         }
      </>
     }
    >
      {panelContent}
    </Panel>
    </div>
  ) : (
    <div>
      {panelContent}
    </div>
  );
};

EEGMontage.defaultProps = {
  montage: [],
  hidden: [],
  coordinateSystem: null,
  chunksURL: '',
  withPanel: true,
  contentHeight: '300px',
  modifiable: false,
  cssClass: '',
};

export default connect(
  (state: RootState) => ({
    hidden: state.montage.hidden,
    electrodes: state.montage.electrodes,
    coordinateSystem: state.montage.coordinateSystem,
    chunksURL: state.dataset.chunksURL,
    channelDelimiter: state.dataset.channelDelimiter,
    eegMontageName: state.dataset.eegMontageName,
  }),
  (dispatch: (_: any) => void) => ({
    setHidden: R.compose(
      dispatch,
      setHidden,
    ),
  })
)(EEGMontage);
