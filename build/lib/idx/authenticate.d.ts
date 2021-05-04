import { AuthTransaction } from '../tx';
import { OktaAuth, IdxOptions } from '../types';
import { IdentifyValues, SelectAuthenticatorValues, EnrollOrChallengeAuthenticatorValues, ReEnrollAuthenticatorValues } from './remediators';
export interface AuthenticationOptions extends IdxOptions, IdentifyValues, SelectAuthenticatorValues, EnrollOrChallengeAuthenticatorValues, ReEnrollAuthenticatorValues {
}
export declare function authenticate(authClient: OktaAuth, options: AuthenticationOptions): Promise<AuthTransaction>;
