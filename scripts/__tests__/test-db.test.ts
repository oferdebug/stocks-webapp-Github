import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock the database module
vi.mock('../../database/mongoose', () => ({
  connectToDatabase: vi.fn()
}));

describe('scripts/test-db.ts', () => {
  let mockExit: ReturnType<typeof vi.spyOn>;
  let consoleLogSpy: ReturnType<typeof vi.spyOn>;
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;
  let connectToDatabase: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    // Setup spies
    mockExit = vi.spyOn(process, 'exit').mockImplementation((() => {}) as any);
    consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    // Get mocked function
    const dbModule = await import('../../database/mongoose');
    connectToDatabase = vi.mocked(dbModule.connectToDatabase);
    
    // Reset all mocks
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('testConnection function', () => {
    it('should log initial message before connecting', async () => {
      // Arrange
      connectToDatabase.mockResolvedValue({} as any);
      
      // Act
      await import('../../scripts/test-db');
      await new Promise(resolve => setTimeout(resolve, 100));

      // Assert
      expect(consoleLogSpy).toHaveBeenCalledWith('Testing database connection...');
    });

    it('should call connectToDatabase', async () => {
      // Arrange
      connectToDatabase.mockResolvedValue({} as any);
      
      // Act
      await import('../../scripts/test-db');
      await new Promise(resolve => setTimeout(resolve, 100));

      // Assert
      expect(connectToDatabase).toHaveBeenCalledTimes(1);
    });

    it('should log success message on successful connection', async () => {
      // Arrange
      connectToDatabase.mockResolvedValue({} as any);
      
      // Act
      await import('../../scripts/test-db');
      await new Promise(resolve => setTimeout(resolve, 100));

      // Assert
      expect(consoleLogSpy).toHaveBeenCalledWith('Successfully connected to the database!');
    });

    it('should exit with code 0 on successful connection', async () => {
      // Arrange
      connectToDatabase.mockResolvedValue({} as any);
      
      // Act
      await import('../../scripts/test-db');
      await new Promise(resolve => setTimeout(resolve, 100));

      // Assert
      expect(mockExit).toHaveBeenCalledWith(0);
    });

    it('should log error messages on connection failure', async () => {
      // Arrange
      const errorMessage = 'Connection refused';
      const error = new Error(errorMessage);
      connectToDatabase.mockRejectedValue(error);
      
      // Act
      await import('../../scripts/test-db');
      await new Promise(resolve => setTimeout(resolve, 100));

      // Assert
      expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to connect to the database:');
      expect(consoleErrorSpy).toHaveBeenCalledWith(error);
    });

    it('should exit with code 1 on connection failure', async () => {
      // Arrange
      connectToDatabase.mockRejectedValue(new Error('Connection failed'));
      
      // Act
      await import('../../scripts/test-db');
      await new Promise(resolve => setTimeout(resolve, 100));

      // Assert
      expect(mockExit).toHaveBeenCalledWith(1);
    });

    it('should handle timeout errors gracefully', async () => {
      // Arrange
      const timeoutError = new Error('Connection timeout');
      (timeoutError as any).code = 'ETIMEDOUT';
      connectToDatabase.mockRejectedValue(timeoutError);
      
      // Act
      await import('../../scripts/test-db');
      await new Promise(resolve => setTimeout(resolve, 100));

      // Assert
      expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to connect to the database:');
      expect(consoleErrorSpy).toHaveBeenCalledWith(timeoutError);
      expect(mockExit).toHaveBeenCalledWith(1);
    });

    it('should handle authentication errors', async () => {
      // Arrange
      const authError = new Error('Authentication failed');
      connectToDatabase.mockRejectedValue(authError);
      
      // Act
      await import('../../scripts/test-db');
      await new Promise(resolve => setTimeout(resolve, 100));

      // Assert
      expect(consoleErrorSpy).toHaveBeenCalledWith(authError);
      expect(mockExit).toHaveBeenCalledWith(1);
    });

    it('should handle network errors', async () => {
      // Arrange
      const networkError = new Error('ECONNREFUSED');
      connectToDatabase.mockRejectedValue(networkError);
      
      // Act
      await import('../../scripts/test-db');
      await new Promise(resolve => setTimeout(resolve, 100));

      // Assert
      expect(consoleErrorSpy).toHaveBeenCalledWith(networkError);
      expect(mockExit).toHaveBeenCalledWith(1);
    });

    it('should handle undefined error gracefully', async () => {
      // Arrange
      connectToDatabase.mockRejectedValue(undefined);
      
      // Act
      await import('../../scripts/test-db');
      await new Promise(resolve => setTimeout(resolve, 100));

      // Assert
      expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to connect to the database:');
      expect(mockExit).toHaveBeenCalledWith(1);
    });
  });

  describe('Script execution flow', () => {
    it('should execute testConnection immediately on import', async () => {
      // Arrange
      connectToDatabase.mockResolvedValue({} as any);
      
      // Act
      await import('../../scripts/test-db');
      
      // Small delay to allow async execution
      await new Promise(resolve => setTimeout(resolve, 50));

      // Assert
      expect(connectToDatabase).toHaveBeenCalled();
    });

    it('should complete full flow in correct order for success', async () => {
      // Arrange
      const callOrder: string[] = [];
      
      consoleLogSpy.mockImplementation((msg) => {
        callOrder.push(`log:${msg}`);
      });
      
      connectToDatabase.mockImplementation(async () => {
        callOrder.push('connect');
        return {} as any;
      });
      
      mockExit.mockImplementation(((code: number) => {
        callOrder.push(`exit:${code}`);
      }) as any);
      
      // Act
      await import('../../scripts/test-db');
      await new Promise(resolve => setTimeout(resolve, 100));

      // Assert
      expect(callOrder).toEqual([
        'log:Testing database connection...',
        'connect',
        'log:Successfully connected to the database!',
        'exit:0'
      ]);
    });

    it('should complete full flow in correct order for failure', async () => {
      // Arrange
      const callOrder: string[] = [];
      const error = new Error('DB Error');
      
      consoleLogSpy.mockImplementation((msg) => {
        callOrder.push(`log:${msg}`);
      });
      
      consoleErrorSpy.mockImplementation((msg) => {
        callOrder.push(`error:${typeof msg === 'string' ? msg : 'error-object'}`);
      });
      
      connectToDatabase.mockImplementation(async () => {
        callOrder.push('connect-attempt');
        throw error;
      });
      
      mockExit.mockImplementation(((code: number) => {
        callOrder.push(`exit:${code}`);
      }) as any);
      
      // Act
      await import('../../scripts/test-db');
      await new Promise(resolve => setTimeout(resolve, 100));

      // Assert
      expect(callOrder).toContain('log:Testing database connection...');
      expect(callOrder).toContain('connect-attempt');
      expect(callOrder).toContain('error:Failed to connect to the database:');
      expect(callOrder).toContain('exit:1');
    });
  });
});