import { AuthTransaction } from '../tx';
import { IdxOptions, OktaAuth } from '../types';
import { SelectEnrollProfileValues, EnrollProfileValues, SelectAuthenticatorValues, EnrollOrChallengeAuthenticatorValues } from './remediators';
export interface RegistrationOptions extends IdxOptions, SelectEnrollProfileValues, EnrollProfileValues, SelectAuthenticatorValues, EnrollOrChallengeAuthenticatorValues {
}
export declare function register(authClient: OktaAuth, options: RegistrationOptions): Promise<AuthTransaction>;
