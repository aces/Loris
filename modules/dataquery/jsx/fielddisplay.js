import getDictionaryDescription from './getdictionarydescription';

/**
 * A single field to display
 *
 * @param {object} props - React props
 *
 * @return {ReactDOM}
 */
function FieldDisplay(props) {
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
                    {props.mapCategoryName(props.module, props.category)}
                    &nbsp;({props.mapModuleName(props.module)})
                </div>
            </div>
   );
}
export default FieldDisplay;
