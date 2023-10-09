import { Component, OnInit } from '@angular/core';
import { User } from '../models/user.model';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent implements OnInit{

  public userID !: number;
  userDetails !:User;

  constructor(private activatedRoute: ActivatedRoute, private api: ApiService){}


  ngOnInit(): void {
    this.activatedRoute.params.subscribe(val =>{
      this.userID = val['id'];
      this.fetchuserDetails(this.userID);
    })
  }

  fetchuserDetails(userID : number){
    this.api.getRegisteredUserId(userID).subscribe(res =>{
      this.userDetails = res;
      console.log(this.userDetails);
    })
  }

}
