import { Base } from './Base';
export class Identify extends Base {
    constructor() {
        super(...arguments);
        this.map = {
            'identifier': ['identifier', 'username'],
            'credentials': ['credentials', 'password']
        };
    }
    mapCredentials() {
        return { passcode: this.values.password };
    }
}
