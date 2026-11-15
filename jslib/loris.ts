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
}

/** Values supported by the filtered menu's hidden form inputs. */
export type LorisMenuFilters = Record<
  string, string | number | null | undefined
>;

/** Shared API available on authenticated LORIS pages. */
export interface Loris extends LorisPageParams {
  user: LorisUser;
  loadFilteredMenuClickHandler(
    module: string,
    filters: LorisMenuFilters,
  ): (event: Pick<Event, 'preventDefault'>) => void;
  getCookie(name: string): string | undefined;
  userHasPermission(permission: string): boolean;
  debounce<This, Args extends unknown[]>(
    fn: (this: This, ...args: Args) => unknown,
    delay: number,
  ): (this: This, ...args: Args) => void;
  config<Key extends keyof LorisStudyConfig>(key: Key): LorisStudyConfig[Key];
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

    /**
     * Build a click handler that posts filters to a module.
     *
     * @param module - Module path relative to the base URL.
     * @param filters - Filter values to submit.
     * @returns A click handler for the filtered menu link.
     */
    loadFilteredMenuClickHandler(module: string, filters: LorisMenuFilters) {
      return function(event: Pick<Event, 'preventDefault'>) {
        event.preventDefault();
        const form = document.createElement('form');
        form.action = params.BaseURL + '/' + module;
        form.method = 'post';
        filters.reset = 'true';
        filters.filter = 'Show Data';

        for (const [name, value] of Object.entries(filters)) {
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = name;
          input.value = value == null ? '' : String(value);
          form.appendChild(input);
        }

        document.body.appendChild(form);
        // A filter named "submit" must not shadow the form's submit method.
        HTMLFormElement.prototype.submit.call(form);
      };
    },

    /**
     * Read a cookie without decoding its value.
     *
     * @param name - Cookie name.
     * @returns The cookie value, or undefined if absent.
     */
    getCookie(name: string): string | undefined {
      for (const cookie of document.cookie.split('; ')) {
        const parts = cookie.split('=');
        if (parts[0] === name) {
          return parts[1];
        }
      }
      return undefined;
    },

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

    /**
     * Delay a callback until calls stop for the requested interval.
     *
     * @param fn - Callback to invoke with the last call's receiver and arguments.
     * @param delay - Delay in milliseconds.
     * @returns A debounced callback that returns no value.
     */
    debounce<This, Args extends unknown[]>(
      fn: (this: This, ...args: Args) => unknown,
      delay: number,
    ): (this: This, ...args: Args) => void {
      let timer: ReturnType<typeof setTimeout> | undefined;
      return function(this: This, ...args: Args): void {
        clearTimeout(timer);
        timer = setTimeout(() => fn.apply(this, args), delay);
      };
    },

    /**
     * Read a whitelisted study setting.
     *
     * @param key - Setting name.
     * @returns The setting supplied by PHP.
     */
    config<Key extends keyof LorisStudyConfig>(key: Key):
      LorisStudyConfig[Key] {
      return study[key];
    },
  });
}
