"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var __1 = require("../../");
/**
 * One-to-many relation allows us to create a type of relation where Entity1 can have multiple instances of Entity2.
 * Entity2 has only one Entity1. Entity2 is the owner of the relationship and stores Entity1's id on its own side.
 */
function OneToMany(typeFunctionOrTarget, inverseSide, options) {
    return function (object, propertyName) {
        if (!options)
            options = {};
        // now try to determine it its lazy relation
        var isLazy = options && options.lazy === true ? true : false;
        if (!isLazy && Reflect && Reflect.getMetadata) { // automatic determination
            var reflectedType = Reflect.getMetadata("design:type", object, propertyName);
            if (reflectedType && typeof reflectedType.name === "string" && reflectedType.name.toLowerCase() === "promise")
                isLazy = true;
        }
        __1.getMetadataArgsStorage().relations.push({
            target: object.constructor,
            propertyName: propertyName,
            // propertyType: reflectedType,
            isLazy: isLazy,
            relationType: "one-to-many",
            type: typeFunctionOrTarget,
            inverseSideProperty: inverseSide,
            options: options
        });
    };
}
exports.OneToMany = OneToMany;

//# sourceMappingURL=OneToMany.js.map
