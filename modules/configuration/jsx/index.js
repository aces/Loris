import {createRoot} from 'react-dom/client';
import {useEffect, useState} from 'react';
import swal from 'sweetalert2';
import PropTypes from 'prop-types';

function IntroText(props) {
    return <div>
        <p>Please enter the various configuration variables into the
           fields below.
        </p>
        <p>For information on how to configure LORIS, please refer to the
           Help section and/or the Developer's guide.</p>
        <p>To configure study cohorts&nbsp;
            <a href={props.BaseURL + '/configuration/cohort/'}>click here</a>.
        </p>
        <p>To configure study projects&nbsp;
            <a href={props.BaseURL + '/configuration/project/'}>click here</a>.
        </p>
    </div>;
}
IntroText.propTypes = {
    BaseURL: PropTypes.string.isRequired,
};

function CategorySelection(props) {
    const catlist = props.categories.map((item) => {
            return <li key={item.Name}
                       className={item.Name == props.active ? 'active' : ''}>
                            <a href={'#' + item.Name}
                               onClick={() =>
                                    props.setActive(item.Name)}
                            >{item.Label}</a>
                   </li>;
    });
    return <div>
        <ul
            className='nav nav-pills nav-stacked'
            role='tablist'
            data-tabs='tabs'>
            {catlist}
        </ul>
    </div>;
}
CategorySelection.propTypes = {
    categories: PropTypes.array.isRequired,
    active: PropTypes.string,
    setActive: PropTypes.func,
};

function ConfigurationSection(props) {
    const [categoryItems, setCategoryItems] = useState([]);
    useEffect(() => {
        if (props.activeCategory === '') {
            // not yet loaded
            return;
        }
        fetch(props.BaseURL + '/configuration/categories/'
            + props.activeCategory)
        .then((resp) => {
            if (!resp.ok) {
                throw new Error(
                    'Could not retrieve category ' + props.activeCategory
                );
            };
            return resp.json();
        })
        .then((data) => {
            setCategoryItems(data.category);
        }).catch((error) => {
            swal.fire('Configuration Error!', error.toString(), 'error');
        });
    }, [props.activeCategory]);

    return <div style={{display: 'flex'}}>
        <CategorySelection
           active={props.activeCategory}
           setActive={props.setActiveCategory}
           categories={props.categories}
           BaseURL={props.BaseURL}
        />
        <CategoryDisplay
           items={categoryItems}
           BaseURL={props.BaseURL}
           Instruments={props.Instruments}
           ScanTypes={props.ScanTypes}
        />
    </div>;
}

ConfigurationSection.propTypes = {
    BaseURL: PropTypes.string.isRequired,

    activeCategory: PropTypes.string,
    setActiveCategory: PropTypes.func,
    categories: PropTypes.array,

    Instruments: PropTypes.object,
    ScanTypes: PropTypes.object,
};

function ItemDisplay(props) {
    if (props.AllowMultiple) {
        return <MultiItemDisplay
                    DataType={props.DataType}
                    Name={props.Name}
                    Label={props.Label}
                    disabled={props.Disabled}
                    Values={props.Value || []}

                    Instruments={props.Instruments}
                    ScanTypes={props.ScanTypes}
                />;
    }

    switch (props.DataType) {
        case 'path': // fallthrough
        case 'web_path': // fallthrough
        case 'text':
            return <TextboxElement
                     name={props.Name}
                     label={props.Label}
                     disabled={props.Disabled}
                     value={props.Value}
                   />;
        case 'boolean':
            return <RadioElement
                     name={props.Name}
                     label={props.Label}
                     disabled={props.Disabled}
                     checked={props.Value ? 'yes' : 'no'}
                     options={{'yes': 'Yes', 'no': 'No'}}
                   />;
        case 'email':
            return <EmailElement
                     name={props.Name}
                     label={props.Label}
                     disabled={props.Disabled}
                     value={props.Value}
                   />;
        case 'textarea':
            return <TextareaElement
                     name={props.Name}
                     label={props.Label}
                     disabled={props.Disabled}
                     value={props.Value}
                   />;
        case 'date_format':
            return <SelectElement
                     name={props.Name}
                     label={props.Label}
                     options={
                        {
                            'Ymd': 'Ymd (EX: 2015-12-28)',
                            'Ym': 'Ym (EX: 2015-12',
                        }
                     }
                     disabled={props.Disabled}
                     value={props.Value}
                />;
        case 'lookup_center':
            return <SelectElement
                     name={props.Name}
                     label={props.Label}
                     options={
                        {
                            'PatientID': 'PatientID',
                            'PatientName': 'PatientName',
                        }
                     }
                     disabled={props.Disabled}
                     value={props.Value}
                />;
        case 'log_level':
            return <SelectElement
                     name={props.Name}
                     label={props.Label}
                     options={
                        {
                            'none': 'None',
                            'debug': 'Debug',
                            'info': 'Info',
                            'notice': 'Notice',
                            'warning': 'Warning',
                            'error': 'Error',
                            'critical': 'Critical',
                            'alert': 'Alert',
                            'emergency': 'Emergency',
                        }
                     }
                     disabled={props.Disabled}
                     value={props.Value}
                />;
        case 'instrument':
            return <SelectElement
                     name={props.Name}
                     label={props.Label}
                     options={props.Instruments}
                     disabled={props.Disabled}
                     value={props.Value}
                />;
        case 'scan_type':
            return <SelectElement
                     name={props.Name}
                     label={props.Label}
                     options={props.ScanTypes}
                     disabled={props.Disabled}
                     value={props.Value}
                />;
        default:
            throw new Error('Invalid DataType ' + props.DataType);
    }
}
ItemDisplay.propTypes = {
    Name: PropTypes.string,
    Description: PropTypes.string,
    Label: PropTypes.string,

    DataType: PropTypes.string,
    AllowMultiple: PropTypes.bool,

    Disabled: PropTypes.bool,
    Value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.array,
        PropTypes.bool,
    ]),

    Instruments: PropTypes.object,
    ScanTypes: PropTypes.object,
};

function MultiItemDisplay(props) {
    // Use the same bootstrap styling as the elements in jsx/Form.js to ensure
    // the alignment is the same.
    const rows = props.Values.map((item, i) => {
        let input;
        switch (props.DataType) {
        case 'instrument':
            input = <SelectElement
                     name={''}
                     label={''}
                     options={props.Instruments}
                     disabled={props.Disabled}
                     value={item}
                />;
            break;
        case 'scan_type':
            input = <SelectElement
                     name={''}
                     label={''}
                     options={props.ScanTypes}
                     disabled={props.Disabled}
                     value={item}
                />;
            break;
        case 'text':
            input = <TextboxElement
                     name={''}
                     label={''}
                     disabled={props.Disabled}
                     value={item}
                />;
            break;
        default:
            // These are the only 3 that we currently have so the only
            // three types of AllowMultiple items we need to support
            throw new Error(
                'Unhandled AllowMultiple element datatype' + props.DataType
            );
        }

        return (
            <div className="row" key={i}>
                <div className="col-sm-11">{input}</div>
                <div className="col-sm-1">
                    <button className="btn btn-success add" type="button">
                        <span className="glyphicon glyphicon-remove"></span>
                    </button>
                </div>
            </div>
        );
    });
    rows.push(<div className="row" key="newItem">
                <div className="col-sm-11">&nbsp;</div>
                <div className="col-sm-1">
                    <button className="btn btn-success remove" type="button">
                        <span className="glyphicon glyphicon-plus"></span>
                    </button>
                </div>
    </div>);
    return (
      <div className="row form-group">
          <label className="col-sm-3 control-label" htmlFor={props.Label}>
              {props.Label}
          </label>
          <div className='col-sm-9'>{rows}</div>
      </div>
    );
}

MultiItemDisplay.propTypes = {
    Label: PropTypes.string,
    Values: PropTypes.array,
    DataType: PropTypes.string,

    Disabled: PropTypes.bool,

    Instruments: PropTypes.object,
    ScanTypes: PropTypes.object,
};

function CategoryDisplay(props) {
    return <div>{props.items ? props.items.map((item) => {
                return <ItemDisplay key={item.ID}
                            Name={item.Name}
                            Description={item.Description}
                            Label={item.Label}

                            DataType={item.DataType}
                            AllowMultiple={item.AllowMultiple}

                            Disabled={item.Disabled}
                            Value={item.Value}
                            Instruments={props.Instruments}
                            ScanTypes={props.ScanTypes}
                    />;
            }): ''}
            </div>;
}
CategoryDisplay.propTypes = {
    items: PropTypes.array,
    Instruments: PropTypes.object,
    ScanTypes: PropTypes.object,
};

function ConfigurationIndex(props) {
    const [categories, setCategories] = useState([]);
    const [instruments, setInstruments] = useState({});
    const [scantypes, setScanTypes] = useState({});
    const [activeCategory, setActiveCategory] = useState('');
    useEffect(() => {
        fetch(props.BaseURL + '/configuration/categories')
        .then((resp) => {
            if (!resp.ok) {
                throw new Error('Could not retrieve configuration categories');
            };
            return resp.json();
        })
        .then((data) => {
            setCategories(data.categories);
            setInstruments(data.instruments);
            setScanTypes(data.scan_types);
            if (data.categories.length >= 1) {
                setActiveCategory(data.categories[0].Name);
            }
        }).catch((error) => {
            console.error(error);
            swal.fire('Configuration Error!', error.toString(), 'error');
        });
    }, []);
    return <div>
            <IntroText BaseURL={props.BaseURL} />
            <ConfigurationSection
                activeCategory={activeCategory}
                setActiveCategory={setActiveCategory}
                categories={categories}
                BaseURL={props.BaseURL}
                Instruments={instruments}
                ScanTypes={scantypes}
            />
    </div>;
}
ConfigurationIndex.propTypes = {
    BaseURL: PropTypes.string.isRequired,
};

window.addEventListener('load', () => {
  const root = createRoot(document.getElementById('lorisworkspace'));
  root.render(
    <ConfigurationIndex
      BaseURL={loris.BaseURL}
    />
  );
});
