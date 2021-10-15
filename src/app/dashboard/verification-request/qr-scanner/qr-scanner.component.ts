import { Component, OnInit } from '@angular/core';
import { CertificateService } from '../../certificate/certificate.service';
import { AlertService } from '../../../common/alert.service';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { CommonService } from '../../../common/common.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-qr-scanner',
  templateUrl: './qr-scanner.component.html',
  styleUrls: ['./qr-scanner.component.css']
})
export class QrScannerComponent implements OnInit {

  /* QRcode scanner defined data */
  availableDevices: MediaDeviceInfo[];
  currentDevice: MediaDeviceInfo = null;

  hasDevices: boolean;
  hasPermission: boolean;

  qrResultString: string;
  torchEnabled = false;
  torchAvailable$ = new BehaviorSubject<boolean>(false);
  /* --------------------------- */

  certificateData: any = {};
  instanceSettingObj:any = {};

  constructor(private certificateService: CertificateService, 
              private alertService: AlertService,
              private route:Router,
              private commonService: CommonService,
              private titleService: Title) { }

  ngOnInit() {
    // this.spinner.show();

    /* let test = `{"issuer":"0xcfABF8D885C2947e5F5957D2bB3720C20BCa9397","certificateHash":"2868344bffae2c131ae523574fb748f29f788a8e81b1a8b145723bd0274fe9a2","merkleRoot":"cf7d5ed07d44d26dfb322451a3978538a1696df2d42d95c70d2df9f13d0a8a91","certificateStoreMainnet":"0x14E5478DE67A6236dCEB9AeF51BA9BDc738dc640","certificateStoreUniblocknet":"0x873AC7D31980eF8767ab6686B5F4B3796Fbc629b"}`;
    test = JSON.parse(test);
    this.getCertificateId(test); */
    /* this.getInstanceSetting(); */
  }

  /* getInstanceSetting(){
      let paramData = ["general"];
      this.commonService.getInstanceSetting(paramData).subscribe(success => {
          this.instanceSettingObj.domainName = success['data'].general.domainName;
          this.titleService.setTitle(this.instanceSettingObj.domainName+": QR Scan");

      }, error => {
          this.alertService.showError(error.message);
      }) 
  } */

  /* Qrcode scanner event handler*/
  onCamerasFound(devices: MediaDeviceInfo[]): void {
    this.availableDevices = devices;
    this.hasDevices = Boolean(devices && devices.length);

    setTimeout(()=>{
      // this.spinner.hide();
    },3000);  
  }

  camerasNotFound(e): void {
    console.log("Device Not Found Info",e);
  }

  async onCodeResult(resultString: string) {
    try
    {
      this.qrResultString = JSON.parse(resultString);
    }
    catch(e)
    {
      // Swal.fire({
      //   type: "error",
      //   text: "Invalid QR code",
      //   title: "Opps..."
      // });
    }


    await this.getCertificateId(this.qrResultString);
  }

  onDeviceSelectChange(selected: string) {
    const device = this.availableDevices.find(x => x.deviceId === selected);
    this.currentDevice = device || null;

    console.log("Device Data",this.currentDevice);
  }

  onHasPermission(has: boolean) {
    this.hasPermission = has;

    console.log("Device Persmission",this.hasPermission);
  }

  openInfoDialog() {
    const data = {
      hasDevices: this.hasDevices,
      hasPermission: this.hasPermission,
    };
    console.log("Info Dialog",data);
  }

  onTorchCompatible(isCompatible: boolean): void {
    this.torchAvailable$.next(isCompatible || false);

    console.log("Tourch Compatible",isCompatible);
  }

  toggleTorch(): void {
    this.torchEnabled = !this.torchEnabled;

    console.log("Tourch enable",this.torchEnabled);
  }

  scanErrorHandler(e){
    console.log("Scan Error Handler", e)
  }

  scanFailureHandler(e){
    console.log("Scan Failure Handler", e)
  }

  scanCompleteHandler(e){
    console.log("Scan Complete Handler", e)
  }
/* --------------------------- */

  getCertificateId(qrResultData){
    this.certificateService.getCertificateId(qrResultData).subscribe(success => {
      this.route.navigateByUrl('/public/certificate/'+success['data']['_id']);
    
    }, error => {
      this.alertService.showError(error.message);
    })
  }

}