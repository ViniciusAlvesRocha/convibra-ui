import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { InstanceSetting } from './instance-setting.service';
import { FormGroup, Validators, FormControl, FormArray, FormBuilder } from '@angular/forms';
import { AlertService } from 'src/app/common/alert.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CommonService } from '../../common/common.service';
import { Title } from '@angular/platform-browser';
import * as moment from 'moment-timezone';
declare var $: any;
@Component({
	selector: 'app-instance-setting',
	templateUrl: './instance-setting.component.html',
	styleUrls: ['./instance-setting.component.css']
})
export class InstanceSettingComponent implements OnInit {
	@ViewChild('logo') logo: ElementRef;
	@ViewChild('favicon') favicon: ElementRef;
	@ViewChild('organizationPicture') organizationPicture: ElementRef;

	isEditable:any = {
		generalInfo:false,
		localizationInfo:false,
		emailSetting:false,
		googleApiSetting:false,
		apiFieldConfig:false,
		certificateAccessTrigger:false,
		blockchain:false
	}

	generalInfoForm: FormGroup;
	localizationInfoForm: FormGroup;
	emailSettingForm: FormGroup;
	googleSettingInfoForm: FormGroup;
	certificateAccessForm: FormGroup;

	apiFieldConfigForm: FormGroup;
	apiFields: FormArray;
	instanceSettingObj: any = {};
	showAccessStatus = false;
	selectedAccessType: any = '';

	/* certificateStoreForm: FormGroup;
	payMentgatewaySettingFrom: FormGroup;
	walletInfoForm: FormGroup; */


	data: any = {};
	dateFormats: any = ["DD-MM-YYYY",
		"DD/MM/YYYY",
		"YYYY-MM-DD",
		"YYYY/MM/DD",
		"YYYY/MM/DD",
		"DD MMMM YYYY"];

	timeFormats: any = [
		"hh:mm:ss",
		"HH:mm:ss"
	];

	timeZones: any = moment.tz.names();
	apiConfigData: any;
	blockchainInfo: any = {};
	generalInfo: any = {};

	constructor(private instanceService: InstanceSetting,
		private alertService: AlertService,
		private _fb: FormBuilder,
		private ngxService: NgxUiLoaderService,
		private commonService: CommonService,
		private titleService: Title) {

		this.prepareAllFormGroup();

	}

	ngOnInit() {
		this.getGeneralInfo();
		this.getLocalizationInfo();
		this.getEmailSettingInfo();
		this.getGoogleSettingInfo();
		this.getApiFieldConfigInfo();
		this.getCertificateAccessInfo();
		this.getBlockchainInfo();
		/* this.getInstanceSetting(); */

		/* 
		this.getPaymetGetwaySettingInfo();
		this.getWalletInfo(); */

		// console.log((this.apiFieldConfigForm.get('apiFields'))['controls']);
		// console.log(moment.tz.names());
	}

	enableEditMode(_section){
		try
		{
			this.isEditable[_section] = true
		}
		catch(e)
		{
			console.warn("Invalid Section");
		}
	}

	/* getInstanceSetting() {
		let paramData = ["general"];
		this.commonService.getInstanceSetting(paramData).subscribe(success => {
			this.instanceSettingObj.domainName = success['data'].general.domainName;
			this.titleService.setTitle(this.instanceSettingObj.domainName + ": Instance Setting");

		}, error => {
			this.alertService.showError(error.message);
		})
	} */

	createApiConfigField(_sequence?, _field?, _criteria?): FormGroup {

		let isEmpty = _field == undefined;
		if (isEmpty) {
			return new FormGroup({
				"sequence": new FormControl('', Validators.required),
				"name": new FormControl(''),
				"systemUniqueness": new FormControl(''),
				"blockchain": new FormControl(''),
				"listing": new FormControl(''),
				"details": new FormControl(''),
				"comparativeUniqueness": new FormControl('')
			});
		}
		else {
			return new FormGroup({
				"sequence": new FormControl(_sequence),
				"name": new FormControl(_field),
				"systemUniqueness": new FormControl(_criteria.systemUniqueness.includes(_sequence)),
				"blockchain": new FormControl(_criteria.blockchain.includes(_sequence)),
				"listing": new FormControl(_criteria.listing.includes(_sequence)),
				"details": new FormControl(_criteria.details.includes(_sequence)),
				"comparativeUniqueness": new FormControl(_criteria.comparativeUniqueness.includes(_sequence))
			});
		}

	}

	// GET GENERAL INFO
	getGeneralInfo() {
		try {
			let _promis = this.instanceService.getGeneralInfo().toPromise();
			_promis.then((response: any) => {
				if (response.status == 'success') {
					this.generalInfo = response.data.general;
					let data = this.generalInfo;

					this.generalInfoForm.get('organizationName').setValue(data.organizationName);
					this.generalInfoForm.get('domainName').setValue(data.domainName);
					this.generalInfoForm.get('address').setValue(data.address);
					this.generalInfoForm.get('city').setValue(data.city);
					this.generalInfoForm.get('state').setValue(data.state);
					this.generalInfoForm.get('country').setValue(data.country);
					this.generalInfoForm.get('zipCode').setValue(data.zipCode);
					this.generalInfoForm.get('phone').setValue(data.phone);
					this.generalInfoForm.get('registrationNumber').setValue(data.registrationNumber);
					this.generalInfoForm.get('coinName').setValue(data.coinName);
					this.generalInfoForm.get('homePageLeafletText').setValue(data.homePageLeafletText);

				}
			}).catch(error => {
				this.alertService.showError(error.message);
			})
		} catch (error) {
			this.alertService.showError(error.message);
		}
	}
	// UPDATE GENERAL INFO
	updateGeneralInfo() {

		if (this.generalInfoForm.invalid) {
			this.alertService.showError('Please check all fields');
			return false;
		}
		var frmValue = this.generalInfoForm.value;

		let frmData = new FormData();


		if (this.logo.nativeElement.files[0] != undefined) {
			frmData.append("logo", this.logo.nativeElement.files[0]);
		}

		if (this.favicon.nativeElement.files[0] != undefined) {
			frmData.append("favicon", this.favicon.nativeElement.files[0]);
		}

		if (this.organizationPicture.nativeElement.files[0] != undefined) {
			frmData.append("organizationPicture", this.organizationPicture.nativeElement.files[0]);
		}

		frmData.append("organizationName", frmValue.organizationName);
		frmData.append("domainName", frmValue.domainName);
		frmData.append("address", frmValue.address);
		frmData.append("city", frmValue.city);
		frmData.append("state", frmValue.state);
		frmData.append("country", frmValue.country);
		frmData.append("zipCode", frmValue.zipCode);
		frmData.append("phone", frmValue.phone);
		frmData.append("registrationNumber", frmValue.registrationNumber);
		frmData.append("coinName", frmValue.coinName);
		frmData.append("homePageLeafletText", frmValue.homePageLeafletText);

		/*  frmData.append("mongodbConnectionUrl", frmValue.mongodbConnectionUrl);
		 frmData.append("certificateStoreAddressMainnet", frmValue.certificateStoreAddressMainnet);
		 frmData.append("certificateStoreAddressBackup", frmValue.certificateStoreAddressBackup);
		 frmData.append("uniblockApiEndpoint",frmValue.uniblockApiEndpoint),
		 frmData.append("uniblockApiKey",frmValue.uniblockApiKey) */

		try {
			// //this.ngxService.start();
			var _promis = this.instanceService.updateGeneralInfo(frmData).toPromise();
			_promis.then((response: any) => {
				if (response.status == 'success') {
					// //this.ngxService.stop();
					this.alertService.showSuccess('General information updated successfully');

					/* Switch Editable Mode */
					this.isEditable.generalInfo = false;

					window.location.reload();
				}
			}).catch(error => {
				// //this.ngxService.stop();
				console.log(error);
				this.alertService.showError(error.message);
			})
		} catch (error) {
			// //this.ngxService.stop();
			console.log(error);
			this.alertService.showError(error.message);
		}
	}
	// GET LOCALIZATION INFO
	getLocalizationInfo() {
		try {
			let _promis = this.instanceService.getLocalizationInfo().toPromise();
			_promis.then((response: any) => {
				if (response.status == 'success') {
					var data = response.data.localization;
					// console.log(data);
					this.localizationInfoForm.get('dateFormat').setValue(data.dateFormat);
					this.localizationInfoForm.get('timeFormat').setValue(data.timeFormat);
					this.localizationInfoForm.get('timeZone').setValue(data.timeZone);
					this.localizationInfoForm.get('defaultLanguage').setValue(data.defaultLanguage);
				}
			}).catch(error => {


				this.alertService.showError(error.message);
			})
		} catch (error) {
			this.alertService.showError(error.message);
		}
	}
	// UPDATE LOCALIZATION INFO
	updateLocalizationInfo() {
		if (this.localizationInfoForm.invalid) {
			this.alertService.showError('Please check all fields');
			return false;
		}
		var frmValue = this.localizationInfoForm.value;
		// console.log(frmValue);
		try {
			// //this.ngxService.start();
			var _promis = this.instanceService.updateLocalizationInfo(frmValue).toPromise();
			_promis.then((response: any) => {
				
				/* Switch Editable Mode */
				this.isEditable.localizationInfo = false;

				if (response.status == 'success') {
					// //this.ngxService.stop();
					this.alertService.showSuccess('Localization information updated successfully');
				}

			}).catch(error => {
				// //this.ngxService.stop();
				this.alertService.showError(error.message)
			})

		} catch (error) {
			// //this.ngxService.stop();
			this.alertService.showError(error.message)
		}
	}

	// GET EMAIL SETTING INFO
	getEmailSettingInfo() {
		try {
			let _promis = this.instanceService.getEmailSettingInfo().toPromise();
			_promis.then((response: any) => {
				if (response.status == 'success') {
					var data = response.data.emailSettings;
					// console.log(data);
					this.emailSettingForm.get('host').setValue(data.host);
					this.emailSettingForm.get('userName').setValue(data.userName);
					this.emailSettingForm.get('password').setValue(data.password);
					this.emailSettingForm.get('port').setValue(data.port);

					/* this.emailSettingForm.get('smtp').setValue(data.smtp);
					this.emailSettingForm.get('enableQueue').setValue(data.enableQueue);
					this.emailSettingForm.get('queueLimit').setValue(data.queueLimit); */
				}
			}).catch(error => {
				this.alertService.showError(error.message);
			})
		} catch (error) {
			this.alertService.showError(error.message);
		}
	}


	// UPDATE LOCALIZATION INFO
	updateEmailSettingInfo() {
		if (this.emailSettingForm.invalid) {
			this.alertService.showError('Please check all fields');
			return false;
		}
		var frmData = this.emailSettingForm.value;
		// console.log(frmData);
		// return;
		try {
			// //this.ngxService.start();
			var _promis = this.instanceService.updateEmailSettingInfo(frmData).toPromise();
			_promis.then((response: any) => {

				/* Switch Editable Mode */
				this.isEditable.emailSetting = false;

				if (response.status == 'success') {
					// //this.ngxService.stop();
					this.alertService.showSuccess('Email settings updated successfully');
				}

			}).catch(error => {
				// //this.ngxService.stop();
				this.alertService.showError(error.message)
			})

		} catch (error) {
			// //this.ngxService.stop();
			this.alertService.showError(error.message)
		}
	}
	// GET GOOGLE API SETTING INFO
	getGoogleSettingInfo() {
		try {
			let _promis = this.instanceService.getGoogleApiSettingInfo().toPromise();
			_promis.then((response: any) => {
				if (response.status == 'success') {
					var data = response.data.googleApiSettings;
					// console.log(data);
					this.googleSettingInfoForm.get('apiKey').setValue(data.apiKey);
					this.googleSettingInfoForm.get('clientId').setValue(data.clientId);
				}
			}).catch(error => {
				this.alertService.showError(error.message);
			})
		} catch (error) {
			this.alertService.showError(error.message);
		}
	}
	// UPDATE GOOGLE API SETTING INFO
	updateGoogleSettingInfo() {
		if (this.googleSettingInfoForm.invalid) {
			this.alertService.showError('Please check all fields');
			return false;
		}
		var frmData = this.googleSettingInfoForm.value;
		// console.log(frmData);
		// return;
		try {
			// //this.ngxService.start();
			var _promis = this.instanceService.updateGoogleApiSettingInfo(frmData).toPromise();
			_promis.then((response: any) => {
				/* Switch Editable Mode */
				this.isEditable.googleApiSetting = false;

				if (response.status == 'success') {
					// //this.ngxService.stop();
					this.alertService.showSuccess('Google Api setting information updated successfully');
				}

			}).catch(error => {
				// //this.ngxService.stop();
				this.alertService.showError(error.message)
			})

		} catch (error) {
			// //this.ngxService.stop();
			this.alertService.showError(error.message)
		}
	}

	// GET API FIELD CONFIG INFO
	getApiFieldConfigInfo() {
		try {
			let _promis = this.instanceService.getAPIFieldConfigInfo().toPromise();
			_promis.then((response: any) => {
				if (response.status == 'success') {

					let _fields = Object.values(response.data.apiFieldConfig.fields);
					// this.apiConfigData = Object.entries(this.apiConfigData).map(([key, value]) => ({key,value}));
					// this.apiConfigData = Object.values(tempData);

					_fields.forEach((_field, _sequence) => {
						this.apiFields = this.apiFieldConfigForm.get('apiFields') as FormArray;
						this.apiFields.push(this.createApiConfigField(_sequence, _field, response.data.apiFieldConfig.criteria));
					});


				}
			}).catch(error => {
				this.alertService.showError(error.message);
			})
		} catch (error) {
			this.alertService.showError(error.message);
		}
	}
	// UPDATE API FIELD CONFIG INFO
	updateApiFieldConfigInfo() {
		if (this.apiFieldConfigForm.invalid) {
			this.alertService.showError('Please check all fields');
			return false;
		}
		var frmData = this.apiFieldConfigForm.value;

		let tmpArrSeqence = [];
		let arrFrmDataValue = frmData.apiFields;

		for (let key in arrFrmDataValue) {

			let _sequence = arrFrmDataValue[key].sequence;


			if (isNaN(_sequence) == true) {
				this.alertService.showError('Sequence should be vaild number');
				return false;
			}

			// if(parseInt(_sequence) < 0 || parseInt(_sequence) > 11){
			//   this.alertService.showError('Sequence should be between 0 to 11');
			//   return false;
			// }

			if (Number.isInteger(parseFloat(_sequence)) == false) {
				this.alertService.showError('Sequence should be only digit number');
				return false;
			}

			tmpArrSeqence.push(parseInt(arrFrmDataValue[key].sequence));
		}


		/* check duplicates columns */
		let arrDuplicates = tmpArrSeqence.reduce(function (acc, el, i, arr) {
			if (arr.indexOf(el) !== i && acc.indexOf(el) < 0) acc.push(el); return acc;
		}, []);

		// if(arrDuplicates.length > 0){
		//   this.alertService.showError('Some duplicate sequence found, Duplicate sequence are '+JSON.stringify(arrDuplicates));
		//   return false;
		// }

		let finalStoreObj = {
			"criteria": {
				"systemUniqueness": [],
				"blockchain": [],
				"listing": [],
				"details": [],
				"comparativeUniqueness": []
			}, "fields": {}
		};


		for (let key in arrFrmDataValue) {
			/* build Field Data */
			finalStoreObj["fields"][arrFrmDataValue[key].sequence] = arrFrmDataValue[key].name;

			/* build criteria data */
			if (arrFrmDataValue[key].systemUniqueness == true) {
				finalStoreObj["criteria"]["systemUniqueness"].push(parseInt(arrFrmDataValue[key].sequence));
			}

			if (arrFrmDataValue[key].blockchain == true) {
				finalStoreObj["criteria"]["blockchain"].push(parseInt(arrFrmDataValue[key].sequence));
			}

			if (arrFrmDataValue[key].listing == true) {
				finalStoreObj["criteria"]["listing"].push(parseInt(arrFrmDataValue[key].sequence));
			}

			if (arrFrmDataValue[key].details == true) {
				finalStoreObj["criteria"]["details"].push(parseInt(arrFrmDataValue[key].sequence));
			}

			if (arrFrmDataValue[key].comparativeUniqueness == true) {
				finalStoreObj["criteria"]["comparativeUniqueness"].push(parseInt(arrFrmDataValue[key].sequence));
			}
		}


		try {

			/* Convert Object to Array  */
			let _tmpFields = [];
			for (let _tmpIndex in finalStoreObj.fields) {
				_tmpFields[parseInt(_tmpIndex)] = finalStoreObj.fields[_tmpIndex];
			}

			finalStoreObj.fields = [];
			finalStoreObj.fields = _tmpFields

			if (finalStoreObj.fields['length'] < 12) {
				this.alertService.showError("Please make sure no repeated index are given.")
				return;
			}


			// //this.ngxService.start();
			var _promis = this.instanceService.updateAPIFieldConfigInfo(finalStoreObj).toPromise();
			_promis.then((response: any) => {

				/* Switch Editable Mode */
				this.isEditable.apiFieldConfig = false;

				if (response.status == 'success') {
					// //this.ngxService.stop();
					this.alertService.showSuccess('API field Config. information updated successfully');
				}

			}).catch(error => {
				// //this.ngxService.stop();
				this.alertService.showError(error.message)
			})

		} catch (error) {
			// //this.ngxService.stop();
			this.alertService.showError(error.message)
		}
	}
	// GET CERTIFICATE ACCESS TRIGGER INFO
	getCertificateAccessInfo() {
		try {
			let _promis = this.instanceService.getCertificateAccessInfo().toPromise();
			_promis.then((response: any) => {
				if (response.status == 'success') {
					var data = response.data.certificateAccessTrigger;

					if (data.accessType == 2) {
						this.showAccessStatus = true;
					}
					this.selectedAccessType = data.accessType;

					this.certificateAccessForm.get('accessCondition').setValue(data.accessCondition);
				}
			}).catch(error => {
				this.alertService.showError(error.message);
			})
		} catch (error) {
			this.alertService.showError(error.message);
		}
	}
	// UPDATE CERTIFICATE ACCESS TRIGGER INFO 
	updateCertificateAccessInfo() {
		if (this.certificateAccessForm.invalid) {
			this.alertService.showError('Please check all fields');
			return false;
		}
		var frmData = this.certificateAccessForm.value;

		if (frmData.accessType != '1' && frmData.accessType != '2') {
			this.alertService.showError('Please select access type');
			return false;
		}

		if (frmData.accessType == '2' && (frmData.accessCondition == null || frmData.accessCondition == "")) {
			this.alertService.showError('Please add access condition');
			return false;
		}

		try {
			// //this.ngxService.start();
			var _promis = this.instanceService.updateCertificateAccessInfo(frmData).toPromise();
			_promis.then((response: any) => {
				/* Switch Editable Mode */
				this.isEditable.certificateAccessTrigger = false;

				if (response.status == 'success') {
					// //this.ngxService.stop();
					this.alertService.showSuccess('Certificate access information updated successfully');
				}

			}).catch(error => {
				// //this.ngxService.stop();
				this.alertService.showError(error.message)
			})

		} catch (error) {
			// //this.ngxService.stop();
			this.alertService.showError(error.message)
		}
	}

	getBlockchainInfo() {
		try {
			let _promis = this.instanceService.getBlockchainInfo().toPromise();
			_promis.then((response: any) => {
				if (response.status == 'success') {
					this.blockchainInfo = response.data;
				}
			}).catch(error => {
				this.alertService.showError(error.message);
			})
		} catch (error) {
			this.alertService.showError(error.message);
		}
	}

	// GET PAYMETGETWAY SETTING INFO
	getPaymetGetwaySettingInfo() {
		/* try {
		  let _promis = this.instanceService.getPaymetGetwaySettingInfo().toPromise();
		  _promis.then((response: any) => {
			if (response.status == 'success') {
			  var data = response.data.paymentGatewayConfig;
			  this.payMentgatewaySettingFrom.get('paymentGatewayType').setValue(data.paymentGatewayType);
			}
		  }).catch(error => {
			this.alertService.showError(error.message);
		  })
		} catch (error) {
		  this.alertService.showError(error.message);
		} */
	}
	// UPDATE PAYMENT GATEWAY SETTING INFO
	updatePaymetGetwaySettingInfo() {
		/* if (this.payMentgatewaySettingFrom.invalid) {
		  this.alertService.showError('Please check all fields');
		  return false;
		}
		var frmData = this.payMentgatewaySettingFrom.value;
		try {
		  var _promis = this.instanceService.updatePaymetGetwaySettingInfo(frmData).toPromise();
		  _promis.then((response: any) => {
			if (response.status == 'success') {
			  this.alertService.showSuccess(response.message);
			}
	
		  }).catch(error => {
			this.alertService.showError(error.message)
		  })
	
		} catch (error) {
		  this.alertService.showError(error.message)
		} */
	}



	// GET WALLET INFO
	getWalletInfo() {
		/* try {
		  let _promis = this.instanceService.getWalletInfo().toPromise();
		  _promis.then((response: any) => {
			if (response.status == 'success') {
			  var data = response.data.walletAddress;
			  this.walletInfoForm.get('balanceInMainnet').setValue(data.balanceInMainnet);
			  this.walletInfoForm.get('balanceInUniblock').setValue(data.balanceInUniblock);
			}
		  }).catch(error => {
			this.alertService.showError(error.message);
		  })
		} catch (error) {
		  this.alertService.showError(error.message);
		} */
	}
	// UPDATE WALLET INFO
	updateWalletInfo() {
		/* if (this.walletInfoForm.invalid) {
		  this.alertService.showError('Please check all fields');
		  return false;
		}
		var frmData = this.walletInfoForm.value;
		try {
		  var _promis = this.instanceService.updateWalletInfo(frmData).toPromise();
		  _promis.then((response: any) => {
			if (response.status == 'success') {
			  this.alertService.showSuccess(response.message);
			}
	
		  }).catch(error => {
			this.alertService.showError(error.message)
		  })
	
		} catch (error) {
		  this.alertService.showError(error.message)
		} */
	}


	prepareAllFormGroup() {
		// General Info Form
		this.generalInfoForm = new FormGroup({
			logo: new FormControl(""),
			favicon: new FormControl(""),
			organizationName: new FormControl("", Validators.required),
			domainName: new FormControl("", Validators.required),
			address: new FormControl("", Validators.required),
			city: new FormControl("", Validators.required),
			state: new FormControl("", Validators.required),
			country: new FormControl("", Validators.required),
			zipCode: new FormControl("", [Validators.required, Validators.pattern('[0-9]*')]),
			phone: new FormControl("", Validators.required),
			registrationNumber: new FormControl("", Validators.required),
			organizationPicture: new FormControl(""),
			coinName: new FormControl("", Validators.required),
			homePageLeafletText: new FormControl("", Validators.required),

			/*  mongodbConnectionUrl: new FormControl("", Validators.required),
			 certificateStoreAddressMainnet: new FormControl("", Validators.required),
			 certificateStoreAddressBackup: new FormControl("", Validators.required),
			 uniblockApiEndpoint: new FormControl('',Validators.required),
			 uniblockApiKey: new FormControl('',Validators.required) */

		});
		// Localization Info Form
		this.localizationInfoForm = new FormGroup({

			dateFormat: new FormControl("", Validators.required),
			timeFormat: new FormControl("", Validators.required),
			timeZone: new FormControl("", Validators.required),
			defaultLanguage: new FormControl("", Validators.required)
		})
		// Email setting Form
		this.emailSettingForm = new FormGroup({
			// smtp: new FormControl("", Validators.required),
			host: new FormControl("", Validators.required),
			userName: new FormControl("", Validators.required),
			password: new FormControl("", Validators.required),
			port: new FormControl("", Validators.required),
			// enableQueue: new FormControl(""),
			// queueLimit: new FormControl("")
		})
		// Google API Setting Form
		this.googleSettingInfoForm = new FormGroup({
			apiKey: new FormControl("", Validators.required),
			clientId: new FormControl("", Validators.required)
		})



		// Certificate Access Trigger Form
		this.certificateAccessForm = new FormGroup({
			accessType: new FormControl("", Validators.required),
			accessCondition: new FormControl()
		})



		// Payment Gateway setting Form
		/* this.payMentgatewaySettingFrom = new FormGroup({
		  paymentGatewayType: new FormControl("", Validators.required)
		}) */

		// walletInfo Form 
		/* this.walletInfoForm = new FormGroup({
		  balanceInMainnet: new FormControl("", Validators.required),
		  balanceInUniblock: new FormControl("", Validators.required)
		}) */

		// API Field Form
		/* this.apiFieldConfigForm = new FormGroup({
		  "sequence[]": new FormControl("",[]),
		  "name[]": new FormControl("",[]),
		  "systemUniqueness[]": new FormControl("",[]),
		  "blockchain[]": new FormControl("",[]),
		  "listing[]": new FormControl("",[]),
		  "details[]": new FormControl("",[]),
		  "comparativeUniqueness[]": new FormControl("",[])
		}) */

		this.apiFieldConfigForm = new FormGroup({
			// apiFields: new FormArray([ this.createApiConfigField() ])
			apiFields: new FormArray([])
		});
	}

	accessTriggerChange(value) {
		if (value == 2) {
			this.showAccessStatus = true;
		}
		else {
			this.showAccessStatus = false;
		}
	}

}
