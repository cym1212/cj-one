import { useSearchParams } from 'react-router';

/**
 * URL SearchParams를 쉽게 조작할 수 있는 유틸리티 함수들
 */

// 기본 SearchParams 조작 함수들
export class SearchParamsUtil {
    private searchParams: URLSearchParams;
    private setSearchParams: (searchParams: URLSearchParams) => void;

    constructor(searchParams: URLSearchParams, setSearchParams: (searchParams: URLSearchParams) => void) {
        this.searchParams = new URLSearchParams(searchParams);
        this.setSearchParams = setSearchParams;
    }

    /**
     * 파라미터 값 가져오기
     * @param key 파라미터 키
     * @returns 파라미터 값 또는 null
     */
    get(key: string): string | null {
        return this.searchParams.get(key);
    }

    /**
     * 모든 파라미터 값 가져오기 (배열 형태)
     * @param key 파라미터 키
     * @returns 파라미터 값들의 배열
     */
    getAll(key: string): string[] {
        return this.searchParams.getAll(key);
    }

    /**
     * 파라미터 존재 여부 확인
     * @param key 파라미터 키
     * @returns 존재 여부
     */
    has(key: string): boolean {
        return this.searchParams.has(key);
    }

    /**
     * 파라미터 추가/수정
     * @param key 파라미터 키
     * @param value 파라미터 값
     * @param replace 기존 값들을 모두 대체할지 여부 (기본값: true)
     */
    set(key: string, value: string, replace: boolean = true): void {
        if (replace) {
            this.searchParams.set(key, value);
        } else {
            this.searchParams.append(key, value);
        }
        this.setSearchParams(this.searchParams);
    }

    /**
     * 여러 파라미터 동시 추가/수정
     * @param params 키-값 쌍의 객체
     * @param replace 기존 값들을 모두 대체할지 여부 (기본값: true)
     */
    setMultiple(params: Record<string, string | string[]>, replace: boolean = true): void {
        Object.entries(params).forEach(([key, value]) => {
            if (Array.isArray(value)) {
                if (replace) {
                    this.searchParams.delete(key);
                }
                value.forEach((v) => this.searchParams.append(key, v));
            } else {
                if (replace) {
                    this.searchParams.set(key, value);
                } else {
                    this.searchParams.append(key, value);
                }
            }
        });
        this.setSearchParams(this.searchParams);
    }

    /**
     * 파라미터 삭제
     * @param key 삭제할 파라미터 키
     * @param value 특정 값만 삭제할 경우 (선택사항)
     */
    delete(key: string, value?: string): void {
        if (value) {
            // 특정 값만 삭제
            const values = this.searchParams.getAll(key);
            this.searchParams.delete(key);
            values.filter((v) => v !== value).forEach((v) => this.searchParams.append(key, v));
        } else {
            // 키의 모든 값 삭제
            this.searchParams.delete(key);
        }
        this.setSearchParams(this.searchParams);
    }

    /**
     * 여러 파라미터 삭제
     * @param keys 삭제할 파라미터 키들
     */
    deleteMultiple(keys: string[]): void {
        keys.forEach((key) => this.searchParams.delete(key));
        this.setSearchParams(this.searchParams);
    }

    /**
     * 모든 파라미터 삭제
     */
    clear(): void {
        this.searchParams.forEach((_, key) => {
            this.searchParams.delete(key);
        });
        this.setSearchParams(this.searchParams);
    }

    /**
     * 파라미터를 객체 형태로 가져오기
     * @returns 파라미터 객체
     */
    toObject(): Record<string, string | string[]> {
        const result: Record<string, string | string[]> = {};

        this.searchParams.forEach((value, key) => {
            const allValues = this.searchParams.getAll(key);
            result[key] = allValues.length === 1 ? allValues[0] : allValues;
        });

        return result;
    }

    /**
     * 현재 SearchParams 문자열 가져오기
     * @returns SearchParams 문자열
     */
    toString(): string {
        return this.searchParams.toString();
    }

    /**
     * 파라미터 개수 가져오기
     * @returns 파라미터 개수
     */
    size(): number {
        return Array.from(this.searchParams.keys()).length;
    }

    /**
     * 파라미터 토글 (있으면 삭제, 없으면 추가)
     * @param key 파라미터 키
     * @param value 파라미터 값
     */
    toggle(key: string, value: string): void {
        const values = this.searchParams.getAll(key);
        if (values.includes(value)) {
            this.delete(key, value);
        } else {
            this.set(key, value, false);
        }
    }
}

/**
 * SearchParams 유틸리티를 사용하기 위한 커스텀 훅
 * @returns SearchParamsUtil 인스턴스
 */
export function useSearchParamsUtil(): SearchParamsUtil {
    const [searchParams, setSearchParams] = useSearchParams();
    return new SearchParamsUtil(searchParams, setSearchParams);
}

/**
 * SearchParams를 쉽게 조작할 수 있는 개별 유틸리티 함수들
 */

/**
 * 현재 URL의 특정 파라미터 값 가져오기
 * @param key 파라미터 키
 * @returns 파라미터 값 또는 null
 */
export function getSearchParam(key: string): string | null {
    if (typeof window === 'undefined') return null;
    const searchParams = new URLSearchParams(window.location.search);
    return searchParams.get(key);
}

/**
 * 현재 URL의 모든 파라미터를 객체로 가져오기
 * @returns 파라미터 객체
 */
export function getAllSearchParams(): Record<string, string | string[]> {
    if (typeof window === 'undefined') return {};

    const searchParams = new URLSearchParams(window.location.search);
    const result: Record<string, string | string[]> = {};

    searchParams.forEach((value, key) => {
        const allValues = searchParams.getAll(key);
        result[key] = allValues.length === 1 ? allValues[0] : allValues;
    });

    return result;
}

/**
 * SearchParams 문자열을 객체로 변환
 * @param searchString SearchParams 문자열
 * @returns 파라미터 객체
 */
export function parseSearchParams(searchString: string): Record<string, string | string[]> {
    const searchParams = new URLSearchParams(searchString);
    const result: Record<string, string | string[]> = {};

    searchParams.forEach((value, key) => {
        const allValues = searchParams.getAll(key);
        result[key] = allValues.length === 1 ? allValues[0] : allValues;
    });

    return result;
}

/**
 * 객체를 SearchParams 문자열로 변환
 * @param params 파라미터 객체
 * @returns SearchParams 문자열
 */
export function stringifySearchParams(params: Record<string, string | string[] | undefined | null>): string {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
        if (value === undefined || value === null) return;

        if (Array.isArray(value)) {
            value.forEach((v) => searchParams.append(key, v));
        } else {
            searchParams.set(key, value);
        }
    });

    return searchParams.toString();
}
