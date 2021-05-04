import { AuthTransaction } from '../tx';
import { OktaAuth, InteractOptions } from '../types';
export declare function startAuthTransaction(authClient: OktaAuth, options: InteractOptions): Promise<AuthTransaction>;
