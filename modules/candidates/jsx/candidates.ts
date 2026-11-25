import {client} from 'jslib/http';

export type CreatedCandidate = {
  CandID: string,
  PSCID: string,
};

export type NewCandidate = {
  Candidate: {
    Project: string,
    DoB: string,
    Sex: string,
    Site: string,
    PSCID?: string,
    EDC?: string,
    RegistrationCohort?: string,
    Parameters?: Record<string, string>,
  },
};

/**
 * Creates a candidate.
 *
 * @param candidate The candidate, as the candidates API takes it
 * @return The new candidate's DCCID and PSCID
 */
export async function create(
  candidate: NewCandidate
): Promise<CreatedCandidate> {
  return client.post<CreatedCandidate, NewCandidate>(
    'api/v0.0.4-dev/candidates/',
    candidate
  );
}
