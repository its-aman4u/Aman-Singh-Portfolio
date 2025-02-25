interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  image: {
    url: string;
    fallback?: string; // Local fallback image path
  };
  link?: string;
  featured?: boolean;
}

export const projects: Project[] = [
  {
    id: 'workforce-planning',
    title: 'Predictive Workforce Planning',
    description: 'Partnered with AI tools to predict workforce attrition, enabling proactive hiring strategies. Increased workforce stability by 15% through strategic resource allocation.',
    tags: ['AI', 'Data Analysis', 'HR Analytics'],
    image: {
      url: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&auto=format&fit=crop',
      fallback: '/projects/workforce.jpg'
    },
    featured: true
  },
  {
    id: 'safety-dashboard',
    title: 'Safety Dashboard Implementation',
    description: 'Built Power BI dashboards to monitor safety compliance across 10+ warehouses. Reduced incident response time by 50% through real-time analytics and automated alerts.',
    tags: ['Power BI', 'Analytics', 'Safety'],
    image: {
      url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop',
      fallback: '/projects/safety.jpg'
    },
    featured: true
  },
  {
    id: 'training-optimization',
    title: 'Training Optimization with AI',
    description: 'Utilized ChatGPT to optimize training content and engagement metrics, increasing attendance by 40%. Simplified reporting processes, cutting time spent on weekly updates by 20%.',
    tags: ['AI', 'Training', 'Process Optimization'],
    image: {
      url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&auto=format&fit=crop',
      fallback: '/projects/training.jpg'
    },
    featured: true
  }
];

export default projects;
