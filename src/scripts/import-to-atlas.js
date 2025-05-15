const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

async function importToAtlas() {
  const uri = process.env.DB_MONGODB_URI || 
    `mongodb+srv://${process.env.DB_USERNAME}:${encodeURIComponent(process.env.DB_PASSWORD)}@${process.env.DB_HOST}/${process.env.DB_NAME}?retryWrites=true&w=majority`;

  try {
    console.log('Connecting to MongoDB Atlas...');
    const client = await MongoClient.connect(uri);
    const db = client.db(process.env.DB_NAME);
    
    // Read the sample products data
    console.log('Reading sample data...');
    const sampleData = JSON.parse(
      fs.readFileSync(
        path.join(__dirname, '../data/sample-products.json'),
        'utf-8'
      )
    );

    // Drop existing products collection if it exists
    console.log('Dropping existing products collection...');
    try {
      await db.collection('products').drop();
    } catch (error) {
      // Collection might not exist, ignore error
    }

    // Insert the products
    console.log('Inserting products...');
    const result = await db.collection('products').insertMany(sampleData.products);
    
    console.log(`Successfully inserted ${result.insertedCount} products`);
    
    // Create indexes for better performance
    console.log('Creating indexes...');
    await db.collection('products').createIndex({ name: 'text', description: 'text', tags: 'text' });
    await db.collection('products').createIndex({ category: 1 });
    await db.collection('products').createIndex({ brand: 1 });
    await db.collection('products').createIndex({ price: 1 });
    
    console.log('Indexes created successfully');
    
    await client.close();
    console.log('Import completed successfully!');
  } catch (error) {
    console.error('Error importing products:', error);
    process.exit(1);
  }
}

// Run the import function
importToAtlas(); 