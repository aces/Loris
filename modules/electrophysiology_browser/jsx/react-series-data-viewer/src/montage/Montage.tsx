import React, {
  useState, useEffect, SetStateAction, Dispatch, useContext, useCallback,
  useMemo,
} from 'react';
import {connect} from 'react-redux';
import {Group} from '@visx/group';
import ResponsiveViewer from '../series/components/ResponsiveViewer';
import Panel from '../series/components/Panel';
import SensorCategoriesSelector, {
  createSensorCategoryMap,
  SensorCategoryMap,
} from './SensorCategoriesSelector';
import {RootState} from '../series/store';
import {useTranslation} from 'react-i18next';
import {
  ChannelInfosContext,
  ChannelMetasContext,
  CoordSystemContext, SensorsContext,
} from '../eeglab/EEGLabSeriesProvider';
import {Sensor} from '../series/store/types';
import Montage3D from './Montage3D';
import ChannelsEditor from './ChannelsEditor';
import {
  checkSensorPosition,
  getSensorCategory,
  getSensorCategoryKey,
} from './utils';

export type ColorMap = {
  color: string,
  mode: 'fill' | 'outline'
  ids: number[],
}

type CProps = {
  colorMap?: ColorMap,
  withPanel: boolean,
  contentHeight: string,
  cssClass: string,
  editChannels: boolean,
  channelDelimiter: string,
  setCancelWarning?: Dispatch<SetStateAction<boolean>>,
  setEventChannels?: Dispatch<SetStateAction<string[]>>,
  eventChannels?: string[],
  montageName: string,
  timeInterval: [number, number],
};

/**
 * The sensors montage.
 */
function Montage({
  colorMap,
  withPanel = true,
  contentHeight = '300px',
  cssClass = '',
  editChannels,
  channelDelimiter,
  setCancelWarning,
  setEventChannels,
  eventChannels,
  montageName,
  timeInterval,
}: CProps) {
  const coordinateSystem = useContext(CoordSystemContext);
  let sensors = useContext(SensorsContext);

  // Remove sensors that do not have a position and therefore cannot be
  // displayed in the montage.
  sensors = useMemo(() => sensors.filter(checkSensorPosition), [sensors]);

  // if (sensors.length === 0 || coordinateSystem === null) return null;
  const {t} = useTranslation();
  const [view3D, setView3D] = useState(false);
  const [showChannelIndices, setShowChannelIndices] = useState(false);
  const [selectedSensors, setSelectedSensors] = useState(
    sensors.map((e, i) => colorMap?.ids?.includes(i))
  );

  /**
   * Get a channel name from its ID.
   */
  const getChannelName = (channelIndex: number) => {
    return sensors[channelIndex].name;
  };

  const [selectedSensorsText, setSelectedSensorsText] = useState(
    selectedSensors.map((sensor, index) => {
      return sensor ? index : undefined;
    }).filter((e) => e !== undefined)
      .map(getChannelName)
      .join(channelDelimiter)
  );

  const rawChannels = useContext(ChannelMetasContext);
  const bidsChannels = useContext(ChannelInfosContext);

  const [sensorCategories, setSensorCategories] = useState<SensorCategoryMap>(
    {}
  );

  const isSensorVisible = useCallback((sensor: Sensor) => {
    const sensorCategory = getSensorCategory(
      sensor,
      rawChannels,
      bidsChannels,
    );

    const sensorCategoryKey = getSensorCategoryKey(sensorCategory);

    return sensorCategories[sensorCategoryKey]?.visible ?? true;
  }, [rawChannels, bidsChannels, sensorCategories]);

  useEffect(() => {
    setSensorCategories(
      createSensorCategoryMap(sensors, rawChannels, bidsChannels)
    );
  }, [sensors]);

  const scatter2D = [];

  /**
   * Compute the stereographic projection.
   *
   * Given a unit sphere with radius r = 1 and center at The origin.
   * Project the point p = (x, y, z) from the sphere's South pole (0, 0, -1)
   * on a plane on the sphere's North pole (0, 0, 1).
   *
   * P' = P * (2r / (r + z))
   *
   * @param {number} x - x coordinate of sensors on a unit sphere scale
   * @param {number} y - x coordinate of sensors on a unit sphere scale
   * @param {number} z - x coordinate of sensors on a unit sphere scale
   * @param {number} scale - Scale to change the projection point.Defaults to
   *                         1, which is on the sphere
   *
   * @return {number[]} : x, y positions of sensors as projected onto a unit circle.
   */
  const stereographicProjection = (x, y, z, scale=1.0) => {
    const mu = 1.0 / (scale + z);
    return [x * mu, y * mu];
  };

  /**
   * Get the 2D unit multiplier.
   */
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
  };

  /**
   * Computes an axis aligned bounding box for a set of points
   *
   * @param {number[][]} points - an array of nD points
   * @return {[number, number]} : a pair of lower and upper bounds
   */
  const boundingBox = (points) => {
    if (points.length === 0) {
      return [];
    }

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

  sensors = sensors.filter((s) => s.position[0] && s.position[1]);

  let ALSOrientation = false;

  // Find the enclosing rectangle
  const bb = boundingBox(
    sensors.map((sensor) => sensor.position.slice(0, 2))
  );

  if (bb.length > 0) {
    // Determine if the points are in an ALS or RAS coordinate system
    const bbw = Math.abs(bb[0][0]) + Math.abs(bb[1][0]);
    const bbh = Math.abs(bb[0][1]) + Math.abs(bb[1][1]);
    if (bbw > bbh) {
      ALSOrientation = true;
    }

    // Scale the sphere used for projection
    // with the radius of the enclosing sphere
  }

  const multiplier2D = get2DMultiplier(coordinateSystem?.units);

  sensors.map((sensor, i) => {
    let sensorCoords = sensor.position.slice();

    // SVG Y axis points toward bottom
    // Rotate the points to have the nose up
    // sensorsCoords[1] *= -1;

    // We want the sensors in the RAS orientation
    // Convert from ALS if necessary
    sensorCoords = [
      sensorCoords[1],
      -sensorCoords[0],
      sensorCoords[2],
    ];

    if (ALSOrientation) {
      const [x, y] = stereographicProjection(
        sensor.position[0] * multiplier2D,
        sensor.position[1] * multiplier2D,
        sensor.position[2] * multiplier2D,
      );
      scatter2D.push({x: x * 135, y: y * 145 / 0.8});
    } else {
      const [x, y] = stereographicProjection(
        sensorCoords[0] * multiplier2D,
        -sensorCoords[1] * multiplier2D,
        sensorCoords[2] * multiplier2D,
      );
      scatter2D.push({x: x * 150, y: y * 150 / 0.8});
    }
  });

  /**
   * Toggle sensor selection.
   */
  const toggleSensorSelection = (index: number) => {
    const newSensorSelection = [
      ...selectedSensors.slice(0, index),
      !selectedSensors[index],
      ...selectedSensors.slice(index + 1),
    ];
    setSelectedSensors(newSensorSelection);
    setSelectedSensorsText(
      newSensorSelection.map((sensor, index) => {
        return sensor ? index : undefined;
      }).filter((s) => s !== undefined)
        .map(getChannelName)
        .join(channelDelimiter)
    );
  };

  /**
   * The 2D sensors montage.
   */
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
        if (!isSensorVisible(sensors[i])) {
          return null;
        }

        const textColor = (
          colorMap?.mode === 'outline' && selectedSensors[i]
        ) ? colorMap?.color : '#000';

        const fillColor = (
          colorMap?.mode === 'fill' && selectedSensors[i]
        ) ? colorMap?.color : 'white';

        return (
          <Group
            className={'electrode ' + (
              editChannels ? ' cursor-pointer' : 'cursor-default'
            )}
            key={i}
            onClick={() => {
              toggleSensorSelection(i);
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
              <title>{showChannelIndices ? sensors[i].name : (i + 1)}</title>
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
              {showChannelIndices ? (i + 1) : sensors[i].name}
              <title>{showChannelIndices ? sensors[i].name : (i + 1)}</title>
            </text>
          </Group>
        );
      })}
    </Group>
  );

  const visibleSensors = sensors.filter(isSensorVisible);

  const panelContent = <div
    className="row"
    style={{
      padding: 0,
      height: contentHeight,
    }}
  >
    <div style={{height: '100%', position: 'relative'}}>
      {view3D ?
        <Montage3D
          visibleSensors={visibleSensors}
          allSensors={sensors}
          handleSensorClick={(sensor) => toggleSensorSelection(
            sensors.findIndex(
              (allSensor) => sensor.channelIndex === allSensor.channelIndex
            )
          )}
        />
        :
        <ResponsiveViewer
          // @ts-ignore
          parentHeight={withPanel ? 300 : 550}
          cssClass={''}
          domain={timeInterval}
        >
          <Montage2D />
        </ResponsiveViewer>
      }
      <div
        style={{
          top: 0,
          position: 'absolute',
          zIndex: 1,
          padding: '0 1rem',
          width: '100%',
        }}
      >
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          gap: '1rem',
        }}>
          <div>
            <button
              className={'btn btn-xs btn-default' + (!view3D ? ' active' : '')}
              onClick={() => setView3D(false)}
            >2D</button>
            <button
              className={'btn btn-xs btn-default' + (view3D ? ' active' : '')}
              onClick={() => setView3D(true)}
            >3D</button>
          </div>
          <SensorCategoriesSelector
            categories={sensorCategories}
            setCategories={setSensorCategories}
          />
        </div>
      </div>
      {editChannels && (
        <ChannelsEditor
          sensors={sensors}
          montageName={montageName}
          view3D={view3D}
          colorMap={colorMap}
          channelDelimiter={channelDelimiter}
          eventChannels={eventChannels as string[]}
          setEventChannels={(
            setEventChannels as Dispatch<SetStateAction<string[]>>
          )}
          selectedSensors={selectedSensors}
          setSelectedSensors={setSelectedSensors}
          selectedSensorsText={selectedSensorsText}
          setSelectedSensorsText={setSelectedSensorsText}
          showChannelIndices={showChannelIndices}
          setShowChannelIndices={setShowChannelIndices}
          setCancelWarning={setCancelWarning}
        />
      )}
    </div>
  </div>;

  return withPanel ? (
    <div className='col-lg-4 col-md-6'>
      <Panel
        id='sensor-montage'
        title={
          <>
            {t(
              'Sensor Map', {
                ns: 'electrophysiology_browser',
              }
            )}
            {
              montageName && (
                <>
                  &nbsp;&nbsp;
                  <span
                    className='code-mimic'
                    style={{backgroundColor: '#eff1f2', color: '#1f2329'}}
                  >
                    {montageName}
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
}

export default connect(
  (state: RootState) => ({
    channelDelimiter: state.dataset.channelDelimiter,
    montageName: state.dataset.eegMontageName,
    timeInterval: state.dataset.timeInterval,
  }),
)(Montage);
