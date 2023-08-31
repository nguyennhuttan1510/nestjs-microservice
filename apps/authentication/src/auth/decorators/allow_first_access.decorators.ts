import { SetMetadata } from '@nestjs/common';

export const ALLOW_FIRST_ACCESS = 'isAllowFirstAccess';

export const AllowFirstAccess = () => SetMetadata(ALLOW_FIRST_ACCESS, true);
