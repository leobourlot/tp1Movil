import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {AuthService} from "../../services/auth/auth.service";

export const authGuard: CanActivateFn = async (route, state) => {
  const service = inject(AuthService);
  const router = inject(Router);

  try {
    const user = await service.usuarioActual();
    console.log(user)

    
    if (!user) {
      await router.navigate(['/login'], { replaceUrl: true });
      return false
    }

    // Ahora que estamos seguros de que user existe, podemos acceder a tipoUsuario
    const tipoUsuario = user.tipoUsuario;
    
    //Logica para verificar si el token expiró
    if (tipoUsuario === "1"){
      return true
    } else if(tipoUsuario === "2"){
      return true
    } else{
      await router.navigate(['/login'], {replaceUrl: true})
      return false
    }
    
    
  } catch (e) {
    return router.navigate(['/login'], {replaceUrl: true});
  }

};