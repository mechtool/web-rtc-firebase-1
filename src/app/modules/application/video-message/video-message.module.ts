import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VideoMessageRoutingModule } from './video-message-routing.module';
import { VideoMessageComponent } from './video-message.component';


@NgModule({
  declarations: [VideoMessageComponent],
  imports: [
    CommonModule,
    VideoMessageRoutingModule
  ]
})
export class VideoMessageModule { }
