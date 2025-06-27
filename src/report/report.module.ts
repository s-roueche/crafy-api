import { Module } from '@nestjs/common';
import { ReportController } from './report.controller';
import { ReportService } from './report.service';
import { PrismaService } from '../prisma.service';
import { CognitoAuthModule } from '@nestjs-cognito/auth';

@Module({
  imports: [
    CognitoAuthModule.register({
      jwtVerifier: {
        userPoolId: process.env.COGNITO_USER_POOL_ID as string,
        clientId: process.env.COGNITO_CLIENT_ID,
        tokenUse: 'access',
      },
    }),
  ],
  controllers: [ReportController],
  providers: [ReportService, PrismaService],
})
export class ReportModule {}
