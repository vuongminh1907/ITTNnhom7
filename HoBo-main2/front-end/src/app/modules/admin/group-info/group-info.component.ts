import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, OnInit, Inject } from '@angular/core';

@Component({
  selector: 'app-group-info',
  templateUrl: './group-info.component.html',
  styleUrls: ['./group-info.component.scss']
})
export class GroupInfoComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<GroupInfoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {group: any, mode: 'more'|'basic'}) { }

  ngOnInit(): void {
  }

  closePopup() {
    this.dialogRef.close();
  }

}
