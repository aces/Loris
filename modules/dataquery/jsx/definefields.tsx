import React, {useState, useEffect, useRef} from 'react';
import Select from 'react-select';
import FilterableSelectGroup from './components/filterableselectgroup';
import getDictionaryDescription from './getdictionarydescription';
import {CheckboxElement} from 'jsx/Form';
import {FullDictionary, FieldDictionary, DictionaryCategory} from './types';
import {CategoriesAPIReturn} from './hooks/usedatadictionary';
import {APIQueryField, VisitOption} from './types';


/**
 * Displays a single field to be selected for querying
 *
 * @param {object} props - react props
 * @param {APIQueryField?} props.selected - the selected field
 * @param {boolean} props.scrollTo - If true, scroll to this element on load.
 * @param {function} props.resetScrollTo - reset the scrollTo effect
 * @param {FieldDictionary} props.value - The dictionary for this field
 * @param {string} props.module - the module containing this field
 * @param {string} props.category - The category of this field
 * @param {string} props.item - The field name
 * @param {function} props.onFieldToggle - callback when the item is clicked
 * @param {function} props.onChangeVisitList - callback when the selected visits are changed for this item.
 * @param {string[]} props.defaultVisits - The default visits when the field is added
 * @returns {React.ReactElement} - A single field
 */
function QueryField(props: {
    selected: APIQueryField|undefined,
    scrollTo: boolean,
    resetScrollTo: () => void,
    value: FieldDictionary,
    module:string
    category:string
    item: string,
    onFieldToggle: (
        module: string,
        category: string,
        field: string,
        visits: string[]
    ) => void,
    onChangeVisitList: (
        module: string,
        category: string,
        field: string,
        visits: string[]
    ) => void,
    defaultVisits: string[],
}) {
  const item=props.item;
  const className = props.selected ?
    'list-group-item active' :
    'list-group-item';
  const value=props.value;
  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
      if (props.scrollTo == true && scrollRef.current !== null) {
          scrollRef.current.scrollIntoView({
              behavior: 'smooth',
          });
          props.resetScrollTo();
      }
  }, [props.scrollTo]);

  let visits;
  let selectedVisits: string[];

  if (value.scope === 'session') {
    /**
     * Callback for React Select to handle selected option
     * change
     *
     * @param {VisitOption[]} newvisits - The newly selected visits
     * @returns {void}
     */
    const selected = (newvisits: readonly VisitOption[]) => {
        props.onChangeVisitList(
            props.module,
            props.category,
            item,
            newvisits.map( (visit: VisitOption) => visit.value),
        );
    };

    const selectOptions: string[] = value.visits || [];

    if (props.selected && (typeof props.selected.visits !== 'undefined')) {
        selectedVisits = props.selected.visits;
    } else {
        selectedVisits = selectOptions.filter((visit: string) => {
            return props.defaultVisits.includes(visit);
        });
    }

    if (props.selected) {
        visits = <div onClick={(e) => e.stopPropagation()}>
            <h4>Visits</h4>
            <Select options={selectOptions.map((visit: string): VisitOption => {
                        return {value: visit, label: visit};
                    })
                }
                isMulti
                onChange={selected}
                placeholder='Select Visits'
                value={selectedVisits.map( (visit: string): VisitOption => {
                        return {value: visit, label: visit};
                    })
                }
                menuPortalTarget={document.body}
                styles={
                    {menuPortal:
                        /**
                         * Adds appropriate zIndex to the react select's base CSS
                         *
                         * @param {object} base - The current CSS
                         * @returns {object} New CSS with z-index added
                         */
                        (base) => ({...base, zIndex: 9999}),
                    }
                }
                closeMenuOnSelect={false}
            />
        </div>;
    }
  }
  const download = value.type == 'URI' ?
    <i className="fas fa-download" /> : null;
  return (
    <div className={className}
       ref={scrollRef}
       style={{
           cursor: 'pointer',
           display: 'flex',
           justifyContent: 'space-between',
       }}
       onClick={() => props.onFieldToggle(
         props.module,
         props.category,
         item,
         selectedVisits,
       )}>
         <dl>
           <dt>{item}</dt>
           <dd>{value.description} {download}</dd>
         </dl>
         {visits}
    </div>);
}

/**
 * Render the define fields tab
 *
 * @param {object} props - React props
 * @param {APIQueryField[]} props.selected - The currently selected fields
 * @param {function} props.setSelected - Function to set the currently selected fields
 * @param {function} props.onCategoryChange - Callback when the selected category changes
 * @param {function} props.onFieldToggle - Callback when an item is clicked in the field list
 * @param {function} props.onChangeVisitList - Callback when the visits are changed for a field
 * @param {function} props.onChangeDefaultVisits - Callback when the default visits are changed
 * @param {function} props.onAddAll - Callback when the "Add All" button is clicked
 * @param {function} props.onRemoveAll - Callback when the "Remove All" button is clicked
 * @param {function} props.onClearAll - Callback when the "Clear All" button is clicked
 * @param {string} props.module - The module of the currently selected category
 * @param {string} props.category - The currently selected category
 * @param {FullDictionary} props.fulldictionary - The dictionary of all elements
 * @param {function} props.removeField - callback to remove a single field
 * @param {string[]} props.defaultVisits - The default visits
 * @param {DictionaryCategory} props.displayedFields - The category currently selected to display
 * @param {CategoriesAPIReturn} props.allCategories - all categories that exist
 * @param {string[]} props.allVisits - All (non-phantom) visits for this LORIS instance
 * @returns {React.ReactElement} - The Define Fields page
 */
function DefineFields(props: {
    selected: APIQueryField[],
    onCategoryChange: (module: string, category: string) => void,
    setSelected: (newselected: APIQueryField[]) => void,
    fulldictionary: FullDictionary,
    displayedFields: DictionaryCategory,
    removeField: (module: string, item: string, field: string) => void,
    onClearAll: () => void,
    defaultVisits: string[],
    allCategories: CategoriesAPIReturn,
    allVisits: string[],
    onChangeDefaultVisits: (newvisits: readonly VisitOption[]) => void,
    module: string,
    category: string,
    onRemoveAll: (removeelements: APIQueryField[]) => void,
    onAddAll: (elements: APIQueryField[]) => void,
    onChangeVisitList: (
        module: string,
        category: string,
        field: string,
        visits: string[]
    ) => void,
    onFieldToggle: (
        module: string,
        category: string,
        field: string,
        visits: string[]
    ) => void,
}) {
  const [activeFilter, setActiveFilter] = useState('');
  const [syncVisits, setSyncVisits] = useState<boolean>(false);
  const [zoomTo, setZoomTo] = useState<string|null>(null);
  useEffect(() => {
      if (!syncVisits) {
          return;
      }
      let modifiedvisits = false;
      props.selected.forEach( (field: APIQueryField) => {
          // Valid visits according to the dictionary
          const category = props.fulldictionary[field.module][field.category];
          const dict = category[field.field];

          if (dict.scope == 'candidate') {
              return;
          }
          if (typeof dict.visits !== 'undefined') {
              const newvisits = dict.visits.filter((visit) => {
                  return props.defaultVisits.includes(visit);
              });
              field.visits = newvisits;
              modifiedvisits = true;
          }
      });
      if (modifiedvisits) {
          props.setSelected([...props.selected]);
      }
  }, [syncVisits, props.defaultVisits]);
  const displayed: string[] = Object.keys(
    props.displayedFields || {}
      ).filter((value) => {
      if (activeFilter === '') {
          // No filter set
          return true;
      }

      // Filter with a case insensitive comparison to either the description or
      // the field name displayed to the user
      const lowerFilter = activeFilter.toLowerCase();
      const desc = props.displayedFields[value].description;
      return (value.toLowerCase().includes(lowerFilter)
        || desc.toLowerCase().includes(lowerFilter));
  });

  const fields = displayed.map((item: string) => {
      /**
       * Return true if this element equals
       * the selected.
       *
       * @param {APIQueryField} element - The element
       * @returns {boolean} - true if equal
       */
      const equalField = (element: APIQueryField) => {
          return (element.module == props.module
              && element.category === props.category
              && element.field == item);
      };
      const selobj = props.selected.find(equalField);
      return <QueryField
                scrollTo={item == zoomTo}
                resetScrollTo={() => setZoomTo(null)}
                key={item}
                item={item}
                value={props.displayedFields[item]}
                selected={selobj}
                module={props.module}
                category={props.category}
                onFieldToggle={props.onFieldToggle}
                onChangeVisitList={props.onChangeVisitList}
                defaultVisits={props.defaultVisits}
            />;
  });

  /**
   * Set the filter that is being applied to displayed fields
   *
   * @param {React.ChangeEventHandler<HTMLInputElement>} e - The mouse event
   */
  const setFilter = (e: React.FormEvent<HTMLInputElement>) => {
      const target = e.target as HTMLInputElement;
      setActiveFilter(target.value);
  };

  /**
   * Add all items from the selected category to selected fields
   *
   * @returns {void}
   */
  const addAll = () => {
      const toAdd = displayed.map((item) => {
          const dict = props.displayedFields[item];
          const retObj: APIQueryField = {
              module: props.module,
              category: props.category,
              field: item,
          };
          // Only include defined visits which intersect
          // with the default ones, convert to the react-select
          // format used internally.
          if (dict.visits) {
              retObj['visits'] = dict.visits.filter((visit) => {
                  return props.defaultVisits.includes(visit);
              });
          }
          return retObj;
      });
      props.onAddAll(toAdd);
  };
  /**
   * Removes all items from the currently selected category
   *
   * @returns {void}
   */
  const removeAll = () => {
      const toRemove = displayed.map((item) => {
          const dict = props.displayedFields[item];
          return {
              module: props.module,
              category: props.category,
              field: item,
              dictionary: dict,
          };
      });
      props.onRemoveAll(toRemove);
  };

  let fieldList: React.ReactElement|null = null;
  if (props.category) {
      // Put into a short variable name for line length
      const mCategories = props.allCategories.categories[props.module];
      const cname = mCategories[props.category];
      let defaultVisits;
      if (props.defaultVisits) {
          const allVisits = props.allVisits.map((el) => {
              return {value: el, label: el};
          });
          const selectedVisits = props.defaultVisits.map((el) => {
              return {value: el, label: el};
          });
          defaultVisits = <div style={{paddingBottom: '1em', display: 'flex'}}>
                <h4 style={{paddingRight: '1ex'}}>Default Visits</h4>
                <Select options={allVisits}
                    isMulti
                    onChange={props.onChangeDefaultVisits}
                    placeholder='Select Visits'
                    menuPortalTarget={document.body}
                    styles={
                        {menuPortal:
                            /**
                             * Adds appropriate zIndex to the react select's base CSS
                             *
                             * @param {object} base - The current CSS
                             * @returns {object} New CSS with z-index added
                             */
                            (base) => ({...base, zIndex: 9999}),
                        }
                    }
                    value={selectedVisits}
                    closeMenuOnSelect={false}
                />
                <div>
                <CheckboxElement label='Sync with selected fields'
                    name="syncVisits"
                    value={syncVisits}
                    onUserInput={
                        (name: string, value: boolean) => setSyncVisits(value)
                    } />
                </div>
            </div>;
      }

      fieldList = (<div>
            <div style={{display: 'flex', flexWrap: 'wrap',
                justifyContent: 'space-between'}}>
                <h2>{cname} fields</h2>
                <div style={{marginTop: '1em',
                    display: 'flex',
                    flexWrap: 'nowrap',
                    flexDirection: 'column',
                    }}>
                    {defaultVisits}
                    <div className="input-group">
                        <input onChange={setFilter}
                            className='form-control'
                            type="text"
                            placeholder="Filter within category"
                            aria-describedby="input-filter-addon"
                            value={activeFilter} />
                        <span className="input-group-addon">
                                <span className="glyphicon glyphicon-search"/>
                        </span>
                    </div>
                    <div style={{margin: '1ex',
                        display: 'flex',
                        flexWrap: 'wrap',
                        flexDirection: 'row',
                        justifyContent: 'space-around',
                    }}>
                        <button type="button" className="btn btn-primary"
                            onClick={addAll}>
                            Add all
                        </button>
                        <button type="button" className="btn btn-primary"
                            onClick={removeAll}>
                            Remove all
                        </button>
                    </div>
                </div>
            </div>
            <div className="list-group">{fields}</div>
        </div>);
  }

  return (
    <div>
    <div style={{display: 'flex', flexWrap: 'nowrap'}}>
       <div style={{width: '80vw', padding: '1em'}}>
            <h1>Available Fields</h1>
            <FilterableSelectGroup groups={props.allCategories.categories}
              mapGroupName={(key) => props.allCategories.modules[key]}
              onChange={props.onCategoryChange}
            />
            {fieldList}
      </div>
      <div style={{
          padding: '1em',
          position: 'sticky',
          top: 0,
          maxHeight: '90vh',
          overflow: 'auto',
        }}>
        <div>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
                marginBottom: '1em',
            }}>
                <h2>Selected Fields</h2>
                <div>
                    <button type="button" className="btn btn-primary"
                        style={{marginBottom: 7}}
                        onClick={props.onClearAll}>Clear</button>
                </div>
            </div>
            <SelectedFieldList
                selected={props.selected}
                removeField={props.removeField}
                fulldictionary={props.fulldictionary}
                setSelected={props.setSelected}
                snapToView={
                    (module: string, category: string, item: string) => {
                        setZoomTo(item);
                        props.onCategoryChange(module, category);
                }}
            />
        </div>
      </div>
   </div>
   </div>);
}

/**
 * Render the selected fields
 *
 * @param {object} props - React props
 * @param {FullDictionary} props.fulldictionary - The fully loaded data dictionary for known modules
 * @param {function} props.snapToView - Function which will snap the item to the viewport, changing pages if necessary
 * @param {function} props.removeField - Remove a field from selected fields
 * @param {APIQueryField[]} props.selected - The currently selected fields
 * @param {function} props.setSelected - Function to set the currently selected fields
 * @returns {React.ReactElement} - The selected field list
 */
function SelectedFieldList(props: {
    fulldictionary: FullDictionary,
    snapToView: (module: string, item: string, field: string) => void,
    removeField: (module: string, item: string, field: string) => void,
    selected: APIQueryField[],
    setSelected: (newselected: APIQueryField[]) => void,
}) {
  const [removingIdx, setRemovingIdx] = useState<number|null>(null);

  const [draggingIdx, setDraggingIdx] = useState<number|null>(null);
  const [droppingIdx, setDroppingIdx] = useState<number|null>(null);

  /**
   * Move the currently selected item from draggingIdx to
   * droppingIdx.
   *
   * @returns {void}
   */
  const moveSelected = () => {
      if (draggingIdx=== null || droppingIdx === null) {
          return;
      }
      const newSelected: APIQueryField[] = props.selected;

      const removed: APIQueryField = newSelected.splice(draggingIdx, 1)[0];
      const newIdx: number|null = (droppingIdx||0 <= draggingIdx||0)
          ? droppingIdx
          : (droppingIdx - 1);

      if (newIdx == null) {
          return;
      }
      newSelected.splice(
              newIdx,
              0,
              removed,
              );
      props.setSelected([...newSelected]);
      setDroppingIdx(null);
      setDraggingIdx(null);
  };

  const fields = props.selected.map((item, i) => {
      /**
       * Removes an item from the selected
       *
       * @param {APIQueryField} item - The field to remove
       * @returns {void}
       */
      const removeField = (item: APIQueryField) => {
          props.removeField(item.module, item.category, item.field);
      };
      const style: React.CSSProperties = {display: 'flex',
                flexWrap: 'nowrap' as const,
                cursor: 'grab',
                justifyContent: 'space-between'};
      if (removingIdx === i) {
          style.textDecoration = 'line-through' as const;
      }
      if (droppingIdx === i) {
          style.borderTop = 'thin solid black';
      }
      if (draggingIdx == i) {
          style.background = '#f5f5f5';
      }
      let fieldvisits;
      if (item.visits) {
          const style = {
              fontStyle: 'italic',
              color: '#aaa',
              fontSize: '0.7em',
              marginLeft: 20,
          };
          fieldvisits = <dd style={style}>{item.visits.join(', ')}</dd>;
      }
      return (<div key={i} style={style}
                draggable="true"
                onClick={() => {
                    props.snapToView(item.module, item.category, item.field);
                }}
                onDragStart={() => {
                    setDraggingIdx(i);
                }}

                onDragEnd={() => {
                    setDraggingIdx(null);
                    setDroppingIdx(null);
                }}

                onDragEnter={() => {
                    setDroppingIdx(i);
                }}

                onDragOver ={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                }}
                onDrop={() => moveSelected()}
                >
        <div>
            <dt>{item.field}</dt>
            <dd style={{marginLeft: 20}}>{getDictionaryDescription(
                    item.module,
                    item.category,
                    item.field,
                    props.fulldictionary,
                )}</dd>
            {fieldvisits}
        </div>
        <div
            onMouseEnter={() => setRemovingIdx(i)}
            onMouseLeave={() => setRemovingIdx(null)}>
            <i
                className="fas fa-trash-alt" onClick={() => {
                    removeField(item);
                    setRemovingIdx(null);
                }}
                style={{cursor: 'pointer'}} />
        </div>
      </div>);
  });
  if (draggingIdx !== null) {
      // Add a sink after the last element, so that we can drop on
      // the end
      const style: React.CSSProperties = {height: 50};
      const nItems = fields.length;
      if (droppingIdx === nItems) {
          style.borderTop = 'thin solid black' as const;
      }
      fields.push(<div
        key={nItems} style={style}
        onDragEnter={() => setDroppingIdx(nItems) }
        onDragOver ={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
        }}
        onDrop={() => moveSelected()}>&nbsp;
        </div>);
  }

  return <div className="list-group">{fields}</div>;
}


export default DefineFields;
