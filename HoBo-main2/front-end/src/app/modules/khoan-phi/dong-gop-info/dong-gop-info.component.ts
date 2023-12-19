import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dong-gop-info',
  templateUrl: './dong-gop-info.component.html',
  styleUrls: ['./dong-gop-info.component.scss']
})
export class DongGopInfoComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  public dialogRef: MatDialogRef<DongGopInfoComponent>) { }

  ngOnInit(): void {
  }

  closePopup() {
    this.dialogRef.close();
  }

}
