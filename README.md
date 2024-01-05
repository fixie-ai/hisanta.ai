# Hi Santa!

This is the source code for the [Hi Santa](https://hisanta.ai) app, developed by [Fixie](https://fixie.ai).
This is an AI-powered app that lets you make phone calls to Santa, Mrs. Claus, and other characters.
It's powered by Fixie's platform for building voice-powered AI applications. Learn more at https://fixie.ai/voice.

## Development and running locally

1. Check versions
  - minimum versions:
    - `node -v` says at least v20.10.0
    - `npm -v` says at least 10.2.3
  - If not, then:
    - install [nvm](https://github.com/nvm-sh/nvm)
    - run `nvm use 20`
1. Run `yarn` to install all dependencies locally.
  - If you get errors about `import tkinter` failing, you must install it:
    - With MacPorts: `sudo port install py39-tkinter`
    - With Homebrew `brew install python-tk`
2. Run `yarn dev` to run the development server.
3. Open [http://localhost:3000](http://localhost:3000) with your browser to see the app.

## Deploying 

1. Register for a Fixie API key at [https://console.fixie.ai](https://console.fixie.ai)
2. Copy `.env.sample` to `.env.local`, and set `NEXTAUTH_SECRET` (next.js will not run on production without that being set)
3. Create a KV store on Vercel, here's a [helpful guide](https://vercel.com/docs/storage/vercel-kv/quickstart). Make sure to set up separate ones for development vs production.
4. Add all the other needed API keys to `.env.local`