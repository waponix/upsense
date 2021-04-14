export const OperationFailed = 'Operation failed';
export const OperationNotAllowed = 'Operation not allowed';
export const OperationSuccess= 'Operation successful';

/**
 * Common Messages
 */
export const CommonMessages = {
    ArgumentValuesIncorrect: `${OperationFailed}, argument values incorrect`,
    SomethingWentWrong: `${OperationFailed}, something went wrong`,
    NotFound (alias: string = '') {
        return `${OperationFailed}, unable to find ${alias} data`;
    },
    UnableToSave (alias: string = '') {
        return `${OperationFailed}, unable to save ${alias} data`;
    },
    UnableToUpdate (alias: string = '') {
        return `${OperationFailed}, unable to update ${alias} data`;
    },
    UnableToDelete (alias: string = '') {
        return `${OperationFailed}, unable to delete ${alias} data`;
    }
}

/**
 * Auth Messages
 */
export const AuthMessages = {
    InvalidCredentials: `${OperationFailed}, invalid credentials`,
    InsufficientPermission: `${OperationFailed}, insufficient permission`
}
