import { useSearchParamsUtil } from '@/utils/searchParams';

/**
 * 검색 관련 액션들을 관리하는 훅
 */
export function useSearchActions(searchKeyword: string, setSearchKeyword: (keyword: string) => void, setIsFocused: (focused: boolean) => void, setShowRealtimeSearch: (show: boolean) => void, addRecentKeyword: (keyword: string) => void) {
    const searchParams = useSearchParamsUtil();

    // 공통 검색 실행 함수
    const executeSearch = (keyword: string) => {
        console.log(keyword);

        if (keyword.trim() !== '') {
            // 실제 검색 로직을 여기에 추가
            alert(`Searching for: ${keyword}`);
            searchParams.set('keyword', keyword);

            // 최근 검색어에 추가
            addRecentKeyword(keyword);

            // 검색어 상태 업데이트
            setSearchKeyword(keyword);
        } else {
            alert('검색어를 입력해주세요.');
            searchParams.delete('keyword');
        }
    };

    // 폼 제출 시 검색 실행
    const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        executeSearch(searchKeyword);
    };

    // 인기/최근 검색어 클릭 시 검색 실행
    const handleKeywordClick = (keyword: string) => {
        setIsFocused(false);
        setShowRealtimeSearch(false);
        executeSearch(keyword);
    };

    // 실시간 검색 결과 클릭 시 검색 실행
    const handleRealtimeItemClick = (keyword: string) => {
        setShowRealtimeSearch(false);
        setIsFocused(false);
        executeSearch(keyword);
    };

    return {
        executeSearch, // 직접 검색 실행
        handleSearch, // 폼 제출 시 검색 실행
        handleKeywordClick, // 인기/최근 검색어 클릭 시 검색 실행
        handleRealtimeItemClick, // 실시간 검색 결과 클릭 시 검색 실행
    };
}
