# Content Management Guide

This directory contains the content for your portfolio website. Here's how to manage your content:

## Projects (`projects.ts`)

To update your projects, edit the `projects.ts` file. Each project has the following structure:

```typescript
{
  id: string;           // Unique identifier for the project
  title: string;        // Project title
  description: string;  // Project description
  tags: string[];       // Array of technology/skill tags
  image: {
    url: string;        // Primary image URL (can be online or local)
    fallback?: string;  // Local fallback image path (optional)
  };
  link?: string;        // Project link (optional)
  featured?: boolean;   // Whether to show in featured projects section
}
```

### Image Management

You can use images in two ways:

1. **Online Images**:
   - Use URLs from image hosting services (e.g., Unsplash, your own CDN)
   - Example: `url: 'https://images.unsplash.com/photo-1234...'`
   - Always provide a fallback for reliability

2. **Local Images**:
   - Store images in `/public/projects/`
   - Reference them with paths starting with `/projects/`
   - Example: `url: '/projects/my-project.jpg'`

### Example:

```typescript
{
  id: 'my-project',
  title: 'My Amazing Project',
  description: 'Description of what the project does...',
  tags: ['React', 'TypeScript', 'AI'],
  image: {
    url: 'https://example.com/image.jpg',
    fallback: '/projects/my-project.jpg'
  },
  link: 'https://github.com/yourusername/project',
  featured: true
}
```

## Updating Content

1. To add a new project:
   - Add a new object to the `projects` array in `projects.ts`
   - If using local images, add them to `/public/projects/`

2. To modify an existing project:
   - Find the project by its `id` in `projects.ts`
   - Update the desired fields

3. To remove a project:
   - Remove the project object from the array
   - Optionally remove any unused local images

## Best Practices

1. Always use high-quality images (recommended: 1200x800 pixels)
2. Compress images before adding them to reduce load times
3. Use meaningful and consistent IDs for projects
4. Keep descriptions concise but informative
5. Use relevant and specific tags
