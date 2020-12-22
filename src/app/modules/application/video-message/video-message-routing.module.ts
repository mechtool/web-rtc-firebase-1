import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {VideoMessageComponent} from "./video-message.component";


const routes: Routes = [
    {path : '', component : VideoMessageComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VideoMessageRoutingModule { }
