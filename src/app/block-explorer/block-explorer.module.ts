import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { BlockDetailsComponent } from './block-details/block-details.component';
import { TxDetailsComponent } from './tx-details/tx-details.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PublicHeaderComponent } from '../shared/public-header/public-header.component';

const routes: Routes = [
  {
    path: "",
    component: DashboardComponent,
    data: {
      title: "Block Explorer",
      role: null
    },
  },
  {
    path: "dasboard",
    component: DashboardComponent,
    data: {
      title: "Block Explorer",
      role: null
    },
  },
  {
    path: "block/:hashOrNumber",
    component: BlockDetailsComponent,
    data: {
      title: "Block Explorer: Block Details",
      role: null
    },
  },
  {
    path: "tx/:hash",
    component: TxDetailsComponent,
    data: {
      title: "Block Explorer: TxDetails",
      role: null
    },
  }
];

@NgModule({
  declarations: [DashboardComponent, BlockDetailsComponent, TxDetailsComponent, PublicHeaderComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule
  ]
})
export class BlockExplorerModule { }
