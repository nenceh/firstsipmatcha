import { PrerenderFallback, RenderMode, ServerRoute } from '@angular/ssr';
import { MenuStore } from './stores/menu.store';
import { inject } from '@angular/core';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'about',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'menu/:itemId',
    renderMode: RenderMode.Prerender,
    fallback: PrerenderFallback.Server,
    async getPrerenderParams(){
      const menuItems = inject(MenuStore)
      menuItems.loadItems();
      return menuItems.items().map((item) => (
        {itemId: item.itemId}
      ));
    }
  },
  {
    path: '**',
    renderMode: RenderMode.Server,
  },
];
