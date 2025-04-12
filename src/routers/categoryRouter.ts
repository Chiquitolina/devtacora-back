import { t } from "../config/tRCP";
import { z } from "zod";

export const categoryRouter = t.router({
  getMostRanked: t.procedure.query(async ({ ctx }) => {
    try {
      return await ctx.prisma.post.groupBy({
        by: ["categoria"],
        _count: { categoria: true },
        orderBy: { _count: { categoria: "desc" } },
      });
    } catch (error) {
      throw new Error("Error obteniendo categorías más rankeadas");
    }
  }),
});
