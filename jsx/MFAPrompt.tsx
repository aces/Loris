import {useState, useEffect, useCallback} from 'react';
import swal from 'sweetalert2';

/**
 * Render a single digit of an MFA prompt
 *
 * @param props - React props
 * @param props.value - The current value of the digit to display
 * @param props.onChange - A callback to call when the number is changed
 */
function Digit(props: {
  value: number|null|string,
  onChange: (newvalue: number) => boolean}
) {
  return <input style={{flex: 1,
    width: '1em',
    fontSize: '3em',
    marginLeft: '0.5ex',
    textAlign: 'center',
  }}
  type="text"
  readOnly={true}
  onKeyDown={(e: React.KeyboardEvent) => {
    e.preventDefault();
    if (e.keyCode >= 48 /* '0' */ && e.keyCode <= 57 /* '9' */) {
      if (props.onChange(e.keyCode-48)) {
        const target = e.target as HTMLElement;
        (target.nextSibling as HTMLElement)?.focus();
      }
      return;
    }
    if (e.key == 'ArrowLeft') {
      const target = e.target as HTMLElement;
      (target.previousSibling as HTMLElement)?.focus();
    } if (e.key == 'ArrowRight') {
      const target = e.target as HTMLElement;
      (target.nextSibling as HTMLElement)?.focus();
    }
  }
  }
  value={props.value || ''}
  />;
}

type errorCallback = (msg: string) => void;
type MFACode = [
     number|null,
    number|null,
    number|null,
    number|null,
    number|null,
    number|null];

/**
 * Prompt for a multi-factor authentication code and call validate
 * callback to validate the code after all 6 digits have been entered.
 *
 * @param props - React props
 * @param props.validate - Callback when a code is entered to validate it.
 *                         If the code is invalid, the callback should call
 *                         the onError callback to reset the prompt state.
 */
function MFAPrompt(props: {validate:
    (code: string, onError: errorCallback) => void
}) {
  const [code, setCode] = useState<MFACode>(
    [null, null, null, null, null, null]
  );
  const digitCallback = useCallback(
    (index: number, value: number): boolean => {
      if (value >= 0 && value <= 9) {
        setCode((prev) => {
          const newCode: MFACode = [...prev];
          newCode[index] = value;
          return newCode;
        });
        return true;
      }
      return false;
    },
    []
  );
  const errorCallback = useCallback( (msg: string) => {
    swal.fire('Error', msg, 'error');
    setCode([null, null, null, null, null, null]);
  }, []);
  useEffect( () => {
    if (code.indexOf(null) >= 0) {
      return;
    }
    props.validate(code.join(''), errorCallback);
  },
  [code, errorCallback]
  );


  // nb. React treats the number 0 as falsey and doesn't display it when passed
  // to an input value but *does* display the string "0".
  return <div style={{display: 'flex'}}>
    <Digit
      value={code[0] === 0 ? '0' : code[0]}
      onChange={(newval: number) => digitCallback(0, newval)}
    />
    <Digit
      value={code[1] === 0 ? '0' : code[1]}
      onChange={(newval: number) => digitCallback(1, newval)}
    />
    <Digit
      value={code[2] === 0 ? '0' : code[2]}
      onChange={(newval: number) => digitCallback(2, newval)}
    />
    <Digit
      value={code[3] === 0 ? '0' : code[3]}
      onChange={(newval: number) => digitCallback(3, newval)}
    />
    <Digit
      value={code[4] === 0 ? '0' : code[4]}
      onChange={(newval: number) => digitCallback(4, newval)}
    />
    <Digit
      value={code[5] === 0 ? '0' : code[5]}
      onChange={(newval: number) => digitCallback(5, newval)}
    />
  </div>;
}

export default MFAPrompt;
