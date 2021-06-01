import * as R from 'ramda';
import {scaleLinear, ScaleLinear} from 'd3-scale';
import {vec2} from 'gl-matrix';
import {colorOrder} from '../../color';
import {Chunk} from '../store/types';
import {LinePath} from '@visx/shape';
import {Group} from '@visx/group';

const LineMemo = R.memoizeWith(
  ({interval, amplitudeScale, filters, channelIndex, traceIndex, chunkIndex}) =>
    `${interval.join(',')},${amplitudeScale},${filters.join('-')},`
  + `${channelIndex}-${traceIndex}-${chunkIndex}`,
  ({
    channelIndex,
    traceIndex,
    chunkIndex,
    interval,
    seriesRange,
    amplitudeScale,
    filters,
    values,
    color,
    ...rest
}) => {
    const scales = [
      scaleLinear()
        .domain(interval)
        .range([-0.5, 0.5]),
      scaleLinear()
        .domain(seriesRange.map((x) => x * amplitudeScale))
        .range([-0.5, 0.5]),
    ];

    const points = values.map((value, i) =>
      vec2.fromValues(
        scales[0](
          interval[0] + (i / values.length) * (interval[1] - interval[0])
        ),
        -scales[1](value)
      )
    );

    return (
      <LinePath
        vectorEffect="non-scaling-stroke"
        data={points}
        strokeWidth={1}
        stroke={color}
        {...rest}
      />
    );
  }
);

type CProps = {
  channelIndex: number,
  traceIndex: number,
  chunkIndex: number,
  chunk: Chunk,
  seriesRange: [number, number],
  amplitudeScale: number,
  scales: [ScaleLinear<number, number, never>, ScaleLinear<number, number, never>],
  color?: string
};

const LineChunk = ({
  channelIndex,
  traceIndex,
  chunkIndex,
  chunk,
  seriesRange,
  amplitudeScale,
  scales,
  color,
  ...rest
}: CProps) => {
  const {interval, values} = chunk;

  if (values.length === 0) {
    return <Group />;
  }

  const range = scales[1].range();
  const chunkLength = Math.abs(scales[0](interval[1]) - scales[0](interval[0]));
  const chunkHeight = Math.abs(range[1] - range[0]);

  const p0 = vec2.fromValues(
    (scales[0](interval[0]) + scales[0](interval[1])) / 2,
    (range[0] + range[1]) / 2
  );

  const lineColor = colorOrder(channelIndex.toString()) || '#999';

  return (
    <Group
      style={{clipPath: 'url(#lineChunk)'}}
      top={-p0[1]}
    >
      <Group
        transform={'translate(' + p0[0] + ' 0)' +
                   'scale(' + chunkLength + ' ' + chunkHeight + ')'
        }
      >
        <LineMemo
          {...rest}
          channelIndex={channelIndex}
          traceIndex={traceIndex}
          chunkIndex={chunkIndex}
          values={values}
          interval={interval}
          seriesRange={seriesRange}
          amplitudeScale={amplitudeScale}
          filters={chunk.filters}
          color={lineColor}
        />
      </Group>
    </Group>
  );
};

export default LineChunk;
