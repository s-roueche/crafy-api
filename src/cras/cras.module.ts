import { Module } from '@nestjs/common';
import { CrasController } from './cras.controller';
import { CrasService } from './cras.service';

@Module({
  controllers: [CrasController],
  providers: [CrasService],
})
export class CrasModule {}
