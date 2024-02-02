/**
 * Utility types for the imaging browser
 */

// Type created from the data used in
// `modules/imaging_browser/templates/form_viewSession.tpl`, which itself takes its data from
// `modules/imaging_browser/php/viewsession.class.inc` (line 379 at the time of this comment),
// which itself takes its data from `php/libraries/MRIFile.class.inc`
// Note: these values might be nullable
/**
 * Image header informations
 */
interface ImageInfos {
  SeriesUID: string;
  XStep: string;
  YStep: string;
  ZStep: string;
  OutputType: string;
  CoordinateSpace: string;
  AcquisitionProtocol: string;
  AcquisitionDate: string;
  InsertedDate: string;
  SeriesNumber: string;
  SeriesDescription: string;
  SliceThickness: string;
  RepetitionTime: string;
  EchoTime: string;
  InversionTime: string;
  PhaseEncodingDirection: string;
  ImageType: string;
  EchoNumber: string;
  NumVolumes: string;
  ProcessingPipeline: string;
  ProcDate: string;
  TotalRejected: string;
  InterlaceRejected: string;
  IntergradientRejected: string;
  SlicewiseRejected: string;
}

/**
 * Paths to image files
 */
interface ImageFiles {
  minc: string; /* MINC file, it also serves as the base URL path in the API */
  xmlProtocol?: string;
  xmlReport?: string;
  nrrd?: string;
  nifti?: string; /* NIFTI file */
  bval?: string;
  bvec?: string;
  json?: string; /* BIDS JSON file */
}

type QcStatus = 'Pass' | 'Fail';

export {
  ImageInfos,
  ImageFiles,
  QcStatus,
};
