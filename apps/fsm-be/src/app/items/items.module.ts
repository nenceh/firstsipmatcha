import { Module } from '@nestjs/common';
import { ItemsService } from './items.service';
import { ItemsResolver } from './items.resolver';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  providers: [ItemsResolver, ItemsService],
  imports: [PrismaModule]
})
export class ItemsModule {}
