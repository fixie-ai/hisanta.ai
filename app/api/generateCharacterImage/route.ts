import { kv } from '@vercel/kv';
import axios from 'axios';
import { GenerateCharacterImageRequest } from '@/lib/types';

export async function POST(req: Request): Promise<Response> {
    try {
        const body = await req.json() as GenerateCharacterImageRequest;
        if (typeof body !== 'object') {
            throw new Error('Invalid request body: expecting object');
        }
        const characterDescription = body.characterDescription; // replace with actual data fields from your request
        const openAIResponse = await callAzureOpenAI(characterDescription)
        const imageUrl = openAIResponse.data[0].url; 

        // Download the image 
        const imageResponse = await axios.get(imageUrl, {responseType: 'arraybuffer'});
        const imageBuffer = imageResponse.data; 

        return new Response(imageBuffer, {
            status: 200, 
            headers: {
                'Content-Type': imageResponse.headers['content-type'], // Set the appropriate content type for the image
                'Content-Length': String(imageBuffer.length),
            }
        });


        
    } catch (e: any) {
        console.error(e);
        return new Response(JSON.stringify({ error: e.message }), { status: 400 });
    }
}


async function callAzureOpenAI(prompt: string) {
    const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
    const key = process.env.AZURE_OPENAI_KEY;

    const base_prompt = `Your job is to create festive avatars of North Pole characters, automatically rendering them in a cheerful, retro pixelated art style reminiscent of Super Nintendo 16-bit graphics. The GPT, with its concise and festive personality, focuses on the traditional holiday theme. It uses its creative judgment to fill in details, ensuring all avatars are in a pixelated style without requiring users to specify this. The goal is to provide users with delightful avatars that capture the essence of each character in a nostalgic, festive spirit.
    The avatar should have a plain background, and the image should feature the character's head only, never their shoulders or neck, or body. Feel free to include things like Santa hats, Poinsetta flowers, or other christmas and holiday accents. Also ensure the avatars use a 16-bit level of detail.
    Never respond with a question, always respond with an image. Now, generate an image with the following description: `

    const body = {
        'model': 'dall-e-3',
        'prompt': base_prompt+prompt, 
        'n': 1,
    }
    const headers = {
        'api-key': `${key}`,
        'Content-Type': 'application/json'
    }

    const response = await axios.post(`${endpoint}`, body, {headers: headers});
    return response.data; 
}