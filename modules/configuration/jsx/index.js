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
        />
    </div>;
}

ConfigurationSection.propTypes = {
    BaseURL: PropTypes.string.isRequired,

    activeCategory: PropTypes.string,
    setActiveCategory: PropTypes.func,
    categories: PropTypes.array,
};

function ItemDisplay(props) {
    return <div className="form-group" style={{display: 'flex'}}>
        <div style={{width: '25%'}} title={props.Description}>
            <label className="control-label">
                {props.Label}
            </label>
        </div>
        <div style={{width: '75%'}}>
            <ItemValue DataType={props.DataType}
                AllowMultiple={props.AllowMultiple}
                Disabled={props.Disabled}
                Value={props.Value}
            />
        </div>
    </div>;
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
    ]),
};

function ItemValue(props) {
    if (props.AllowMultiple) {
        console.error('Multiple not implemented');
        return <div>Multiple not implemented</div>;
    }
    switch (props.DataType) {
        case 'text':
            return <TextElement label="" />;
        case 'boolean':
        case 'email':
        case 'instrument':
        case 'textarea':
        case 'scan_type':
        case 'date_format':
        case 'lookup_center':
        case 'path':
        case 'web_path':
        case 'log_level':
        console.error(props.DataType, ' not implemented');
        return <div>{props.DataType} not implemented</div>;
        default:
            throw new Error('Invalid DataType ' + props.DataType);
    }
}
ItemValue.propTypes = {
    DataType: PropTypes.string.isRequired,
    AllowMultiple: PropTypes.string.isRequired,
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
                    />;
            }): ''}
            </div>;
}
CategoryDisplay.propTypes = {
    items: PropTypes.array,
};

function ConfigurationIndex(props) {
    const [categories, setCategories] = useState([]);
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
