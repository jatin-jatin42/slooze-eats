import { Module } from '@nestjs/common';
import { SharedCartsService } from './shared-carts.service';
import { SharedCartsResolver } from './shared-carts.resolver';

@Module({
  providers: [SharedCartsService, SharedCartsResolver],
})
export class SharedCartsModule {}
