Steps to install and verify favicon and app meta

1. Copy the `public` folder contents into your Next.js app `public/` directory (preserve uploads/ and favicon.ico).
2. Copy the `src/app` files into your Next.js app `src/app/`.
3. Ensure `frontend/src/app/layout.tsx` includes the apple-mobile-web-app-title meta tag (already added).

Start the app:

```bash
npm run dev
```

Verify the favicon using realfavicontool (install globally if needed):

```bash
npx realfavicon check 3000
```

If you prefer me to run these steps here and generate `favicon.ico` directly, tell me and I will create the file and commit it into `public/favicon.ico`.
