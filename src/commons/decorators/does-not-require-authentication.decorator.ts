import { SetMetadata } from '@nestjs/common';

export const DOES_NOT_REQUIRE_AUTHENTICATION = 'doesNotRequireAuthentication';
export const DoesNotRequireAuthentication = () => SetMetadata(DOES_NOT_REQUIRE_AUTHENTICATION, true);