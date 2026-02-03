import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../pages/authentication/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard  {

  constructor(private loginService: AuthService, private router: Router){}
  canActivate(route: ActivatedRouteSnapshot,state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
      if(this.loginService.isAuthenticated()){
        return true;
      }
      else{
        alert('please login first')
        this.router.navigate(['']);
        return true;
      }
    }

}
