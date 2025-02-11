import {z} from 'zod';

export const createRatingSchema = z.object({
    postId: z.number(),
    rating: z.number().min(1).max(5),
})

type createPost = z.infer<typeof createRatingSchema>;
