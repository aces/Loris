import * as R from 'ramda';
import {scaleLinear, ScaleLinear} from 'd3-scale';
import {vec2} from 'gl-matrix';
import {Chunk} from '../store/types';
import {LinePath} from '@visx/shape';
import {Group} from '@visx/group';
import {colorOrder} from '../../color';

const LineMemo = R.memoizeWith(
  ({amplitudeScale, interval, filters,
     channelIndex, traceIndex, chunkIndex,
     isStacked, DCOffset, numChannels,
     numChunks, previousPoint,
  }) =>
    `${amplitudeScale},${interval.join('-')},${filters.join('-')},`
    + `${channelIndex}-${traceIndex}-${chunkIndex},`
    + `${isStacked},${DCOffset},${numChannels},`
    + `${numChunks},${previousPoint}`,
  ({
    channelIndex,
    traceIndex,
    chunkIndex,
    interval,
    seriesRange,
    amplitudeScale,
    filters,
    values,
    isStacked,
    DCOffset,
    numChannels,
    numChunks,
    previousPoint,
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

    const points = previousPoint === null
      ? []
      : [
        vec2.fromValues(
          scales[0](
            interval[0] - (1 / values.length) * (interval[1] - interval[0])
          ),
          -(scales[1](previousPoint) - DCOffset)
        )
    ];

    points.push(
      ...values.map((value, i) =>
        vec2.fromValues(
          scales[0](
            interval[0] + (i / values.length) * (interval[1] - interval[0])
          ),
          -(scales[1](value) - DCOffset)
        )
      )
    );

    return (
      <LinePath
        className={`channel-${channelIndex}`}
        vectorEffect="non-scaling-stroke"
        data={points}
        strokeWidth={1}
        stroke={isStacked
          ? colorOrder(channelIndex.toString()).toString()
          : '#999'}
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

/**
 *
 * @param root0
 * @param root0.channelIndex
 * @param root0.traceIndex
 * @param root0.chunkIndex
 * @param root0.chunk
 * @param root0.seriesRange
 * @param root0.amplitudeScale
 * @param root0.scales
 * @param root0.physioFileID
 * @param root0.isHovered
 * @param root0.isStacked
 * @param root0.withDCOffset
 * @param root0.numChannels
 * @param root0.numChunks
 * @param root0.previousPoint
 */
const LineChunk = ({
  channelIndex,
  traceIndex,
  chunkIndex,
  chunk,
  seriesRange,
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
          seriesRange={seriesRange}
          amplitudeScale={amplitudeScale}
          filters={chunk.filters}
          isStacked={isStacked}
          DCOffset={withDCOffset}
          numChannels={numChannels}
          numChunks={numChunks}
          previousPoint={previousPoint}
        />
      </Group>
    </Group>
  );
};

export default LineChunk;
