import { Routes } from "@angular/router";

export const userRoutes: Routes = [
    {
        path: '',
        loadComponent: () =>
        import('./users-list/users-list').then(
            c => c.UsersList
        )
    },
    {
        path: 'roles',
        loadComponent: () =>
        import('./role-list.component/role-list.component').then(
            c => c.RoleListComponent
        )
    }
];