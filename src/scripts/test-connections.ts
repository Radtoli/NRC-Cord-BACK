import { config } from 'dotenv';

config();

async function testEmbeddingAPI() {
  const embeddingApiUrl = process.env.EMBEDDING_API_URL;
  console.log(`\n🔍 Testing Embedding API at: ${embeddingApiUrl}`);

  try {
    const response = await fetch(`${embeddingApiUrl}/embed`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ texto: 'teste de conexão' }),
    });

    console.log(`✅ Embedding API Status: ${response.status}`);

    if (response.ok) {
      const data = await response.json() as { embedding?: number[] };
      console.log(`✅ Embedding API Response: Success, embedding length: ${data.embedding?.length || 'N/A'}`);
    } else {
      const errorText = await response.text();
      console.log(`❌ Embedding API Error: ${errorText}`);
    }
  } catch (error) {
    console.log(`❌ Embedding API Connection Failed: ${error}`);
  }
}

async function testQdrantConnection() {
  const host = process.env.QDRANT_HOST;
  const apiKey = process.env.QDRANT_API_KEY;

  const isExternalHost = !host?.includes('localhost') && !host?.includes('127.0.0.1');
  const baseUrl = isExternalHost ? `https://${host}` : `http://${host}:${process.env.QDRANT_PORT || 6333}`;

  console.log(`\n🔍 Testing Qdrant at: ${baseUrl}`);
  console.log(`🔑 Using API Key: ${apiKey ? 'Yes' : 'No'}`);

  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (apiKey && apiKey.trim() !== '') {
      headers['Authorization'] = `Bearer ${apiKey}`;
    }

    const response = await fetch(`${baseUrl}/collections`, {
      method: 'GET',
      headers,
      signal: AbortSignal.timeout(30000),
    });

    console.log(`✅ Qdrant Status: ${response.status}`);

    if (response.ok) {
      const data = await response.json() as { result?: { collections?: unknown[] } };
      console.log(`✅ Qdrant Connection: Success`);
      console.log(`📊 Collections found: ${data.result?.collections?.length || 0}`);
    } else {
      const errorText = await response.text();
      console.log(`❌ Qdrant Error: ${errorText}`);
    }
  } catch (error) {
    console.log(`❌ Qdrant Connection Failed: ${error}`);
  }
}

async function testFullFlow() {
  console.log('🚀 Testing full embedding + Qdrant flow...\n');

  // Test embedding generation
  await testEmbeddingAPI();

  // Test Qdrant connection
  await testQdrantConnection();

  console.log('\n📋 Configuration Summary:');
  console.log(`NODE_ENV: ${process.env.NODE_ENV || 'Not set'}`);
  console.log(`EMBEDDING_API_URL: ${process.env.EMBEDDING_API_URL}`);
  console.log(`QDRANT_HOST: ${process.env.QDRANT_HOST}`);
  console.log(`QDRANT_PORT: ${process.env.QDRANT_PORT}`);
  console.log(`QDRANT_API_KEY: ${process.env.QDRANT_API_KEY ? 'Set' : 'Not set'}`);
}

testFullFlow().catch(console.error);