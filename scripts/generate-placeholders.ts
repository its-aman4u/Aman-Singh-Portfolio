import { OpenAI } from 'openai';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function downloadImage(url: string, filepath: string) {
  const response = await axios({
    url,
    method: 'GET',
    responseType: 'arraybuffer'
  });

  fs.writeFileSync(filepath, response.data);
}

async function generatePlaceholder(prompt: string, filename: string) {
  try {
    console.log(`Generating image for ${filename}...`);
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024",
    });

    const imageUrl = response.data[0].url;
    if (!imageUrl) {
      throw new Error('No image URL returned from OpenAI');
    }

    const filepath = path.join(process.cwd(), 'public', 'projects', filename);
    await downloadImage(imageUrl, filepath);
    console.log(`Successfully generated ${filename}`);
  } catch (error) {
    console.error(`Error generating ${filename}:`, error);
  }
}

async function main() {
  const images = [
    {
      filename: 'workforce.jpg',
      prompt: 'A modern office workspace with diverse professionals collaborating, data visualization screens in background, clean corporate style'
    },
    {
      filename: 'safety.jpg',
      prompt: 'A professional workplace safety visualization with modern safety equipment and data analytics dashboard'
    },
    {
      filename: 'training.jpg',
      prompt: 'A modern corporate training session with interactive displays showing data analytics and HR metrics'
    }
  ];

  for (const image of images) {
    await generatePlaceholder(image.prompt, image.filename);
  }
}

main().catch(console.error);
