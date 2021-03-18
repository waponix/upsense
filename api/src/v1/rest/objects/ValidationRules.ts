/**
 * Type to determine if value is for fields
 */
type Fields = {
    [key: string]: string[]
}

/**
 * Use this class to easy manage validation rules to be used by validatorjs
 * This class can easily handle adding and removing fields
 * This class can easily handle adding, removing and changing rules from a specific field
 */
export default class validationRules
{
    fields: any = {}; // easily give this property to validatorjs
    originalFields: Fields;

    constructor(fields: Fields)
    {
        this.originalFields = fields;
        const keys = Object.keys(this.originalFields);

        for (const field of keys) {
            this._addFieldProperties(field);
        }
    }

    addField(field: string, rules: string[]) {
        this.originalFields[field] = rules;
        this._addFieldProperties(field);
        return this;
    }

    removeField(field: string)
    {
        delete this.originalFields[field];
        this._removeFieldProperties(field);
        return this;
    }

    private _addFieldProperties(field: string)
    {
        const _fieldGetter = (field: string) => {
            return () => {
                return this.originalFields[field].join('|');
            };
        };

        const _addRule = (field: string) => {
            return (rule: string) => {
                if (this.originalFields[field].indexOf(rule) < 0) {
                    this.originalFields[field].push(rule);
                }

                return this.fields;
            };
        };

        const _removeRule = (field: string) => {
            return (rules: string | string[]) => {
                if (typeof rules === 'string') {
                    // convert to array
                    rules = [rules];
                }

                for (let rule of rules) {
                    const ruleIndex = this.originalFields[field].indexOf(rule);
                    if (ruleIndex > -1) {
                        this.originalFields[field].splice(ruleIndex, 1);
                    }
                }

                return this.fields;
            };
        }

        const _changeRule = (field: string) => {
            return (rule: string, newRule: string) => {
                const ruleIndex = this.originalFields[field].indexOf(rule);
                if (ruleIndex > -1) {
                    this.originalFields[field][ruleIndex] = newRule;
                }

                return this.fields;
            }
        }

        Object.defineProperty(this.fields, field, {get: _fieldGetter(field), enumerable: true, configurable: true})
        Object.defineProperty(this.fields, `addRuleTo${field.charAt(0).toUpperCase()}${field.slice(1)}Field`, {value: _addRule(field), enumerable: false, configurable: true});
        Object.defineProperty(this.fields, `removeRuleFrom${field.charAt(0).toUpperCase()}${field.slice(1)}Field`, {value: _removeRule(field), enumerable: false, configurable: true});
        Object.defineProperty(this.fields, `changeRuleOf${field.charAt(0).toUpperCase()}${field.slice(1)}Field`, {value: _changeRule(field), enumerable: false, configurable: true});
    }

    private _removeFieldProperties(field: string)
    {
        delete this.fields[field];
        delete this.fields[`addRuleTo${field.charAt(0).toUpperCase()}${field.slice(1)}Field`];
        delete this.fields[`removeRuleFrom${field.charAt(0).toUpperCase()}${field.slice(1)}Field`];
        delete this.fields[`changeRuleOf${field.charAt(0).toUpperCase()}${field.slice(1)}Field`];
    }
}
