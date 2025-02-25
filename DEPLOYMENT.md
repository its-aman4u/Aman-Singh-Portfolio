# Deployment Guide

## Security First Steps
1. **Revoke Exposed Credentials**
   - [X] OpenAI API Key
   - [X] Deepseek API Key
   - [X] Supabase anon key
   - [X] Change admin password
   - [X] Generate new JWT secret

2. **Vercel Deployment**
   a. Go to https://vercel.com/new
   b. Import "its-aman4u/Aman-Singh-Portfolio"
   c. Add Environment Variables:
      ```
      OPENAI_API_KEY=[new-key]
      DEEPSEEK_API_KEY=[new-key]
      DEFAULT_MODEL=deepseek
      ADMIN_USERNAME=admin_aman
      ADMIN_PASSWORD=P@ssw0rd#2025$Secure!Portfolio
      JWT_SECRET=K9x#mP$2vL8nQ@5hR3fY7wZ1jB4tN6cD9gH2sA5kM8pE3vX7uJ4yT0bV1nC
      PUBLIC_SUPABASE_URL=https://oyuwrulgdjgqvozozyps.supabase.co
      PUBLIC_SUPABASE_ANON_KEY=[new-key]
      ```
   d. Deploy

3. **Railway Deployment**
   a. Go to https://railway.app/new
   b. Choose "Deploy from GitHub repo"
   c. Select "its-aman4u/Aman-Singh-Portfolio"
   d. Add the same environment variables as Vercel
   e. Deploy

## After Deployment
1. Test admin login with new credentials
2. Verify API integrations are working
3. Test blog and community features
4. Monitor error logs

## Important Notes
- Keep `.env.new` file secure and local only
- Never commit sensitive data to Git
- Regularly rotate API keys and passwords
- Monitor for unauthorized access
