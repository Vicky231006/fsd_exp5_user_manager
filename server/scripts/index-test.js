const mongoose = require('mongoose');
require('dotenv').config();
const User = require('../models/User');

// Sample test data
const sampleUsers = [
    { userId: 'U001', name: 'Alice Johnson', email: 'alice@example.com', age: 25, hobbies: ['reading', 'gaming'], bio: 'Software developer passionate about coding' },
    { userId: 'U002', name: 'Bob Smith', email: 'bob@example.com', age: 28, hobbies: ['sports', 'music'], bio: 'Product manager with 5 years experience' },
    { userId: 'U003', name: 'Charlie Brown', email: 'charlie@example.com', age: 30, hobbies: ['travel', 'photography'], bio: 'Designer creating beautiful user experiences' },
    { userId: 'U004', name: 'Diana Prince', email: 'diana@example.com', age: 26, hobbies: ['writing', 'art'], bio: 'Writer and creative content specialist' },
    { userId: 'U005', name: 'Eve Wilson', email: 'eve@example.com', age: 29, hobbies: ['cooking', 'hiking'], bio: 'Data scientist analyzing trends' },
    { userId: 'U006', name: 'Frank Castle', email: 'frank@example.com', age: 35, hobbies: ['reading', 'movies'], bio: 'DevOps engineer managing infrastructure' },
    { userId: 'U007', name: 'Grace Lee', email: 'grace@example.com', age: 27, hobbies: ['gaming', 'reading'], bio: 'QA engineer testing applications' },
    { userId: 'U008', name: 'Henry Davis', email: 'henry@example.com', age: 31, hobbies: ['sports', 'coding'], bio: 'Backend developer building APIs' },
    { userId: 'U009', name: 'Alice Cooper', email: 'acooper@example.com', age: 24, hobbies: ['music', 'art'], bio: 'Frontend developer with React expertise' },
    { userId: 'U010', name: 'Jake Miller', email: 'jake@example.com', age: 33, hobbies: ['travel', 'food'], bio: 'Full stack developer experienced in cloud' },
];

async function runTests() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/user_manager');
        console.log('✅ Connected to MongoDB\n');

        // Clear existing data
        await User.deleteMany({});
        console.log('🗑️  Cleared existing users\n');

        // Insert sample data
        console.log('📝 Inserting sample data...');
        const insertedUsers = await User.insertMany(sampleUsers);
        console.log(`✅ Inserted ${insertedUsers.length} users\n`);

        // Wait a moment for indexes to be created
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Test 1: Single field index on name
        console.log('═══════════════════════════════════════════════════════════');
        console.log('📊 TEST 1: Single Field Index on NAME');
        console.log('═══════════════════════════════════════════════════════════');
        const nameExplanation = await User.find({ name: 'Alice Johnson' }).explain('executionStats');
        console.log(`Query: { name: 'Alice Johnson' }`);
        console.log(`Keys Examined: ${nameExplanation.executionStats.totalDocsExamined}`);
        console.log(`Documents Examined: ${nameExplanation.executionStats.totalDocsExamined}`);
        console.log(`Documents Returned: ${nameExplanation.executionStats.nReturned}`);
        console.log(`Execution Stages: ${nameExplanation.executionStats.executionStages.stage}`);
        console.log(`Execution Time: ${nameExplanation.executionStats.executionTimeMillis}ms\n`);

        // Test 2: Compound index on email and age
        console.log('═══════════════════════════════════════════════════════════');
        console.log('📊 TEST 2: Compound Index on EMAIL and AGE');
        console.log('═══════════════════════════════════════════════════════════');
        const compoundExplanation = await User.find({ email: 'alice@example.com', age: 25 }).explain('executionStats');
        console.log(`Query: { email: 'alice@example.com', age: 25 }`);
        console.log(`Keys Examined: ${compoundExplanation.executionStats.totalDocsExamined}`);
        console.log(`Documents Examined: ${compoundExplanation.executionStats.totalDocsExamined}`);
        console.log(`Documents Returned: ${compoundExplanation.executionStats.nReturned}`);
        console.log(`Execution Stages: ${compoundExplanation.executionStats.executionStages.stage}`);
        console.log(`Execution Time: ${compoundExplanation.executionStats.executionTimeMillis}ms\n`);

        // Test 3: Multikey index on hobbies
        console.log('═══════════════════════════════════════════════════════════');
        console.log('📊 TEST 3: Multikey Index on HOBBIES');
        console.log('═══════════════════════════════════════════════════════════');
        const hobbiesExplanation = await User.find({ hobbies: 'reading' }).explain('executionStats');
        console.log(`Query: { hobbies: 'reading' }`);
        console.log(`Keys Examined: ${hobbiesExplanation.executionStats.totalDocsExamined}`);
        console.log(`Documents Examined: ${hobbiesExplanation.executionStats.totalDocsExamined}`);
        console.log(`Documents Returned: ${hobbiesExplanation.executionStats.nReturned}`);
        console.log(`Execution Stages: ${hobbiesExplanation.executionStats.executionStages.stage}`);
        console.log(`Execution Time: ${hobbiesExplanation.executionStats.executionTimeMillis}ms\n`);

        // Test 4: Text index on bio
        console.log('═══════════════════════════════════════════════════════════');
        console.log('📊 TEST 4: Text Index on BIO');
        console.log('═══════════════════════════════════════════════════════════');
        const textExplanation = await User.find({ $text: { $search: 'developer' } }).explain('executionStats');
        console.log(`Query: { $text: { $search: 'developer' } }`);
        console.log(`Keys Examined: ${textExplanation.executionStats.totalDocsExamined}`);
        console.log(`Documents Examined: ${textExplanation.executionStats.totalDocsExamined}`);
        console.log(`Documents Returned: ${textExplanation.executionStats.nReturned}`);
        console.log(`Execution Stages: ${textExplanation.executionStats.executionStages.stage}`);
        console.log(`Execution Time: ${textExplanation.executionStats.executionTimeMillis}ms\n`);

        // Test 5: Hashed index on userId
        console.log('═══════════════════════════════════════════════════════════');
        console.log('📊 TEST 5: Hashed Index on USER ID');
        console.log('═══════════════════════════════════════════════════════════');
        const hashedExplanation = await User.find({ userId: 'U001' }).explain('executionStats');
        console.log(`Query: { userId: 'U001' }`);
        console.log(`Keys Examined: ${hashedExplanation.executionStats.totalDocsExamined}`);
        console.log(`Documents Examined: ${hashedExplanation.executionStats.totalDocsExamined}`);
        console.log(`Documents Returned: ${hashedExplanation.executionStats.nReturned}`);
        console.log(`Execution Stages: ${hashedExplanation.executionStats.executionStages.stage}`);
        console.log(`Execution Time: ${hashedExplanation.executionStats.executionTimeMillis}ms\n`);

        // Test 6: Query without proper index for comparison
        console.log('═══════════════════════════════════════════════════════════');
        console.log('📊 TEST 6: COLLECTION SCAN (No Index) for Comparison');
        console.log('═══════════════════════════════════════════════════════════');
        const noIndexExplanation = await User.find({ bio: 'engineer' }).explain('executionStats');
        console.log(`Query: { bio: 'engineer' } (no text search)`);
        console.log(`Keys Examined: ${noIndexExplanation.executionStats.totalDocsExamined}`);
        console.log(`Documents Examined: ${noIndexExplanation.executionStats.totalDocsExamined}`);
        console.log(`Documents Returned: ${noIndexExplanation.executionStats.nReturned}`);
        console.log(`Execution Stages: ${noIndexExplanation.executionStats.executionStages.stage}`);
        console.log(`Execution Time: ${noIndexExplanation.executionStats.executionTimeMillis}ms\n`);

        // Summary
        console.log('═══════════════════════════════════════════════════════════');
        console.log('📋 INDEX IMPLEMENTATION SUMMARY');
        console.log('═══════════════════════════════════════════════════════════');
        const indexes = await User.collection.getIndexes();
        console.log('\n✅ All Indexes Created:\n');
        Object.entries(indexes).forEach(([key, value]) => {
            console.log(`  • ${key}: ${JSON.stringify(value)}`);
        });

        console.log('\n✅ INDEX PERFORMANCE ANALYSIS:');
        console.log(`  • Single field (name): ${nameExplanation.executionStats.executionTimeMillis}ms`);
        console.log(`  • Compound (email + age): ${compoundExplanation.executionStats.executionTimeMillis}ms`);
        console.log(`  • Multikey (hobbies): ${hobbiesExplanation.executionStats.executionTimeMillis}ms`);
        console.log(`  • Text (bio): ${textExplanation.executionStats.executionTimeMillis}ms`);
        console.log(`  • Hashed (userId): ${hashedExplanation.executionStats.executionTimeMillis}ms`);
        console.log(`  • Collection Scan (no index): ${noIndexExplanation.executionStats.executionTimeMillis}ms\n`);

        console.log('✅ All tests completed successfully!\n');

    } catch (error) {
        console.error('❌ Error running tests:', error.message);
    } finally {
        await mongoose.connection.close();
        console.log('🔌 Disconnected from MongoDB');
    }
}

// Run tests
runTests();
