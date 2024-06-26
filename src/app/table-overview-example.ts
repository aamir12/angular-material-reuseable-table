import { Component, OnInit } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { IActionBtnConfiguration, IColumn, IUserData } from './model';
import { createNewUser } from './data';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'table-overview-example',
  styleUrls: ['table-overview-example.css'],
  templateUrl: 'table-overview-example.html',
})
export class TableOverviewExample implements OnInit {
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
    headerClasses: ['text-center', 'action-column'],
    dataClasses: ['text-center', 'action-column'],
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

  constructor(private currencyPipe: CurrencyPipe) {}

  ngOnInit() {
    // Create 100 users
    const users = Array.from({ length: 100 }, (_, k) => createNewUser(k + 1));
    this.allProject = users;
    this.myProject = this.allProject.filter((x) => x.project_type === 'MY');
    this.teamProject = this.allProject.filter((x) => x.project_type === 'TEAM');

    this.info('ALL', this.allProject);
    this.info('MY', this.myProject);
    this.info('TEAM', this.teamProject);

    setTimeout(() => {
      this.onProjectTypeChange();
    }, 0);
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
    const filterOption = JSON.parse(filter);
    const { status, textSearch } = filterOption;
    const isBothSelect = +status === 3;
    const isTextSearch = !!textSearch?.trim()?.length;

    if (isBothSelect && !isTextSearch) {
      console.log('Both and text search is blank');
      return true;
    }

    const matchesStatus = isBothSelect || +row.status === +status;
    const matchesTextSearch =
      !isTextSearch ||
      row.name.toLowerCase().includes(textSearch.toLowerCase());

    return matchesStatus && matchesTextSearch;
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
    console.log('onProjectTypeChange');
    if (this.project_type === 'MY') {
      this.data = [...this.myProject];
    } else if (this.project_type === 'TEAM') {
      this.data = [...this.teamProject];
    } else {
      this.data = [...this.allProject];
    }
    this.applyFilter();
  }

  onStatusChange() {
    this.applyFilter();
  }
}
