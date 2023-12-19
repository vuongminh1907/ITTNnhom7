import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-evaluation-info',
  templateUrl: './evaluation-info.component.html',
  styleUrls: ['./evaluation-info.component.scss']
})
export class EvaluationInfoComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<EvaluationInfoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {evaluation_list: any, info: any, mode: 'more'|'basic'}) { }

  ngOnInit(): void {
  }

  closePopup() {
    this.dialogRef.close();
  }
}
