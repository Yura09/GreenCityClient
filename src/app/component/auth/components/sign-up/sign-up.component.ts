import { Component, OnInit } from '@angular/core';
import { authImages } from '../../../../../assets/img/auth/auth-images';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { UserOwnSignInService } from '../../../../service/auth/user-own-sign-in.service';
import { UserOwnSignUpService } from '../../../../service/auth/user-own-sign-up.service';
import { Router } from '@angular/router';
import { AuthService, GoogleLoginProvider } from 'angularx-social-login';
import { GoogleSignInService } from '../../../../service/auth/google-sign-in.service';
import { UserOwnSignUp } from '../../../../model/user-own-sign-up';
import { HttpErrorResponse } from '@angular/common/http';
import { UserSuccessSignIn } from '../../../../model/user-success-sign-in';
import { SubmitEmailComponent } from '../submit-email/submit-email.component';
import { LocalStorageService } from '../../../../service/localstorage/local-storage.service';
import { SignInComponent } from '../sign-in/sign-in.component';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {
  private signUpImgs = authImages;
  private userOwnSignUp: UserOwnSignUp;
  private firstNameErrorMessageBackEnd: string;
  private lastNameErrorMessageBackEnd: string;
  private emailErrorMessageBackEnd: string;
  private passwordErrorMessageBackEnd: string;
  private passwordConfirmErrorMessageBackEnd: string;
  private loadingAnim = false;
  private tmp: string;
  private backEndError: string;

  constructor(private matDialogRef: MatDialogRef<SignUpComponent>,
              private dialog: MatDialog,
              private userOwnSignInService: UserOwnSignInService,
              private userOwnSecurityService: UserOwnSignUpService,
              private router: Router,
              private authService: AuthService,
              private googleService: GoogleSignInService,
              private localStorageService: LocalStorageService) { }

  ngOnInit() {
    this.userOwnSignUp = new UserOwnSignUp();
    this.setNullAllMessage();
  }

  private setNullAllMessage(): void {
    this.firstNameErrorMessageBackEnd = null;
    this.lastNameErrorMessageBackEnd = null;
    this.emailErrorMessageBackEnd = null;
    this.passwordErrorMessageBackEnd = null;
    this.passwordConfirmErrorMessageBackEnd = null;
  }

  private onSubmit(userOwnRegister: UserOwnSignUp): void {
    this.setNullAllMessage();
    this.loadingAnim = true;
    this.userOwnSecurityService.signUp(userOwnRegister)
      .subscribe({
        next:  this.onSubmitSuccess.bind(this),
        error: this.onSubmitError.bind(this)
      });
  }

  private onSubmitSuccess(data): void {
    this.loadingAnim = false;
    this.openSignUpPopup();
    this.closeSignUpWindow();
    this.receiveUserId(data.userId);
  }

  private receiveUserId(id): void {
    setTimeout(() => {
      this.router.navigate(['profile', id]);
      this.dialog.closeAll();
    }, 5000);
  }

  private openSignUpPopup(): void {
    this.dialog.open(SubmitEmailComponent, {
      hasBackdrop: true,
      closeOnNavigation: true,
      disableClose: false,
      panelClass: 'custom-dialog-container',
    });

  }

  private onSubmitError(errors: HttpErrorResponse): void {
    errors.error.forEach(error => {
      switch (error.name) {
        case 'name':
          this.firstNameErrorMessageBackEnd = error.message;
          break;
        case 'email':
          this.emailErrorMessageBackEnd = error.message;
          break;
        case 'password':
          this.passwordErrorMessageBackEnd = error.message;
          break;
        case 'passwordConfirm':
          this.passwordConfirmErrorMessageBackEnd = error.message;
          break;
      }
    });

    this.loadingAnim = false;
  }

  private signInWithGoogle(): void {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID).then(data => {
      this.googleService.signIn(data.idToken)
        .subscribe({
          next: this.signInWithGoogleSuccess.bind(this),
          error: this.signInWithGoogleError.bind(this)
        });
    });
  }

  private signInWithGoogleSuccess(data: UserSuccessSignIn): void {
    this.userOwnSignInService.saveUserToLocalStorage(data);
    this.closeSignUpWindow();
    this.router.navigate(['/']);
  }

  private signInWithGoogleError(errors: HttpErrorResponse): void {
    try {
      errors.error.forEach(error => {
        if (error.name === 'email') {
          this.emailErrorMessageBackEnd = error.message;
        } else if (error.name === 'password') {
          this.passwordErrorMessageBackEnd = error.message;
        }
      });
    } catch (e) {
      this.backEndError = errors.error.message;
    }
  }

  private closeSignUpWindow(): void {
    this.matDialogRef.close();
  }

  private matchPassword(passInput: HTMLInputElement,
                        passRepeat: HTMLInputElement,
                        inputBlock: HTMLElement): void {
    this.passwordErrorMessageBackEnd = null;
    inputBlock.className = passInput.value !== passRepeat.value ?
                          'main-data-input-password wrong-input' :
                          'main-data-input-password';
  }

  private setEmailBackendErr(): void {
    this.emailErrorMessageBackEnd = null;
  }

  private setPasswordVisibility(htmlInput: HTMLInputElement, htmlImage: HTMLImageElement): void {
    htmlInput.type = htmlInput.type === 'password' ? 'text' : 'password';
    htmlImage.src = htmlInput.type === 'password' ? this.signUpImgs.openEye : this.signUpImgs.hiddenEye;
  }

  private checkSpaces(input: string): boolean {
    return input.indexOf(' ') >= 0;
  }

  private checkSymbols(input: string): boolean {
    const regexp = /^(?=.*[a-z]+)(?=.*[A-Z]+)(?=.*\d+)(?=.*[~`!@#$%^&*()+=_\-{}|:;”’?/<>,.\]\[]+).{8,}$/;
    return (regexp.test(input) || input === '');
  }

  private openSignInWindow(): void {
    this.closeSignUpWindow();
    this.dialog.open(SignInComponent, {
      hasBackdrop: true,
      closeOnNavigation: true,
      disableClose: true,
      panelClass: 'custom-dialog-container',
    });
  }
}
