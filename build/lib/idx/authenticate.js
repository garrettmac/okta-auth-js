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
import { Identify, SelectAuthenticator, EnrollOrChallengeAuthenticator, ReEnrollAuthenticator, RedirectIdp } from './remediators';
const flow = {
    'identify': Identify,
    'select-authenticator-authenticate': SelectAuthenticator,
    'challenge-authenticator': EnrollOrChallengeAuthenticator,
    'reenroll-authenticator': ReEnrollAuthenticator,
    'redirect-idp': RedirectIdp
};
export function authenticate(authClient, options) {
    return __awaiter(this, void 0, void 0, function* () {
        return run(authClient, Object.assign(Object.assign({}, options), { flow }));
    });
}
