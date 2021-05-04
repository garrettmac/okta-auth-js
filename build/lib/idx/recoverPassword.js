var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { run } from './run';
import { Identify, SelectAuthenticator, EnrollOrChallengeAuthenticator, AuthenticatorVerificationData, } from './remediators';
const flow = {
    'identify-recovery': Identify,
    'select-authenticator-authenticate': SelectAuthenticator,
    'challenge-authenticator': EnrollOrChallengeAuthenticator,
    'authenticator-verification-data': AuthenticatorVerificationData,
    'reset-authenticator': EnrollOrChallengeAuthenticator,
};
export function recoverPassword(authClient, options) {
    return __awaiter(this, void 0, void 0, function* () {
        return run(authClient, Object.assign(Object.assign({}, options), { flow, actions: [
                'currentAuthenticator-recover',
                'currentAuthenticatorEnrollment-recover'
            ] }));
    });
}
