# bifrost-design-system — a Bifrost standalone_v2 app

## Local dev (no token pasting)

You only need to be logged in with the CLI once — `npm run dev` reads the token
from an explicit process/current-directory override or the CLI's saved default.
So from your logged-in solution workspace:

    npm install     # resolves `bifrost` from https://bifrost.gobifrost.com
    npm run dev     # http://localhost:5173 — already authenticated

(To override the saved default for this app, copy `.env.example` to `.env` in
the directory where you run Vite and set BIFROST_API_URL. Authenticate that URL
once with the CLI; its credentials remain in the global credential store.)

## Deploy

The platform builds the app server-side and serves it at `/apps/bifrost-design-system`:

    bifrost solution deploy
