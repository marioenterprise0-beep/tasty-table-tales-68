import { createFileRoute } from "@tanstack/react-router";
import { bootstrapAdmin } from "@/lib/bootstrap-admin.functions";

export const Route = createFileRoute("/api/public/bootstrap-admin")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = (await request.json()) as {
          token: string;
          email: string;
          phone: string;
          password: string;
          firstName: string;
        };
        if (body.token !== "gh-bootstrap-2026") {
          return new Response("nope", { status: 401 });
        }
        const result = await bootstrapAdmin({ data: body });
        return Response.json(result);
      },
    },
  },
});
