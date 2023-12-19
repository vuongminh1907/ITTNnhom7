import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-tam-vang-info',
  templateUrl: './tam-vang-info.component.html',
  styleUrls: ['./tam-vang-info.component.scss']
})
export class TamVangInfoComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  public dialogRef: MatDialogRef<TamVangInfoComponent>) { }

  ngOnInit(): void {
  }

  closePopup() {
    this.dialogRef.close();
  }

}
