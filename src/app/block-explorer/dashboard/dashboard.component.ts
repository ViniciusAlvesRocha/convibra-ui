import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/common/common.service';
import { Title } from '@angular/platform-browser';
import { AlertService } from 'src/app/common/alert.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BlockExplorerService } from '../block-explorer.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  instanceSettingObj: any = {};
  
  searchForm:FormGroup;
  stats:any = {
    latestBlockNumber: 0,
    lastestGasPrice: 0,
    latestBlockTime: 0,
    latestDifficulty: 0
  };

  blockListing:any = {
    data: [],
    options:{
      fromBlockNumber: null,
      toBlockNumber: null,
      fallbackPerPage: 5,
      perPage: 5,
    },
    perPageOption:[
      {name:"5 Per Page",value:5},
      {name:"10 Per Page",value:10},
      {name:"50 Per Page",value:50},
      {name:"100 Per Page",value:100},
    ],
    listingExhausted:false,
    listingLoaded:false
  }
  baseRoute: string;
  isPublic: Boolean;

  constructor(
    private commonService: CommonService,
    private blockExplorerService: BlockExplorerService,
    private titleService: Title,
    private router: Router,
    private alertService:AlertService ) {
      blockExplorerService
      this.searchForm = new FormGroup({
        'term' : new FormControl('',[Validators.required]),
      })

      this.baseRoute = '/dashboard/block-explorer/';
      this.isPublic = false;
  }

  ngOnInit() {
    /* this.getInstanceSetting(); */
    this.getStats();
    
    if(this.router.url.includes("public"))
    {
        this.baseRoute = '/public/block-explorer/';
        this.isPublic = true;
    }
  }

  /* getInstanceSetting() {
    let paramData = ["general"];
    this.commonService.getInstanceSetting(paramData).subscribe(success => {
      this.instanceSettingObj.domainName = success['data'].general.domainName;
      this.titleService.setTitle(this.instanceSettingObj.domainName + ": Block Explorer");

    }, error => {
      this.alertService.showError(error.message);
    })
  } */

  searchTerm(){
    if(this.searchForm.valid == false)
    {
      this.alertService.showError("Please provide search term"); 
      return;
    }

    let _field = this.searchForm.value;
    this.blockExplorerService.guessEntity(_field.term).subscribe((_response:any) =>{
      
      if(_response.status == 'success')
      {
        // if(_response.data == 'block')
        // {
        //   this.router.navigate(['/dashboard/block-explorer/block/'+_field.term]);
        // }  
        // else if(_response.data == 'transaction')
        // {
        //   this.router.navigate(['/dashboard/block-explorer/tx/'+_field.term]);
        // }  
        this.router.navigate([`${this.baseRoute}tx/${_field.term}`]);
      }
      else
      {
        this.alertService.showError(_response.message); 
      }
    });
  }

  getStats(){
    try
    {
      this.blockExplorerService.getStats().subscribe((_response:any) => {
        if(_response.status == 'success')
        {
          this.stats = _response.data;
          this.stats.latestDifficulty = this.stats.latestDifficulty == null ? "NA" : this.stats.latestDifficulty; 

          /* Get Blocks based on latest block number */
          if(this.stats.latestBlockNumber > 0)
          {
            this.blockListing.options.toBlockNumber = parseInt(this.stats.latestBlockNumber);
            /* Set from block number based on to block number */
            this.blockListing.options.fromBlockNumber = (this.stats.latestBlockNumber - this.blockListing.options.perPage);
          }

          /* Get Block Listing */
          this.getBlocks(this.blockListing.options);
        }
        else
        {
          this.alertService.showError(_response.message); 
        }
      });
    }
    catch(e){
      console.warn(e);
    }
    
  }

  getBlocks(_options){
    try
    {
      this.blockExplorerService.getBlocks(_options).subscribe((_response:any) => {
        this.blockListing.listingLoaded = true;
        if(_response.status == 'success')
        {
          this.blockListing.data = _response.data.listing;
          this.blockListing.isExhausted = _response.data.listingExhausted;
          /* Set  */
        }
        else
        {
          this.alertService.showError(_response.message); 
        }
        
      }, error => {
        this.blockListing.listingLoaded = true;
        this.alertService.showError(error.message); 
      });
    }
    catch(e){
      console.warn(e);
    }
  }

  navigateBlocksPagination(_direction){
    if(_direction == "oldest")
    {
      this.blockListing.options.fromBlockNumber = 0;
      this.blockListing.options.toBlockNumber = this.blockListing.options.fromBlockNumber + this.blockListing.options.perPage;
    }
    else if(_direction == 'most_recent')
    {
      this.blockListing.options.toBlockNumber = this.stats.latestBlockNumber;
      this.blockListing.options.fromBlockNumber = (this.blockListing.options.toBlockNumber - this.blockListing.options.perPage);
    }
    else if(_direction == 'previous')
    {
      this.blockListing.options.toBlockNumber = this.blockListing.options.fromBlockNumber;
      this.blockListing.options.fromBlockNumber = (this.blockListing.options.toBlockNumber - this.blockListing.options.perPage);
    }
    else
    {
      this.blockListing.options.fromBlockNumber = this.blockListing.options.toBlockNumber;
      this.blockListing.options.toBlockNumber = this.blockListing.options.fromBlockNumber + this.blockListing.options.perPage;
    }

    // console.log(this.blockListing.options)
    /* Get Block Listing */
    this.getBlocks(this.blockListing.options);
  }

  changeBlocksPerPage(){
    this.blockListing.options.fromBlockNumber = (this.blockListing.options.toBlockNumber - this.blockListing.options.perPage);
    /* Get Block Listing */
    this.getBlocks(this.blockListing.options);
  }


 
  
}
