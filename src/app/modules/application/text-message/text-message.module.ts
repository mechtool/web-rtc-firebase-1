import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TextMessageRoutingModule } from './text-message-routing.module';
import { TextMessageComponent } from './text-message.component';


@NgModule({
  declarations: [TextMessageComponent],
  imports: [
    CommonModule,
    TextMessageRoutingModule
  ]
})
export class TextMessageModule { }
