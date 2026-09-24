/* eslint-disable react/no-unknown-property */
import React, {useContext, useMemo, useState} from 'react';
import {Canvas} from '@react-three/fiber';
import {Html, OrbitControls} from '@react-three/drei';
import {Sensor} from '../domain/types';
import {
  computeCameraSettings,
  getSensorsBoundingBox,
  getSensorCategoryColor,
  normalizeSensorPositions,
  getSensorBidsChannel,
} from './utils';
import * as THREE from 'three';
import {
  ChannelInfosContext,
  ChannelMetadataContext,
} from '../recording/RecordingDataProvider';
/**
 * A sensor of the 3D montage.
 */
function Sensor3D({sensor, handleClick, selected, signalViewerHovered}: {
  sensor: Sensor,
  handleClick?: (sensor: Sensor) => void,
  selected: boolean,
  signalViewerHovered: boolean,
}) {
  const rawChannels = useContext(ChannelMetadataContext);
  const bidsChannels = useContext(ChannelInfosContext);
  const bidsChannel = getSensorBidsChannel(
    sensor,
    rawChannels,
    bidsChannels,
  );

  // Whether the sensor is hovered or not.
  const [hovered, setHovered] = useState(false);
  const categoryColor = getSensorCategoryColor(
    sensor.type,
    bidsChannel?.ChannelType,
  );
  const color = selected
    ? `#${new THREE.Color(categoryColor).multiplyScalar(0.7).getHexString()}`
    : categoryColor;

  return (
    <group>
      <mesh
        position={sensor.position}
        onClick={() => handleClick?.(sensor)}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[0.02, 16, 16]} />
        <meshBasicMaterial color={color} />
      </mesh>
      {(hovered || signalViewerHovered) && (
        <Html
          position={sensor.position}
          center
          style={{pointerEvents: 'none'}}
          distanceFactor={2}
        >
          <div style={{
            background: 'rgba(0,0,0,0.8)',
            color: 'white',
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '12px',
            fontFamily: 'sans-serif',
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
            transform: 'translateY(-20px)',
          }}>
            {sensor.name}
          </div>
        </Html>
      )}
    </group>
  );
}

/**
 * A canvas displaying sensors of the montage in 3D.
 */
function Montage3D({
  visibleSensors,
  allSensors,
  handleSensorClick,
  isSensorSelectable,
  isSensorSelected,
  hoveredChannelIndices,
}: {
  visibleSensors: Sensor[],
  allSensors: Sensor[],
  handleSensorClick?: (sensor: Sensor) => void,
  isSensorSelectable: (sensor: Sensor) => boolean,
  isSensorSelected: (sensor: Sensor) => boolean,
  hoveredChannelIndices: number[],
}) {
  const rawChannels = useContext(ChannelMetadataContext);
  const bidsChannels = useContext(ChannelInfosContext);

  // Reference sensors sit outside the helmet. Render them, but do not let
  // them determine the initial framing of the head-mounted sensors.
  const framingSensors = useMemo(() => {
    const sensors = allSensors.filter((sensor) => {
      const channelType = getSensorBidsChannel(
        sensor,
        rawChannels,
        bidsChannels,
      )?.ChannelType;

      return channelType !== 'MEGREFMAG'
        && channelType !== 'MEGREFGRADAXIAL';
    });

    return sensors.length > 0 ? sensors : allSensors;
  }, [allSensors, rawChannels, bidsChannels]);

  // Normalize against the head-mounted sensors so remote reference sensors
  // do not shrink or offset the montage.
  const boundingBox = useMemo(() =>
    getSensorsBoundingBox(framingSensors)
  , [framingSensors]);

  // Normalize visible sensor positions to range [-1, 1].
  const sensors = useMemo(() =>
    normalizeSensorPositions(boundingBox, visibleSensors)
  , [boundingBox, visibleSensors]);

  const normalizedFramingBox = useMemo(() => {
    const normalizedFramingSensors = normalizeSensorPositions(
      boundingBox,
      framingSensors,
    );

    return getSensorsBoundingBox(normalizedFramingSensors);
  }, [framingSensors, boundingBox]);

  const cameraSettings = useMemo(() => {
    const center = normalizedFramingBox.getCenter(new THREE.Vector3());
    const size = normalizedFramingBox.getSize(new THREE.Vector3());
    return computeCameraSettings(center, size);
  }, [normalizedFramingBox]);

  return (
    <div style={{width: '100%', height: '100%'}}>
      <Canvas
        camera={{
          position: cameraSettings.position,
          fov: 30,
          up: [0, 0, 1], // Set Z as up vector
        }}
      >
        {/* <axesHelper args={[5]} /> */}
        {sensors.map((sensor, idx) => (
          <Sensor3D
            key={idx}
            sensor={sensor}
            handleClick={isSensorSelectable(sensor)
              ? handleSensorClick
              : undefined
            }
            selected={isSensorSelected(sensor)}
            signalViewerHovered={
              sensor.channelIndex !== undefined
              && hoveredChannelIndices.includes(sensor.channelIndex)
            }
          />
        ))}
        <OrbitControls makeDefault target={cameraSettings.target} />
      </Canvas>
    </div>
  );
}

export default Montage3D;
