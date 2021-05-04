import { Base } from './Base';
export class EnrollProfile extends Base {
    constructor() {
        super(...arguments);
        this.map = {
            'userProfile': ['firstName', 'lastName', 'email']
        };
    }
    mapUserProfile() {
        const { firstName, lastName, email } = this.values;
        return {
            firstName,
            lastName,
            email,
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
