import { postRouter } from '../routers/postRouter';
import { t } from '../config/tRCP';
import { filterPostRouter } from '../routers/postFilterRouter';
import { postRatingRouter } from '../routers/postRatingRouter';

export const appRouter = t.router({
  post: postRouter, 
  filter: filterPostRouter,
  postrating: postRatingRouter
});

export type AppRouter = typeof appRouter;