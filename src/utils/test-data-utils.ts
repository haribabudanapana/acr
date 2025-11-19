import * as fs from 'fs';
import * as path from 'path';
import * as csv from 'csv-parser';
import * as xlsx from 'xlsx';

export class TestDataUtils {
  private static instance: TestDataUtils;
  private testDataCache: Map<string, any> = new Map();

  private constructor() {}

  static getInstance(): TestDataUtils {
    if (!TestDataUtils.instance) {
      TestDataUtils.instance = new TestDataUtils();
    }
    return TestDataUtils.instance;
  }

  /**
   * Load JSON test data
   */
  async loadJSONData(filePath: string): Promise<any> {
    try {
      const fullPath = path.resolve(filePath);
      const data = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
      this.testDataCache.set(filePath, data);
      return data;
    } catch (error) {
      throw new Error(`Failed to load JSON data from ${filePath}: ${error.message}`);
    }
  }

  /**
   * Load CSV test data
   */
  async loadCSVData(filePath: string): Promise<any[]> {
    try {
      const fullPath = path.resolve(filePath);
      const results: any[] = [];
      
      return new Promise((resolve, reject) => {
        fs.createReadStream(fullPath)
          .pipe(csv())
          .on('data', (data) => results.push(data))
          .on('end', () => {
            this.testDataCache.set(filePath, results);
            resolve(results);
          })
          .on('error', reject);
      });
    } catch (error) {
      throw new Error(`Failed to load CSV data from ${filePath}: ${error.message}`);
    }
  }

  /**
   * Load Excel test data
   */
  async loadExcelData(filePath: string, sheetName?: string): Promise<any[]> {
    try {
      const fullPath = path.resolve(filePath);
      const workbook = xlsx.readFile(fullPath);
      const sheet = sheetName ? workbook.Sheets[sheetName] : workbook.Sheets[workbook.SheetNames[0]];
      const data = xlsx.utils.sheet_to_json(sheet);
      
      this.testDataCache.set(filePath, data);
      return data;
    } catch (error) {
      throw new Error(`Failed to load Excel data from ${filePath}: ${error.message}`);
    }
  }

  /**
   * Get cached data
   */
  getCachedData(filePath: string): any {
    return this.testDataCache.get(filePath);
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.testDataCache.clear();
  }

  /**
   * Get test data by environment
   */
  async getTestDataByEnvironment(environment: string, fileName: string): Promise<any> {
    const filePath = `test-data/${environment}/${fileName}`;
    const fileExtension = path.extname(fileName).toLowerCase();
    
    switch (fileExtension) {
      case '.json':
        return await this.loadJSONData(filePath);
      case '.csv':
        return await this.loadCSVData(filePath);
      case '.xls':
      case '.xlsx':
        return await this.loadExcelData(filePath);
      default:
        throw new Error(`Unsupported file type: ${fileExtension}`);
    }
  }

  /**
   * Get random test data row
   */
  async getRandomTestData(environment: string, fileName: string): Promise<any> {
    const data = await this.getTestDataByEnvironment(environment, fileName);
    if (Array.isArray(data) && data.length > 0) {
      return data[Math.floor(Math.random() * data.length)];
    }
    return data;
  }

  /**
   * Get test data by index
   */
  async getTestDataByIndex(environment: string, fileName: string, index: number): Promise<any> {
    const data = await this.getTestDataByEnvironment(environment, fileName);
    if (Array.isArray(data) && index >= 0 && index < data.length) {
      return data[index];
    }
    throw new Error(`Index ${index} out of range for ${fileName}`);
  }

  /**
   * Filter test data
   */
  async filterTestData(environment: string, fileName: string, filterFn: (item: any) => boolean): Promise<any[]> {
    const data = await this.getTestDataByEnvironment(environment, fileName);
    if (Array.isArray(data)) {
      return data.filter(filterFn);
    }
    return [];
  }
}