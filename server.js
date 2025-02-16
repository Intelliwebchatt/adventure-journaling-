import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';
import multer from 'multer';

dotenv.config();

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

// MongoDB Setup
const mongoUri = process.env.MONGODB_URI;
const client = new MongoClient(mongoUri);

async function connectToMongo() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB', error);
  }
}

connectToMongo();

const db = client.db('journaling_db');
const entriesCollection = db.collection('entries');

// Multer setup for handling file uploads
const storage = multer.memoryStorage(); // Store file in memory for now
const upload = multer({ storage: storage });

// POST endpoint to create a new journal entry
app.post('/entries', upload.array('media'), async (req, res) => {
  try {
    const { text, latitude, longitude } = req.body;
    const timestamp = new Date();
    const mediaFiles = req.files; // Array of uploaded files

    // Placeholder for Azure Blob Storage upload and URLs
    const mediaUrls = [];
    if (mediaFiles && mediaFiles.length > 0) {
      // In a real scenario, upload files to Azure Blob Storage here
      // and get back the URLs. For now, we'll just have placeholders.
      mediaFiles.forEach(file => {
        mediaUrls.push(`URL_TO_AZURE_BLOB_STORAGE/${file.originalname}`);
      });
    }

    const newEntry = {
      text,
      location: {
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
      },
      timestamp,
      mediaUrls: mediaUrls, // Store URLs instead of file data directly
    };

    const result = await entriesCollection.insertOne(newEntry);
    res.status(201).json({ message: 'Journal entry created successfully', entryId: result.insertedId });
  } catch (error) {
    console.error('Error creating journal entry', error);
    res.status(500).json({ error: 'Failed to create journal entry' });
  }
});

// GET endpoint to retrieve all journal entries
app.get('/entries', async (req, res) => {
  try {
    const entries = await entriesCollection.find().toArray();
    res.status(200).json(entries);
  } catch (error) {
    console.error('Error retrieving journal entries', error);
    res.status(500).json({ error: 'Failed to retrieve journal entries' });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
