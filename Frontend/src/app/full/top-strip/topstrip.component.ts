import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { Subscription } from 'rxjs';
import { AuthService } from '../../pages/authentication/auth.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-topstrip',
    imports: [MatButtonModule, MatMenuModule],
    templateUrl: './topstrip.component.html',
    styleUrl: './topstrip.component.scss'
})
export class AppTopstripComponent {
    username!: string
    companyName!: number;
    constructor() { 
        const token: any = localStorage.getItem('user')
        let user = JSON.parse(token)
        this.username = user.name;
        // this.getCompany(user.companyId)
    }


    private compSub!: Subscription;
    // private compService = inject(CompanyService);
    // getCompany(id: number){
    //     this.compSub = this.compService.getCompanyById(id).subscribe(res => {
    //         this.companyName = res.data.companyName;
    //     })
    // }

    private router = inject(Router);
    logout(){
        localStorage.removeItem('jwt');
        localStorage.removeItem('user');
        this.router.navigate(['/']);  
    }
}
