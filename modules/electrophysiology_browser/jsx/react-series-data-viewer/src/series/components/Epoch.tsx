import {vec2} from 'gl-matrix';
import {MIN_EPOCH_WIDTH} from '../../vector';
import {ScaleLinear} from 'd3-scale';

type CProps = {
  parentHeight: number,
  onset: number,
  duration: number,
  scales: [ScaleLinear<number, number, never>, ScaleLinear<number, number, never>],
  color: string,
  opacity: number,
};

const Epoch = (
  {
    parentHeight,
    onset,
    duration,
    scales,
    color,
    opacity,
  }: CProps) => {
  const start = vec2.fromValues(
    scales[0](onset),
    scales[1](-parentHeight/2),
  );

  const end = vec2.fromValues(
    scales[0](onset + duration) + MIN_EPOCH_WIDTH,
    scales[1](parentHeight/2)
  );

  const width = Math.abs(end[0] - start[0]);
  const height = Math.abs(end[1] - start[1]);
  const center = (start[0] + end[0]) / 2;

  return (
    <rect
      fill={color}
      fillOpacity={opacity}
      width={width}
      height={height}
      x={center - width/2}
      y={-height/2}
    />
  );
};

Epoch.defaultProps = {
  color: '#dae5f2',
  opacity: 1,
};

export default Epoch;
