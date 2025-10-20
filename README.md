# Hi Santa!

This is the source code for the [Hi Santa](https://hisanta.ai) app, now powered by Google Gemini AI.
This is an AI-powered app that lets you make phone calls to Santa, Mrs. Claus, and other characters.
It uses Google's Gemini AI for conversational intelligence and Web Speech APIs for voice interaction.

## Technology Stack

- **AI Model**: Google Gemini (gemini-1.5-pro, gemini-1.5-flash)
- **Framework**: Next.js 14 with React 18 and TypeScript
- **Voice Input**: Web Speech Recognition API
- **Voice Output**: Web Speech Synthesis API
- **Storage**: Vercel KV
- **Deployment**: Vercel

## Development and running locally

1. Copy `.env.example` to `.env.local` and fill in your Gemini API key:
   ```bash
   cp .env.example .env.local
   ```
   Get your Gemini API key from: https://makersuite.google.com/app/apikey

2. Run `yarn` to install all dependencies locally.

3. Run `yarn dev` to run the development server.

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the app.

## Environment Variables

Required:
- `NEXT_PUBLIC_GEMINI_API_KEY` - Your Google Gemini API key

Optional:
- `NEXT_PUBLIC_LAUNCHDARKLY_CLIENT_ID` - For feature flags
- `NEXT_PUBLIC_DATADOG_APP_ID` - For monitoring
- `NEXT_PUBLIC_DATADOG_CLIENT_TOKEN` - For monitoring

## Features

- Real-time voice conversations with AI characters
- Multiple character personalities
- Custom character creation
- Conversation history and feedback
- Latency monitoring for ASR, LLM, and TTS
- Mobile-friendly interface with wake lock support
