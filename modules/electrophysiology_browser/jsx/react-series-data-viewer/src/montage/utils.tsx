import {findBidsChannel} from '../series/store/logic/channels';
import {
  ChannelInfo, ChannelMetadata, Sensor, SensorType,
} from '../series/store/types';
import * as THREE from 'three';

/**
 * A sensor category, that is, a pair of sensor type and associated channel
 * type.
 */
export type SensorCategory = {
  sensorType: SensorType,
  channelType?: string,
};

/**
 * Get a unique string key for a sensor category.
 */
export function getSensorCategoryKey(category: SensorCategory): string {
  return `${category.sensorType}-${category.channelType}`;
}

/**
 * Get the BIDS channel associated with a sensor, if there is one.
 */
export function getSensorBidsChannel(
  sensor: Sensor,
  rawChannels: ChannelMetadata[],
  bidsChannels: ChannelInfo[],
): ChannelInfo | undefined {
  // Sensors and raw-channel metadata are fetched independently. The sensor
  // list can therefore render before its corresponding channel is available.
  const rawChannel = sensor.channelIndex === undefined
    ? undefined
    : rawChannels[sensor.channelIndex];

  return rawChannel === undefined
    ? undefined
    : findBidsChannel(rawChannel, bidsChannels);
}

/**
 * Get the category of a sensor.
 */
export function getSensorCategory(
  sensor: Sensor,
  rawChannels: ChannelMetadata[],
  bidsChannels: ChannelInfo[],
): SensorCategory {
  const sensorTypeName = getSensorBidsChannel(
    sensor,
    rawChannels,
    bidsChannels,
  );

  return {
    sensorType: sensor.type,
    channelType: sensorTypeName?.ChannelType,
  };
}

/**
 * Check whether a sensor has a position, and can thus be displayed in the
 * montage.
 */
export function checkSensorPosition(sensor: Sensor): boolean {
  return (
    sensor.position[0] !== null &&
    sensor.position[1] !== null &&
    sensor.position[2] !== null
  );
}

/**
 * Get the display color of a sensor type.
 */
export function getSensorCategoryColor(
  sensorType: SensorType,
  bidsChannel?: string,
): string {
  switch (sensorType) {
  case 'electrode':
    return '#B28B00';
  case 'meg-sensor':
    switch (bidsChannel) {
    case 'MEGREFGRADAXIAL':
      return '#ff7f0e';
    case 'MEGREFMAG':
      return '#d62728';
    case 'HUL':
      return '#2ca02c';
    case 'MEGGRADAXIAL':
      return '#1f77b4';
    default:
      return '#222222';
    }
  case 'head-shape-point':
    return '#666666';
  }
}

/**
 * Normalize the sensor positions from their original bounding box to [-1, 1].
 * This is done to get similar scaling across different datasets that may use
 * different position units.
 */
export function normalizeSensorPositions(
  boundingBox: THREE.Box3,
  sensors: Sensor[],
): Sensor[] {
  const center = boundingBox.getCenter(new THREE.Vector3());
  const size = boundingBox.getSize(new THREE.Vector3());

  // Find the largest dimension to maintain aspect ratio.
  const maxRange = Math.max(size.x, size.y, size.z);

  // Normalize all sensor positions to range [-1, 1] centered at origin.
  return sensors.map((sensor) => {
    const originalPos = new THREE.Vector3(...sensor.position);
    return {
      ...sensor,
      position: [
        ((originalPos.x - center.x) / maxRange) * 2,
        ((originalPos.y - center.y) / maxRange) * 2,
        ((originalPos.z - center.z) / maxRange) * 2,
      ],
    };
  });
}

/**
 * Compute the camera settings given information about the sensors position.
 */
export function computeCameraSettings(
  center: THREE.Vector3,
  size: THREE.Vector3,
): {
  position: [number, number, number],
  target: [number, number, number],
} {
  const horizontalSize = Math.max(size.x, size.z);
  const verticalSize = size.y;
  const maxDimension = Math.max(horizontalSize, verticalSize);

  const fovRadians = (50 * Math.PI) / 180;
  const distance = (maxDimension / 2) / Math.tan(fovRadians / 2);
  const finalDistance = distance * 2;

  return {
    position: [center.x, center.y + finalDistance, center.z],
    target: [center.x, center.y, center.z],
  };
}

/**
 * Compute the centroid of sensor positions.
 */
export function getSensorsCentroid(sensors: Sensor[]): THREE.Vector3 {
  if (sensors.length === 0) {
    return new THREE.Vector3(0, 0, 0);
  }

  const centroid = sensors.reduce(
    (sum, sensor) => sum.add(new THREE.Vector3(...sensor.position)),
    new THREE.Vector3(0, 0, 0),
  );

  return centroid.divideScalar(sensors.length);
}

/**
 * Get the bounding box for a list of sensors.
 */
export function getSensorsBoundingBox(sensors: Sensor[]): THREE.Box3 {
  const box = new THREE.Box3();
  for (const sensor of sensors) {
    box.expandByPoint(new THREE.Vector3(...sensor.position));
  }

  return box;
}
