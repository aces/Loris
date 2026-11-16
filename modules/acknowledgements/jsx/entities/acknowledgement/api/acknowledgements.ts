import {client, Query} from 'jslib/http';
import {Acknowledgement} from '../types/Acknowledgement';

export type NewAcknowledgement = Record<string, string | string[] | null>;

/**
 * Fetches the acknowledgements.
 *
 * @param query A Query object to build the URL query string
 * @return The acknowledgements
 */
export async function getAll(
  query?: Query
): Promise<Acknowledgement[]> {
  return client.get<Acknowledgement[]>('acknowledgements/', query);
}

/**
 * Adds an acknowledgement.
 *
 * @param acknowledgement The form values of the new acknowledgement
 */
export async function create(
  acknowledgement: NewAcknowledgement
): Promise<void> {
  return client.post<void, NewAcknowledgement>(
    'acknowledgements/AcknowledgementsProcess',
    acknowledgement
  );
}
