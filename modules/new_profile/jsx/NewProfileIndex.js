import Panel from 'Panel';
/**
 * New Profile Form
 *
 * Create a new profile form
 *
 * @author  Shen Wang
 * @version 1.0.0
 * */
class NewProfileIndex extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {},
            configData: {},
            formData: {},
            newData: {},
            isLoaded: false,
            isCreated: false,
            errMessage: '',
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.setFormData = this.setFormData.bind(this);
        this.fetchData = this.fetchData.bind(this);
    }

  componentDidMount() {
    this.fetchData()
      .then(() => this.setState({isLoaded: true}));
  }

  /**
   * Retrieve data from the provided URL and save it in state
   * Additionally add hiddenHeaders to global loris variable
   * for easy access by columnFormatter.
   *
   * @return {object}
   */
  fetchData() {
    return fetch(this.props.dataURL, {credentials: 'same-origin'})
      .then((resp) => resp.json())
      .then((data) => this.setState({configData: data}))
      .catch((error) => {
        this.setState({error: true});
        console.error(error);
      });
  }

    validateMatchDate() {
        const data = this.state.formData;
        let isError = false;
        if (data.dateTaken !== data.dateTakenConfirm) {
            isError = true;
        }
        let decError = false;
        if (this.state.configData['edc'] === 'true'
            && data.edcDateTaken !== data.edcDateTakenConfirm
        ) {
            decError = true;
        }
        return isError || decError;
    }


  /**
   * Handles form submission
   *
   * @param {event} e - Form submition event
   */
    handleSubmit(e) {
        e.preventDefault();
        const err = this.validateMatchDate();
        this.setState(
            {
                errMessage: '',
                }
        );
        if (err) {
            this.setState(
                {
                    errMessage: 'Date of Birth or EDC fields must match',
                    isCreated: false,
                }
            );
        } else {
    let formData = this.state.formData;
    let formObject = new FormData();
    for (let key in formData) {
      if (formData[key] !== '') {
        formObject.append(key, formData[key]);
      }
    }
   fetch(this.props.submitURL, {
      method: 'POST',
      cache: 'no-cache',
      credentials: 'same-origin',
      body: formObject,
    })
    .then((resp) => resp.json())
    .then((data) => {
     this.setState({newData: data});
     this.setState({isCreated: true});
    });
                }
    }

    /**
   * Set the form data based on state values of child elements/componenets
   *
   * @param {string} formElement - name of the selected element
   * @param {string} value - selected value for corresponding form element
   */
    setFormData(formElement, value) {
        let formData = JSON.parse(JSON.stringify(this.state.formData));
        formData[formElement] = value;

        this.setState(
            {
                formData: formData,
            }
        );
    }

     render() {
            let profile = null;
            let edc = null;
            let project = null;
            let pscid = null;
            if (this.state.configData['useProject'] === 'true') {
                project =
                <div>
                 <SelectElement
                   name ="project"
                   label ="Project"
                   options ={this.state.configData.project}
                   onUserInput ={this.setFormData}
                   value ={this.state.formData.project}
                   required ={true}
                 />
                </div>;
            }
            if (this.state.configData['edc'] === 'true') {
                edc =
                 <div>
                 <DateElement
                   name ="edcDateTaken"
                   label ="Expected Date of Confinement"
                   minYear ="2000"
                   maxYear ="2017"
                   onUserInput ={this.setFormData}
                   value ={this.state.formData.edcDateTaken}
                   required ={true}
                 />
                 <DateElement
                   name ="edcDateTakenConfirm"
                   label ="Confirm EDC"
                   minYear ="2000"
                   maxYear ="2017"
                   onUserInput ={this.setFormData}
                   value ={this.state.formData.edcDateTakenConfirm}
                   required ={true}
                 />
                 </div>;
            }
            if (this.state.configData['pscidSet'] === 'true') {
                pscid =
                <div>
                  <TextboxElement
                   name ="pscid"
                   label ="PSCID"
                   onUserInput ={this.setFormData}
                   value ={this.state.formData.pscid}
                   required ={true}
                  />
                </div>;
            }
            if (!this.state.isCreated) {
                profile =
                <FormElement
                 name ="newProfileForm"
                 onSubmit ={this.handleSubmit}
                >
                 <label className ="error">{this.state.errMessage}</label>
                 <DateElement
                   name ="dateTaken"
                   label ="Date of Birth"
                   minYear ="2000"
                   maxYear ="2017"
                   onUserInput ={this.setFormData}
                   value ={this.state.formData.dateTaken}
                   required ={true}
                 />
                 <DateElement
                   name ="dateTakenConfirm"
                   label ="Date of Birth Confirm"
                   minYear ="2000"
                   maxYear ="2017"
                   onUserInput ={this.setFormData}
                   value ={this.state.formData.dateTakenConfirm}
                   required ={true}
                 />
                 {edc}
                 <SelectElement
                   name ="gender"
                   label ="Gender"
                   options ={this.state.configData.gender}
                   onUserInput ={this.setFormData}
                   value ={this.state.formData.gender}
                   required ={true}
                 />
                 <SelectElement
                   name ="site"
                   label ="Site"
                   options ={this.state.configData.site}
                   onUserInput ={this.setFormData}
                   value ={this.state.formData.site}
                   required ={true}
                 />
                 {pscid}
                 {project}
                 <ButtonElement label ="Create" id ="button"/>
                </FormElement>;
            } else {
                profile =
                <div>
                <p>New candidate created. DCCID: {this.state.newData.candID} PSCID: {this.state.newData.pscid}</p>
                <p><a href ={'/' + this.state.newData.candID}>Access this candidate</a></p>
                <p><a href ="/new_profile/">Recruit another candidate</a></p>
                </div>;
            }
            return (
            <div>
            <Panel>
            {profile}
            </Panel>
            </div>
            );
    }
}
window.addEventListener('load', () => {
  ReactDOM.render(
    <NewProfileIndex
      dataURL={`${loris.BaseURL}/new_profile/?format=json`}
      submitURL={`${loris.BaseURL}/new_profile/Addprofile`}
      hasPermission={loris.userHasPermission}
    />,
    document.getElementById('lorisworkspace')
  );
});
