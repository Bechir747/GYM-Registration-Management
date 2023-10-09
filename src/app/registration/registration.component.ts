import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { NgToastService } from 'ng-angular-popup';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { User } from '../models/user.model';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {

  public packages =['Quarterly', 'monthly', 'yearly'];
  public genders =['Male', 'Female'];
  public importantlist: string[] =[
    "Toxic Fat reduction",
    "Energy and Endurance",
    "Building Lean Muscle",
    "Healthier Digetive System",
    "Sugar Craving Body",
    "Fitness"
  ];

  public registerForm !: FormGroup;
  public userIdToUpdate !: number;
  public isUpdateActive: boolean =false;

  constructor(private fb: FormBuilder,private activatedroute:ActivatedRoute,private router:Router , private api: ApiService, private toastService: NgToastService){ }
  ngOnInit(): void {
    this.registerForm = this.fb.group(
      {
        firstName : [''],
        lastName : [''],
        email : [''],
        mobile : [''],
        weight : [''],
        height : [''],
        requireTrainer : [''],
        gender : [''],
        package : [''],
        important : [''],
        beenGymBefore : [''],
        enquiryDate : [''],
        bmi : [''],
        bmiresult : [''],
      }
    );

    this.registerForm.controls['height'].valueChanges.subscribe(res =>{
      this.calculateBmi(res);
    });
    this.activatedroute.params.subscribe(val =>{
      this.userIdToUpdate = val['id'];
      this.api.getRegisteredUserId(this.userIdToUpdate).subscribe(res =>{
        this.isUpdateActive = true;
        this.fillFormToUpdate(res);
      })
    })
  }



  submit(){
    console.log(this.registerForm.value);
    this.api.postRegistration(this.registerForm.value).subscribe(res=>{
      this.toastService.success({detail: "success" ,summary:"Enquiry Added", duration:3000});
      this.registerForm.reset();
    });

  }

  update() {
    console.log(this.registerForm.value);
    this.api.updateRegisterUser(this.registerForm.value, this.userIdToUpdate).subscribe(res=>{
      this.toastService.success({detail: "success" ,summary:"Enquiry Updated", duration:3000});
      this.registerForm.reset();
      this.router.navigate(['list']);
    });
    }

  calculateBmi(heightValue: number){
    const weight = this.registerForm.value.weight;
    const height = heightValue;
    const bmi = weight /  (height * height);
    this.registerForm.controls['bmi'].patchValue(bmi);
    switch (true){
      case bmi < 18.5:
        this.registerForm.controls['bmiresult'].patchValue("UnderWeight");
        break;
      case bmi >= 18.5 && bmi <25:
        this.registerForm.controls['bmiresult'].patchValue("Normal");
        break;
      case bmi >= 25 && bmi < 30:
        this.registerForm.controls['bmiresult'].patchValue("OverWeight");
        break;
      default:
        this.registerForm.controls['bmiresult'].patchValue("Obese");
        break;
    }


  }

  fillFormToUpdate(user: User){
    this.registerForm.setValue({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      mobile: user.mobile,
      weight: user.weight,
      height: user.height,
      bmi: user.bmi,
      bmiresult: user.bmiresult,
      gender: user.gender,
      requireTrainer: user.requireTrainer,
      package: user.package,
      important: user.important,
      beenGymBefore: user.beenGymBefore,
      enquiryDate: user.enquiryDate
    })
  }

}
