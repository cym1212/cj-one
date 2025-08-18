import { useSearchState } from './useSearchState';
import { useRecentKeywords } from './useRecentKeywords';
import { useRealtimeSearch } from './useRealtimeSearch';
import { useSearchActions } from './useSearchActions';

/**
 * 검색 기능 전체를 통합하는 메인 훅
 */
export function useSearch() {
    // 기본 상태 관리
    const { searchKeyword, setSearchKeyword, isFocused, setIsFocused, activeTab, setActiveTab, realtimeResults, setRealtimeResults, showRealtimeSearch, setShowRealtimeSearch } = useSearchState();

    // 최근 검색어 관리
    const { recentKeywords, addRecentKeyword, removeRecentKeyword, clearAllRecentKeywords } = useRecentKeywords();

    // 실시간 검색 로직
    useRealtimeSearch(searchKeyword, isFocused, setRealtimeResults, setShowRealtimeSearch);

    // 검색 액션들
    const { handleSearch, handleKeywordClick, handleRealtimeItemClick } = useSearchActions(searchKeyword, setSearchKeyword, setIsFocused, setShowRealtimeSearch, addRecentKeyword);

    // 최근 검색어 삭제 핸들러들
    const handleRemoveRecentKeyword = (index: number) => {
        removeRecentKeyword(index);
    };

    const handleClearAllRecentKeywords = () => {
        clearAllRecentKeywords();
    };

    return {
        // 상태
        searchKeyword,
        setSearchKeyword,
        recentKeywords,
        isFocused,
        setIsFocused,
        activeTab,
        setActiveTab,
        realtimeResults,
        showRealtimeSearch,
        setShowRealtimeSearch,

        // 핸들러들
        handleSearch, // 폼 제출 시 검색 실행
        handleKeywordClick, // 인기/최근 검색어 클릭 시 검색 실행
        handleRealtimeItemClick, // 실시간 검색 결과 클릭 시 검색 실행
        handleRemoveRecentKeyword, // 최근 검색어 개별 삭제
        handleClearAllRecentKeywords, // 최근 검색어 전체 삭제
    };
}
