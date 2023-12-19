import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject, OnInit } from '@angular/core';

@Component({
  selector: 'app-tam-tru-info',
  templateUrl: './tam-tru-info.component.html',
  styleUrls: ['./tam-tru-info.component.scss']
})
export class TamTruInfoComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  public dialogRef: MatDialogRef<TamTruInfoComponent>) { }

  ngOnInit(): void {
  }

  closePopup() {
    this.dialogRef.close();
  }

}
