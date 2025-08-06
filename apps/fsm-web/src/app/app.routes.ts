import { Route } from '@angular/router';

export const appRoutes: Route[] = [
    {
        path: '',
        title: 'Home | First Sip Matcha Bar',
        loadComponent: async () => {
        const mod = await import('./home/home');
        return mod.Home;
        },
    },
    {
        path: 'menu',
        title: 'Our Menu | First Sip Matcha Bar',
        loadComponent: async () => {
        const mod = await import('./menu/menu');
        return mod.Menu;
        },
    },
    {
        path: 'menu/:itemId',
        pathMatch: 'full',
        // component: MenuItem,
        loadComponent: async () => {
        const mod = await import('./menu_item/menu_item');
        return mod.MenuItem;
        },
    }, // TODO: implement not-found
    // {
    //     path: 'menu/not-found',
    //     loadComponent: async () => {
    //     const mod = await import('./not_found/not_found');
    //     return mod.NotFound;
    //     },
    // },
    {
        path: 'about',
        title: 'About Us | First Sip Matcha Bar',
        loadComponent: async () => {
        const mod = await import('./about/about');
        return mod.About;
        },
    },
    {
        path: '**',
        redirectTo: ''
    },
];
