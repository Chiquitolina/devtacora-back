import { postRouter } from '../routers/postRouter';
import { t } from '../config/tRCP';
import { filterPostRouter } from '../routers/postFilterRouter';
import { postRatingRouter } from '../routers/postRatingRouter';
import { linkedinRouter } from '../routers/linkedInRouter';
import { categoryRouter } from '../routers/categoryRouter';

export const appRouter = t.router({
  post: postRouter, 
  filter: filterPostRouter,
  postrating: postRatingRouter,
  linkedin: linkedinRouter,
  category: categoryRouter
});

export type AppRouter = typeof appRouter;