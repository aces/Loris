import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import {Channel, ChannelInfo, ChannelMetadata} from '../../domain/types';
import {colorOrder} from '../../ui/colors';
import {
  createSignalRenderModel,
  hitTestSignalModel,
} from '../rendering/SignalRenderModel';
import WebGLSignalRenderer from '../rendering/WebGLSignalRenderer';
import {useTranslation} from 'react-i18next';

/* eslint-disable jsdoc/require-jsdoc */

export type SignalCanvasHandle = {
  hitTest(position: [number, number]): number[],
};

type WebGLSignalCanvasProps = {
  width: number,
  height: number,
  channels: Channel[],
  channelMetadata: ChannelMetadata[],
  bidsChannels: ChannelInfo[],
  channelCount: number,
  timeWindow: [number, number],
  amplitudeScale: number,
  withDCOffset: boolean,
  stackedView: boolean,
  singleMode: boolean,
  hoveredChannels: number[],
};

function parseColor(color: string): [number, number, number, number] {
  const value = color.startsWith('#') ? color.slice(1) : color;
  if (value.length !== 6) return [0.2, 0.2, 0.2, 1];
  return [
    Number.parseInt(value.slice(0, 2), 16) / 255,
    Number.parseInt(value.slice(2, 4), 16) / 255,
    Number.parseInt(value.slice(4, 6), 16) / 255,
    1,
  ];
}

/** Own the GPU signal surface and expose source-data hit testing. */
const WebGLSignalCanvas = forwardRef<SignalCanvasHandle, WebGLSignalCanvasProps>(
  function WebGLSignalCanvas({
    width,
    height,
    channels,
    channelMetadata,
    bidsChannels,
    channelCount,
    timeWindow,
    amplitudeScale,
    withDCOffset,
    stackedView,
    singleMode,
    hoveredChannels,
  }, ref) {
    const {t} = useTranslation();
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const rendererRef = useRef<WebGLSignalRenderer | null>(null);
    const [contextGeneration, setContextGeneration] = useState(0);
    const [renderError, setRenderError] = useState<string | null>(null);
    const model = useMemo(() => createSignalRenderModel({
      channels,
      channelMetadata,
      bidsChannels,
      channelCount,
      timeWindow,
      amplitudeScale,
      withDCOffset,
      stackedView,
      viewportWidth: width,
    }), [
      channels,
      channelMetadata,
      bidsChannels,
      channelCount,
      timeWindow[0],
      timeWindow[1],
      amplitudeScale,
      withDCOffset,
      stackedView,
      width,
    ]);
    const colors = useMemo(() => new Map(channels.map((channel) => [
      channel.index,
      parseColor(colorOrder(channel.index.toString()).toString()),
    ])), [channels]);

    useImperativeHandle(ref, () => ({
      hitTest: (position) => hitTestSignalModel(
        model, position, timeWindow, channelCount
      ),
    }), [model, timeWindow[0], timeWindow[1], channelCount]);

    useEffect(() => {
      const canvas = canvasRef.current;
      if (canvas === null) return;
      let renderer: WebGLSignalRenderer;
      try {
        renderer = new WebGLSignalRenderer(canvas);
        rendererRef.current = renderer;
        setRenderError(null);
      } catch (error) {
        setRenderError(error instanceof Error ? error.message : String(error));
        return;
      }
      return () => {
        renderer.dispose();
        if (rendererRef.current === renderer) rendererRef.current = null;
      };
    }, [contextGeneration]);

    useEffect(() => {
      const canvas = canvasRef.current;
      if (canvas === null) return;
      const onLost = (event: Event) => event.preventDefault();
      const onRestored = () => setContextGeneration((value) => value + 1);
      canvas.addEventListener('webglcontextlost', onLost);
      canvas.addEventListener('webglcontextrestored', onRestored);
      return () => {
        canvas.removeEventListener('webglcontextlost', onLost);
        canvas.removeEventListener('webglcontextrestored', onRestored);
      };
    }, []);

    useEffect(() => {
      const renderer = rendererRef.current;
      if (renderer === null) return;
      renderer.resize(width, height, Math.min(window.devicePixelRatio || 1, 2));
      renderer.setModel(model);
      renderer.render({
        hoveredChannels,
        stackedView,
        singleMode,
        colors,
      });
    }, [
      width,
      height,
      model,
      hoveredChannels,
      stackedView,
      singleMode,
      colors,
      contextGeneration,
    ]);

    return (
      <>
        <canvas
          ref={canvasRef}
          aria-label={t('Signal traces', {ns: 'electrophysiology_browser'})}
          style={{
            display: 'block',
            height,
            left: 0,
            pointerEvents: 'none',
            position: 'absolute',
            top: 0,
            width,
          }}
        />
        {renderError !== null && (
          <div role='alert' style={{padding: 8}}>
            {t('Signal rendering requires WebGL2: {{error}}', {
              ns: 'electrophysiology_browser',
              error: renderError,
            })}
          </div>
        )}
      </>
    );
  }
);

export default WebGLSignalCanvas;
