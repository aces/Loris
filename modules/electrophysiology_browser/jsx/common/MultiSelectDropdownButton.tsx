import React, {ReactNode} from 'react';

/**
 * Store one value displayed in the multi-select dropdown.
 */
type DropdownOption<T> = {
  key: string,
  value: T;
  label: ReactNode;
  selected: boolean;
};

/**
 * Configure the multi-select dropdown button.
 */
type MultiSelectDropdownButtonProps<T> = {
  label: ReactNode;
  options: DropdownOption<T>[];
  onToggle: (value: T) => void;
  className?: string;
  align?: 'left' | 'right';
};

/**
 * Component for a dropdown button with checkbox options.
 * Toggle multiple values without closing the menu.
 */
function MultiSelectDropdownButton<T>({
  label,
  options,
  onToggle,
  className = 'btn btn-primary dropdown',
  align = 'left',
}: MultiSelectDropdownButtonProps<T>) {
  return (
    <div style={{position: 'relative'}}>
      <button className={className} data-toggle="dropdown">
        {label}
      </button>
      <ul
        className={`dropdown-menu ${align == 'right' && 'dropdown-menu-right'}`}
      >
        {options.map(({key, value, label, selected}) => (
          <li
            key={key}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              gap: '1rem',
              padding: '0.75rem 1.5rem',
            }}
            onClick={(e) => {
              onToggle(value);
              e.stopPropagation();
            }}
          >
            <span>{label}</span>
            <input
              type="checkbox"
              checked={selected}
              onClick={(e) => e.stopPropagation()}
              onChange={() => onToggle(value)}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MultiSelectDropdownButton;
