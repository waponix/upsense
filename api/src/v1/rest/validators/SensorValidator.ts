import {getRepository, Repository} from 'typeorm';
import ValidationRules from "../objects/ValidationRules";
import {Hub} from "../../shared/entities/Hub";
import {Sensor} from "../../shared/entities/Sensor";
const Validator = require('validatorjs');

const rules = new ValidationRules({
    name: ['required', 'string'],
    serial: ['required', 'string', 'serial_not_exist'],
    hub: ['required', 'numeric', 'hub_exist'],
    maxTemp: ['numeric'],
    minTemp: ['numeric'],
});

export const sensorCreateValidation = (data: any) => {
    return new Validator(data, rules.fields);
};

export const sensorUpdateValidation = (data: any) => {
    rules
        .removeField('serial');

    return new Validator(data, rules.fields);
};

Validator.registerAsync('serial_not_exist', async function (serial: string, attribute: any, req: any, passes: any) {
    const sensorRepository: Repository<Sensor> | undefined = getRepository(Sensor);

    const sensor: Sensor | undefined = await sensorRepository.findOne({where: {serial}});

    if (sensor !== undefined) {
        passes(false, `Sensor with serial '${serial}' already exist`)
    }

    passes();
});

Validator.registerAsync('hub_exist', async (hubId: number, attribute: any, req: any, passes: any) => {
    const hubRepository = getRepository(Hub);
    const hub: Hub | undefined = await hubRepository.findOne({where: {id: hubId}});

    if (!hub) {
        passes(false, 'Hub does not exist');
    } else {
        passes();
    }
});
