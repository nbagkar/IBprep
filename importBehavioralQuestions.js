// importBehavioralQuestions.js
const admin = require('firebase-admin');
const serviceAccount = require('/Users/niharbagkar/Downloads/ibprephub-firebase-adminsdk-fbsvc-682029485a.json');
const dataToImport = require('./firestore_behavioral_questions.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function importData() {
  console.log('Starting data import...');
  const collectionRef = db.collection('behavioralQuestions');

  for (const item of dataToImport) {
    try {
      await collectionRef.add(item); // Use auto-generated IDs
      console.log(`Added question: ${item.question.slice(0, 60)}...`);
    } catch (error) {
      console.error('Error adding document:', error);
    }
  }
  console.log('Data import finished!');
}

importData().catch(console.error); 