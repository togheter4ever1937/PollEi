import { Component, OnInit } from '@angular/core';
import { AutentificationService } from '../../services/autentification.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-test',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './test.component.html',
  styleUrl: './test.component.css',
})
export class TestComponent {
  users = [];

  constructor(private autenUser: AutentificationService) {}

  // getUsers(): any {
  //   this.autenUser.getUsers().subscribe((err: any, data: any) => {
  //     console.log('i am inside the getUsers function ');

  //     if (err) {
  //       console.log('error occured while geting data !!');
  //     }
  //     console.log(data);
  //     this.users = data;
  //   });
  // }

  OnInit(): void {
    this.autenUser.getUsers().subscribe(
      (data: any) => {
        this.users = data;
      },
      (err: any) => {
        console.error(`error while fetching data ${err}`);
      }
    );
  }
}
