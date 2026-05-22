export class DatabaseConnection {
  private static instance: DatabaseConnection;
  private connected: boolean = false;

  private constructor() {
    this.connect();
  }

  public static getInstance(): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection();
    }
    return DatabaseConnection.instance;
  }

  private connect(): void {
    console.log('Connecting to MySQL database...');
    this.connected = true;
    console.log('Database connection established');
  }

  public isConnected(): boolean {
    return this.connected;
  }

  public query(sql: string, params?: any[]): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.connected) {
        reject(new Error('Database not connected'));
        return;
      }

      console.log('Executing SQL:', sql, 'Params:', params);

      setTimeout(() => {
        resolve({ success: true, data: [] });
      }, 100);
    });
  }

  public disconnect(): void {
    this.connected = false;
    console.log('Database connection closed');
  }
}

export default DatabaseConnection.getInstance();
