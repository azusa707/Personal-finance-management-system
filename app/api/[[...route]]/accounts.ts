import { Hono } from "hono";
import { db } from "@/db/drizzle";
import { accounts,insertAccountSchema } from "@/db/schema";
import { zValidator } from "@hono/zod-validator";
import { createId } from "@paralleldrive/cuid2";


const app =new Hono()
.get("/", async (c) => {

    const data = await db
    .select({
        id: accounts.id,
        name: accounts.name,
    })
    .from(accounts);
    return c.json({ data});
})

.post(
    "/",
    zValidator("json", insertAccountSchema.pick({
        name: true, // Validate only the 'name' field
    })),
    async (c) => {
        const values = c.req.valid("json");

      // Assign a default value for `userId`
      const userId = "default-user-id"; // 
        // Insert the new account into the database
        const [data] = await db.insert(accounts).values({
            id: createId(), 
            ...values,
              userId,
        }).returning();

        return c.json({ data });
    }
);


export default app;