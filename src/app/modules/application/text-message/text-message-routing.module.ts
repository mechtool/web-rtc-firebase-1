import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {TextMessageComponent} from "./text-message.component";


const routes: Routes = [
    {path : '', component : TextMessageComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TextMessageRoutingModule { }
