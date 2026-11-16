import { ForbiddenError } from '../utils/errors.js';

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ForbiddenError('User session not found'));
    }

    if (!roles.includes(req.user.role)) {
      return next(
        new ForbiddenError(`Role '${req.user.role}' is not authorized to access this resource`)
      );
    }

    next();
  };
};

