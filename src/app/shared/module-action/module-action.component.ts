import { Component, OnInit, Input } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-module-action',
  templateUrl: './module-action.component.html',
  styleUrls: ['./module-action.component.css']
})
export class ModuleActionComponent implements OnInit {

  @Input() public submitTitle:String;
  @Input() public showBack:Boolean;

  constructor(private location:Location) { }

  ngOnInit() {

    console.log(this.submitTitle,"this.submitTitle");
    console.log(this.showBack,"this.showBack");
  }

  clickBack(){
    this.location.back();
  }

}
