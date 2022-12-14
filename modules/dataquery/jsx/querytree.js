import {useState} from 'react';
import {QueryGroup, QueryTerm} from './querydef';
import CriteriaTerm from './criteriaterm';


/**
 * Alternate background colour for a QueryTree
 *
 * @param {string} c - the current colour
 *
 * @return {string}
 */
function alternateColour(c) {
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
 *
 * @return {ReactDOM}
 */
function QueryTree(props) {
    let terms;
    const [deleteItemIndex, setDeleteItemIndex] = useState(null);

    const renderitem = (item, i) => {
        const operator = i != props.items.group.length-1 ?
            props.items.operator : '';
        let style = {
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
        };
        const operatorStyle = {
            alignSelf: 'center',
            fontWeight: 'bold',
        };
        if (deleteItemIndex == i) {
            style.textDecoration = 'line-through';
        }

        const deleteItem = () => {
            const newquery = props.removeQueryGroupItem(
                    props.items,
                    i,
            );
            if (props.setModalGroup) {
                props.setModalGroup(newquery);
            }
        };
        if (item instanceof QueryTerm) {
            const deleteIcon = props.removeQueryGroupItem ? (
                <div style={{alignSelf: 'center'}}>
                    <i title="Delete item"
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
            const buttonStyle = deleteItemIndex == i ? {
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
                                    alternateColour(props.backgroundColour)
                                }
                                deleteItem={deleteItem}
                                buttonStyle={buttonStyle}
                                onDeleteHover={() => setDeleteItemIndex(i)}
                                onDeleteLeave={
                                        () => setDeleteItemIndex(null)
                                }
                                subtree={true}
                                fulldictionary={props.fulldictionary}

                                />
                    </div>
                    <div style={operatorStyle}>{operator}</div>
            </li>);
        } else {
            console.error('Invalid tree');
        }
        return <li>{i}</li>;
    };

    terms = props.items.group.map(renderitem);
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
                Group does not have any items.
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
            Group only has 1 item. A group with only 1 item is equivalent
            to not having the group.
            </div>
        </div>;
        break;
    }
    const newItemClick = (e) => {
        e.preventDefault();
        props.newItem(props.items);
    };
    const newGroupClick = (e) => {
        e.preventDefault();
        props.newGroup(props.items);
    };

    const antiOperator = props.items.operator == 'and' ? 'or' : 'and';
    const style = {};
    if (props.activeGroup == props.items) {
        style.background = 'pink';
    }

    let deleteGroupHTML;
    if (props.deleteItem) {
        deleteGroupHTML = (
            <div style={{alignSelf: 'center', marginLeft: 'auto'}}>
                <i className="fas fa-trash-alt"
                    title='Delete Group'

                    onMouseEnter={props.onDeleteHover}
                    onMouseLeave={props.onDeleteLeave}
                    onClick={props.deleteItem}
                    style={{cursor: 'pointer', marginLeft: 'auto'}} />
            </div>
        );
    }
    const marginStyle = props.subtree === true ? {} : {
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
                    label={'Add "' + props.items.operator
                        + '" condition to group'}
                    onUserInput={newItemClick}
                    style={props.buttonStyle}
                    columnSize='col-sm-12'
                  />
              </div>
              <div style={{margin: 5}}>
                  <ButtonElement
                    label={'New "' + antiOperator + '" subgroup'}
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
