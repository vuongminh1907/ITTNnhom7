import { UserService } from 'src/app/services/user.service';
import { UserInfoComponent } from './../user-info/user-info.component';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {

  user!: any;
  isLoggedIn = false;

  constructor(public dialog: MatDialog,
    private authService: AuthService,
    private userService: UserService) {
      this.authService.isLoggedIn().subscribe(
        (res) => {
          if(res.data.is_logged_in) {
            this.isLoggedIn = true;
            this.userService.getMyInfo().subscribe(
              (res) => this.user = res.data
            )
          }
        }
      )
    }

  ngOnInit(): void {
  }

  getUser() {
  }

  openUserInfo() {
    const dialogRef = this.dialog.open(UserInfoComponent, {
      data: this.user,
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  onLogout() {
    this.authService.logout().subscribe(
      (res) => console.log(res));
  }
}
