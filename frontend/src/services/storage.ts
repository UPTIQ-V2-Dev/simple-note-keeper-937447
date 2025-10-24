export class StorageService {
    private static isStorageAvailable(): boolean {
        try {
            const test = '__storage_test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch {
            return false;
        }
    }

    static getItem<T>(key: string, defaultValue: T): T {
        if (!this.isStorageAvailable()) {
            return defaultValue;
        }

        try {
            const item = localStorage.getItem(key);
            if (item === null) {
                return defaultValue;
            }
            return JSON.parse(item);
        } catch {
            return defaultValue;
        }
    }

    static setItem<T>(key: string, value: T): void {
        if (!this.isStorageAvailable()) {
            return;
        }

        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error('Failed to save to localStorage:', error);
        }
    }

    static removeItem(key: string): void {
        if (!this.isStorageAvailable()) {
            return;
        }

        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.error('Failed to remove from localStorage:', error);
        }
    }

    static clear(): void {
        if (!this.isStorageAvailable()) {
            return;
        }

        try {
            localStorage.clear();
        } catch (error) {
            console.error('Failed to clear localStorage:', error);
        }
    }
}
