# Modern Portfolio with Blog & Community

A modern, interactive portfolio website built with Astro, React, and Supabase. Features a blog system with community features.

## Features

- 🎨 Modern UI with animations and transitions
- 📝 Blog system with Markdown support
- 💬 Community features (comments, likes)
- 🔒 Admin interface for content management
- 🚀 Fast and SEO-friendly
- 📱 Fully responsive design

## Tech Stack

- **Frontend**: Astro, React, TailwindCSS
- **Backend**: Supabase
- **Animation**: Motion One, Framer Motion
- **Icons**: Phosphor Icons
- **Database**: PostgreSQL (via Supabase)

## Local Development

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with your Supabase credentials:
   ```env
   PUBLIC_SUPABASE_URL=your_supabase_url
   PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```

## Deployment to Railway

1. Create a new project on [Railway](https://railway.app)
2. Connect your GitHub repository
3. Add the following environment variables:
   - `PUBLIC_SUPABASE_URL`
   - `PUBLIC_SUPABASE_ANON_KEY`
4. Deploy! Railway will automatically detect the configuration and deploy your app.

## Database Setup

1. Create a new project on [Supabase](https://supabase.com)
2. Run the SQL schema in `supabase/schema.sql`
3. Set up Row Level Security (RLS) policies as needed

## Content Management

### Blog Posts
- Access the admin interface at `/admin/blog`
- Create, edit, and publish posts
- Support for Markdown content
- Image management via URLs

### Projects
- Edit `src/content/projects.ts` to manage project data
- Images can be stored locally in `public/projects/` or use external URLs

## Customization

### Styling
- Edit `tailwind.config.mjs` for theme customization
- Modify component styles in their respective files

### Components
- Add new components in `src/components/`
- Page templates in `src/layouts/`
- Routes in `src/pages/`

## Contributing

Feel free to submit issues and enhancement requests!
