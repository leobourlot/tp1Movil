import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {AuthService} from "../../services/auth/auth.service";

export const authGuard: CanActivateFn = async (route, state) => {
  const service = inject(AuthService);
  const router = inject(Router);

  try {
    const user = await service.usuarioActual();
    console.log(user)
    //Logica para verificar si el token expiró
    return !user ? router.navigate(['/login'], {replaceUrl: true}) : true;
  } catch (e) {
    return router.navigate(['/login'], {replaceUrl: true});
  }

};