import type { LoaderFunctionArgs } from "@remix-run/node";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  // Get the favicon.png from the public directory
  const favicon = await fetch(new URL("/favicon.png", request.url));

  // Return the favicon with the correct content type
  return new Response(await favicon.arrayBuffer(), {
    headers: {
      "Content-Type": "image/x-icon",
      "Cache-Control": "public, max-age=31536000",
    },
  });
};
