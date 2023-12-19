import { Component, Inject, OnInit } from '@angular/core'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-popup',
  templateUrl: './confirm-popup.component.html',
  styleUrls: ['./confirm-popup.component.scss']
})
export class ConfirmPopupComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<ConfirmPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {title: string, text: string}) { }

  ngOnInit(): void {
  }

  onYesBtn() {
    this.dialogRef.close(true);
    console.log('aaaaaa');
  }

  onNoBtn() {
    this.dialogRef.close();
  }
}
