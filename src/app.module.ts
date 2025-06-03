import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';
import { CompanyModule } from './company/company.module';
import { UserModule } from './user/user.module';
import { ReportModule } from './report/report.module';

@Module({
  imports: [ConfigModule.forRoot(), CompanyModule, UserModule, ReportModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
