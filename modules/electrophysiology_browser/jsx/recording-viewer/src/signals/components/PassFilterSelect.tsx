import type {CSSProperties} from 'react';
import {useTranslation} from 'react-i18next';
import type {TFunction} from 'i18next';
import {
  getHighPassFilterLabel,
  getLowPassFilterLabel,
  getPassFilterFrequencyFromSelectValue,
  getPassFilterSelectValue,
  HIGH_PASS_FILTER_FREQUENCIES,
  LOW_PASS_FILTER_FREQUENCIES,
} from '../filters/passFilters';
import type {PassFilterLabel} from '../filters/passFilters';

const ns = {ns: 'electrophysiology_browser'};

type PassFilterSelectProps = {
  className?: string,
  style?: CSSProperties,
  value?: number,
  onChange: (frequency?: number) => void,
};

/**
 * Select control for high pass filter frequencies.
 */
export function HighPassFilterSelect({
  value,
  onChange,
}: PassFilterSelectProps) {
  const {t} = useTranslation();

  return (
    <select
      className="btn btn-xs btn-primary"
      aria-label={t('High Pass Filter', ns)}
      value={getPassFilterSelectValue(value)}
      onChange={(event) => {
        onChange(getPassFilterFrequencyFromSelectValue(event.target.value));
      }}
    >
      <option value={getPassFilterSelectValue()}>
        {translatePassFilterLabel(t, getHighPassFilterLabel())}
      </option>
      {HIGH_PASS_FILTER_FREQUENCIES.map((frequency) => (
        <option
          key={frequency}
          value={getPassFilterSelectValue(frequency)}
        >
          {translatePassFilterLabel(t, getHighPassFilterLabel(frequency))}
        </option>
      ))}
    </select>
  );
}

/**
 * Select control for low pass filter frequencies.
 */
export function LowPassFilterSelect({
  value,
  onChange,
}: PassFilterSelectProps) {
  const {t} = useTranslation();

  return (
    <select
      className="btn btn-xs btn-primary"
      aria-label={t('Low Pass Filter', ns)}
      value={getPassFilterSelectValue(value)}
      onChange={(event) => {
        onChange(getPassFilterFrequencyFromSelectValue(event.target.value));
      }}
    >
      <option value={getPassFilterSelectValue()}>
        {translatePassFilterLabel(t, getLowPassFilterLabel())}
      </option>
      {LOW_PASS_FILTER_FREQUENCIES.map((frequency) => (
        <option
          key={frequency}
          value={getPassFilterSelectValue(frequency)}
        >
          {translatePassFilterLabel(t, getLowPassFilterLabel(frequency))}
        </option>
      ))}
    </select>
  );
}

/**
 * Translate a pass filter label with optional frequency interpolation.
 */
function translatePassFilterLabel(
  t: TFunction,
  label: PassFilterLabel
): string {
  return t(label.key, {
    ...ns,
    frequency: label.frequency,
  });
}
