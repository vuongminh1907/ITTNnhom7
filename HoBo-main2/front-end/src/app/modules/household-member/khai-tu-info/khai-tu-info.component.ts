import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject, OnInit } from '@angular/core';

@Component({
  selector: 'app-khai-tu-info',
  templateUrl: './khai-tu-info.component.html',
  styleUrls: ['./khai-tu-info.component.scss']
})
export class KhaiTuInfoComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<KhaiTuInfoComponent>) { }

  ngOnInit(): void {

  }

  closePopup() {
    this.dialogRef.close()
  }
}
