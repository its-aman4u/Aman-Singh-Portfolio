/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly PUBLIC_SUPABASE_URL: string;
  readonly PUBLIC_SUPABASE_ANON_KEY: string;
  readonly OPENAI_API_KEY: string;
  readonly DEEPSEEK_API_KEY: string;
  readonly ADMIN_USERNAME: string;
  readonly ADMIN_PASSWORD: string;
  readonly JWT_SECRET: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare namespace App {
  interface Locals {
    user?: {
      id: string;
      role: string;
    };
  }
}