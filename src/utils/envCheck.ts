// src/utils/envCheck.ts
export function checkRequiredEnvVars() {
    const requiredVars = [
      'DATABASE_URL',
      'NEXT_PUBLIC_SUPABASE_URL',
      'NEXT_PUBLIC_SUPABASE_ANON_KEY',
      'CLOUDINARY_CLOUD_NAME',
      'CLOUDINARY_API_KEY',
      'CLOUDINARY_API_SECRET'
    ];
    
    const missingVars = requiredVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length > 0) {
      console.error('❌ Missing required environment variables:');
      missingVars.forEach(varName => {
        console.error(`   - ${varName}`);
      });
      console.error('Please add these variables to your .env file');
    } else {
      console.log('✅ All required environment variables are set');
    }
  }
  
  // Add this to layout.tsx or a server component that runs at startup
  // import { checkRequiredEnvVars } from "~/utils/envCheck";
  // checkRequiredEnvVars();