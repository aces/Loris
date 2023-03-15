import {createRoot} from 'react-dom/client';
import {useEffect, useState} from 'react';
import swal from 'sweetalert2';

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

function ConfigurationSection(props) {
    const [categoryItems, setCategoryItems] = useState(false);
    useEffect(() => {
        if (props.activeCategory === false) {
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
            console.log(data);
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

function ItemDisplay(props) {
    return <div className="form-group" style={{display: 'flex'}}>
        <div style={{width: '25%'}} title={props.Description}>
            <label className="control-label">
                {props.Label}
            </label>
        </div>
        <div style={{width: '75%'}}>Data stuff goes here.</div>
    </div>;
}
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
function ConfigurationIndex(props) {
    const [categories, setCategories] = useState([]);
    const [activeCategory, setActiveCategory] = useState(false);
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
window.addEventListener('load', () => {
  const root = createRoot(document.getElementById('lorisworkspace'));
  root.render(
    <ConfigurationIndex
      hasPermission={loris.userHasPermission}
      BaseURL={loris.BaseURL}
    />
  );
});
