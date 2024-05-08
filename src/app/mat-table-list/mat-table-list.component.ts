import {
  AfterViewInit,
  Component,
  Input,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { IActionBtnConfiguration, IColumn, Style } from '../model';

@Component({
  selector: 'app-mat-table-list',
  templateUrl: './mat-table-list.component.html',
  styleUrls: ['./mat-table-list.component.scss'],
})
export class MatTableListComponent<T> implements OnInit, AfterViewInit {
  @Input() data: T[] = [];
  @Input() filterValue: string;
  @Input() containerClasses: string[] = [];
  @Input() tableContainerClasses: string[] = [];
  @Input() pageSize: number = 10;
  @Input() limitSizes: number[] = [5, 10, 25, 50, 100];
  @Input() columns: IColumn[] = [];
  @Input() rowClickListner!: (data: T) => void;
  @Input() filterFn!: (data: T, filter: string) => boolean;
  @Input() sortFn!: (data: T[], sort: MatSort) => T[];

  //need to work on action btns
  @Input() actionBtns!: IActionBtnConfiguration<T>;

  dataSource!: MatTableDataSource<T>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  // console.log(this.columns);
  displayedColumns: string[] = [];

  ngOnInit() {
    this.setUpcolumnsSetting();
    this.dataSource = new MatTableDataSource(this.data);
    this.filterDefinition();
    this.sortDefinition();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['columns']) {
      this.setUpcolumnsSetting();
    }

    if (
      changes['data'] &&
      changes['data'].currentValue !== changes['data'].previousValue
    ) {
      console.log('Data Changed');
      this.dataSource = new MatTableDataSource(this.data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.filterDefinition();
      this.sortDefinition();
      this.applyFilter();
    }

    if (changes['filterValue']) {
      this.applyFilter();
    }
  }

  setUpcolumnsSetting() {
    const displayedCols = this.columns.map((x) => x.name);
    if (!!this.actionBtns) {
      this.displayedColumns =
        this.actionBtns.positions === 'start'
          ? ['action', ...displayedCols]
          : [...displayedCols, 'action'];
    } else {
      this.displayedColumns = displayedCols;
    }
  }

  filterDefinition() {
    if (this.filterFn) {
      this.dataSource.filterPredicate = this.filterFn;
    }
  }

  sortDefinition() {
    if (this.sortFn) {
      this.dataSource.sortData = this.sortFn;
    }
  }

  applyFilter() {
    if (this.filterValue?.trim()) {
      this.dataSource.filter = this.filterValue.trim();

      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
    }
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  onRowClick(row: T) {
    if (this.rowClickListner) {
      this.rowClickListner(row);
    }
  }

  onOptionClick(event: Event) {
    event.stopPropagation();
  }
}
