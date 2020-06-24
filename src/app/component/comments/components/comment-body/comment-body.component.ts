import { Component, OnInit } from '@angular/core';
import { UserOwnAuthService } from '@global-service/auth/user-own-auth.service';

@Component({
  selector: 'app-comment-body',
  templateUrl: './comment-body.component.html',
  styleUrls: ['./comment-body.component.scss']
})
export class CommentBodyComponent implements OnInit {

  public isLoggedIn: boolean;

  constructor(private userOwnAuthService: UserOwnAuthService) { }

  ngOnInit() {
    this.checkUserSingIn();
    this.userOwnAuthService.getDataFromLocalStorage();
  }

  private checkUserSingIn(): void {
    this.userOwnAuthService.credentialDataSubject
      .subscribe((data) => this.isLoggedIn = data && data.userId);
  }
}
