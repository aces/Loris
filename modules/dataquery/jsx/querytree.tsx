import {useState} from 'react';
import {QueryGroup, QueryTerm} from './querydef';
import {CriteriaTerm} from './criteriaterm';
import {ButtonElement} from 'jsx/Form';
import {FullDictionary} from './types';
import {useEffect} from 'react'; // already present
import {useTranslation} from 'react-i18next'; // <-- ADD THIS

/**
 * Alternate background colour for a QueryTree
 *
 * @param {string} c - the current colour
 * @returns {string} - The next colour after c
 */
function alternateColour(c: string): string {
  if (c == 'rgb(255, 255, 255)') {
    return 'rgb(240, 240, 240)';
  }
  return 'rgb(255, 255, 255)';
}

/**
 * Recursively render a tree of AND/OR
 * conditions
 *
 * @param {object} props - React props
 * @param {React.CSSProperties} props.buttonStyle - CSS to add to buttons
 * @param {React.CSSProperties} props.buttonGroupStyle - CSS to add to groups of buttons
 * @param {string} props.backgroundColour - The colour to use for the background of this QueryTree
 * @param {QueryGroup} props.items - The QueryGroup to render into a tree
 * @param {boolean} props.subtree - True if this is a sub-tree
 * @param {React.MouseEventHandler<HTMLElement>} props.onDeleteHover - Callback for when hovering over the delete icon
 * @param {React.MouseEventHandler<HTMLElement>} props.onDeleteLeave - Callback for when no longer hovering over the delete icon
 * @param {React.MouseEventHandler<HTMLElement>} props.deleteItem - Callback for when delete is clicked.
 * @param {QueryGroup} props.activeGroup - The active group that a modal is managing
 * @param {function} props.newGroup - Callback to create a new group at the end of props.items
 * @param {function} props.newItem - Callback to create a new item (term) at the end of props.items
 * @param {function} props.removeQueryGroupItem - Callback that should remove item i from props.items and return a new QueryGroup
 * @param {function} props.setModalGroup - Callback that should set the group that a modal (managed by the parent) is managing
 * @param {object} props.mapModuleName - Function to map the backend module name to a user friendly name
 * @param {object} props.mapCategoryName - Function to map the backend category name to a user friendly name
 * @param {object} props.fulldictionary - The dictionary of all modules that have been loaded
 * @returns {React.ReactElement} - the react element
 */
function QueryTree(props: {
    buttonStyle?: React.CSSProperties,
    buttonGroupStyle?: React.CSSProperties,
    backgroundColour?: string,
    items: QueryGroup,
    subtree?: boolean,
    onDeleteHover?: React.MouseEventHandler<HTMLElement>,
    onDeleteLeave?: React.MouseEventHandler<HTMLElement>,
    deleteItem?: React.MouseEventHandler<HTMLElement>,
    activeGroup?: QueryGroup,
    newGroup?: (items: QueryGroup) => void,
    newItem?: (items: QueryGroup) => void,
    removeQueryGroupItem?: (items: QueryGroup, i: number) => QueryGroup,
    setModalGroup?: (newgroup: QueryGroup) => void,
    setDeleteItemIndex?: (index: number | null) => void,
    fulldictionary: FullDictionary,
    mapModuleName: (module: string) => string,
    mapCategoryName: (module: string, category: string) => string,
}) {
  const [deleteItemIndex, setDeleteItemIndex] = useState<number|null>(null);
  const {t} = useTranslation('dataquery'); // <-- ADD THIS

  useEffect(() => {
    // Reset strikethrough when group is empty or changed
    setDeleteItemIndex(null);
  }, [props.items.group.length]);

  /**
   * Render a single term of the QueryTree group.
   *
   * @param {QueryGroup|QueryTerm} item - The item to render from a group
   * @param {number} i - the index being rendered
   * @returns {React.ReactElement} - The react element
   */
  const renderitem =
        (item: QueryGroup|QueryTerm, i: number): React.ReactElement<any> => {
          const operator = i != props.items.group.length-1 ?
            props.items.operator : '';
          const style: React.CSSProperties = {
            display: 'flex' as const,
            flexDirection: 'column' as const,
            width: '100%',
          };
          const operatorStyle = {
            alignSelf: 'center',
            fontWeight: 'bold',
          };
          if (deleteItemIndex == i) {
            style.textDecoration = 'line-through';
          }

          /**
           * Deletes an item from the group and call the removeQueryGroupItem
           * callback.
           *
           * @returns {void}
           */
          const deleteItem = () => {
            if (props.removeQueryGroupItem) {
              const newquery = props.removeQueryGroupItem(
                props.items,
                i,
              );
              if (props.setModalGroup) {
                props.setModalGroup(newquery);
              }
              if (props.setDeleteItemIndex) {
                props.setDeleteItemIndex(null);
              }
            }
          };
          if (item instanceof QueryTerm) {
            const deleteIcon = props.removeQueryGroupItem ? (
              <div style={{alignSelf: 'center'}}>
                <i title={t('Delete item', {ns: 'dataquery'})}
                  className="fas fa-trash-alt"
                  onClick={deleteItem}
                  onMouseEnter={() => setDeleteItemIndex(i)}
                  onMouseLeave={() => setDeleteItemIndex(null)}
                  style={{cursor: 'pointer'}}
                />
              </div>
            ) : '';

            return <li key={i} style={style}>
              <div style={{display: 'flex'}}>
                <CriteriaTerm term={item}
                  mapModuleName={props.mapModuleName}
                  mapCategoryName={props.mapCategoryName}
                  fulldictionary={props.fulldictionary}
                />
                {deleteIcon}
              </div>
              <div style={operatorStyle}>{operator}</div>
            </li>;
          } else if (item instanceof QueryGroup) {
            const buttonStyle: React.CSSProperties = deleteItemIndex == i ? {
              textDecoration: 'line-through',
            } : {};

            return (<li key={i} style={style}>
              <div style={{background: props.backgroundColour}}>
                <QueryTree items={item}
                  buttonGroupStyle={props.buttonGroupStyle}
                  mapModuleName={props.mapModuleName}
                  mapCategoryName={props.mapCategoryName}
                  removeQueryGroupItem={
                    props.removeQueryGroupItem
                  }
                  activeGroup={props.activeGroup}
                  newItem={props.newItem}
                  newGroup={props.newGroup}
                  backgroundColour={
                    alternateColour(
                      props.backgroundColour
                                        || 'rgb(240, 240, 240)'
                    )
                  }
                  deleteItem={deleteItem}
                  buttonStyle={buttonStyle}
                  onDeleteHover={() => setDeleteItemIndex(i)}
                  onDeleteLeave={
                    () => setDeleteItemIndex(null)
                  }
                  subtree={true}
                  fulldictionary={props.fulldictionary}
                  setDeleteItemIndex={props.setDeleteItemIndex}
                />
              </div>
              <div style={operatorStyle}>{operator}</div>
            </li>);
          } else {
            console.error('Invalid tree');
          }
          return <li>{i}</li>;
        };

  const terms: React.ReactElement[] = props.items.group.map(renderitem);
  let warning;
  switch (props.items.group.length) {
  case 0:
    warning = <div className="alert alert-warning"
      style={{display: 'flex'}}>
      <i className="fas fa-exclamation-triangle"
        style={{
          fontSize: '1.5em',
          margin: 7,
          marginLeft: 10,
        }}></i>
      <div style={{alignSelf: 'center'}}>
        {t('Group does not have any items.', {ns: 'dataquery'})}
      </div>
    </div>;
    break;
  case 1:
    warning = <div className="alert alert-warning"
      style={{display: 'flex'}}>
      <i className="fas fa-exclamation-triangle"
        style={{
          fontSize: '1.5em',
          margin: 7,
          marginLeft: 10,
        }}></i>
      <div style={{alignSelf: 'center'}}>
        {t('Group only has 1 item. A group with only 1 item is equivalent to not having the group.', {ns: 'dataquery'})}
      </div>
    </div>;
    break;
  }

  /**
   * Handler to calls newItem callback onClick
   *
   * @param {React.MouseEvent} e - The event
   * @returns {void}
   */
  const newItemClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (props.newItem) {
      props.newItem(props.items);
    }
  };

  /**
   * Call newGroup callback onClick
   *
   * @param {React.MouseEvent} e - The event
   * @returns {void}
   */
  const newGroupClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (props.newGroup) {
      props.newGroup(props.items);
    }
  };

  const antiOperator = props.items.operator == 'and' ? 'or' : 'and';
  const style: React.CSSProperties= {};
  if (props.activeGroup == props.items) {
    style.background = 'pink';
  }

  let deleteGroupHTML;
  if (props.deleteItem) {
    deleteGroupHTML = (
      <div style={{alignSelf: 'center', marginLeft: 'auto'}}>
        <i className="fas fa-trash-alt"
          title={t('Delete Group', {ns: 'dataquery'})}
          onMouseEnter={props.onDeleteHover}
          onMouseLeave={props.onDeleteLeave}
          onClick={props.deleteItem}
          style={{cursor: 'pointer', marginLeft: 'auto'}} />
      </div>
    );
  }
  const marginStyle: React.CSSProperties = props.subtree === true ? {} : {
    margin: 0,
    padding: 0,
  };
  return (
    <div style={style}>
      <ul style={marginStyle}>
        {terms}
        <li style={{display: 'flex', width: '100%'}}>
          <div style={{...props.buttonGroupStyle, width: '100%'}}>
            <div style={{margin: 5}}>
              <ButtonElement
                label={t('Add "{{operator}}" condition to group', {ns: 'dataquery', operator: props.items.operator})}
                onUserInput={newItemClick}
                style={props.buttonStyle}
                columnSize='col-sm-12'
              />
            </div>
            <div style={{margin: 5}}>
              <ButtonElement
                label={t('New "{{antiOperator}}" subgroup', {ns: 'dataquery', antiOperator})}
                onUserInput={newGroupClick}
                style={props.buttonStyle}
                columnSize='col-sm-12'
              />
            </div>
            {warning}
            {deleteGroupHTML}
          </div></li>
      </ul>
    </div>
  );
}

export default QueryTree;
