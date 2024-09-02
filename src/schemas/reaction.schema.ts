import { z } from "zod";

// Definición de posibles reacciones del usuario
const UserReactionEnum = z.enum([
    "like",
    "dislike",
    "love",
  ]);

const ReactionSchema = z.object({
    type: UserReactionEnum,
  });
  
export default ReactionSchema;