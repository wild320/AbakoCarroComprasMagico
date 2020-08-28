import { Component, OnInit  } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import {  FormGroup , FormBuilder, Validators , FormControl} from '@angular/forms';

// servicios
import {UsuarioService} from '../../../../shared/services/usuario.service';

@Component({
    selector: 'app-login',
    templateUrl: './page-login.component.html',
    styleUrls: ['./page-login.component.scss']
})
export class PageLoginComponent implements OnInit{

    public ingresoForm: FormGroup;
    public error = false;
    public mensajeerror: string;
    public loading = false;

    constructor(
        private fb: FormBuilder,
        private usuariossvc: UsuarioService,
        private router: Router ) {

    }

    ngOnInit() {

        this.ingresoForm = this.fb.group({
          usuario: new FormControl('', Validators.compose([Validators.required])),
          contrasena: new FormControl('', Validators.compose([Validators.required]))
        });

        this.ingresoForm.valueChanges.subscribe(query => {
          if (this.error){ this.error = false; }
        });

      }

    submitForm() {

      this.loading = true;

      if (this.ingresoForm.valid){

        this.usuariossvc.Loguin(this.ingresoForm.value).then((config: any) => {

          // si no llega logueado validar mensaje
          if  (!this.usuariossvc.EsUsuarioLogueado){
            this.mensajeerror = this.usuariossvc.MensajeError;
            this.error = true;
           }else{
            this.error = false;

            // direccionar al home
            this.router.navigate(['/']);
          }

          this.loading = false;

         }) ;
      }else{

        // validar que tenga contraseña
        if (this.ingresoForm.controls.contrasena.invalid){
          this.mensajeerror = 'Debe ingresar información valida en contraseña';
        }

        // validar que tenga usuario
        if (this.ingresoForm.controls.usuario.invalid){
          this.mensajeerror = 'Debe ingresar información valida en usuario';
        }

        this.error = true;
        this.loading = false;

      }
    }

    get usuario() { return this.ingresoForm.get('usuario'); }

    get contrasena() { return this.ingresoForm.get('contrasena'); }
}
