import { Base, RemediationValues } from './Base';

export interface EnrollProfileValues extends RemediationValues {
  firstName?: string;
  lastName?: string;
  email?: string;
}

export class EnrollProfile extends Base {
  values: EnrollProfileValues;

  map = {
    'userProfile': ['firstName', 'lastName', 'email']
  };

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