import { MongoClient } from 'mongodb';
import * as fs from 'fs';
import * as path from 'path';

async function seedProducts() {
  const uri = process.env.DB_MONGODB_URI || `mongodb+srv://${process.env.DB_USERNAME}:${encodeURIComponent(process.env.DB_PASSWORD)}@${process.env.DB_HOST}/${process.env.DB_NAME}?retryWrites=true&w=majority&appName=${process.env.DB_APP_NAME || 'Cluster0'}`;
  
  try {
    const client = await MongoClient.connect(uri);
    const db = client.db(process.env.DB_NAME);
    
    // Read the sample products data
    const sampleData = JSON.parse(
      fs.readFileSync(
        path.join(__dirname, '../data/sample-products.json'),
        'utf-8'
      )
    );

    // Insert the products
    const result = await db.collection('products').insertMany(sampleData.products);
    
    console.log(`Successfully inserted ${result.insertedCount} products`);
    
    await client.close();
  } catch (error) {
    console.error('Error seeding products:', error);
    process.exit(1);
  }
}

// Run the seeding function
seedProducts(); 