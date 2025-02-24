//import type { MetaFunction } from "@remix-run/node";

// export const meta: MetaFunction = () => {
//   return [
//     { title: "HeroUI + Remix App" },
//     { name: "description", content: "Welcome to HeroUI!" },
//   ];
// };

export default function Index() {
  return (
    <div className="relative flex flex-col bg-slate-200">
      <main className="container mx-auto max-w-7xl pt-16 px-6 flex-grow">
        <h1>Hello World</h1>
      </main>
    </div>
  );
}
