import {createRoot} from 'react-dom/client';
import {useState, useEffect, useCallback} from 'react';

function Digit(props: {value: number|null|string, onChange: (newvalue: number) => boolean}) {
	return <input style={{flex: 1,
		width: "1em",
		fontSize: "3em",
		marginLeft: "0.5ex",
		textAlign: "center"
	}}
		type="text"
		readOnly={true}
		onKeyDown={(e: React.KeyboardEvent) => {
			e.preventDefault();
			if(e.keyCode >= 48 /* '0' */ && e.keyCode <= 57 /* '9' */) {
				if(props.onChange(e.keyCode-48)) {
					const target = e.target as HTMLElement;
					(target.nextSibling as HTMLElement)?.focus();
				}
				return;
			}
			if(e.key == "ArrowLeft") {
				const target = e.target as HTMLElement;
				(target.previousSibling as HTMLElement)?.focus();
			} if(e.key == "ArrowRight") {
				const target = e.target as HTMLElement;
				(target.nextSibling as HTMLElement)?.focus();
			}
		}
		}
		value={props.value || ""}
	/>;
}
function CodePrompt(props: {onValidate: () => void}) {
	const [code, setCode] = useState<[number|null, number|null, number|null, number|null, number|null, number|null]>([null, null, null, null, null, null]);
	const digitCallback = useCallback( (index: number, value: number): boolean => {
		if(value >= 0 && value <= 9) {
			code[index] = value;
			setCode([...code]);
			return true;
		}
		return false;
	}, []);
	useEffect( () => {
		if(code.indexOf(null) >= 0) {
			console.log("not yet entered");
			return;
		}
		fetch("/login/mfa",
		      {
			      method: "POST",
			      body: JSON.stringify({"code": code.join("")}),
			      credentials: 'same-origin',
			      
		      }
		     ).then( (resp) => {
			     if(!resp.ok) {
				     console.warn("invalid response");
			     }
			     return resp.json();
		     }).then( (json) => {
			     if(json["success"]) {
				     window.location.reload();
			     }
			     console.log(json);
		     }).catch( (e) => {
			     console.error("error validating code");
		     });

		console.log("validate code")
		//call onValidate
	}, [code]);


	
	return <div style={{display: "flex"}}>
		<Digit value={code[0] === 0 ? "0" : code[0]} onChange={(newval: number) => digitCallback(0, newval)}/>
		<Digit value={code[1] === 0 ? "0" : code[1]} onChange={(newval: number) => digitCallback(1, newval)}/>
		<Digit value={code[2] === 0 ? "0" : code[2]} onChange={(newval: number) => digitCallback(2, newval)}/>
		<Digit value={code[3] === 0 ? "0" : code[3]} onChange={(newval: number) => digitCallback(3, newval)}/>
		<Digit value={code[4] === 0 ? "0" : code[4]} onChange={(newval: number) => digitCallback(4, newval)}/>
		<Digit value={code[5] === 0 ? "0" : code[5]} onChange={(newval: number) => digitCallback(5, newval)}/>
		</div>;
}

function MFAPrompt() {
	return (<div>
		<h2>Multifactor authentication required</h2>
		<p>Enter the code from your authenticator app below to proceed.</p>
		<CodePrompt onValidate={() => {window.location.reload()}}/>

	</div>)

}

declare const loris: any;
window.addEventListener('load', () => {
  createRoot(
    document.getElementsByClassName('main-content')[0]
  ).render(
    <MFAPrompt />
  );
});
