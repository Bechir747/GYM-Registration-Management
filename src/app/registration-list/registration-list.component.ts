import { Component, OnInit, ViewChild } from '@angular/core';
import { User } from '../models/user.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';
import { NgConfirmService } from 'ng-confirm-box';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-registration-list',
  templateUrl: './registration-list.component.html',
  styleUrls: ['./registration-list.component.scss']
})
export class RegistrationListComponent implements OnInit {
  public dataSource !: MatTableDataSource<User>;
  public users !: User[];
  @ViewChild(MatPaginator) paginator !: MatPaginator;
  @ViewChild(MatSort) sort !: MatSort;

  displayedColumns : string[] = ['id', 'firstName', 'lastName', 'email', 'mobile', 'bmiresult', 'gender', 'package', 'enquiryDate', 'action'];
  constructor(private api: ApiService, private router: Router, private confirm: NgConfirmService, private toast: NgToastService){

  }
  ngOnInit(): void {
    this.getUsers();
  }

  getUsers(){
    this.api.getRegisteredUser().subscribe(res =>{
      this.users = res;
      this.dataSource = new MatTableDataSource(this.users);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
  })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  edit(id: number) {
    this.router.navigate(['update', id])
  }

  delete(id: number){
    this.confirm.showConfirm("You want to delete the player ?",() =>{
      this.api.deleteRegistered(id).subscribe(res =>{
        this.toast.success({detail: "success" ,summary:"Deleted successfully", duration:3000});
        this.getUsers();
      })
    },()=>{})
  }

}
