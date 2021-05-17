import {User} from '../../shared/entities/User';
import {getRepository} from 'typeorm';
import ValidationRules from "../objects/ValidationRules";
import {Company} from "../../shared/entities/Company";
import {Zone} from "../../shared/entities/Zone";
const Validator = require('validatorjs');

const rules = new ValidationRules({
    zone: ['integer', 'zone_exist']
});

export const hubUpdateValidation = (data: any) => {
    return new Validator(data, rules.fields);
};

Validator.registerAsync('zone_exist', async function (zones: any[], attribute: any, req: any, passes: any) {
    const zoneRepository = getRepository(Zone);

    for (let zoneId of zones) {
        const zone: Zone | undefined = await zoneRepository.findOne({where: {id: parseInt(zoneId)}});

        if (!zone) {
            passes(false, `There is no zone with id ${zoneId}`);
        }
    }

    passes();
});
