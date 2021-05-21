import {User} from '../../shared/entities/User';
import {getRepository} from 'typeorm';
import ValidationRules from "../objects/ValidationRules";
import {Company} from "../../shared/entities/Company";
import {Zone} from "../../shared/entities/Zone";
const Validator = require('validatorjs');

const rules = new ValidationRules({
    maxTemp: ['number'],
    minTemp: ['number']
});

export const sensorUpdateValidation = (data: any) => {
    return new Validator(data, rules.fields);
};
