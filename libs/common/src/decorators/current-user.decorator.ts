import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '@app/common';

const getCurrentUser = (context: ExecutionContext): User => {
  return context.switchToHttp().getRequest().user;
};

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext) => getCurrentUser(context),
);
