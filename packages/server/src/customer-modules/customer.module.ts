import { Module } from '@nestjs/common';
import { CatsModule } from 'src/customer-modules/cats/cats.module';

@Module({
  imports: [
    CatsModule, 
  ],
  exports: [
    CatsModule,
  ],
})
export class CustomerModule {}