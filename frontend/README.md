# Remix & HeroUI Template

This is a template for creating applications using Next.js 14 (app directory) and HeroUI (v2).

## Technologies Used

- [Remix 2](https://remix.run/docs/en/main/start/quickstart)
- [HeroUI v2](https://heroui.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Tailwind Variants](https://tailwind-variants.org)
- [TypeScript](https://www.typescriptlang.org/)
- [Framer Motion](https://www.framer.com/motion/)

## How to Use

### Use the template with create-remix

To create a new project based on this template using `create-remix`, run the following command:

```bash
npx create-next-app -e https://github.com/frontio-ai/remix-template.git
```

### Install dependencies

You can use one of them `npm`, `yarn`, `pnpm`, `bun`, Example using `npm`:

```bash
npm install
```

### Run the development server

```bash
npm run dev
```

### Setup pnpm (optional)

If you are using `pnpm`, you need to add the following code to your `.npmrc` file:

```bash
public-hoist-pattern[]=*@heroui/*
```

After modifying the `.npmrc` file, you need to run `pnpm install` again to ensure that the dependencies are installed correctly.
