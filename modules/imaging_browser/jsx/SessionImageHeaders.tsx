import {ImageHeaders} from './types';


interface ImageHeadersProps {
  infos: ImageHeaders;
}

/**
 * Image File Headers Table component
 *
 * @returns The React element
 */
function ImageHeaders(props: ImageHeadersProps) {
  const inversionTime = props.infos.InversionTime !== 0
    ? props.infos.InversionTime + ' ms'
    : null;

  const numVolumes = props.infos.NumVolumes !== 0
    ? props.infos.NumVolumes + ' volumes'
    : null;

  return (
    <div style={{overflowX: 'scroll'}}>
    <table
      className="
        table
        table-hover
        table-bordered
        header-info
        col-xs-12
        dynamictable"
    >
      <tbody>
      <tr>
        <th className="col-xs-2 info">Series Instance UID</th>
        <td className="col-xs-10" colSpan={5}>
          {props.infos.SeriesUID}
        </td>
      </tr>
      <tr>
        <th className="col-xs-2 info">Voxel Size</th>
        <td className="col-xs-6" colSpan={3}>
          X: {props.infos.Xstep} mm,
          Y: {props.infos.Ystep} mm,
          Z: {props.infos.Zstep} mm
        </td>
        <th className="col-xs-2 info">Output Type</th>
        <td className="col-xs-2">
          {props.infos.OutputType}
        </td>
      </tr>
      <tr>
        <th className="col-xs-2 info">Protocol</th>
        <td className="col-xs-2">
          {props.infos.AcquisitionProtocol}
        </td>
        <th className="col-xs-2 info">Acquisition Date</th>
        <td className="col-xs-2">
          {props.infos.AcquisitionDate}
        </td>
        <th className="col-xs-2 info">Inserted Date</th>
        <td className="col-xs-2">
          {props.infos.InsertedDate}
        </td>
      </tr>
      <tr>
        <th className="col-xs-2 info">Series Number</th>
        <td className="col-xs-2">
          {props.infos.SeriesNumber}
        </td>
        <th className="col-xs-2 info">Series Description</th>
        <td className="col-xs-2">
          {props.infos.SeriesDescription}
        </td>
        <th className="col-xs-2 info">Slice Thick</th>
        <td className="col-xs-2">
          {props.infos.SliceThickness} mm
        </td>
      </tr>
      <tr>
        <th className="col-xs-2 info">TR</th>
        <td className="col-xs-2">
          {props.infos.RepetitionTime} ms
        </td>
        <th className="col-xs-2 info">TE</th>
        <td className="col-xs-2">
          {props.infos.EchoTime} ms
        </td>
        <th className="col-xs-2 info">TI</th>
        <td className="col-xs-2">
          {inversionTime}
        </td>
      </tr>
      <tr>
        <th className="col-xs-2 info">Phase Encoding Direction</th>
        <td className="col-xs-2">
          {props.infos.PhaseEncodingDirection}
        </td>
        <th className="col-xs-2 info">Image Type</th>
        <td className="col-xs-2">
          {props.infos.ImageType}
        </td>
        <th className="col-xs-2 info">Echo Number</th>
        <td className="col-xs-2">
          {props.infos.EchoNumber}
        </td>
      </tr>
      <tr>
        <th className="col-xs-2 info">Number of volumes</th>
        <td className="col-xs-2">
          {numVolumes}
        </td>
        {props.infos.ProcessingPipeline ?
          <th className="col-xs-2 info">Processing Pipeline</th>
          : null}
        {props.infos.ProcessingPipeline ?
          <td className="col-xs-2">
            {props.infos.ProcessingPipeline}
          </td>
          : null}
        {props.infos.ProcDate ?
        <th className="col-xs-2 info">Processing Pipeline Date</th>
          : null }
        {props.infos.ProcDate ?
        <td className="col-xs-2">
          {props.infos.ProcDate}
        </td>
          : null }
      </tr>
      {props.infos.ProcessingPipeline === 'DTIPrepPipeline' ?
        <tr>
          <th className="col-xs-2 info">Number of rejected directions</th>
          <td className="col-xs-2">
            {props.infos.TotalRejected}
          </td>
          <th className="col-xs-2 info">Number of Interlace correlations</th>
          <td className="col-xs-2">
            {props.infos.InterlaceRejected}
          </td>
          <th className="col-xs-2 info">
            Number of Gradient-wise correlations
          </th>
          <td className="col-xs-2">
            {props.infos.IntergradientRejected}
          </td>
        </tr>
        : null}
      {props.infos.ProcessingPipeline === 'DTIPrepPipeline' ?
        <tr>
          <th className="col-xs-2 info">Number of Slicewise correlations</th>
          <td className="col-xs-2">
            {props.infos.SlicewiseRejected}
          </td>
        </tr>
        : null}
      </tbody>
    </table>
    </div>
  );
}

export default ImageHeaders;
