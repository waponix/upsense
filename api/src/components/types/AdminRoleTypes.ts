export type AdminRoleTypes = ROLE_ADMIN | ROLE_MANAGER | ROLE_USER;

type ROLE_ADMIN = 'ROLE_ADMIN';
type ROLE_MANAGER = 'ROLE_MANAGER';
type ROLE_USER = 'ROLE_USER';

export enum AdminRole {
    admin = 'ROLE_ADMIN',
    manager = 'ROLE_MANAGER',
    user = 'ROLE_USER'
}
