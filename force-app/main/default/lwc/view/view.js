import { LightningElement, api, wire, track } from 'lwc';
import getAccountData from '@salesforce/apex/AccountSearch.getAccountData';
import viewRecord from '@salesforce/apex/AccountSearch.viewRecord';
import GetContacts from '@salesforce/apex/AccountSearch.GetContacts';
import AddRecord from '@salesforce/apex/AccountSearch.AddRecord';
import UpdateRecord from '@salesforce/apex/AccountSearch.UpdateRecord';
import AddContact from '@salesforce/apex/AccountSearch.AddContact';
import UpdateContacts from '@salesforce/apex/AccountSearch.UpdateContacts';
import GetConRecord from '@salesforce/apex/AccountSearch.GetConRecord';
import deleteContact from '@salesforce/apex/AccountSearch.deleteContact';
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import { refreshApex } from '@salesforce/apex';
export default class accountSearch extends LightningElement {
    @api recordId;
    @api view =[];
    @api accounts;
    @api recrdsID;
    @api recid;
    @api AccountId;
    @api AccId;
    @api redId;
    @api coneditdId;
    @api editId;
    @api deleteId;
    @api coId
    @track isModalOpen = false;
    disabled;
    @api accountName;
    @api ConFirstName;
    @api ConLastName;
    @api ConEmail;
    conList;
    @api accountNumberOfEmployees;
    @api accountType;
    @track isDialogVisible = false;
    @track isNewAccountModal = false;
    @track isEditeDialogVisible = false;
    @track isEditModalOpen = false;
    @track isNewContactModal = false;
    @api message = ''; //modal message
    @track confirmLabel = ''; //confirm button label
    @track cancelLabel = '';
    @track updateKey
    @api AccountNameIn;
    @api NumberOfEmployeesIn;
    @api AccountTypeIn;
    @api isLoaded = false;
    @api record;
    // @wire (getAccountData,{recrdsID:'$recid'})
    // wiredaccount;
    @wire(viewRecord, { recrdsID: '$recid' })
    wireAccount;
    @wire(getAccountData)
    refreshAcc;
    // Create Event
    // ------insert Account--------------
    openAddAccountModal() {
        this.isNewAccountModal = true;
        console.log("Enter New Account Modal ");
    }
    closeAddAccountModal() {
        this.isNewAccountModal = false;
        console.log("Exit New Account Modal ");
    }
    handleNameChange(event) {
        this.AccountNameIn = event.target.value;
    }
    handleEmployeesChange(event) {
        this.NumberOfEmployeesIn = event.target.value;
    }
    handleTypeChange(event) {
        this.AccountTypeIn = event.target.value;
    }
    onCreateRecord() {
        AddRecord({
            AccountNameinsert: this.AccountNameIn,
            NumberOfEmployeesinsert: this.NumberOfEmployeesIn,
            AccountTypeinsert: this.AccountTypeIn
        })
            .then(addAccountResult => {
                this.isLoaded = true;
                console.log("addAccountResult:" + JSON.stringify(addAccountResult))
                refreshApex(this.wireAccount);
                const event = new ShowToastEvent({
                    title: 'Success',
                    message: 'Account Added Successfully',
                    variant: 'success',
                    mode: 'dismissable'
                });
                this.isNewAccountModal = false;
                setTimeout(() => {
                    this.isLoaded = false;
                    this.dispatchEvent(event);
                }, 1300)
                refreshApex(this.conDataList);
            })
            .catch(error => {
                console.log("error:" + JSON.stringify(error))
                const evt = new ShowToastEvent({
                    title: 'Error',
                    message: 'Account Not Added Yet',
                    variant: 'error',
                    mode: 'dismissable'
                });
                this.dispatchEvent(evt);
            })
    }
    //---------- Contacts list----------
    connectedCallback() {
        this.columns = [
            { label: 'Related Contacts', fieldName: 'Name' },
            {
                type: "button", typeAttributes: {
                    label: 'Edit',
                    name: 'editRecord',
                    title: 'Edit',
                    value: 'Edit',
                    variant: 'brand'
                },
            }, {
                type: "button", typeAttributes: {
                    label: 'Delete',
                    name: 'deleteRecord',
                    title: 'Delete',
                    disabled: false,
                    value: 'deleteRecord',
                    iconPosition: 'end',
                    variant: 'destructive'
                }
            }
        ];
    }
    contactsList = [];
    updateKey(event) {
        this.contactsList = event.target.value;
        console.log("this.contactsList" + JSON.stringify(this.contactsList))
        refreshApex(this.conDataList);
    }
    // ------------Get contact----------------
    @wire(GetContacts, { recdId: '$recid' })
    WireContactRecords(result) {
        this.conDataList = result;
        console.log('Entering WireContactRecords');
        console.log('Entering WireContactRecords====' + this.recdId);
        if (result.data) {
            console.log('data*********+' + JSON.stringify(result.data))
            this.contactsList = result.data;
            // this.error = undefined;
        } else if(result.error) {
            this.error = result.error;
            // this.contactsList = undefined;
        }
    }
    @wire(GetConRecord, { coneditdId: '$editId' })
    ContactRecords(result) {
        this.detailCons = result;
        console.log('Entering ContactRecords');
        console.log('Entering ContactRecords====' + this.coneditdId);
        if (result.data) {
            console.log('data*********+' + JSON.stringify(result.data))
            this.conList = result.data;
            // this.error = undefined;
        } else if(result.error){
            this.error = result.error;
            // this.conList = undefined;
        }
    }
    getSelectedRow(event) {
        const actionName = event.detail.action.name;
        const row = event.detail.row;
        const Id = row.Id;
        if (actionName == 'viewDetails') {
            this.wireAccount = true;
            this.recid = Id;
        }
        console.log(actionName);
        console.log(row);
    }
    // ------------Insert Contacts---------------
    openAddContactModal() {
        this.isNewContactModal = true;
        console.log("Enter Add Contact Modal");
    }
    closeAddContactModal() {
        this.isNewContactModal = false;
        console.log("Exit Add Contact Modal");
    }
    handleFirstNameChange(event) {
        this.ConFirstName = event.target.value;
    }
    handleLastNameChange(event) {
        this.ConLastName = event.target.value;
    }
    handleEmailChange(event) {
        this.ConEmail = event.target.value;
    }
    onAddContact() {
        console.log("Save in Contact");
        this.isLoaded = true;
        AddContact({
            ParentAccountId: this.recid,
            firstNameInsert: this.ConFirstName,
            lastNameInsert: this.ConLastName,
            emailInsert: this.ConEmail
        })
            .then(addContactResult => {
                console.log("addContactResult:" + JSON.stringify(addContactResult))
                refreshApex(this.conDataList);
                const event = new ShowToastEvent({
                    title: 'Success',
                    message: 'Added Successfully',
                    variant: 'success',
                    mode: 'dismissable'
                });
                this.isNewContactModal = false;
                setTimeout(() => {
                    this.isLoaded = false;
                    this.dispatchEvent(event);
                }, 1300)
                refreshApex(this.conDataList);
            })
            .catch(error => {
                console.log("error:" + JSON.stringify(error))
                const evt = new ShowToastEvent({
                    title: 'Error',
                    message: 'Not Changed Anything Yet',
                    variant: 'error',
                    mode: 'dismissable'
                });
                this.dispatchEvent(evt);
            })
    }
    //-------------- Update Contacts-----------------
    openModal() {
        this.isModalOpen = true;
        console.log("Enter EditAccount Hit");
    }
    closeModal() {
        this.isModalOpen = false;
        console.log("Exit EditAccount Hit");
    }
    submitDetails() {
        var inp = this.template.querySelectorAll("lightning-input");
        inp.forEach(function (element) {
            if (element.name == "Name")
                this.accountName = element.value;
            else if (element.name == "NumberOfEmployees")
                this.accountNumberOfEmployees = element.value;
            else if (element.name == "Type")
                this.accountType = element.value;
        }, this);
        this.isLoaded = true;
        UpdateRecord({
            accountId: this.recid,
            accountNames: this.accountName,
            accountNumberOfEmployeess: this.accountNumberOfEmployees,
            accountTypes: this.accountType
        })
            .then(accountDetails => {
                console.log("accountDetails:" + JSON.stringify(accountDetails))
                refreshApex(this.wireAccount);
                refreshApex(this.refreshAcc);
                const event = new ShowToastEvent({
                    title: 'Success',
                    message: 'Updated Successfully',
                    variant: 'success',
                    mode: 'dismissable'
                });
                this.view = accountDetails;
                console.log('cascfc'+JSON.stringify(this.view));
                this.isModalOpen = false;
                //   this.recid = this.recrdsID;
                //   this.connectedCallback();
                setTimeout(() => {
                    this.isLoaded = false;
                    this.dispatchEvent(event);
                }, 1300)
                const std = this.view
                const accEvent = new CustomEvent('acclist',{detail:{record:std}
                });
                this.dispatchEvent(accEvent);
            })
            .catch(error => {
                console.error("error" + JSON.stringify(error))
                const evt = new ShowToastEvent({
                    title: 'Error',
                    message: 'Not Changed Anything Yet',
                    variant: 'error',
                    mode: 'dismissable'
                });
                this.dispatchEvent(evt);
            })
        // Custom Event to pass data from view to accsearch (parent)
    }
    // ----------------Edit and Delete Contacts--------------
    handleRowAction(event) {
        const actionName1 = event.detail.action.name;
        const row1 = event.detail.row;
        const Id1 = row1.Id;
        if (actionName1 === 'editRecord') {
            refreshApex(this.detailCons );
            this.isEditModalOpen = true;
            this.editId = Id1;
            console.log('Enter in edit Contact');
        }
        else if (actionName1 === 'deleteRecord') {
            this.editId = Id1;
            this.isLoaded = true;
            deleteContact({ coId: this.editId })
                .then(result => {
                    if (result) {
                        const evt = new ShowToastEvent({
                            title: "Deleted",
                            message: 'Record Deleted Successfully',
                            variant: "success",
                        });
                        this.dispatchEvent(evt);
                    }
                    else {
                        console.log('Delete operation not successful');
                    }
                    refreshApex(this.conDataList);
                    setTimeout(() => {
                        this.isLoaded = false;
                        this.dispatchEvent(event);
                    }, 1300)
                })
                .catch(error => {
                    console.log(error);
                })
        }
    }
    closeEditModal() {
        this.isEditModalOpen = false;
    }
    submitContactDetails() {
        var inp = this.template.querySelectorAll("lightning-input");
        inp.forEach(function (element) {
            if (element.name == "fNames")
                this.FirstNames = element.value;
            else if (element.name == "lNames")
                this.LastName = element.value;
            else if (element.name == "emails")
                this.Email = element.value;
        }, this);
        this.isLoaded = true;
        UpdateContacts({
            ContactId: this.editId,
            firstNames: this.FirstNames,
            lastNames: this.LastName,
            Emails: this.Email
        })
            .then(contactDetails => {
                console.log("contactDetails:" + JSON.stringify(contactDetails))
                const event = new ShowToastEvent({
                    title: 'Success',
                    message: 'Updated Successfully',
                    variant: 'success',
                    mode: 'dismissable'
                });
                this.dispatchEvent(event);
                this.isEditModalOpen = false;
                setTimeout(() => {
                    this.isLoaded = false;
                    this.dispatchEvent(event);
                }, 1300)
                refreshApex(this.conDataList);
            })
            .catch(error => {
                console.error("error" + JSON.stringify(error))
                const evt = new ShowToastEvent({
                    title: 'Error',
                    message: 'Not Changed Anything Yet',
                    variant: 'error',
                    mode: 'dismissable'
                });
                this.dispatchEvent(evt);
            })
    }
}