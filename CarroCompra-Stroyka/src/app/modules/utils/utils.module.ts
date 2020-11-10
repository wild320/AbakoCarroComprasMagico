import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatDialogModule} from '@angular/material/dialog';
import {MatSnackBarModule} from '@angular/material/snack-bar';


// componentes
import { DialogoSiNoComponent } from './components/dialogo-si-no/dialogo-si-no.component';


@NgModule({
  declarations: [
    DialogoSiNoComponent
  ],
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatSnackBarModule


  ]
})
export class UtilsModule { }
