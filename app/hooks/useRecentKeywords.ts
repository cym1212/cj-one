import { useState, useEffect } from 'react';
import { LocalStorageUtil, STORAGE_DURATION } from '@/utils/localStorage';

export interface SearchKeywordStorage {
    keyword: string;
    createdAt: string;
}

/**
 * 최근 검색어 localStorage 관리를 담당하는 훅
 */
export function useRecentKeywords() {
    const keywordStorage = new LocalStorageUtil('poj2');
    const [recentKeywords, setRecentKeywords] = useState<SearchKeywordStorage[]>([]);

    // 최근 검색어를 localStorage에서 로드
    const loadRecentKeywords = () => {
        const keywords = keywordStorage.get<SearchKeywordStorage[]>('search-keyword', []) || [];
        setRecentKeywords(keywords);
    };

    // 새 검색어 추가 (중복 제거 + 최대 10개 유지)
    const addRecentKeyword = (keyword: string) => {
        if (keyword.trim() === '') return;

        const existingKeywords = keywordStorage.get<SearchKeywordStorage[]>('search-keyword', []) || [];

        const newKeyword: SearchKeywordStorage = {
            keyword: keyword.trim(),
            createdAt: new Date().toLocaleDateString('ko-KR'),
        };

        // 중복 제거
        const filteredKeywords = existingKeywords.filter((item) => item.keyword !== newKeyword.keyword);

        // 새로운 검색어를 맨 앞에 추가하고 최대 10개까지만 유지
        const updatedKeywords = [newKeyword, ...filteredKeywords].slice(0, 10);

        keywordStorage.set('search-keyword', updatedKeywords, {
            expiresIn: STORAGE_DURATION.WEEK,
        });

        setRecentKeywords(updatedKeywords);
    };

    // 특정 검색어 삭제
    const removeRecentKeyword = (index: number) => {
        const currentKeywords = keywordStorage.get<SearchKeywordStorage[]>('search-keyword', []) || [];
        const updatedKeywords = currentKeywords.filter((_, i) => i !== index);

        keywordStorage.set('search-keyword', updatedKeywords, {
            expiresIn: STORAGE_DURATION.WEEK,
        });

        setRecentKeywords(updatedKeywords);
    };

    // 모든 검색어 삭제
    const clearAllRecentKeywords = () => {
        keywordStorage.delete('search-keyword');
        setRecentKeywords([]);
    };

    // 컴포넌트 마운트 시 localStorage에서 로드
    useEffect(() => {
        loadRecentKeywords();
    }, []);

    return {
        recentKeywords,
        addRecentKeyword, // 새 검색어 추가
        removeRecentKeyword, // 특정 검색어 삭제
        clearAllRecentKeywords, // 모든 검색어 삭제
        loadRecentKeywords, // 수동으로 다시 로드
    };
}
