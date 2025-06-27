import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';
import { CompanyModule } from './company/company.module';
import { UserModule } from './user/user.module';
import { ReportModule } from './report/report.module';
import { ActivityModule } from './activity/activity.module';
import getCognitoAuthModule from './getCognitoAuthModule';

@Module({
  imports: [
    getCognitoAuthModule(),
    CompanyModule,
    UserModule,
    ReportModule,
    ActivityModule,
    ConfigModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
