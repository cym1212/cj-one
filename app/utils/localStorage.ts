/**
 * LocalStorage 유틸리티 클래스
 * 만료시간 설정, 자동 삭제, CRUD 기능을 제공합니다.
 */

export interface StorageItem<T = any> {
    value: T;
    expiresAt?: number; // timestamp
    createdAt: number;
}

export interface StorageOptions {
    expiresIn?: number; // 밀리초 단위
    expiresAt?: Date; // 특정 날짜/시간
}

export class LocalStorageUtil {
    private prefix: string;

    constructor(prefix: string = '') {
        this.prefix = prefix;
    }

    /**
     * 브라우저 환경인지 확인
     */
    private isBrowser(): boolean {
        return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
    }

    /**
     * 키에 prefix를 추가하여 실제 storage key 생성
     */
    private getKey(key: string): string {
        return this.prefix ? `${this.prefix}_${key}` : key;
    }

    /**
     * 아이템이 만료되었는지 확인
     */
    private isExpired(item: StorageItem): boolean {
        if (!item.expiresAt) return false;
        return Date.now() > item.expiresAt;
    }

    /**
     * 값 저장
     * @param key 저장할 키
     * @param value 저장할 값
     * @param options 만료시간 옵션
     */
    set<T>(key: string, value: T, options?: StorageOptions): boolean {
        if (!this.isBrowser()) return false;

        try {
            const item: StorageItem<T> = {
                value,
                createdAt: Date.now(),
            };

            // 만료시간 설정
            if (options?.expiresIn) {
                item.expiresAt = Date.now() + options.expiresIn;
            } else if (options?.expiresAt) {
                item.expiresAt = options.expiresAt.getTime();
            }

            window.localStorage.setItem(this.getKey(key), JSON.stringify(item));
            return true;
        } catch (error) {
            console.error('LocalStorage set error:', error);
            return false;
        }
    }

    /**
     * 여러 키-값 쌍을 개별적으로 저장
     * @param data 저장할 데이터 객체
     * @param options 만료시간 옵션 (모든 아이템에 적용)
     */
    setEach(data: Record<string, any>, options?: StorageOptions): string[] {
        const successKeys: string[] = [];

        Object.entries(data).forEach(([key, value]) => {
            if (this.set(key, value, options)) {
                successKeys.push(key);
            }
        });

        return successKeys;
    }

    /**
     * 값 가져오기
     * @param key 가져올 키
     * @param defaultValue 기본값 (아이템이 없거나 만료된 경우)
     * @returns 저장된 값 또는 기본값
     */
    get<T>(key: string, defaultValue?: T): T | null {
        if (!this.isBrowser()) return defaultValue ?? null;

        try {
            const rawItem = window.localStorage.getItem(this.getKey(key));
            if (!rawItem) return defaultValue ?? null;

            const item: StorageItem<T> = JSON.parse(rawItem);

            // 만료 확인
            if (this.isExpired(item)) {
                this.delete(key); // 만료된 아이템 자동 삭제
                return defaultValue ?? null;
            }

            return item.value;
        } catch (error) {
            console.error('LocalStorage get error:', error);
            return defaultValue ?? null;
        }
    }

    /**
     * 모든 값 가져오기 (만료되지 않은 것만)
     * @returns 모든 데이터가 포함된 객체
     */
    getAll(): Record<string, any> {
        if (!this.isBrowser()) return {};

        const data: Record<string, any> = {};

        // 유효한 키들만 가져와서 데이터 구성
        this.keys().forEach((key) => {
            const value = this.get(key);
            if (value !== null) {
                data[key] = value;
            }
        });

        return data;
    }

    /**
     * 값 존재 여부 확인 (만료되지 않은 경우에만)
     * @param key 확인할 키
     * @returns 존재 여부
     */
    has(key: string): boolean {
        if (!this.isBrowser()) return false;

        try {
            const rawItem = window.localStorage.getItem(this.getKey(key));
            if (!rawItem) return false;

            const item: StorageItem = JSON.parse(rawItem);

            if (this.isExpired(item)) {
                this.delete(key); // 만료된 아이템 자동 삭제
                return false;
            }

            return true;
        } catch (error) {
            console.error('LocalStorage has error:', error);
            return false;
        }
    }

    /**
     * 값 삭제
     * @param key 삭제할 키
     * @returns 삭제 성공 여부
     */
    delete(key: string): boolean {
        if (!this.isBrowser()) return false;

        try {
            window.localStorage.removeItem(this.getKey(key));
            return true;
        } catch (error) {
            console.error('LocalStorage delete error:', error);
            return false;
        }
    }

    /**
     * 여러 키 동시 삭제
     * @param keys 삭제할 키들
     * @returns 성공한 키들의 배열
     */
    deleteMultiple(keys: string[]): string[] {
        const successKeys: string[] = [];
        keys.forEach((key) => {
            if (this.delete(key)) {
                successKeys.push(key);
            }
        });
        return successKeys;
    }

    /**
     * prefix에 해당하는 모든 키 삭제
     * @returns 삭제된 키들의 개수
     */
    clear(): number {
        if (!this.isBrowser()) return 0;

        try {
            const keysToDelete: string[] = [];

            for (let i = 0; i < window.localStorage.length; i++) {
                const key = window.localStorage.key(i);
                if (key && (this.prefix ? key.startsWith(`${this.prefix}_`) : true)) {
                    keysToDelete.push(key);
                }
            }

            keysToDelete.forEach((key) => window.localStorage.removeItem(key));
            return keysToDelete.length;
        } catch (error) {
            console.error('LocalStorage clear error:', error);
            return 0;
        }
    }

    /**
     * 값 업데이트 (기존 만료시간 유지)
     * @param key 업데이트할 키
     * @param value 새로운 값
     * @param keepExpiration 기존 만료시간 유지 여부 (기본값: true)
     * @returns 업데이트 성공 여부
     */
    update<T>(key: string, value: T, keepExpiration: boolean = true): boolean {
        if (!this.isBrowser()) return false;

        try {
            if (!this.has(key)) return false;

            let expiresAt: number | undefined;

            if (keepExpiration) {
                const rawItem = window.localStorage.getItem(this.getKey(key));
                if (rawItem) {
                    const oldItem: StorageItem = JSON.parse(rawItem);
                    expiresAt = oldItem.expiresAt;
                }
            }

            const item: StorageItem<T> = {
                value,
                createdAt: Date.now(),
                expiresAt,
            };

            window.localStorage.setItem(this.getKey(key), JSON.stringify(item));
            return true;
        } catch (error) {
            console.error('LocalStorage update error:', error);
            return false;
        }
    }

    /**
     * 만료시간 연장
     * @param key 연장할 키
     * @param options 새로운 만료시간 옵션
     * @returns 연장 성공 여부
     */
    extend(key: string, options: StorageOptions): boolean {
        if (!this.isBrowser()) return false;

        try {
            const rawItem = window.localStorage.getItem(this.getKey(key));
            if (!rawItem) return false;

            const item: StorageItem = JSON.parse(rawItem);

            // 새로운 만료시간 설정
            if (options.expiresIn) {
                item.expiresAt = Date.now() + options.expiresIn;
            } else if (options.expiresAt) {
                item.expiresAt = options.expiresAt.getTime();
            }

            window.localStorage.setItem(this.getKey(key), JSON.stringify(item));
            return true;
        } catch (error) {
            console.error('LocalStorage extend error:', error);
            return false;
        }
    }

    /**
     * 모든 만료된 아이템 찾기 및 삭제
     * @returns 삭제된 키들의 배열
     */
    clearExpired(): string[] {
        if (!this.isBrowser()) return [];

        const expiredKeys: string[] = [];

        try {
            for (let i = window.localStorage.length - 1; i >= 0; i--) {
                const fullKey = window.localStorage.key(i);
                if (!fullKey || (this.prefix && !fullKey.startsWith(`${this.prefix}_`))) {
                    continue;
                }

                const rawItem = window.localStorage.getItem(fullKey);
                if (!rawItem) continue;

                try {
                    const item: StorageItem = JSON.parse(rawItem);
                    if (this.isExpired(item)) {
                        window.localStorage.removeItem(fullKey);
                        // prefix 제거하여 원래 키 이름으로 반환
                        const originalKey = this.prefix ? fullKey.replace(`${this.prefix}_`, '') : fullKey;
                        expiredKeys.push(originalKey);
                    }
                } catch (parseError) {
                    // JSON 파싱 오류가 있는 아이템도 삭제
                    window.localStorage.removeItem(fullKey);
                    const originalKey = this.prefix ? fullKey.replace(`${this.prefix}_`, '') : fullKey;
                    expiredKeys.push(originalKey);
                }
            }
        } catch (error) {
            console.error('LocalStorage clearExpired error:', error);
        }

        return expiredKeys;
    }

    /**
     * prefix에 해당하는 모든 키 목록 가져오기 (만료되지 않은 것만)
     * @returns 키들의 배열
     */
    keys(): string[] {
        if (!this.isBrowser()) return [];

        const keys: string[] = [];

        try {
            for (let i = 0; i < window.localStorage.length; i++) {
                const fullKey = window.localStorage.key(i);
                if (!fullKey || (this.prefix && !fullKey.startsWith(`${this.prefix}_`))) {
                    continue;
                }

                // prefix 제거하여 원래 키 이름 추출
                const originalKey = this.prefix ? fullKey.replace(`${this.prefix}_`, '') : fullKey;

                // 만료되지 않은 키만 포함
                if (this.has(originalKey)) {
                    keys.push(originalKey);
                }
            }
        } catch (error) {
            console.error('LocalStorage keys error:', error);
        }

        return keys;
    }

    /**
     * 저장된 아이템의 메타데이터 가져오기
     * @param key 확인할 키
     * @returns 메타데이터 또는 null
     */
    getMetadata(key: string): { createdAt: Date; expiresAt?: Date; isExpired: boolean } | null {
        if (!this.isBrowser()) return null;

        try {
            const rawItem = window.localStorage.getItem(this.getKey(key));
            if (!rawItem) return null;

            const item: StorageItem = JSON.parse(rawItem);

            return {
                createdAt: new Date(item.createdAt),
                expiresAt: item.expiresAt ? new Date(item.expiresAt) : undefined,
                isExpired: this.isExpired(item),
            };
        } catch (error) {
            console.error('LocalStorage getMetadata error:', error);
            return null;
        }
    }
}

/**
 * 상수 정의
 */
export const STORAGE_DURATION = {
    MINUTE: 60 * 1000,
    HOUR: 60 * 60 * 1000,
    DAY: 24 * 60 * 60 * 1000,
    WEEK: 7 * 24 * 60 * 60 * 1000,
    MONTH: 30 * 24 * 60 * 60 * 1000,
} as const;
