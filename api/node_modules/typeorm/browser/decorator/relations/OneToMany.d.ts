import { ObjectType, RelationOptions } from "../../";
/**
 * One-to-many relation allows us to create a type of relation where Entity1 can have multiple instances of Entity2.
 * Entity2 has only one Entity1. Entity2 is the owner of the relationship and stores Entity1's id on its own side.
 */
export declare function OneToMany<T>(typeFunctionOrTarget: string | ((type?: any) => ObjectType<T>), inverseSide: string | ((object: T) => any), options?: RelationOptions): PropertyDecorator;
