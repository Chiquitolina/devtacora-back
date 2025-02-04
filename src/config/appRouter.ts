import { postRouter } from '../routers/postRouter';
import { t } from '../config/tRCP';
import { filterPostRouter } from '../routers/postFilterRouter';

export const appRouter = t.router({
  post: postRouter, 
  filter: filterPostRouter 
});

export type AppRouter = typeof appRouter;