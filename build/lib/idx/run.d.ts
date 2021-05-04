import { AuthTransaction } from '../tx';
import { OktaAuth, IdxOptions, RemediationFlow } from '../types';
export interface RunOptions {
    flow: RemediationFlow;
    actions?: string[];
}
export declare function run(authClient: OktaAuth, options: RunOptions & IdxOptions): Promise<AuthTransaction>;
