/* eslint-disable react/no-unknown-property */
import React, {useContext, useMemo, useState} from 'react';
import {Canvas} from '@react-three/fiber';
import {Html, OrbitControls} from '@react-three/drei';
import {Sensor} from '../series/store/types';
import {
  computeCameraSettings,
  getSensorsCentroid,
  getSensorsBoundingBox,
  getSensorCategoryColor,
  normalizeSensorPositions,
  getSensorBidsChannel,
} from './utils';
import * as THREE from 'three';
import {
  ChannelInfosContext,
  ChannelMetasContext,
  HoveredChannelsContext,
} from '../eeglab/EEGLabSeriesProvider';
/**
 * A sensor of the 3D montage.
 */
function Sensor3D({sensor, handleClick}: {
  sensor: Sensor,
  handleClick?: (sensor: Sensor) => void,
}) {
  // The hovered channels in the signal visualizer.
  const {hoveredChannels} = useContext(HoveredChannelsContext);
  const rawChannels = useContext(ChannelMetasContext);
  const bidsChannels = useContext(ChannelInfosContext);
  const bidsChannel = getSensorBidsChannel(
    sensor,
    rawChannels,
    bidsChannels,
  );

  const hoveredChannel = (
    sensor.channelIndex !== undefined
    && hoveredChannels.includes(sensor.channelIndex)
  );

  // Whether the sensor is hovered or not.
  const [hovered, setHovered] = useState(false);
  const color = getSensorCategoryColor(sensor.type, bidsChannel?.ChannelType);

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
      {(hovered || hoveredChannel) && (
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
function Montage3D({visibleSensors, allSensors, handleSensorClick}: {
  visibleSensors: Sensor[],
  allSensors: Sensor[],
  handleSensorClick?: (sensor: Sensor) => void,
}) {
  // Compute the bounding box of all sensors.
  const boundingBox = useMemo(() =>
    getSensorsBoundingBox(allSensors)
  , [allSensors]);

  // Normalize visible sensor positions to range [-1, 1].
  const sensors = useMemo(() =>
    normalizeSensorPositions(boundingBox, visibleSensors)
  , [boundingBox, visibleSensors]);

  const normalizedCenter = useMemo(() => {
    const allNormalizedSensors = normalizeSensorPositions(
      boundingBox,
      allSensors,
    );

    return getSensorsCentroid(allNormalizedSensors);
  }, [allSensors, boundingBox]);

  const cameraSettings = useMemo(() => {
    const normalizedSize = new THREE.Vector3(2, 2, 2);
    return computeCameraSettings(normalizedCenter, normalizedSize);
  }, [normalizedCenter]);

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
            handleClick={handleSensorClick}
          />
        ))}
        <OrbitControls makeDefault target={cameraSettings.target} />
      </Canvas>
    </div>
  );
}

export default Montage3D;
