import { AuthTransaction } from '../tx';
import { OktaAuth, IdxOptions } from '../types';
import { IdentifyValues, SelectAuthenticatorValues, EnrollOrChallengeAuthenticatorValues, AuthenticatorVerificationDataValues } from './remediators';
export interface PasswordRecoveryOptions extends IdxOptions, IdentifyValues, SelectAuthenticatorValues, EnrollOrChallengeAuthenticatorValues, AuthenticatorVerificationDataValues {
}
export declare function recoverPassword(authClient: OktaAuth, options: PasswordRecoveryOptions): Promise<AuthTransaction>;
