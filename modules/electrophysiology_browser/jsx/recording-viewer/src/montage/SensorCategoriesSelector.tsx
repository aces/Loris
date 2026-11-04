import {useCallback} from 'react';
import {useTranslation} from 'react-i18next';
import {
  ChannelInfo, ChannelMetadata, Sensor, SensorType,
} from '../domain/types';
import MultiSelectDropdownButton
  from '../../../common/MultiSelectDropdownButton';
import {
  getSensorCategoryKey,
  getSensorCategoryColor,
  SensorCategory,
  getSensorCategory,
} from './utils';

/**
 * The map of all sensor categories.
 */
export type SensorCategoryMap = Record<string, SensorCategoryInfo>;

/**
 * Information about a sensor category.
 */
export type SensorCategoryInfo = {
  sensorType: SensorType,
  channelType?: string,
  sensorsCount: number,
}

/**
 * Iterate over all sensors to get the possible sensor categories.
 */
export function createSensorCategoryMap(
  sensors: Sensor[],
  rawChannels: ChannelMetadata[],
  bidsChannels: ChannelInfo[],
): SensorCategoryMap {
  const categories: SensorCategoryMap = {};
  for (const sensor of sensors) {
    const category = getSensorCategory(sensor, rawChannels, bidsChannels);

    const categoryKey = getSensorCategoryKey(category);
    if (!(categoryKey in categories)) {
      categories[categoryKey] = {
        ...category,
        sensorsCount: 0,
      };
    }

    categories[categoryKey].sensorsCount += 1;
  }

  return categories;
}

/**
 * A dropdown button component that allows to select which sensors to show or
 * hide dependending on their sensor type and associated channel type.
 */
function SensorCategoriesSelector({
  categories,
  hiddenCategories,
  setHiddenCategories,
}: {
  categories: SensorCategoryMap,
  hiddenCategories: Set<string>,
  setHiddenCategories: React.Dispatch<React.SetStateAction<Set<string>>>,
}) {
  const {t} = useTranslation();

  const toggleCategory = useCallback((category: SensorCategory) => {
    setHiddenCategories((currentHiddenCategories) => {
      const categoryKey = getSensorCategoryKey(category);
      const hiddenCategories = new Set(currentHiddenCategories);
      if (!hiddenCategories.delete(categoryKey)) {
        hiddenCategories.add(categoryKey);
      }

      return hiddenCategories;
    });
  }, []);

  return (
    <MultiSelectDropdownButton
      label={t('Sensor Types')}
      className="btn btn-xs btn-default"
      align="right"
      options={Object.entries(categories).map(([key, category]) => ({
        key,
        value: {
          sensorType: category.sensorType,
          channelType: category.channelType,
        },
        label: <SensorCategoryLabel category={category} />,
        selected: !hiddenCategories.has(key),
      }))}
      onToggle={toggleCategory}
    />
  );
}

/**
 * A component for the label of a sensor category.
 */
function SensorCategoryLabel({category}: {category: SensorCategoryInfo}) {
  const {t} = useTranslation();

  const getSensorTypeName = useCallback((sensorType: SensorType) => {
    switch (sensorType) {
    case 'electrode':
      return t('EEG Electrode');
    case 'meg-sensor':
      return t('MEG Sensor');
    case 'head-shape-point':
      return t('Head Shape Point');
    }
  }, [t]);

  const categoryColor = getSensorCategoryColor(
    category.sensorType,
    category.channelType,
  );

  const sensorType = getSensorTypeName(category.sensorType);
  const channelType = category.channelType && ` — ${category.channelType}`;

  return (
    <>
      <span style={{
        display: 'inline-block',
        width: '0.9em',
        height: '0.9em',
        borderRadius: '50%',
        backgroundColor: categoryColor,
      }} />
      &nbsp;
      {sensorType}
      {channelType}
      &nbsp;
      ({category.sensorsCount})
    </>
  );
}

export default SensorCategoriesSelector;
