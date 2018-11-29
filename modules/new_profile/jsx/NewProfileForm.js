/**
 * New Profile Form
 *
 * Create a new proflie form
 *
 * @author  Shen Wang
 * @version 1.0.0
 * */
class NewProfileForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {
            },
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

    /**
   * Retrive data from the provided URL and save it in state
   */
    fetchData() {
        $.ajax(
            loris.BaseURL + '/new_profile/?format=json',
            {
                method: 'GET',
                dataType: 'json',
                success: (data) => {
                    this.setState(
                        {
                            configData: data,
                            isLoaded: true,
                        }
                    );
                },
            }
        );
    }

    componentWillMount() {
        this.fetchData();
    }

    validate() {
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
        const err = this.validate();
        this.setState(
                {
                    errMessage: '',
                }
            );
        if (!err) {
            this.setState(
                {
                    isCreated: true,
                }
            );
        } else {
            this.setState(
                {
                    errMessage: 'Date of birth fields must match',
                    isCreated: false,
                }
            );
        }
        $.ajax(
            loris.BaseURL + '/new_profile/ajax/addProfile.php',
            {
                method: 'POST',
                data: JSON.stringify(this.state.formData),
                dataType: 'json',
                success: (data) => {
                    this.setState(
                        {
                            newData: data,
                        }
                    );
                },
            }
        );
    }

    /**
   * Set the form data based on state values of child elements/componenets
   *
   * @param {string} formElement - name of the selected element
   * @param {string} value - selected value for corresponding form element
   */
    setFormData(formElement, value) {
        let formData = this.state.formData;
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
                   ref ="project"
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
                   ref ="edcDateTaken1"
                   value ={this.state.formData.edcDateTaken}
                   required ={true}
                 />
                 <DateElement
                   name ="edcDateTakenConfirm"
                   label ="Confirm EDC"
                   minYear ="2000"
                   maxYear ="2017"
                   onUserInput ={this.setFormData}
                   ref ="edcDateTaken2"
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
                   ref ="pscid"
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
                 ref ="form"
                >
                 <label className="error">{this.state.errMessage}</label>
                 <DateElement
                   name ="dateTaken"
                   label ="Date of Birth"
                   minYear ="2000"
                   maxYear ="2017"
                   onUserInput ={this.setFormData}
                   ref ="dateTaken1"
                   value ={this.state.formData.dateTaken}
                   required ={true}
                 />
                 <DateElement
                   name ="dateTakenConfirm"
                   label ="Date of Birth Confirm"
                   minYear ="2000"
                   maxYear ="2017"
                   onUserInput ={this.setFormData}
                   ref ="dateTaken2"
                   value ={this.state.formData.dateTakenConfirm}
                   required ={true}
                 />
                 {edc}
                 <SelectElement
                   name ="gender"
                   label ="Gender"
                   options ={this.state.configData.gender}
                   onUserInput ={this.setFormData}
                   ref ="gender"
                   value ={this.state.formData.gender}
                   required ={true}
                 />
                 <SelectElement
                   name ="site"
                   label ="Site"
                   options ={this.state.configData.site}
                   onUserInput ={this.setFormData}
                   ref ="site"
                   value ={this.state.formData.site}
                   required ={true}
                 />
                 {pscid}
                 {project}
                 <ButtonElement label ="Create" id="button"/>
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
            {profile}
            </div>
            );
    }
}
export default NewProfileForm;
