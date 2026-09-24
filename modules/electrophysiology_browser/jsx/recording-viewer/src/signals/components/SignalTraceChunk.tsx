import {scaleLinear, ScaleLinear} from 'd3-scale';
import {vec2} from 'gl-matrix';
import {Chunk} from '../../domain/types';
import {LinePath} from '@visx/shape';
import {Group} from '@visx/group';
import {colorOrder} from '../../ui/colors';

/** Memoize a function using a caller-provided cache key. */
const memoizeWith = <TArgs extends unknown[], TResult>(
  createKey: (...args: TArgs) => string,
  fn: (...args: TArgs) => TResult
) => {
  const cache = new Map<string, TResult>();
  return (...args: TArgs) => {
    const key = createKey(...args);
    if (!cache.has(key)) cache.set(key, fn(...args));
    return cache.get(key) as TResult;
  };
};

type LineMemoProps = Omit<
  SignalTraceChunkProps,
  'chunk' | 'scales' | 'physioFileID' | 'withDCOffset'
> & {
  values: Float32Array,
  DCOffset: number,
  filters: string[],
  interval: [number, number],
};

const renderMemoizedLine = memoizeWith(
  ({amplitudeScale, interval, filters,
    channelIndex, traceIndex, chunkIndex,
    isStacked, DCOffset, numChannels,
    numChunks, previousPoint, isHovered,
  }) =>
    `${amplitudeScale},${interval.join('-')},${filters.join('-')},`
    + `${channelIndex}-${traceIndex}-${chunkIndex},`
    + `${isStacked},${DCOffset},${numChannels},`
    + `${numChunks},${previousPoint},${isHovered}`,
  ({
    channelIndex,
    traceIndex,
    chunkIndex,
    interval,
    signalRange,
    amplitudeScale,
    filters,
    values,
    isStacked,
    DCOffset,
    numChannels,
    numChunks,
    previousPoint,
    isHovered,
    ...rest
  }: LineMemoProps) => {
    const scales = [
      scaleLinear()
        .domain(interval)
        .range([-0.5, 0.5]),
      scaleLinear()
        .domain(signalRange.map((x) => x * amplitudeScale))
        .range([-0.5, 0.5]),
    ];

    const points = previousPoint === null
      ? []
      : [
        vec2.fromValues(
          scales[0](
            interval[0] - (1 / values.length) * (interval[1] - interval[0])
          ),
          -(scales[1](previousPoint) - DCOffset)
        ),
      ];

    for (let i = 0; i < values.length; i++) {
      points.push(
        vec2.fromValues(
          scales[0](
            interval[0] + (i / values.length) * (interval[1] - interval[0])
          ),
          -(scales[1](values[i]) - DCOffset)
        )
      );
    }

    return (
      <LinePath
        className={`channel-${channelIndex}`}
        vectorEffect="non-scaling-stroke"
        data={points}
        fill="none"
        pointerEvents="stroke"
        strokeWidth={isHovered ? 2 : 1}
        stroke={isStacked || isHovered
          ? colorOrder(channelIndex.toString()).toString()
          : '#999'}
        {...rest}
      />
    );
  }
);

/** Render a memoized signal line. */
function LineMemo(props: LineMemoProps) {
  return renderMemoizedLine(props);
}

type SignalTraceChunkProps = {
  channelIndex: number,
  traceIndex: number,
  chunkIndex: number,
  chunk: Chunk,
  signalRange: [number, number],
  amplitudeScale: number,
  scales: [
    ScaleLinear<number, number, never>,
    ScaleLinear<number, number, never>,
  ],
  physioFileID: number,
  isHovered: boolean,
  isStacked: boolean,
  withDCOffset: number,
  numChannels: number,
  numChunks: number,
  previousPoint: number | null,
};

/** Render one chunk of a signal trace. */
function SignalTraceChunk({
  channelIndex,
  traceIndex,
  chunkIndex,
  chunk,
  signalRange,
  amplitudeScale,
  scales,
  physioFileID,
  isHovered,
  isStacked,
  withDCOffset,
  numChannels,
  numChunks,
  previousPoint,
  ...rest
}: SignalTraceChunkProps) {
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

  return (
    <Group
      // style={{clipPath: 'url(#lineChunk-' + physioFileID + ')'}}
      top={-p0[1]}
    >
      <Group
        transform={'translate(' + p0[0] + ' 0) ' +
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
          signalRange={signalRange}
          amplitudeScale={amplitudeScale}
          filters={chunk.filters}
          isStacked={isStacked}
          DCOffset={withDCOffset}
          numChannels={numChannels}
          numChunks={numChunks}
          previousPoint={previousPoint}
          isHovered={isHovered}
        />
      </Group>
    </Group>
  );
}

export default SignalTraceChunk;
