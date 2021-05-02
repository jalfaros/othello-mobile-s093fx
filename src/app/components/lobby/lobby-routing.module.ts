import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LobbyPage } from './lobby.page';

const routes: Routes = [
  {
    path: '',
    component: LobbyPage
  },  {
    path: 'players',
    loadChildren: () => import('./modalUser/players/players.module').then( m => m.PlayersPageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LobbyPageRoutingModule {}
