/** User data supplied by UserPageDecorationMiddleware. */
export interface LorisUser {
  username: string;
  id: number;
  langpref: string;
}

/** Page parameters supplied by UserPageDecorationMiddleware. */
export interface LorisPageParams {
  BaseURL: string;
  TestName: string;
  Subtest: string;
  CandID: string | number;
  SessionID: string | number;
  CommentID: string | number;
}

/** Study settings, with booleans encoded as strings from PHP. */
export interface LorisStudyConfig {
  useEDC: string | null;
  useProband: string | null;
  useFamilyID: string | null;
  useConsent: string | null;
  studyTitle: string | null;
  printEndpoint: string | null;
}

/** Shared API available on authenticated LORIS pages. */
export interface Loris extends LorisPageParams {
  user: LorisUser;
  userHasPermission(permission: string): boolean;
  config: LorisStudyConfig;
}

declare global {
  interface Window {
    loris: Loris;
  }
}

/**
 * Shared LORIS instance used in `window.loris`. The template code must call
 * `initializeLoris` before this module is imported by other modules, or this
 * variable will be `undefined`.
 */
export let loris: Loris = window.loris;

/**
 * Initialize the shared LORIS instance and assign it to `window.loris`.
 *
 * @param user - Current user.
 * @param params - Page parameters.
 * @param permissions - Granted permission names.
 * @param study - Whitelisted study settings.
 */
export function initializeLoris(
  user: LorisUser,
  params: LorisPageParams,
  permissions: readonly string[],
  study: LorisStudyConfig,
) {
  loris = window.loris = createLoris(user, params, permissions, study);
}

/**
 * Create a LORIS instance from the provided initialization data.
 *
 * @param user - Current user.
 * @param params - Page parameters.
 * @param permissions - Granted permission names.
 * @param study - Whitelisted study settings.
 * @returns The LORIS instance.
 */
export function createLoris(
  user: LorisUser,
  params: LorisPageParams,
  permissions: readonly string[],
  study: LorisStudyConfig,
): Loris {
  return Object.assign(params, {
    user,
    config: study,

    /**
     * Check a permission, including the superuser override.
     *
     * @param permission - Permission name.
     * @returns Whether the user has the permission.
     */
    userHasPermission(permission: string): boolean {
      return permissions.includes(permission) ||
        permissions.includes('superuser');
    },
  });
}
