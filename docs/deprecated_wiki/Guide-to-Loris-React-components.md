<!-- Last updated: 2017/02/05 // Loris 17.1 -->

_Under construction_

>**Note**: this guide assumes a basic understanding of React concepts and lifecycle.  
>For React documentation **[click here](https://facebook.github.io/react/docs/hello-world.html)**.


You can find a set of reusable components under `jsx/` directory of your Loris installation.
The list is continuously expanding, so watch out for updates.


---

### Table of Contents
<!-- Remove "new" badges after 3 months of usage -->
1. [StaticDataTable.js](#staticdatatable)
2. [DynamicDataTable.js](#dynamicdatatable)
3. [Form.js](#form)
    - [FormElement](#formelement)
    - [SelectElement](#selectelement)
    - [TextboxElement](#textboxelement)
    - [TextareaElement](#textareaelement)
    - [DateElement](#dateelement)
    - [NumericElement](#numericelement)
    - [FileElement](#fileelement)
    - [StaticElement](#staticelement)
    - [ButtonElement](#buttonelement)
    - [LorisElement](#loriselement)
4. [FilterForm.js](#filterform) :new:
5. [Tabs.js](#tabs) :new:
6. [Panel.js](#panel) :new:
7. [Breadcrumbs.js](#breadcrumbs)
8. [PaginationLinks.js](#paginationlinks)
9. [Markdown.js](#markdown)
10. [MultiSelectDropdown.js](#multiselectdropdown) (Currently only used by DQT, ask Jordan for details)

----

### StaticDataTable

Static Data Table displays a set of data that is receives via props.  

**API**

Optional props are in `[]` brackets.

| Props                | Type       | Description                              |
| :------------------- | ---------- | ---------------------------------------- |
| `Headers`            | `array`    | Headers of the given table               |
| `Data`               | `array`    | Data to be shown in the table            |
| `[RowNumLabel]`      | `string`   | Header of the first column of every table (**Default**: 'No.') |
| `[getFormattedCell]` | `function` | **Signature**: `function formatColumn(column, cell, rowData, rowHeaders){}` <br> **Return**:  JSX element for a table cell |
| `[freezeColumn]`     | `string`   | Name of the column that stays in place when table is scrolled horizontally |
| `[RowNameMap]`       | ???        | ???                                      |
| `[Filter]`           | `object`   | Object used to filter displayed data     |


**Usage**

```js
<StaticDataTable
    Headers={['ID', 'First Name', 'Last Name']}
    Data=[[1, 'Ted', 'Mosby'], [2, 'Barney', 'Stinson'], [3, 'Robin', 'Scherbatsky']]
    getFormattedCell={formatColumn}
    freezeColumn="ID"
/>
```

>**Note**: `formatColumn()` is usually declared in a separate file, typically named `columnFormatter.js`

---

### DynamicDataTable

`DynamicDataTable` is a wrapper around `StaticDataTable`

Instead of raw `Data` and `Headers`, it expects a URL pointing to JSON data which it retrieves and passes down to `StaticDataTable`. All other properties are the same as in `StaticDataTable` as they are passed down to it.

**Usage**

```js
<DynamicDataTable
  DataURL="https://loris.ca/media/?format=json",
  getFormattedCell={formatColumn},
  freezeColumn="File Name"
/>
```

---

## Form

`Form.js` contains a collection of components commonly used to built interactive forms.

### FormElement

FormElement is a React wrapper around HTML `<form>` element.

**API**

| Props            | Type       | Description                              |
| ---------------- | ---------- | ---------------------------------------- |
| `name`           | `string`   | Form name                                |
| `[id]`           | `string`   | Form unique id                           |
| `[method]`       | `string`   | `GET` or `POST`                          |
| `[class]`        | `string`   | CSS class applied on `<form>` element    |
| `[columns]`      | `number`   | Number of columns in the form. Determines the layout of children elements. |
| `[formElements]` | `object`   | React elements rendered inside the `<form>` |
| `[onSubmit]`     | `function` | Callback function triggered on form submission |
| `[onUserInput]`  | `function` | Callback function triggered on input change in one of the form elements |

### SelectElement

SelectElement is a react wrapper around HTML `<select>`.

**API**

| Props            | Type                | Description                              |
| ---------------- | ------------------- | ---------------------------------------- |
| `name`           | `string`            | Element name. Must be consistent with values used on the backend. |
| `options`        | `object`            | Options displayed in the `<select>` dropdown |
| `[label]`        | `string`            | User friendly text describing `<select>` purpose. **Default**: `""` |
| `[value]`        | `string` or `array` | Selected value(s). **Default**: `undefined` |
| `[id]`           | `string`            | Element unique id. **Default**: `""`     |
| `[class]`        | `string`            | CSS class applied on `<form>` element. **Default**: `""` |
| `[multiple]`     | `bool`              | When set to `true` the element replicates native `HTML5` behaviour allowing user to select multiple elements in the dropdown. **Default**: `false` |
| `[disabled]`     | `bool`              | When set to `true` HTML5 `disabled` is applied to the element. **Default**: `false` |
| `[required]`     | `bool`              | When set to `true` HTML5 `required` is applied to the element. Additionally, a red 'asterisk' is displayed along the label. **Default**: `false` |
| `[emptyOption]`  | `bool`              | By default adds an empty option to every `<select>` dropdown. **Default**: `true` |
| `[hasError]`     | `bool`              | When set to `true` adds displays `errorMessage` and applies error styles to the element. **Default**: `false` |
| `[errorMessage]` | `string`            | The error message, displayed only if `hasError` is set to `true`. **Default**: `"The field is required!"` |
| `[onUserInput]`  | `function`          | Callback function triggered on input change |

### TextboxElement

TextboxElement is a react wrapper around HTML `<input type="text">`.

**API**

| Props           | Type       | Description                              |
| --------------- | ---------- | ---------------------------------------- |
| `name`          | `string`   | Element name. Must be consistent with values used on the backend. |
| `[label]`       | `string`   | User friendly text describing `<input typ="text" />` purpose. **Default**: `""` |
| `[value]`       | `string`   | Selected value(s). **Default**: `undefined` |
| `[id]`          | `string`   | Element unique id. **Default**: `""`     |
| `[disabled]`    | `bool`     | When set to `true` HTML5 `disabled` is applied to the element. **Default**: `false` |
| `[required]`    | `bool`     | When set to `true` HTML5 `required` is applied to the element. Additionally, a red 'asterisk' is displayed along the label. **Default**: `false` |
| `[onUserInput]` | `function` | Callback function triggered on input change |

### TextareaElement

TextareaElement element is a react wrapper around HTML `<textarea>`.

**API**

| Props           | Type       | Description                              |
| --------------- | ---------- | ---------------------------------------- |
| `name`          | `string`   | Element name. Must be consistent with values used on the backend. |
| `[label]`       | `string`   | User friendly text describing `<textarea>` purpose. **Default**: `""` |
| `[value]`       | `string`   | Selected value(s). **Default**: `undefined` |
| `[id]`          | `string`   | Element unique id. **Default**: `""`     |
| `[disabled]`    | `bool`     | When set to `true` HTML5 `disabled` is applied to the element. **Default**: `false` |
| `[required]`    | `bool`     | When set to `true` HTML5 `required` is applied to the element. Additionally, a red 'asterisk' is displayed along the label. **Default**: `false` |
| `[onUserInput]` | `function` | Callback function triggered on input change |

### DateElement

DateElement is a react wrapper around HTML `<input type="date">`.

**API**

| Props           | Type       | Description                              |
| --------------- | ---------- | ---------------------------------------- |
| `name`          | `string`   | Element name. Must be consistent with values used on the backend. |
| `[label]`       | `string`   | User friendly text describing purpose of the element. **Default**: `""` |
| `[value]`       | `string`   | Selected value(s). **Default**: `undefined` |
| `[id]`          | `string`   | Element unique id. **Default**: `""`     |
| `[disabled]`    | `bool`     | When set to `true` HTML5 `disabled` is applied to the element. **Default**: `false` |
| `[required]`    | `bool`     | When set to `true` HTML5 `required` is applied to the element. Additionally, a red 'asterisk' is displayed along the label. **Default**: `false` |
| `[onUserInput]` | `function` | Callback function triggered on input change |

### NumericElement

NumericElement is a react wrapper around HTML `<input type="number">`.

**API**

| Props           | Type       | Description                              |
| --------------- | ---------- | ---------------------------------------- |
| `name`          | `string`   | Element name. Must be consistent with values used on the backend. |
| `min`           | `number`   |                                          |
| `max`           | `number`   |                                          |
| `[label]`       | `string`   | User friendly text describing purpose of the element. **Default**: `""` |
| `[value]`       | `string`   | Selected value(s). **Default**: `undefined` |
| `[id]`          | `string`   | Element unique id. **Default**: `""`     |
| `[disabled]`    | `bool`     | When set to `true` HTML5 `disabled` is applied to the element. **Default**: `false` |
| `[required]`    | `bool`     | When set to `true` HTML5 `required` is applied to the element. Additionally, a red 'asterisk' is displayed along the label. **Default**: `false` |
| `[onUserInput]` | `function` | Callback function triggered on input change |

### FileElement

FileElement renders custom HTML used to upload files.

**API**

| Props            | Type       | Description                              |
| ---------------- | ---------- | ---------------------------------------- |
| `name`           | `string`   | Element name. Must be consistent with values used on the backend. |
| `[label]`        | `string`   | User friendly text describing purpose of the element. **Default**: `""` |
| `[value]`        | `string`   | Selected value(s). **Default**: `undefined` |
| `[id]`           | `string`   | Element unique id. **Default**: `""`     |
| `[disabled]`     | `bool`     | When set to `true` HTML5 `disabled` is applied to the element. **Default**: `false` |
| `[required]`     | `bool`     | When set to `true` HTML5 `required` is applied to the element. Additionally, a red 'asterisk' is displayed along the label. **Default**: `false` |
| `[hasError]`     | `bool`     | When set to `true` adds displays `errorMessage` and applies error styles to the element. **Default**: `false` |
| `[errorMessage]` | `string`   | The error message, displayed only if `hasError` is set to `true`. **Default**: `"The field is required!"` |
| `[onUserInput]`  | `function` | Callback function triggered on input change |

### StaticElement

StaticElement is a react wrapper around HTML `<label>`.

**API**

| Props     | Type                 | Description                              |
| --------- | -------------------- | ---------------------------------------- |
| `[label]` | `string`             | User friendly text describing purpose of the element. **Default**: `""` |
| `[text]`  | `string` or `object` | Selected value(s). **Default**: `undefined` |

### ButtonElement

ButtonElement  is a react wrapper around HTML `<button>`.

**API**

| Props           | Type       | Description                              |
| --------------- | ---------- | ---------------------------------------- |
| `[label]`       | `string`   | User friendly text describing purpose of the element. **Default**: `""` |
| `[type]`        | `string`   | HTML `<button/>` type. **Default**: `submit` |
| `[onUserInput]` | `function` | Callback function triggered on input change |

### LorisElement

Loris element is a generic component that receives a JSON representation of the element and renders an appropriate component from the list above. It infers the type of the element to be rendered from `element.type` property.

**Usage**
```js

// The element will typically be received in the PHP LorisForm format, 
// but can also be defined as a Javascript object.

const el = {
  type: "select",
  // other props
}

<LorisElement
  element={element}          // JSON representation of a form element
  onUserInput={function(){}} // Optional callback function
  value={"123"}              // Optional props supported by the target element.
/>
```

---

### FilterForm

**Overview**

FilterForm component renders a 'Selection Filter' panel with form elements, as seen in the screenshot below. 

![image](https://cloud.githubusercontent.com/assets/6627543/25719192/9507fa6e-30d6-11e7-8e74-d1649c3da3ea.png)

**Main functionality**

- Adds `onUpdate` callbacks to all children elements and passes them to `FormElement` for proper form rendering. 
- Updates `filter` object values to correspond to formElement values and propagates changes to parent component on every update. (This is particularly useful to filter `StaticDataTable` by filter values).
- Updates browser query string using `QueryString` utility class in order to have persistent data in form fields across page updates

**API**

| Props          | Type       | Description                              |
| -------------- | ---------- | ---------------------------------------- |
| `Module`       | `string`   | Module name                              |
| `filter`       | `object`   | An object containing the current values of form elements inside the filter |
| `formElements` | `object`   | List of form elements in `json` format   |
| `[id]`         | `string`   | Unique FilterForm id. **Default**: 'selection-filter' |
| `[height]`     | `string`   | The height of the selection filter panel. **Default**: 100% |
| `[title]`      | `string`   | Text displayed in the title bar of the panel. **Default**: 'Selection Filter' |
| `[onUpdate]`   | `function` | Callback function triggered on input change in one of the form elements |



**Usage**

1. Passing form elements as a `prop`. 
   - Particularly useful when converting existing Loris selection filters from PHP to React. 
   - In the example below, `this.state.Data.form` contains `JSON` encoded value of `$this->form->form` returned from PHP backend.

```js
// Renders a Selection Filter (as seen on the screenshot above)
// Form elements are passed to <FilterForm /> as a formElements prop.
<FilterForm
  Module="media"
  name="media_filter"
  id="media_filter"
  columns={3}
  formElements={this.state.Data.form}
  onUpdate={this.updateFilter}    // Update filter on FilterForm update
  filter={this.state.filter}	  // Keep track of filter in the parent class
>
  <br/>
  <ButtonElement type="reset" label="Clear Filters" />
</FilterForm>
```

2. Passing form elements as `children` of `<FilterForm />`

```js
// Renders a Selection Filter 
// Form elements are passed as children element of the <FilterForm />
<FilterForm
  Module="dicom_archive"
  name="dicom_filter"
  id="dicom_filter"
  columns={2}
  onUpdate={this.updateFilter}  // Update filter on FilterForm update
  filter={this.state.filter}    // Keep track of filter in the parent class
>
  <TextboxElement
    name={patientName}
    label="Patient Name"
  />
  <SelectElement
    name={site}
    label="Sites"
    options={siteList}
  />
  <ButtonElement
    label="Clear Filters"
    type="reset"
  />
</FilterForm>
```

---

### Tabs

`Tabs.js` consist of two React components `<Tabs/>` and `<TabPane/>` that are used together to render a Bootstrap tab UI with dynamic content. The screenshot below demonstrates an example of React tabs as used in `media` module.

![image](https://cloud.githubusercontent.com/assets/6627543/25721486/a094d35e-30de-11e7-999d-11ea96146a0e.png)

**API**

<u>Tabs</u>

| Props           | Type       | Description                              |
| --------------- | ---------- | ---------------------------------------- |
| `tabs`          | `array`    | Array of tab objects consisting of and ID and a label |
| `[defaultTab]`  | `string`   | ID of the tab to display on page load. Overridden by tab ID from `updateURL` if any. **Default**: the first tab from tabs array. |
| `[updateURL]`   | `bool`     | If set to `true`, the component will look for `#tab-id` in the browser query string in order to open appropriate tab on page load. **Default**: `false` |
| `[onTabChange]` | `function` | Callback function invoked on tab change  |



<u>TabPane</u>

| Props       | Type     | Description                              |
| ----------- | -------- | ---------------------------------------- |
| `TabID`     | `string` | Binds tab content pane, to the appropriate tab "button" |
| `[Title]`   | `string` | Optional title to display on top of the tab content |
| `activeTab` | `string` | Passed automatically by `<Tabs/>` to determine wether the tab content should be displayed based on the currently active tab value. |



**Usage**

1. Define an array of tabs with unique IDs and labels

```js
const tabList = [{id: "tab1", label: "This is tab title"}];`
```

2. Pass tabList as `<Tab>` prop and `<TabPane>` as a child

```js
<Tabs tabs={tabList} defaultTab="tab1">
  
  <TabPane TabId={tabList[0].id}>
  // Tab content goes here
  </TabPane>
  
  // Add a <TabPane/> component per tab
  
</Tabs>
```

**Note**: when a large number of tabs is required, the creation of tab panes can be automated in a loop. See [CandidateParameters](https://github.com/aces/Loris/blob/17.1-dev/modules/candidate_parameters/jsx/CandidateParameters.js) for an example of such usage. 

---

### Panel

Wrapper around bootstrap panel. Can be used as a standalone component or nested inside a parent (example FilterForm)

![image](https://cloud.githubusercontent.com/assets/6627543/25724859/748d6084-30eb-11e7-86c8-f4c1840c8114.png)

**API**

| Props             | Type      | Description                              |
| ----------------- | --------- | ---------------------------------------- |
| `[id]`            | `string`  | Panel id. Needs to be unique if multiple panels are used on the same page. **Default**: 'default-panel' |
| `[height]`        | `string`  | Height of the panel component. **Default**: '100%' |
| `[title]`         | `string`  | Text shown in the title bar of the panel. **Default**: If not specified, the title bar is not shown. |
| `[initCollapsed]` | `bool` | Initial state of the panel (collapsed = closed). **Default**: false |

**Usage**

```javascript
<Panel id="log_panel" title="Log Viewer">
  // Children components shown inside the panel
</Panel>
```

---

### Breadcrumbs

Wrapper around bootstrap breadcrumbs used for uniquely navigation on Loris website. 
For usage see `htdocs/main.tpl`

---

### PaginationLinks

Component used by `StaticDataTable` to add pagination to table results.

**API**

| Props          | Type       | Description                              |
| -------------- | ---------- | ---------------------------------------- |
| `Total`        | `number`   | Total number of table rows in the table  |
| `RowsPerPage`  | `number`   | Number of table rows per page            |
| `Active`       | `number`   | Index of the currently displayed page    |
| `onChangePage` | `function` | Callback function invoked on page change |

**Usage**

```js
<PaginationLinks
  Total={100}
  RowsPerPage={20}
  Active={1}
  onChangePage={this.changePage} // Defined within parent
/>
```

---

### Markdown

Markdown component is used to render markdown text into HTML by way of JSX.

Only very basic markdown is supported. In particular:

1. Paragraphs can be delineated with an empty line.
2. `**text**` or `__text__` will bold the text. `*text*` or `_text_` will italicize it.
3. Up to six header levels can be supported by starting a paragraph with (up to 6) `#` characters.
4. Links can be added with `[text](url)`

This should be enough to write help documents in Markdown, even without the more complicated features that markdown should support.

**API**

| Props          | Type       | Description                              |
| -------------- | ---------- | ---------------------------------------- |
| `content`      | `string`   | A string containing text in markdown format |


---

### MultiSelectDropdown
Used uniquely by Data Query Tool. 
- For generic `<select/>` and multiselect dropdown, use `SelectElement` from `Form.js`
- To investigate functionality of `MultiSelectDropdown`, see [Jordan](https://github.com/jstirling91)

