import { Component, OnInit } from '@angular/core';
import { BlockchainInfoService } from './blockchain.info.service';
import { AlertService } from '../../common/alert.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CommonService } from '../../common/common.service';
import { AuthenticationService } from '../../common/authentication.service';
import { Title } from '@angular/platform-browser';
declare var $: any;

@Component({
    selector: 'app-dashboard-blockchain-info',
    templateUrl: './blockchain.info.component.html',
    styleUrls: ['./blockchain.info.component.css']
})
export class BlockchainInfoComponent implements OnInit {
    blockchainInfo;
    role;
    authData:any;
    instanceSettingObj:any;

    constructor(private blockchainInfoService: BlockchainInfoService, 
                private alertService: AlertService,
                private ngxService:NgxUiLoaderService,
                private commonService: CommonService,
                private titleService: Title,
                private authenticationService:AuthenticationService) {

    }
    ngOnInit() {
        this.authData = this.authenticationService.getCurrentAuthData();
        this.role     = this.authData.role;
        this.getWalletInfo();
    }

    getWalletInfo() {
        //this.ngxService.start();
        this.blockchainInfoService.getWalletInfo().subscribe(success => {
            //this.ngxService.stop();
            this.blockchainInfo = success['data'];
        }, error => {
            //this.ngxService.stop();
            this.alertService.showError(error.message);
        })
    }

    async downloadPrivateKey() {
        let paramData = ["general","localization"];

        try
        {
            let _response = await this.commonService.getInstanceSetting(paramData).toPromise();

            if(_response['status'] == 'success') {

                var anchor = document.createElement("a");
                anchor.download = _response['data'].general.domainName +'-'+this.authData.firstName+'-'+this.authData.lastName+'.key';
                var blob = new Blob([this.blockchainInfo.privateKey], { type: 'text/plain' });
                anchor.href = window.URL.createObjectURL(blob);
                anchor.click();
            }
            else
            {
                this.alertService.showError(_response['message']);
            }
        }
        catch(error)
        {
            this.alertService.showError("Problem Occured while downloading key file");
            console.warn(error);
        }        

        
    }
}