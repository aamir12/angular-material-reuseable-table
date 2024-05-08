import { Component, Inject } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { IActionBtnConfiguration, IColumn, IUserData } from './model';
import { createNewUser } from './data';
import { WINDOW } from './window.service';

import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'table-overview-example',
  styleUrls: ['table-overview-example.css'],
  templateUrl: 'table-overview-example.html',
})
export class TableOverviewExample {
  data: IUserData[] = [];
  textSearch = '';
  project_type = 'ALL';
  status_type = '1';
  filterValue: string = '';

  //Define column configuation
  //transForm,style,disableSorting are optional

  columns: IColumn[] = [
    {
      name: 'id',
      disableSorting: true,
      displayName: 'ID',
      headerStyle: { width: '10%' },
      headerClasses: ['text-center'],
      dataClasses: ['text-center'],
    },
    {
      name: 'name',
      disableSorting: false,
      displayName: 'Name',

      headerClasses: ['text-center'],
      dataClasses: ['text-center'],
      transForm: (value: any) => {
        return value.toLowerCase();
      },
    },
    {
      name: 'fruit',
      disableSorting: false,
      displayName: 'Fruit',
      headerClasses: ['text-center'],
      dataClasses: ['text-center'],
      transForm: (value: any) => value.toUpperCase(),
    },
    {
      name: 'price',
      disableSorting: false,
      displayName: 'Price',
      headerClasses: ['text-center'],
      dataClasses: ['text-center'],
      transForm: (value: string) =>
        this.currencyPipe.transform(value, 'USD', 'symbol'),
    },
  ];

  actionBtns: IActionBtnConfiguration<IUserData> = {
    positions: 'start',
    headerClasses: ['text-center'],
    dataStyle: {
      backgroundColor: '#f1f1f1',
    },
    dataClasses: ['text-center'],
    buttons: [
      {
        name: 'View',
        onClick: this.onView.bind(this),
        icon: 'visibility',
        access: this.canView.bind(this),
      },
      {
        name: 'Edit',
        onClick: this.onEdit.bind(this),
        icon: 'edit',
        access: this.canEdit.bind(this),
      },
      {
        name: 'Delete',
        onClick: this.onDelete.bind(this),
        icon: 'delete',
        access: this.canDelete.bind(this),
      },
    ],
  };

  //to check access of variables;
  testVar: string = 'test variables';
  myProject: IUserData[] = [];
  teamProject: IUserData[] = [];
  allProject: IUserData[] = [];

  info(title: string, data: IUserData[]) {
    console.log(title);
    console.log(data.length);
    console.log('Active', data.filter((d) => d.status === 1).length);
    console.log('Inactive', data.filter((d) => d.status === 2).length);
  }
  //Window object wrapper
  constructor(
    @Inject(WINDOW) private window: Window,
    private currencyPipe: CurrencyPipe
  ) {
    // setTimeout(() => {
    //   this.window.alert("Hi...")
    // }, 3000);

    // Create 100 users
    const users = Array.from({ length: 100 }, (_, k) => createNewUser(k + 1));
    this.allProject = users;
    console.log();
    this.myProject = this.allProject.filter((x) => x.project_type === 'MY');
    this.teamProject = this.allProject.filter((x) => x.project_type === 'TEAM');

    this.info('ALL', this.allProject);
    this.info('MY', this.myProject);
    this.info('TEAM', this.teamProject);

    setTimeout(() => {
      this.onProjectTypeChange();
    }, 200);
  }

  applyFilter() {
    this.filterValue = JSON.stringify({
      textSearch: this.textSearch,
      status: this.status_type,
    });
  }

  //Action Functions
  onEdit(row: IUserData) {
    console.log('On Edit', row);
    console.log(this.testVar);
  }

  onView(row: IUserData) {
    console.log('On View', row);
    console.log(this.testVar);
  }

  onDelete(row: IUserData) {
    console.log('On Delete', row);
  }

  canView(row: IUserData) {
    return true;
  }

  canEdit(row: IUserData) {
    return true;
  }

  canDelete(row: IUserData) {
    return true;
  }

  //Custom Sorting Function
  sortFN = (items: IUserData[], sort: MatSort): IUserData[] => {
    if (!sort.active || sort.direction === '') {
      return items;
    }

    return items.sort((a, b) => {
      let comparatorResult = 0;
      switch (sort.active) {
        case 'name':
          comparatorResult = a.name.localeCompare(b.name);
          break;
        case 'fruit':
          comparatorResult = a.fruit.localeCompare(b.fruit);
          break;
        default:
          comparatorResult = a.name.localeCompare(b.name);
          break;
      }
      return comparatorResult * (sort.direction == 'asc' ? 1 : -1);
    });
  };

  filterFN = (row: IUserData, filter: string): boolean => {
    // console.log('filterFN');
    const filterOption = JSON.parse(filter);
    if (+filterOption.status === 3 && !filterOption?.textSearch?.trim()) {
      // console.log('Both and filter blank');
      return true;
    }

    if (+filterOption.status !== 3 && !filterOption?.textSearch?.trim()) {
      // console.log('Active/Inactive and filter blank');
      // console.log('Match Status', +row.status === +filterOption.status);
      return +row.status === +filterOption.status;
    }

    // console.log('Active/Inactive and filter not blank');
    return (
      row.name.toLowerCase().includes(filterOption.textSearch.toLowerCase()) &&
      +row.status === +filterOption.status
    );
  };

  // On Row Click
  onRowClick = (data: IUserData) => {
    console.log('Row Click');
    console.log(data);
    console.log(this.testVar);
  };

  clearFilter() {
    this.textSearch = '';
    this.applyFilter();
  }

  onProjectTypeChange() {
    let projects: IUserData[] = [];
    if (this.project_type === 'MY') {
      projects = this.myProject;
    } else if (this.project_type === 'TEAM') {
      projects = this.teamProject;
    } else {
      projects = this.allProject;
    }
    this.filterByOptions(projects);
  }

  filterByOptions(projects: IUserData[]) {
    // if (this.status_type !== '3') {
    //   this.data = projects.filter(
    //     (project) => +project.status === +this.status_type
    //   );
    // } else {
    //   this.data = projects;
    // }

    this.data = projects;

    this.applyFilter();
  }

  onStatusChange() {
    this.applyFilter();
  }
}
