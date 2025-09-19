import { config } from 'dotenv';
import { randomUUID } from 'crypto';

config();

console.log('🧪 Testing UUID generation for Qdrant point IDs...\n');

// Test UUID generation
for (let i = 0; i < 5; i++) {
  const uuid = randomUUID();
  console.log(`✅ Generated UUID ${i + 1}: ${uuid}`);
}

console.log('\n📋 UUID Format Validation:');
const testUuid = randomUUID();
console.log(`✅ UUID: ${testUuid}`);
console.log(`✅ Type: ${typeof testUuid}`);
console.log(`✅ Length: ${testUuid.length}`);
console.log(`✅ Format: ${/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(testUuid) ? 'Valid UUID' : 'Invalid UUID'}`);

console.log('\n🔄 Testing Qdrant point structure...');

const mockEmbedding = new Array(384).fill(0.1);
const mockPayload = {
  provaId: 'PROVA_002',
  tipoProva: 'Capela',
  numeroQuestao: 1,
  text: 'Test document',
  createdAt: new Date().toISOString(),
  originalId: `PROVA_002_${Date.now()}`,
};

const testPoint = {
  id: randomUUID(),
  vector: mockEmbedding,
  payload: mockPayload,
};

console.log('✅ Test point structure:');
console.log(`   ID: ${testPoint.id} (${typeof testPoint.id})`);
console.log(`   Vector length: ${testPoint.vector.length}`);
console.log(`   Payload keys: ${Object.keys(testPoint.payload).join(', ')}`);

console.log('\n🎯 The new UUID-based IDs should resolve the Qdrant 400 error!');