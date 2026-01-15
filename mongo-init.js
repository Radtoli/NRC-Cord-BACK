print('Iniciando configuração do MongoDB para NRC Tools...');

db = db.getSiblingDB('nrc_database');

db.createCollection('users');
db.createCollection('videos');
db.createCollection('trilhas');
db.createCollection('documents');

db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ role: 1 });
db.videos.createIndex({ youtubeId: 1 });
db.videos.createIndex({ trilha: 1 });
db.trilhas.createIndex({ title: 1 });
db.documents.createIndex({ type: 1 });
db.documents.createIndex({ video: 1 });

print('MongoDB configurado com sucesso para NRC Tools!');
print('Collections criadas: users, videos, trilhas, documents');
print('Índices criados para otimização de consultas');