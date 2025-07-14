import { SetMetadata } from '@nestjs/common';
import { UserRole } from './user-role-enum';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);

// SetMetadata: NestJS’in içinden gelir.
// Ne işe yarar?
// Bir decorator fonksiyonu içinde, bir key–value (anahtar-değer) çifti belirlememizi sağlar.
