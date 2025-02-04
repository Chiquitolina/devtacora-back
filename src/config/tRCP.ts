import { initTRPC, inferAsyncReturnType } from '@trpc/server';
import { prisma } from '../db/prisma'; 

const createContext = ({}) => ({
  prisma,
});

type Context = inferAsyncReturnType<typeof createContext>;

const t = initTRPC.context<Context>().create();

export { t, createContext };