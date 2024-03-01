/**
 * Subject type
 */
interface Subject {
  mriqcstatus: string; // may be empty
  mriqcpending: string; // boolean 'Y' 'N'
  pscid: string;
  candid: string;
  visitLabel: string;
  site: string;
  dob: string; // YYYY-MM-DD
  edc: string | null; // YYYY-MM-DD
  sex: string;
  scanner: string;
  CohortTitle: string;
  useEDC: boolean; // not really part of a subject, should be factorzed out in the future
}

/**
 * Scanner type
 */
interface Scanner {
  id: number;
  manufacturer: string;
  model: string;
  serialNumber: string;
}

/**
 * Image file informations
 */
interface Image {
  FileID: number;
  Filename: string;
  FullFilename: string;
  APIFile: string;
  Caveat: boolean;
  Comment: string | null;
  EditableCaveat: boolean;
  New: boolean;
  OtherTimepoints: number;
  QCStatus: QcStatus | null;
  SNR: string | null; // Looks like a float
  Selected: boolean | null;
  SourceFile: string; // May be empty
  Tool: string | null;
  ScannerID: number | null;
  headers: ImageHeaders;
  files: ImageFiles;
  HasQCPerm: boolean; // it is a user permission, not related to the image
  // so it should be factored out in the future
}

/**
 * Image headers
 */
interface ImageHeaders {
  AcquisitionDate: string; // YYYY-MM-DD
  AcquisitionProtocol: string;
  CoordinateSpace: string;
  EchoNumber: number;
  EchoTime: number;
  ImageType: string;
  InsertedDate: string; // YYYY-MM-DD
  IntergradientRejected: string | null;
  InterlaceRejected: string | null;
  InversionTime: number;
  NumVolumes: number;
  OutputType: string;
  PhaseEncodingDirection: string | null;
  ProcDate: string | null;
  ProcessingPipeline: string | null;
  RepetitionTime: number;
  SeriesDescription: number;
  SeriesNumber: number;
  SeriesUID: string;
  SliceThickness: number;
  SlicewiseRejected: string | null
  TotalRejected: string | null
  Xstep: number;
  Ystep: number;
  Zstep: number;
}

/**
 * Paths to auxiliary image files.
 */
interface ImageFiles {
  protocol: string | null; /* XML protocol */
  report: string | null; /* XML report */
  nrrd: string | null;
  nii: string | null; /* NIFTI file */
  bval: string | null;
  bvec: string | null;
  json: string | null; /* BIDS JSON file */
}

type QcStatus = 'Pass' | 'Fail';

export {
  Subject,
  Scanner,
  Image,
  ImageHeaders,
  ImageFiles,
  QcStatus,
};
