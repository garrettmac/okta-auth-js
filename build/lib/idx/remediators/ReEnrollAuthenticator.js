import { Base } from './Base';
export class ReEnrollAuthenticator extends Base {
    constructor() {
        super(...arguments);
        this.map = {
            'credentials': ['newPassword']
        };
    }
    mapCredentials() {
        return {
            passcode: this.values.newPassword,
        };
    }
    getNextStep() {
        return {
            name: this.remediation.name,
            type: this.remediation.relatesTo.value.type,
        };
    }
    getErrorMessages(errorRemediation) {
        return errorRemediation.value[0].form.value.reduce((errors, field) => {
            if (field.messages) {
                errors.push(field.messages.value[0].message);
            }
            return errors;
        }, []);
    }
}
