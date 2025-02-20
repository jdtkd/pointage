#!/usr/bin/env node
import * as dotenv from 'dotenv';
dotenv.config();

const requiredEnvVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_KEY',
  'DATABASE_URL',
  'DIRECT_URL'
];

function checkEnvVars() {
  const missing = requiredEnvVars.filter(
    varName => !process.env[varName]
  );

  if (missing.length > 0) {
    console.error('❌ Variables d\'environnement manquantes:');
    missing.forEach(varName => {
      console.error(`   - ${varName}`);
    });
    process.exit(1);
  }

  console.log('✅ Configuration des variables d\'environnement OK');
}

checkEnvVars();