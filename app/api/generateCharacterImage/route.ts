import { GenerateCharacterImageRequest } from '@/lib/types';
import { DALLE_BASE_PROMPT, DALLE_MODEL } from '@/lib/config';

export async function POST(req: Request): Promise<Response> {
  try {
    const body = (await req.json()) as GenerateCharacterImageRequest;
    if (typeof body !== 'object') {
      throw new Error('Invalid request body: expecting object');
    }
    const characterDescription = body.characterDescription;
    const openAIResponse = await callOpenAI(characterDescription);
    const imageUrl = openAIResponse.data[0].url;

    // Download the image
    const imageResponse = await fetch(imageUrl);
    const imageBuffer = await imageResponse.arrayBuffer();

    const contentType = imageResponse.headers.get('content-type');
    if (!contentType) {
      throw new Error('Invalid content type');
    }

    return new Response(imageBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Length': String(imageBuffer.byteLength),
      },
    });
  } catch (e: any) {
    console.error(e);
    return new Response(JSON.stringify({ error: e.message }), { status: 400 });
  }
}

async function callOpenAI(prompt: string) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error('OpenAI key is undefined');
  }

  const endpoint = 'https://api.openai.com/v1/images/generations';
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${apiKey}`,
  };

  const body = JSON.stringify({
    model: 'dall-e-3',
    prompt: DALLE_BASE_PROMPT + prompt,
    n: 1,
    size: '1024x1024', // Include size parameter as in your curl example
  });

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: headers,
      body: body,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  } catch (error: any) {
    throw new Error(`API request failed: ${error.message}`);
  }
}

async function callAzureOpenAI(prompt: string) {
  const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
  const key = process.env.AZURE_OPENAI_KEY;

  if (!endpoint) {
    throw new Error('Azure OpenAI endpoint is undefined');
  }

  if (!key) {
    throw new Error('Azure OpenAI key is undefined');
  }

  if (!endpoint || !key) {
    throw new Error('Azure OpenAI endpoint or key is undefined');
  }

  const body = JSON.stringify({
    model: DALLE_MODEL,
    prompt: DALLE_BASE_PROMPT + prompt,
    n: 1,
  });

  const headers = {
    'api-key': key,
    'Content-Type': 'application/json',
  };

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: headers,
    body: body,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  return await response.json();
}
