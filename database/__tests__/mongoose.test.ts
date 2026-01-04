import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import * as mongoose from 'mongoose';

// Mock mongoose module
vi.mock('mongoose', () => ({
    default: {
        connect: vi.fn()
    },
    connect: vi.fn()
}));

describe('database/mongoose.ts', () => {
    // We'll need to dynamically import to work with mocks
    let connectToDatabase: () => Promise<typeof mongoose>;

    beforeEach(async () => {
        // Clear module cache and reset mocks
        vi.resetModules();
        vi.clearAllMocks();

        // Reset global mongoose cache
        if (global.mongooseCache) {
            global.mongooseCache = {conn: null, promise: null};
        }
    });

    afterEach(() => {
        // Cleanup environment
        delete process.env.MONGODB_URI;
    });

    describe('connectToDatabase', () => {
        it('should throw error when MONGODB_URI is not set', async () => {
            // Arrange
            delete process.env.MONGODB_URI;
            const {connectToDatabase} = await import('../mongoose');

            // Act & Assert
            await expect(connectToDatabase()).rejects.toThrow(
                'MONGODB_URI must be set within .env'
            );
        });

        it('should return cached connection if it exists', async () => {
            // Arrange
            process.env.MONGODB_URI = 'mongodb://localhost:27017/test';
            const mockConnection = {connection: 'mock'} as any;
            global.mongooseCache = {
                conn: mockConnection,
                promise: null
            };

            const {connectToDatabase} = await import('../mongoose');

            // Act
            const result = await connectToDatabase();

            // Assert
            expect(result).toBe(mockConnection);
            expect(mongoose.connect).not.toHaveBeenCalled();
        });

        it('should create new connection when cache is empty', async () => {
            // Arrange
            process.env.MONGODB_URI = 'mongodb://localhost:27017/testdb';
            const mockMongooseInstance = {
                connection: {readyState: 1},
                connections: []
            } as any;

            vi.mocked(mongoose.connect).mockResolvedValue(mockMongooseInstance);

            global.mongooseCache = {conn: null, promise: null};
            const {connectToDatabase} = await import('../mongoose');

            // Act
            const result = await connectToDatabase();

            // Assert
            expect(mongoose.connect).toHaveBeenCalledWith(
                'mongodb://localhost:27017/testdb',
                expect.objectContaining({
                    bufferCommands: false,
                    serverSelectionTimeoutMS: 5000,
                    socketTimeoutMS: 45000
                })
            );
            expect(result).toBe(mockMongooseInstance);
            expect(global.mongooseCache.conn).toBe(mockMongooseInstance);
        });

        it('should reuse pending connection promise', async () => {
            // Arrange
            process.env.MONGODB_URI = 'mongodb://localhost:27017/testdb';
            const mockMongooseInstance = {connection: 'mock'} as any;
            const pendingPromise = Promise.resolve(mockMongooseInstance);

            global.mongooseCache = {
                conn: null,
                promise: pendingPromise
            };

            vi.mocked(mongoose.connect).mockResolvedValue(mockMongooseInstance);
            const {connectToDatabase} = await import('../mongoose');

            // Act
            const result = await connectToDatabase();

            // Assert
            expect(mongoose.connect).not.toHaveBeenCalled();
            expect(result).toBe(mockMongooseInstance);
        });

        it('should handle connection errors and reset promise', async () => {
            // Arrange
            process.env.MONGODB_URI = 'mongodb://invalid:27017/testdb';
            const connectionError = new Error('Connection failed');

            vi.mocked(mongoose.connect).mockRejectedValue(connectionError);

            global.mongooseCache = {conn: null, promise: null};
            const {connectToDatabase} = await import('../mongoose');

            // Act & Assert
            await expect(connectToDatabase()).rejects.toThrow('Connection failed');
            expect(global.mongooseCache.promise).toBeNull();
        });

        it('should connect with correct options', async () => {
            // Arrange
            process.env.MONGODB_URI = 'mongodb://localhost:27017/testdb';
            const mockMongooseInstance = {connection: 'mock'} as any;

            vi.mocked(mongoose.connect).mockResolvedValue(mockMongooseInstance);

            global.mongooseCache = {conn: null, promise: null};
            const {connectToDatabase} = await import('../mongoose');

            // Act
            await connectToDatabase();

            // Assert
            expect(mongoose.connect).toHaveBeenCalledWith(
                expect.any(String),
                expect.objectContaining({
                    bufferCommands: false,
                    serverSelectionTimeoutMS: 5000,
                    socketTimeoutMS: 45000
                })
            );
        });

        it('should handle concurrent connection attempts correctly', async () => {
            // Arrange
            process.env.MONGODB_URI = 'mongodb://localhost:27017/testdb';
            const mockMongooseInstance = {connection: 'mock'} as any;

            let resolveConnection: (value: any) => void;
            const connectionPromise = new Promise((resolve) => {
                resolveConnection = resolve;
            });

            vi.mocked(mongoose.connect).mockReturnValue(connectionPromise as any);

            global.mongooseCache = {conn: null, promise: null};
            const {connectToDatabase} = await import('../mongoose');

            // Act - Start multiple concurrent connections
            const promise1 = connectToDatabase();
            const promise2 = connectToDatabase();
            const promise3 = connectToDatabase();

            // Resolve the connection
            resolveConnection!(mockMongooseInstance);

            const [result1, result2, result3] = await Promise.all([
                promise1,
                promise2,
                promise3
            ]);

            // Assert - All should get same connection, mongoose.connect called only once
            expect(result1).toBe(mockMongooseInstance);
            expect(result2).toBe(mockMongooseInstance);
            expect(result3).toBe(mockMongooseInstance);
            expect(mongoose.connect).toHaveBeenCalledTimes(1);
        });

        it('should log connection success with environment info', async () => {
            // Arrange
            process.env.MONGODB_URI = 'mongodb://localhost:27017/testdb';
            const originalNodeEnv = process.env.NODE_ENV;
            (process.env as any).NODE_ENV = 'test';
            const mockMongooseInstance = {connection: 'mock'} as any;
            const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {
            });

            vi.mocked(mongoose.connect).mockResolvedValue(mockMongooseInstance);

            global.mongooseCache = {conn: null, promise: null};
            const {connectToDatabase} = await import('../mongoose');

            // Act
            await connectToDatabase();

            // Assert
            expect(consoleLogSpy).toHaveBeenCalledWith(
                expect.stringContaining('Connected To Database:')
            );
            expect(consoleLogSpy).toHaveBeenCalledWith(
                expect.stringContaining('test-mongodb://localhost:27017/testdb')
            );

            consoleLogSpy.mockRestore();
            process.env.NODE_ENV = originalNodeEnv;
        });

        it('should initialize global cache if not present', async () => {
            // Arrange
            process.env.MONGODB_URI = 'mongodb://localhost:27017/testdb';
            delete (global as any).mongooseCache;

            const mockMongooseInstance = {connection: 'mock'} as any;
            vi.mocked(mongoose.connect).mockResolvedValue(mockMongooseInstance);

            // Act
            const {connectToDatabase} = await import('../mongoose');
            await connectToDatabase();

            // Assert
            expect(global.mongooseCache).toBeDefined();
            expect(global.mongooseCache.conn).toBeDefined();
            expect(global.mongooseCache.promise).toBeDefined();
        });

        it('should handle different MongoDB URI formats', async () => {
            // Arrange
            const uris = [
                'mongodb://localhost:27017/db',
                'mongodb://user:pass@localhost:27017/db',
                'mongodb://host1:27017,host2:27017/db',
                'mongodb+srv://cluster.mongodb.net/db'
            ];

            for (const uri of uris) {
                vi.resetModules();
                vi.clearAllMocks();
                process.env.MONGODB_URI = uri;

                const mockMongooseInstance = {connection: 'mock'} as any;
                vi.mocked(mongoose.connect).mockResolvedValue(mockMongooseInstance);

                global.mongooseCache = {conn: null, promise: null};
                const {connectToDatabase} = await import('../mongoose');

                // Act
                await connectToDatabase();

                // Assert
                expect(mongoose.connect).toHaveBeenCalledWith(
                    uri,
                    expect.objectContaining({
                        bufferCommands: false,
                        serverSelectionTimeoutMS: 5000,
                        socketTimeoutMS: 45000
                    })
                );
            }
        });

        it('should handle empty string MONGODB_URI as invalid', async () => {
            // Arrange
            process.env.MONGODB_URI = '';
            const {connectToDatabase} = await import('../mongoose');

            // Act & Assert
            await expect(connectToDatabase()).rejects.toThrow(
                'MONGODB_URI must be set within .env'
            );
        });
    });

    describe('Global cache behavior', () => {
        it('should maintain cache across multiple imports', async () => {
            // Arrange
            process.env.MONGODB_URI = 'mongodb://localhost:27017/testdb';
            const mockMongooseInstance = {connection: 'mock'} as any;

            vi.mocked(mongoose.connect).mockResolvedValue(mockMongooseInstance);
            global.mongooseCache = {conn: null, promise: null};

            // Act
            const module1 = await import('../mongoose');
            await module1.connectToDatabase();

            const module2 = await import('../mongoose');
            const result2 = await module2.connectToDatabase();

            // Assert
            expect(result2).toBe(mockMongooseInstance);
            expect(mongoose.connect).toHaveBeenCalledTimes(1);
        });
    });

    describe('Error handling edge cases', () => {
        it('should handle network timeout errors', async () => {
            // Arrange
            process.env.MONGODB_URI = 'mongodb://localhost:27017/testdb';
            const timeoutError = new Error('connection timed out');
            (timeoutError as any).code = 'ETIMEDOUT';

            vi.mocked(mongoose.connect).mockRejectedValue(timeoutError);
            global.mongooseCache = {conn: null, promise: null};

            const {connectToDatabase} = await import('../mongoose');

            // Act & Assert
            await expect(connectToDatabase()).rejects.toThrow('connection timed out');
            expect(global.mongooseCache.promise).toBeNull();
        });

        it('should handle authentication errors', async () => {
            // Arrange
            process.env.MONGODB_URI = 'mongodb://baduser:badpass@localhost:27017/testdb';
            const authError = new Error('Authentication failed');
            (authError as any).code = 18;

            vi.mocked(mongoose.connect).mockRejectedValue(authError);
            global.mongooseCache = {conn: null, promise: null};

            const {connectToDatabase} = await import('../mongoose');

            // Act & Assert
            await expect(connectToDatabase()).rejects.toThrow('Authentication failed');
        });
    });
});