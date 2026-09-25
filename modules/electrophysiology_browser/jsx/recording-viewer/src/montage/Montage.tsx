import React, {
  useState, useContext, useCallback, useMemo,
} from 'react';
import {ParentSize} from '@visx/responsive';
import SensorCategoriesSelector, {
  createSensorCategoryMap,
} from './SensorCategoriesSelector';
import {
  ChannelInfosContext,
  ChannelMetadataContext,
  CoordinateSystemContext, SensorsContext,
} from '../recording/RecordingDataProvider';
import {Sensor} from '../domain/types';
import Montage3D from './Montage3D';
import Montage2D, {ColorMap} from './Montage2D';
import {
  checkSensorPosition,
  getSensorCategory,
  getSensorCategoryKey,
} from './utils';

export type {ColorMap} from './Montage2D';

const MONTAGE_2D_TOP_EXTENT = 48;

type MontageProps = {
  colorMap?: ColorMap,
  contentHeight?: string,
  cssClass?: string,
  selectedSensors?: boolean[],
  onSensorClick?: (index: number) => void,
  isSensorSelectable?: (sensor: Sensor) => boolean,
  hoveredChannelIndices?: number[],
  showChannelIndices?: boolean,
  view3D?: boolean,
  onView3DChange?: (view3D: boolean) => void,
};

/**
 * The sensors montage.
 */
function Montage({
  colorMap,
  contentHeight = '300px',
  cssClass = '',
  selectedSensors,
  onSensorClick,
  isSensorSelectable = () => true,
  hoveredChannelIndices = [],
  showChannelIndices = false,
  view3D: controlledView3D,
  onView3DChange,
}: MontageProps) {
  const coordinateSystem = useContext(CoordinateSystemContext);
  let sensors = useContext(SensorsContext);

  // Remove sensors that do not have a position and therefore cannot be
  // displayed in the montage.
  sensors = useMemo(() => sensors.filter(checkSensorPosition), [sensors]);

  // if (sensors.length === 0 || coordinateSystem === null) return null;
  const [localView3D, setLocalView3D] = useState(false);
  const view3D = controlledView3D ?? localView3D;
  const setView3D = onView3DChange ?? setLocalView3D;
  const highlightedSensors = selectedSensors ?? sensors.map(
    (_, index) => Boolean(colorMap?.ids?.includes(index))
  );

  const rawChannels = useContext(ChannelMetadataContext);
  const bidsChannels = useContext(ChannelInfosContext);

  // Store the hidden categories rather than the category map itself, as the
  // categories depend on the channels, which may load after the sensors.
  const [hiddenSensorCategories, setHiddenSensorCategories] = useState<
    Set<string>
  >(new Set());

  const sensorCategories = useMemo(
    () => createSensorCategoryMap(sensors, rawChannels, bidsChannels),
    [sensors, rawChannels, bidsChannels],
  );

  const isSensorVisible = useCallback((sensor: Sensor) => {
    const sensorCategory = getSensorCategory(
      sensor,
      rawChannels,
      bidsChannels,
    );

    const sensorCategoryKey = getSensorCategoryKey(sensorCategory);

    return !hiddenSensorCategories.has(sensorCategoryKey);
  }, [rawChannels, bidsChannels, hiddenSensorCategories]);

  const scatter2D: {x: number, y: number}[] = [];

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
  const stereographicProjection = (
    x: number, y: number, z: number, scale = 1.0
  ) => {
    const mu = 1.0 / (scale + z);
    return [x * mu, y * mu];
  };

  /**
   * Get the 2D unit multiplier.
   */
  const get2DMultiplier = (unit: string | undefined) => {
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
  const boundingBox = (points: number[][]): number[][] => {
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

  sensors.map((sensor) => {
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

  const visibleSensors = sensors.filter(isSensorVisible);
  /** Find a sensor's index in the displayed montage. */
  const getSensorIndex = (sensor: Sensor) => sensors.findIndex(
    (candidate) => sensor.channelIndex !== undefined
      ? candidate.channelIndex === sensor.channelIndex
      : candidate.type === sensor.type && candidate.name === sensor.name
  );

  return <div
    style={{
      padding: 0,
      height: contentHeight,
    }}
  >
    <div className='montage-viewport'>
      <div className='montage-controls'>
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
          hiddenCategories={hiddenSensorCategories}
          setHiddenCategories={setHiddenSensorCategories}
        />
      </div>
      <div className='montage-canvas'>
        {view3D ?
          <Montage3D
            visibleSensors={visibleSensors}
            allSensors={sensors}
            handleSensorClick={(sensor) => onSensorClick?.(
              getSensorIndex(sensor)
            )}
            isSensorSelectable={isSensorSelectable}
            isSensorSelected={(sensor) => (
              highlightedSensors[getSensorIndex(sensor)] ?? false
            )}
            hoveredChannelIndices={hoveredChannelIndices}
          />
          :
          <ParentSize>
            {({width, height}) => (
              <svg
                viewBox={`${-width / 2} ${
                  -height / 2 - MONTAGE_2D_TOP_EXTENT
                } ${width} ${
                  height + MONTAGE_2D_TOP_EXTENT
                }`}
                width={width}
                height={height}
              >
                <Montage2D
                  cssClass={cssClass}
                  points={scatter2D}
                  sensors={sensors}
                  selectedSensors={highlightedSensors}
                  colorMap={colorMap}
                  isSensorSelectable={(sensor) => (
                    onSensorClick !== undefined && isSensorSelectable(sensor)
                  )}
                  showChannelIndices={showChannelIndices}
                  isSensorVisible={isSensorVisible}
                  onSensorClick={(index) => onSensorClick?.(index)}
                />
              </svg>
            )}
          </ParentSize>
        }
      </div>
    </div>
  </div>;
}

export default Montage;
