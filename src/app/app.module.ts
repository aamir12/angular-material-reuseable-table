import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MaterialExampleModule } from '../material.module';
import { TableOverviewExample } from './table-overview-example';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { HttpClientModule } from '@angular/common/http';
// import { MatTableListComponent } from './mat-table-list/mat-table-list.component';
import { WindowProvider } from './window.service';
import { MatTableListModule } from './mat-table-list/mat-table-list.module';
import { CurrencyPipe } from '@angular/common';

@NgModule({
  declarations: [TableOverviewExample],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    MatNativeDateModule,
    MaterialExampleModule,
    ReactiveFormsModule,
    MatTableListModule,
  ],
  providers: [WindowProvider, CurrencyPipe],
  bootstrap: [TableOverviewExample],
})
export class AppModule {}
