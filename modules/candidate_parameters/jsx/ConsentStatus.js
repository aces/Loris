import React, {Component} from 'react';
import PropTypes from 'prop-types';
import swal from 'sweetalert2';

import {VerticalTabs, TabPane} from 'Tabs';
import Loader from 'Loader';
import {
  FormElement,
  StaticElement,
  ButtonElement,
  HeaderElement,
  SelectElement,
  DateElement,
} from 'jsx/Form';

/**
 * Consent Status Component.
 *
 * Renders the contents of the Consent Status tab, consisting of the FormElement component
 */
class ConsentStatus extends Component {
    /**
     * @constructor
     * @param {object} props - React Component properties
     */
    constructor(props) {
        super(props);
        this.state = {
            Data: [],
            formData: {},
            error: false,
            isLoaded: false,
            submitDisabled: false,
            showHistory: false,
        };

        /**
         * Bind component instance to custom methods
         */
        this.fetchData = this.fetchData.bind(this);
        this.setFormData = this.setFormData.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.showHistory = this.showHistory.bind(this);
        this.renderFormattedHistory = this.renderFormattedHistory.bind(this);
        this.renderConsent = this.renderConsent.bind(this);
    }

    /**
     * Called by React when the component has been rendered on the page.
     */
    componentDidMount() {
        this.fetchData();
    }

    /**
     * Retrieve data from the provided URL and save it in state
     */
    fetchData() {
        $.ajax(this.props.dataURL, {
            method: 'GET',
            dataType: 'json',
            success: (data) => {
                let formData = {};
                let consents = data.consents;
                for (let cStatus in consents) {
                    if (consents.hasOwnProperty(cStatus)) {
                        let cOptions = cStatus + '_options';
                        let cDate = cStatus + '_date';
                        let cDate2 = cStatus + '_date2';
                        let cWithdrawal = cStatus + '_withdrawal';
                        let cWithdrawal2 = cStatus + '_withdrawal2';
                        formData[cStatus] = data.consentStatuses[cStatus];
                        formData[cDate] = data.consentDates[cStatus];
                        formData[cDate2] = data.consentDates[cStatus];
                        formData[cWithdrawal] = data.withdrawals[cStatus];
                        formData[cWithdrawal2] = data.withdrawals[cStatus];
                        if (data.consentStatuses[cStatus] === 'yes' ||
                            data.consentStatuses[cStatus] === 'no'
                        ) {
                            formData[cOptions] = {
                                yes: 'Yes',
                                no: 'No',
                            };
                        } else {
                            formData[cOptions] = {
                                yes: 'Yes',
                                no: 'No',
                                not_applicable: 'Not applicable',
                            };
                        }
                    }
                }
                this.setState({
                    Data: data,
                    formData: formData,
                    isLoaded: true,
                });
            },
            error: (error) => {
                console.error(error);
                this.setState({
                    error: true,
                });
            },
        });
    }

    /**
     * Store the value of the element in this.state.formData
     *
     * @param {string} formElement - name of the form element
     * @param {string} value - value of the form element
     */
    setFormData(formElement, value) {
        let formData = this.state.formData;
        formData[formElement] = value;
        for (let consent in this.state.Data.consents) {
            if (this.state.Data.consents.hasOwnProperty(consent)) {
                const oldConsent = this.state.Data.consentStatuses[consent];
                const newConsent = this.state.formData[consent];
                if (formElement === consent) {
                    // Clear withdrawal date if consent status changes from no
                    // (or empty if uncleaned data) to yes
                    if ((newConsent === 'yes' && oldConsent !== 'yes') ||
                        (newConsent === 'no' &&
                            (oldConsent === null || oldConsent === '')
                        )
                    ) {
                        formData[consent + '_withdrawal'] = '';
                        formData[consent + '_withdrawal2'] = '';
                    }
                    // Clear date if response set back to null
                    if (newConsent === '' && oldConsent !== null) {
                        formData[consent + '_date'] = '';
                        formData[consent + '_date2'] = '';
                        formData[consent + '_withdrawal'] = '';
                        formData[consent + '_withdrawal2'] = '';
                    }
                }
            }
        }
        this.setState({
            formData: formData,
        });
    }

    /**
     * Handles form submission
     *
     * @param {event} e - Form submission event
     */
    handleSubmit(e) {
        e.preventDefault();
        let myFormData = this.state.formData;
        let today = new Date();
        let dd = today.getDate();
        let mm = today.getMonth() + 1; // January is 0!
        let yyyy = today.getFullYear();
        if (dd < 10) {
            dd = '0' + dd;
        }
        if (mm < 10) {
            mm = '0' + mm;
        }
        today = yyyy + '-' + mm + '-' + dd;
        for (let consentStatus in this.state.Data.consents) {
            if (this.state.Data.consents.hasOwnProperty(consentStatus)) {
                let label = this.state.Data.consents[consentStatus];

                let consentDate = consentStatus + '_date';
                let consentDate2 = consentStatus + '_date2';

                let date1 = myFormData[consentDate] ?
                    myFormData[consentDate] : null;
                let date2 = myFormData[consentDate2] ?
                    myFormData[consentDate2] : null;

                if (date1 !== date2) {
                    alert(label + ' dates do not match!');
                    return;
                }
                if (date1 > today) {
                    alert(label + ' date cannot be later than today!');
                    return;
                }

                let consentWithdrawal = consentStatus + '_withdrawal';
                let consentWithdrawal2 = consentStatus + '_withdrawal2';

                const withdrawDate1 = myFormData[consentWithdrawal] ?
                    myFormData[consentWithdrawal] : null;
                const withdrawDate2 = myFormData[consentWithdrawal2] ?
                    myFormData[consentWithdrawal2] : null;

                if (withdrawDate1 !== withdrawDate2) {
                    alert(label + ' withdrawal dates do not match!');
                    return;
                }
                if (withdrawDate1 > today) {
                    alert(
                      label
                      + ' withdrawal date cannot be later than today!'
                    );
                    return;
                }
                if (withdrawDate1 < date1) {
                    alert(
                      label
                      + ' withdrawal date cannot be earlier than response date!'
                    );
                    return;
                }
            }
        }
        // Set form data
        let formData = new FormData();
        for (let key in myFormData) {
            // Does not submit data with empty string
            if (myFormData[key] !== '') {
                formData.append(key, myFormData[key]);
            }
        }
        formData.append('tab', this.props.tabName);
        formData.append('candID', this.state.Data.candID);

        // Disable submit button to prevent form resubmission
        this.setState({submitDisabled: true});

        $.ajax({
            type: 'POST',
            url: this.props.action,
            data: formData,
            cache: false,
            contentType: false,
            processData: false,
            success: (data) => {
                swal.fire('Success!', 'Update successful.', 'success')
                  .then((result) => {
                    if (result.value) {
                        this.setState({submitDisabled: false});
                        this.fetchData();
                    }
                  }
                );
                this.fetchData();
            },
            error: (error) => {
                console.error(error);
                // Enable submit button for form resubmission
                this.setState({submitDisabled: false});
                let errorMessage = error.responseText || 'Update failed.';
                swal.fire('Error!', errorMessage, 'error');
            },
        });
    }

    /**
     * Show history
     */
    showHistory() {
        this.setState({showHistory: !this.state.showHistory});
    }

    /**
     * Render formatted history
     *
     * @return {JSX} - React markup for the component
     */
    renderFormattedHistory() {
        const historyBtnLabel = this.state.showHistory ?
            'Hide Consent History' : 'Show Consent History';

        const formattedHistory = this.state.Data.history.map((info, key) => {
            const label = info.label;
            const dataEntry = info.data_entry_date;
            const user = info.entry_staff;
            const consentStatus = info.consentStatus;
            const consentDate = info.date;
            const withdrawal = info.withdrawal;
            const dateHistory = consentDate ? (
                <span>
                   , <b>Date of Consent</b> to {consentDate}
                </span>
            ) : null;
            const withdrawalHistory = withdrawal ? (
                <span>
                    , <b>Date of Consent Withdrawal</b> to {withdrawal}
                </span>
            ) : null;

            return (
                <div key={key}>
                    <hr/>
                    <p>
                      <b>
                        {dataEntry} - {user}
                      </b> updated for <i>{label}</i>:
                      <b> Status</b> to {' '}
                      {consentStatus}
                      {dateHistory}
                      {withdrawalHistory}
                    </p>
                </div>
            );
        });

        return (
            <div style={{margin: '20px'}}>
                <button
                    className='btn btn-primary'
                    onClick={this.showHistory}
                    data-toggle='collapse'
                    data-target='#consent-history'
                    style={{margin: '10px 0'}}
                >
                    {historyBtnLabel}
                </button>
                <div id='consent-history' className='collapse'>
                    {formattedHistory}
                </div>
            </div>
        );
    }

    /**
     * Render Consent
     *
     * @param {string} consentName
     * @return {JSX} - React markup for the component
     */
    renderConsent(consentName) {
        // Allow editing if user has permission
        let disabled = loris.userHasPermission('candidate_parameter_edit')
          ? false : true;

        // Set up props for front-end validation
        const oldConsent = this.state.Data.consentStatuses[consentName];
        const newConsent = this.state.formData[consentName];
        const withdrawalDate = this.state.Data.withdrawals[consentName];
        // Define defaults
        let dateRequired = false;
        let responseDateDisabled = true;
        let withdrawalRequired = false;
        // Let date of withdrawal field be disabled until it is needed
        let withdrawalDisabled = true;

        // If answer to consent is 'yes', require date of consent
        if (newConsent === 'yes') {
            responseDateDisabled = false;
            dateRequired = true;
        }
        // If answer to consent is 'no', require date of consent
        if (newConsent === 'no') {
            responseDateDisabled = false;
            dateRequired = true;
            // If answer was previously 'yes' and consent is now being withdrawn, enable and require withdrawal date
            // If consent was previously withdrawn and stays withdrawn, enable and require withdrawal date
            if (oldConsent === 'yes' ||
                (oldConsent === 'no' && withdrawalDate)
            ) {
                withdrawalDisabled = false;
                withdrawalRequired = true;
            }
        }

        // Set up elements
        const label = this.state.Data.consents[consentName];
        const consentOptions = consentName + '_options';
        const statusLabel = 'Response';
        const consentDate = consentName + '_date';
        const consentDate2 = consentName + '_date2';
        const consentDateLabel = 'Date of Response';
        const consentDateConfirmationLabel = 'Confirmation Date of Response';
        const consentWithdrawal = consentName + '_withdrawal';
        const consentWithdrawal2 = consentName + '_withdrawal2';
        const consentWithdrawalLabel = 'Date of Withdrawal of Consent';
        const consentWithdrawalConfirmationLabel =
            'Confirmation Date of Withdrawal of Consent';

        return (
            <div key={consentName}>
                <HeaderElement
                    text={label}
                />
                <SelectElement
                    label={statusLabel}
                    name={consentName}
                    options={this.state.formData[consentOptions]}
                    value={this.state.formData[consentName]}
                    onUserInput={this.setFormData}
                    disabled={disabled}
                    required={false}
                />
                <DateElement
                    label={consentDateLabel}
                    name={consentDate}
                    value={this.state.formData[consentDate]}
                    onUserInput={this.setFormData}
                    disabled={disabled || responseDateDisabled}
                    required={dateRequired}
                />
                <DateElement
                    label={consentDateConfirmationLabel}
                    name={consentDate2}
                    value={this.state.formData[consentDate2]}
                    onUserInput={this.setFormData}
                    disabled={disabled || responseDateDisabled}
                    required={dateRequired}
                />
                <DateElement
                    label={consentWithdrawalLabel}
                    name={consentWithdrawal}
                    value={this.state.formData[consentWithdrawal]}
                    onUserInput={this.setFormData}
                    disabled={disabled || withdrawalDisabled}
                    required={withdrawalRequired}
                />
                <DateElement
                    label={consentWithdrawalConfirmationLabel}
                    name={consentWithdrawal2}
                    value={this.state.formData[consentWithdrawal2]}
                    onUserInput={this.setFormData}
                    disabled={disabled || withdrawalDisabled}
                    required={withdrawalRequired}
                />
                <hr/>
            </div>
        );
    }

    /**
     * Renders the React component.
     *
     * @return {JSX} - React markup for the component
     */
    render() {
        // If error occurs, return a message.
        // XXX: Replace this with a UI component for 500 errors.
        if (this.state.error) {
            return <h3>An error occurred while loading the page.</h3>;
        }

        if (!this.state.isLoaded) {
            return <Loader />;
        }

        // Allow editing if user has permission
        let updateButton = loris.userHasPermission('candidate_parameter_edit') ?
            (<ButtonElement
              label='Update'
              disabled={this.state.submitDisabled}
            />) : null;

        // Set up vertical tabs to group consent by consent groups
        const tabList = [];
        const tabPanes = Object.keys(this.state.Data.consentGroups).map(
          (consentID) => {
            if (this.state.Data.consentGroups[consentID].Children) {
              tabList.push({
                  id: consentID,
                  label: this.state.Data.consentGroups[consentID].Label,
              });
              return (
                  <TabPane key={consentID} TabId={consentID}>
                      <FormElement
                          name="consentStatus"
                          onSubmit={this.handleSubmit}
                          class="col-md-9"
                      >
                          <StaticElement
                            label="PSCID"
                            text={this.state.Data.pscid}
                          />
                          <StaticElement
                            label="DCCID"
                            text={this.state.Data.candID}
                          />
                          {this.state.Data.consentGroups[consentID].Children
                            .map((consentName) => {
                              return this.renderConsent(consentName);
                            }
                          )}
                          {updateButton}
                      </FormElement>
                  </TabPane>
              );
            }
          }
        );
        return (
            <div className="row">
                <VerticalTabs
                    tabs={tabList}
                    defaultTab={tabList[0].id}
                    updateURL={false}
                >
                    {tabPanes}
                </VerticalTabs>
                {this.renderFormattedHistory()}
            </div>
        );
    }
}

ConsentStatus.propTypes = {
    dataURL: PropTypes.string.isRequired,
    action: PropTypes.string.isRequired,
    tabName: PropTypes.string,
};

export default ConsentStatus;
