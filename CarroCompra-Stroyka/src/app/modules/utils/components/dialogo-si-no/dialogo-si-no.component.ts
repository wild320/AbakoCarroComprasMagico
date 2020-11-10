import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

// modelos
import { DialogData} from '../../../../../data/modelos/negocio/DialogData';

@Component({
  selector: 'app-dialogo-si-no',
  templateUrl: './dialogo-si-no.component.html',
  styleUrls: ['./dialogo-si-no.component.scss']
})
export class DialogoSiNoComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<DialogoSiNoComponent>,
              @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
  ngOnInit() {

  }

}

