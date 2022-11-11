import { LightningElement, track, wire, api } from 'lwc';
import getAccountData from '@salesforce/apex/AccountSearch.getAccountData';
import getAccountDataDetails from '@salesforce/apex/AccountSearch.getAccountDataDetails';
import { refreshApex } from '@salesforce/apex';
export default class AccountSearch extends LightningElement {
    searchKey;
    @api accounts;
    @api recrdsID;
    @track viewRecord
    @track showViewComponent = false;
    @track sortBy;
    @track sortDirection;
    @api AccountId;
    @api AccId;
    @api totalAccounts
     visibleAccounts = [];
     visibleAcc = [];
    @track columns = [];
    @track updateKey
//    @track searchValue;
   get options() {
    return [
        { label: 'Ascending', value: 'ascending' },
        { label: 'Descending', value: 'descending' },
    ];
}
    connectedCallback() {
        this.columns = [
            {label:'Name', fieldName:'Name'},
            {
                type:"button", typeAttributes: {
                    label: 'View',
                    name: 'View',
                    title: 'View',
                    disabled: false,
                    value: 'view',
                    iconPosition: 'left',
                    variant:'base'
                }
            }
        ];
    }
    // Sorting action code *************
    handleChange(event) {
        this.value = event.target.value;
        getAccountDataDetails({ Value: this.value })
            .then((result) => {
                this.visibleAccounts = result;
                // refreshApex(this.visibleAccounts);
            })
            .catch(error => {
                console.log(error);
            })
    }
    //This Funcation will get the value from Text Input.
    handelSearchKey(event){
        this.searchKey = event.target.value;
        getAccountData({textkey: this.searchKey})
        .then(result => {
                this.accounts = result;
                // refreshApex(this.accounts);
        })
        .catch( error=>{
            this.accounts = null;
        })
    }
    // Get Account data from apex for datatable
    @wire(getAccountData)
    wiredaccount({error, data}){
        if(data){
            this.totalAccounts = data
            console.log(this.totalAccounts)
        }
        if(error){
            console.error(error)
        }
    }
    updateAccountHandler(event){
        this.visibleAcc=event.detail.records
        console.log(event.detail.records)
    }
    showView(event) {
        this.showViewComponent = true;
        const recId =  event.detail.row.Id;
        this.recrdsID =  recId
        const actionName = event.detail.action.name;
      }
      submitDetails(event){
        this.visibleAcc =event.detail.record;
        console.log('data getting',JSON.stringify(this.visibleAcc));
      }
}