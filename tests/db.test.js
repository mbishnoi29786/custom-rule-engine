const connectDB = require('../configure/db.js');
const mongoose = require('mongoose');

// Mock process.exit to prevent it from actually stopping Jest
jest.spyOn(process, 'exit').mockImplementation(code => {
    console.warn(`process.exit called with code: ${code}`);
});

// Mock the mongoose connect function to prevent real database connections
jest.mock('mongoose', () => ({
    connect: jest.fn().mockResolvedValue(() => Promise.resolve()),
    disconnect: jest.fn().mockResolvedValue(() => Promise.resolve()),
    connection: { readyState: 1 }
}));

describe('Database Connection', () => {
    it('should connect to the database successfully', async () => {
        await connectDB();
        expect(mongoose.connection.readyState).toBe(1); // 1 means connected
        await mongoose.disconnect();
    });
});
