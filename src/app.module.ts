import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CrasModule } from './cras/cras.module';
import { CatsModule } from './cats/cats.module';

@Module({
  imports: [CatsModule, CrasModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
