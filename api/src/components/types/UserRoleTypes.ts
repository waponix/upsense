export type UserRoleTypes = ROLE_ADMIN | ROLE_MANAGER | ROLE_USER;

type ROLE_ADMIN = 'admin';
type ROLE_MANAGER = 'manager';
type ROLE_USER = 'user';

export enum UserRole {
    admin = 'admin',
    manager = 'manager',
    user = 'user'
}
