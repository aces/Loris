import {FullDictionary} from './types';
import getDictionaryDescription from './getdictionarydescription';
import {useTranslation} from 'react-i18next';

/**
 * A single field to display
 *
 * @param {object} props - React props
 * @param {string} props.module - The module with the field
 * @param {string} props.category - The field's category
 * @param {string} props.fieldname - The field's field name
 * @param {FullDictionary} props.fulldictionary - The complete loaded dictionary
 * @param {function} props.mapModuleName - Mapper from module backend to frontend name
 * @param {function} props.mapCategoryName - Mapper from category backend to frontend name
 * @returns {React.ReactElement} - the react element
 */
function FieldDisplay(props: {
    module: string,
    category: string,
    fieldname: string,
    fulldictionary: FullDictionary,
    mapModuleName: (module: string) => string,
    mapCategoryName: (module: string, category: string) => string,
}) {
  const {t} = useTranslation('dataquery');
  const description = getDictionaryDescription(
    props.module,
    props.category,
    props.fieldname,
    props.fulldictionary,
  );

  return (<div>
    <div title={props.fieldname}>
      {description}
    </div>
    <div style={{fontSize: '0.8em', color: '#aaa'}}>
      {t('Category', {ns: 'dataquery'})}:
      {props.mapCategoryName(props.module, props.category)}
      &nbsp;({t('Module', {ns: 'dataquery'})}:
      {props.mapModuleName(props.module)})
    </div>
  </div>
  );
}
export default FieldDisplay;
