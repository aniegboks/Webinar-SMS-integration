import { Elysia } from "elysia";
import { createPosts } from "./handlers";
import { createHmac } from "node:crypto";

export const postRoutes = new Elysia().post("/", async ({ body, headers, set }) => {
    const secret = process.env.TALLY_SIGNING_SECRET;
    const signature = headers['tally-signature'];

    if (secret && signature) {
        const hmac = createHmac('sha256', secret);
        const digest = hmac.update(JSON.stringify(body)).digest('base64');

        if (signature !== digest) {
            set.status = 401;
            return { error: "Invalid signature" };
        }
    }
    const fields = (body as any).data.fields;
    const phone = fields.find((f: any) => f.label.toLowerCase().includes("phone"))?.value;
    const name = fields.find((f: any) => f.label.toLowerCase().includes("name"))?.value;

    if (!phone) {
        set.status = 400;
        return { error: "No phone number found in submission" };
    }

    return await createPosts(phone, name || "Registrant");
});