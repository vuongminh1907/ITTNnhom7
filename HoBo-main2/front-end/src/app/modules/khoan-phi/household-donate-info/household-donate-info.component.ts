import { HouseholdBookService } from 'src/app/services/household-book.service';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-household-donate-info',
  templateUrl: './household-donate-info.component.html',
  styleUrls: ['./household-donate-info.component.scss']
})
export class HouseholdDonateInfoComponent implements OnInit {
  //history: any;
  dataSource :any
  constructor(
    public dialogRef: MatDialogRef<HouseholdDonateInfoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    console.log(this.data);  // Thêm dòng này
  }
  list_dong_gop : any[] = this.data.fees
  closePopup() {
    this.dialogRef.close()
  }
}
