import React, {useState, useEffect, useRef} from 'react';
import {FieldDictionary, DictionaryCategory} from '../types';
import {APIQueryField} from '../types';

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
 * @param {string[]} props.defaultVisits - The default visits when the field is added
 * @returns {React.ReactElement} - A single field
 */
function CategoryFieldItem(props: {
    selected: APIQueryField|undefined,
    scrollTo: boolean,
    resetScrollTo: () => void,
    value: FieldDictionary,
    module: string
    category: string
    item: string,
    onFieldToggle: (
        module: string,
        category: string,
        field: string,
        visits: string[]
    ) => void,
    defaultVisits: string[],
}) {
  const item = props.item;
  const className = props.selected ?
    'list-group-item active' :
    'list-group-item';
  const value = props.value;
  const scrollRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (props.scrollTo == true && scrollRef.current !== null) {
      scrollRef.current.scrollIntoView({
        behavior: 'smooth',
      });
      props.resetScrollTo();
    }
  }, [props.scrollTo]);

  // Visits will be handled in a separate component
  let selectedVisits: string[] = [];
  
  const download = value.type == 'URI' ?
    <i className="fas fa-download" /> : null;
    
  return (
    <div className={className}
      ref={scrollRef}
      style={{
        cursor: 'pointer',
        display: 'flex',
        justifyContent: 'space-between',
        transition: 'background-color 0.2s ease',
        paddingLeft: '15px',
        paddingRight: '15px',
        marginBottom: '5px'
      }}
      onMouseEnter={(e) => {
        if (!props.selected) {
          e.currentTarget.style.backgroundColor = '#f5f5f5';
        }
      }}
      onMouseLeave={(e) => {
        if (!props.selected) {
          e.currentTarget.style.backgroundColor = '';
        }
      }}
      onClick={() => props.onFieldToggle(
        props.module,
        props.category,
        item,
        selectedVisits,
      )}>
      <dl style={{
        margin: '0', 
        lineHeight: '1.2'
      }}>
        <dt style={{margin: '0', fontSize: '0.9em'}}>{value.description}</dt>
        <dd style={{margin: '0', marginTop: '2px', fontSize: '0.75em', color: '#666'}}>
          {item} {download}
        </dd>
      </dl>
    </div>
  );
}

/**
 * CategoryFields Component - Displays fields for a selected category
 *
 * @param {object} props - React props
 * @param {string} props.selectedModule - The currently selected module
 * @param {string} props.selectedCategory - The currently selected category
 * @param {DictionaryCategory} props.fields - The fields for the selected category
 * @param {APIQueryField[]} props.selectedFields - Currently selected fields
 * @param {function} props.onFieldToggle - Callback when a field is toggled

 * @param {string[]} props.defaultVisits - Default visits for fields
 * @returns {React.ReactElement} - The CategoryFields component
 */
function CategoryFields(props: {
    selectedModule: string,
    selectedCategory: string,
    fields: DictionaryCategory,
    selectedFields: APIQueryField[],
    onFieldToggle: (
        module: string,
        category: string,
        field: string,
        visits: string[]
    ) => void,
    defaultVisits: string[],
}) {
  const [activeFilter, setActiveFilter] = useState('');
  const [zoomTo, setZoomTo] = useState<string|null>(null);

  // Don't render if no category is selected
  if (!props.selectedCategory || !props.fields) {
    return (
      <div style={{
        textAlign: 'center', 
        padding: '2em', 
        color: '#666',
        fontStyle: 'italic'
      }}>
        Select a category to view its fields
      </div>
    );
  }

  const displayed: string[] = Object.keys(props.fields || {}).filter((value) => {
    if (activeFilter === '') {
      return true;
    }

    const lowerFilter = activeFilter.toLowerCase();
    const desc = props.fields[value].description;
    return (value.toLowerCase().includes(lowerFilter)
        || desc.toLowerCase().includes(lowerFilter));
  });

  const fields = displayed.map((item: string) => {
    const equalField = (element: APIQueryField) => {
      return (element.module == props.selectedModule
              && element.category === props.selectedCategory
              && element.field == item);
    };
    const selobj = props.selectedFields.find(equalField);
    
    return <CategoryFieldItem
      scrollTo={item == zoomTo}
      resetScrollTo={() => setZoomTo(null)}
      key={item}
      item={item}
      value={props.fields[item]}
      selected={selobj}
      module={props.selectedModule}
      category={props.selectedCategory}
      onFieldToggle={props.onFieldToggle}
      defaultVisits={props.defaultVisits}
    />;
  });

  const setFilter = (e: React.FormEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    setActiveFilter(target.value);
  };

  return (
    <div>
      <div className="input-group" style={{marginBottom: '10px'}}>
        <input onChange={setFilter}
          className='form-control'
          type="text"
          placeholder="Type a field name here"
          aria-describedby="input-filter-addon"
          value={activeFilter} />
        <span className="input-group-addon">
          <span className="glyphicon glyphicon-search"/>
        </span>
      </div>
      
      <div className="list-group" style={{
        maxHeight: '40vh',
        overflowY: 'auto',
        border: '1px solid #ddd'
      }}>
        {fields}
      </div>
    </div>
  );
}

export default CategoryFields;