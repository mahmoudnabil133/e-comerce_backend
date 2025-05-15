#!/bin/bash

# Check if environment variables are set
if [ -z "$DB_USERNAME" ] || [ -z "$DB_PASSWORD" ] || [ -z "$DB_HOST" ] || [ -z "$DB_NAME" ]; then
    echo "Error: Please set all required environment variables (DB_USERNAME, DB_PASSWORD, DB_HOST, DB_NAME)"
    exit 1
fi

# Construct the MongoDB Atlas connection string
CONNECTION_STRING="mongodb+srv://$DB_USERNAME:$DB_PASSWORD@$DB_HOST/$DB_NAME"

# Convert JSON to MongoDB extended JSON format
echo "Converting JSON format..."
node <<EOF
const fs = require('fs');
const data = require('../data/sample-products.json');
const products = data.products.map(product => ({
    ...product,
    _id: { '\$oid': require('crypto').randomBytes(12).toString('hex') }
}));
fs.writeFileSync('products_extended.json', products.map(JSON.stringify).join('\n'));
EOF

# Import to MongoDB Atlas
echo "Importing to MongoDB Atlas..."
mongoimport --uri "$CONNECTION_STRING" \
    --collection products \
    --file products_extended.json \
    --jsonArray

# Clean up
rm products_extended.json

echo "Import completed!" 