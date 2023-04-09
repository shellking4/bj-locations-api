import { SetMetadata } from '@nestjs/common';

export const DOES_NOT_REQUIRE_AUTHORISATIONS = 'doesNotRequireAuthorisations';
export const DoesNotRequireAuthorisations = () => SetMetadata(DOES_NOT_REQUIRE_AUTHORISATIONS, true);