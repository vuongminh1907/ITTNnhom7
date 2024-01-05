import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BatBuocService } from 'src/app/services/bat-buoc.service';

@Component({
  selector: 'app-bat-buoc-info',
  templateUrl: './bat-buoc-info.component.html',
  styleUrls: ['./bat-buoc-info.component.scss']
})
export class BatBuocInfoComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  public dialogRef: MatDialogRef<BatBuocInfoComponent>,
  private batbuocService: BatBuocService) { }

  dataa:any
  ngOnInit(): void {
    this.batbuocService.getBatBuocById(this.data.ma_ho_khau, this.data.thang, this.data.nam).subscribe(
      (res) => {
        this.dataa = res.data;
        console.log('Dataa:', this.dataa);
      },
      (error) => {
        console.log('Error fetching data:', error);
        this.dataa = null;
      }
    );
  }
  closePopup() {
    this.dialogRef.close();
  }

}
