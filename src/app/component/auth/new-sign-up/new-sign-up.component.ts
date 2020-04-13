import { Component, OnInit } from '@angular/core';
import { authImages } from '../../../../assets/img/auth/auth-images';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-new-sign-up',
  templateUrl: './new-sign-up.component.html',
  styleUrls: ['./new-sign-up.component.scss']
})
export class NewSignUpComponent implements OnInit {
  private signUpImgs = authImages;

  constructor(private matDialogRef: MatDialogRef<NewSignUpComponent>) { }

  ngOnInit() {
  }

  private closeSignUpWindow(): void {
    this.matDialogRef.close();
  }
}