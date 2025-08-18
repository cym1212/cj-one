import { useState } from 'react';
import { useSearchParamsUtil } from '@/utils/searchParams';

/**
 * 검색 관련 기본 상태들을 관리하는 훅
 */
export function useSearchState() {
    const searchParams = useSearchParamsUtil();

    const [searchKeyword, setSearchKeyword] = useState<string>(searchParams.get('keyword') || '');
    const [isFocused, setIsFocused] = useState<boolean>(false);
    const [activeTab, setActiveTab] = useState<'popular' | 'recent'>('popular');
    const [realtimeResults, setRealtimeResults] = useState<string[]>([]);
    const [showRealtimeSearch, setShowRealtimeSearch] = useState<boolean>(false);

    return {
        // 검색어 관련 상태
        searchKeyword,
        setSearchKeyword,

        // UI 상태
        isFocused,
        setIsFocused,
        activeTab,
        setActiveTab,

        // 실시간 검색 상태
        realtimeResults,
        setRealtimeResults,
        showRealtimeSearch,
        setShowRealtimeSearch,
    };
}
