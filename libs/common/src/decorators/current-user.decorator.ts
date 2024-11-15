import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserDocument } from '@app/common/models';

const getCurrentUser = (context: ExecutionContext): UserDocument => {
  return context.switchToHttp().getRequest().user;
};

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext) => getCurrentUser(context),
);
