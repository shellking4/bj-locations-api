import { SetMetadata } from '@nestjs/common';

export const ACCESSIBLE = 'isAccessible';
export const Accessible = () => SetMetadata(ACCESSIBLE, true);