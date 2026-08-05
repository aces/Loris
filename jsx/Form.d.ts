import {ReactNode} from 'react';

type formElement = {
    name: string
    type: string
};
type formElementProps = {
    name?: string
    id?: string
    method?: 'POST' | 'GET' = 'POST',
    action?: string = '',
    class?: string
    columns?: number
    formElements?: {[elementName: string]: formElement}
    onSubmit: (FormEvent) => void
    onUserInput?: (name: string, value: string) => void
    children: ReactNode
    fileUpload?: boolean = false
};
/**
 * FormElement class. See Form.js
 */
export class FormElement {
    props: formElementProps
    state: any
    context: object
    refs: {[key: string]: ReactInstance}

    /**
     * Construct a FormElement
     *
     * @param {formElementProps} props - React props
     */
    constructor(props: formElementProps)

    /**
     * React lifecycle method
     *
     * @returns {ReactNode} - the element
     */
    render(): ReactNode

    /**
     * React lifecycle method
     *
     * @param {object} newstate - the state to override
     */
    setState(newstate: object): void

    /**
     * React lifecycle method.
     */
    forceUpdate(): void
}


type fieldsetElementProps = {
    columns?: number;
    name?: string;
    legend: string;
    children: ReactNode;
}
/**
 * FieldsetElement class. See Form.js
 */
export class FieldsetElement {
    props: fieldsetElementProps
    state: any
    context: object
    refs: {[key: string]: ReactInstance}

    /**
     * Construct a FieldsetElement
     *
     * @param {fieldsetElementProps} props - React props
     */
    constructor(props: fieldsetElementProps)

    /**
     * React lifecycle method
     *
     * @returns {ReactNode} - the element
     */
    render(): ReactNode

    /**
     * React lifecycle method
     *
     * @param {object} newstate - the state to override
     */
    setState(newstate: object): void

    /**
     * React lifecycle method.
     */
    forceUpdate(): void
}

type selectElementProps = {
    name: string
    options: {[name: string]: string}
    disabledOptions?: {[name: string]: string}
    label: string
    value: string|string[]
    id?: string
    multiple?: boolean
    disabled?: boolean
    required?: boolean
    emptyOption?: boolean
    autoSelect?: boolean
    errorMessage?: string
    onUserInput: (name: string, value: any) => void
    noMargins?: boolean
    placeholder?: string
    sortByValue: boolean
}

/**
 * SelectElement class. See Form.js
 */
export class SelectElement {
    props: selectElementProps
    state: any
    context: object
    refs: {[key: string]: ReactInstance}

    /**
     * Construct a SelectElement
     *
     * @param {selectElementProps} props - React props
     */
    constructor(props: selectElementProps)

    /**
     * React lifecycle method
     *
     * @returns {ReactNode} - the element
     */
    render(): ReactNode

    /**
     * React lifecycle method
     *
     * @param {object} newstate - the state to override
     */
    setState(newstate: object): void

    /**
     * React lifecycle method.
     */
    forceUpdate(): void
}

type checkboxProps = {
    name: string
    label: string
    value: boolean
    id?: string
    class?: string
    offset?: string
    disabled?: boolean
    required?: boolean
    errorMessage?: string
    elementClass?: string
    onUserInput?: (name: string, value: any) => void
}
/**
 * CheckboxElement class. See Form.js
 */
export class CheckboxElement {
    props: checkboxProps
    state: any
    context: object
    refs: {[key: string]: ReactInstance}

    /**
     * Construct a CheckboxElement
     *
     * @param {checkboxProps} props - React props
     */
    constructor(props: checkboxProps)

    /**
     * React lifecycle method
     *
     * @returns {ReactNode} - the element
     */
    render(): ReactNode

    /**
     * React lifecycle method
     *
     * @param {object} newstate - the state to override
     */
    setState(newstate: object): void

    /**
     * React lifecycle method.
     */
    forceUpdate(): void
}

type buttonProps = {
    id?: string
    name?: string
    label?: string
    type?: string
    disabled?: boolean
    style?: React.CSSProperties
    onUserInput?: (e: React.MouseEvent) => void
    columnSize?: string
    buttonClass?: string
}
/**
 * ButtonElement class. See Form.js
 */
export class ButtonElement {
    props: buttonProps
    state: any
    context: object
    refs: {[key: string]: ReactInstance}

    /**
     * Construct a ButtonElement
     *
     * @param {buttonProps} props - React props
     */
    constructor(props: buttonProps)

    /**
     * React lifecycle method
     *
     * @returns {ReactNode} - the element
     */
    render(): ReactNode

    /**
     * React lifecycle method
     *
     * @param {object} newstate - the state to override
     */
    setState(newstate: object): void

    /**
     * React lifecycle method.
     */
    forceUpdate(): void
}

type textboxProps = {
    name: string
    label?: string
    value?: string
    id?: string
    class?: string
    placeholder?: string
    autoComplete?: string
    disabled?: boolean
    required?: boolean
    errorMessage?: string;
    onUserInput: (name: string, value: any) => void;
    onUserBlur?: (name: string, value: any) => void;
}
/**
 * TextboxElement class. See Form.js
 */
export class TextboxElement {
    props: textboxProps
    state: any
    context: object
    refs: {[key: string]: ReactInstance}

    /**
     * Construct a TextboxElement
     *
     * @param {textboxProps} props - React props
     */
    constructor(props: textboxProps)

    /**
     * React lifecycle method
     *
     * @returns {ReactNode} - the element
     */
    render(): ReactNode

    /**
     * React lifecycle method
     *
     * @param {object} newstate - the state to override
     */
    setState(newstate: object): void

    /**
     * React lifecycle method.
     */
    forceUpdate(): void
}

type fileElementProps = {
    name: string
    label?: string
    value?: string|object|null
    id?: string
    disabled?: boolean
    required?: boolean
    allowMultiple?: boolean
    errorMessage?: string
    onUserInput: (name: string, value: any) => void
};

/**
 * FileElement class. See Form.js
 */
export class FileElement {
    props: fileElementProps
    state: any
    context: object
    refs: {[key: string]: ReactInstance}

    /**
     * Construct a FileElement
     *
     * @param {fileElementProps} props - React props
     */
    constructor(props: fileElementProps)

    /**
     * React lifecycle method
     *
     * @returns {ReactNode} - the element
     */
    render(): ReactNode

    /**
     * React lifecycle method
     *
     * @param {object} newstate - the state to override
     */
    setState(newstate: object): void

    /**
     * React lifecycle method.
     */
    forceUpdate(): void
}

type numericElementProps = {
    name: string
    min?: number
    max?: number
    step?: number|'any'
    label?: string
    value?: string|number
    id?: string
    disabled?: boolean
    required?: boolean
    onUserInput: (name: string, value: any) => void
    errorMessage?: string
};

/**
 * NumericElement class. See Form.js
 */
export class NumericElement {
    props: numericElementProps
    state: any
    context: object
    refs: {[key: string]: ReactInstance}

    /**
     * Construct a NumericElement
     *
     * @param {numericElementProps} props - React props
     */
    constructor(props: numericElementProps)

    /**
     * React lifecycle method
     *
     * @returns {ReactNode} - the element
     */
    render(): ReactNode

    /**
     * React lifecycle method
     *
     * @param {object} newstate - the state to override
     */
    setState(newstate: object): void

    /**
     * React lifecycle method.
     */
    forceUpdate(): void
}

type dateElementProps = {
    name: string
    label?: string
    value?: string
    id?: string
    maxYear?: string|number
    minYear?: string|number
    dateFormat?: string
    disabled?: boolean
    required?: boolean
    errorMessage?: string
    onUserInput: (name: string, value: any) => void
};
/**
 * DateElement class. See Form.js
 */
export class DateElement {
    props: dateElementProps
    state: any
    context: object
    refs: {[key: string]: ReactInstance}

    /**
     * Construct a NumericElement
     *
     * @param {dateElementProps} props - React props
     */
    constructor(props: dateElementProps)

    /**
     * React lifecycle method
     *
     * @returns {ReactNode} - the element
     */
    render(): ReactNode

    /**
     * React lifecycle method
     *
     * @param {object} newstate - the state to override
     */
    setState(newstate: object): void

    /**
     * React lifecycle method.
     */
    forceUpdate(): void
}

type timeElementProps = {
    name: string
    label?: string
    value?: string
    id?: string
    disabled?: boolean
    required?: boolean
    onUserInput: (name: string, value: any) => void
}

/**
 * TimeElement class. See Form.js
 */
export class TimeElement {
    props: timeElementProps
    state: any
    context: object
    refs: {[key: string]: ReactInstance}

    /**
     * Construct a TimeElement
     *
     * @param {timeElementProps} props - React props
     */
    constructor(props: timeElementProps)

    /**
     * React lifecycle method
     *
     * @returns {ReactNode} - the element
     */
    render(): ReactNode

    /**
     * React lifecycle method
     *
     * @param {object} newstate - the state to override
     */
    setState(newstate: object): void

    /**
     * React lifecycle method.
     */
    forceUpdate(): void
}

type textareaElementProps = {
    name: string
    label?: string
    value?: string
    placeholder?: string
    id?: string
    disabled?: boolean
    required?: boolean
    rows?: number
    cols?: number
    onUserInput: (name: string, value: any) => void
}
/**
 * TextareaElement class. See Form.js
 */
export class TextareaElement {
    props: any
    state: any
    context: object
    refs: {[key: string]: ReactInstance}

    /**
     * Construct a TextareaElement
     *
     * @param {textareaElementProps} props - React props
     */
    constructor(props: textareaElementProps)

    /**
     * React lifecycle method
     *
     * @returns {ReactNode} - the element
     */
    render(): ReactNode

    /**
     * React lifecycle method
     *
     * @param {object} newstate - the state to override
     */
    setState(newstate: object): void

    /**
     * React lifecycle method.
     */
    forceUpdate(): void
}

type dateTimeElementProps = {
    name: string
    label?: string
    value?: string
    id?: string
    disabled?: boolean
    required?: boolean
    onUserInput: (name: string, value: any) => void
}

/**
 * DateTimeElement class. See Form.js
 */
export class DateTimeElement {
    props: dateTimeElementProps
    state: any
    context: object
    refs: {[key: string]: ReactInstance}

    /**
     * Construct a DateTimeElement
     *
     * @param {dateTimeElementProps} props - React props
     */
    constructor(props: dateTimeElementProps)

    /**
     * React lifecycle method
     *
     * @returns {ReactNode} - the element
     */
    render(): ReactNode

    /**
     * React lifecycle method
     *
     * @param {object} newstate - the state to override
     */
    setState(newstate: object): void

    /**
     * React lifecycle method.
     */
    forceUpdate(): void
}

type radioElementProps = {
    name: string
    label?: string
    options: {[name: string]: string}
    disabled?: boolean
    required?: boolean
    vertical?: boolean
    checked: boolean
    errorMessage?: string
    elementClass?: boolean
    onUserInput: (name: string, value: any) => void
}
/**
 * RadioElement class. See Form.js
 */
export class RadioElement {
    props: radioElementProps
    state: any
    context: object
    refs: {[key: string]: ReactInstance}


    /**
     * Construct a RadioElement
     *
     * @param {radioElementProps} props - React props
     */
    constructor(props: radioElementProps)

    /**
     * React lifecycle method
     *
     * @returns {ReactNode} - the element
     */
    render(): ReactNode

    /**
     * React lifecycle method
     *
     * @param {object} newstate - the state to override
     */
    setState(newstate: object): void

    /**
     * React lifecycle method.
     */
    forceUpdate(): void
}


type ctaProps = {
    label?: string;
    buttonClass?: string;
    onUserInput?: (e: any) => void;
}

/**
 * CTA class. See Form.js
 */
export class CTA {
    props: ctaProps
    state: any
    context: object
    refs: {[key: string]: ReactInstance}

    /**
     * Construct a CTA
     *
     * @param {ctaProps} props - React props
     */
    constructor(props: ctaProps)

    /**
     * React lifecycle method
     *
     * @returns {ReactNode} - the element
     */
    render(): ReactNode

    /**
     * React lifecycle method
     *
     * @param {object} newstate - the state to override
     */
    setState(newstate: object): void

    /**
     * React lifecycle method.
     */
    forceUpdate(): void
}

export default {
  FormElement,
  FieldsetElement,
  SelectElement,
  TagsElement,
  TextboxElement,
  SearchableDropdown,
  TextareaElement,
  PasswordElement,
  DateElement,
  TimeElement,
  DateTimeElement,
  NumericElement,
  FileElement,
  StaticElement,
  HeaderElement,
  LinkElement,
  CheckboxElement,
  RadioElement,
  SliderElement,
  ButtonElement,
  CTA,
  LorisElement,
};
