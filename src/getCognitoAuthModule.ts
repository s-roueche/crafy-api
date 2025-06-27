import { CognitoAuthModule } from '@nestjs-cognito/auth';

export default function getCognitoAuthModule() {
  return CognitoAuthModule.register({
    jwtVerifier: {
      userPoolId: process.env.COGNITO_USER_POOL_ID as string,
      clientId: process.env.COGNITO_CLIENT_ID,
      tokenUse: 'access',
    },
  });
}
