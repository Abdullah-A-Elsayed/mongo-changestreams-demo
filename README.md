# MongoDB Change Streams Demo

This demo project showcases the power of MongoDB Change Streams by implementing a real-world scenario: simulating an inventory notification system that detects when items come back in stock. Created for the MongoDB User Group Meetup in Cairo.

## Overview

The project demonstrates how to:

1. Set up and configure MongoDB Change Streams
2. Listen to inventory changes in real-time
3. Simulate notification delivery when items become available
4. Optimize change stream queries using pipelines

## Prerequisites

- Node.js (v14 or higher)
- MongoDB 5.0+ (either MongoDB Atlas or local replica set via Docker)
- Docker and Docker Compose (if running locally)

## Getting Started

1. Clone this repository
2. Set up your MongoDB connection:

   ```bash
   # Copy the environment file
   cp .env.example .env
   ```

3. Choose one of these options for MongoDB:

   ### Option A: Local MongoDB with Docker

   ```bash
   # Start the MongoDB replica set
   docker compose up -d
   ```

   The connection string will be: `mongodb://127.0.0.1:6333/inventory-demo?replicaSet=rs0&directConnection=true`

   ### Option B: MongoDB Atlas

   - Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Get your connection string and update it in the `.env` file

4. Install dependencies:
   ```bash
   npm install
   ```

## Enable Change Stream Pre/Post Images

Before running the demo, you need to enable pre and post images for the collection. Connect to your MongoDB instance using `mongosh` and run:

```javascript
db.runCommand({
  collMod: "inventory",
  changeStreamPreAndPostImages: { enabled: true },
});
```

## Demo Steps

### 1. Basic Change Stream (1-all-inventory-events.js)

- Demonstrates how to initialize a basic change stream
- Shows all events happening in the inventory collection
- No filtering or optimization

### 2. Change Stream with Pre/Post Images (2-all-events-with-images.js)

- Shows how to include document states before and after changes
- Helps in understanding what changed in the document
- Essential for tracking stock status changes

### 3. Naive Solution (3-naive-solution.js)

- Implements a simulated back-in-stock notification system
- Demonstrates event filtering in the application code
- Shows potential performance considerations through console output
- Uses a mock email service to visualize the notification flow

### 4. Enhanced Solution (4-enhanced-solution.js)

- Uses MongoDB's pipeline for efficient filtering
- Reduces unnecessary document processing

## Running the Demo

Execute each demo file to see different aspects of change streams:

```bash
# Basic change stream
node watch/1-all-inventory-events.js

# With pre/post images
node watch/2-all-events-with-images.js

# Naive solution
node watch/3-naive-solution.js

# Enhanced solution
node watch/4-enhanced-solution.js
```

## Key Concepts Covered

1. Change Stream Basics

   - Event types
   - Document tracking
   - Error handling

2. Pre/Post Images

   - Configuration
   - Use cases
   - Performance implications

3. Pipeline Optimization
   - Filtering at database level
   - Reducing network overhead
   - Improving application efficiency

## Project Structure

```
├── watch/                      # Demo implementations
│   ├── 1-all-inventory-events.js    # Basic change stream
│   ├── 2-all-events-with-images.js  # Pre/post images demo
│   ├── 3-naive-solution.js          # Simple implementation
│   └── 4-enhanced-solution.js       # Optimized solution
├── services/                   # Helper services
│   └── send-item-stock-email.js     # Mock notification service (for demo)
├── docker-compose.yml         # Local MongoDB setup
├── .env.example              # Environment configuration
└── README.md                 # Project documentation
```

## Additional Resources

- [MongoDB Change Streams Documentation](https://www.mongodb.com/docs/manual/changeStreams/)
