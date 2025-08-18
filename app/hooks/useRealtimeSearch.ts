import { useEffect, useRef } from 'react';
import { REALTIME_SEARCH_DATA } from '@/constants/Search';

/**
 * 실시간 검색 기능을 담당하는 훅 (디바운스 포함)
 */
export function useRealtimeSearch(searchKeyword: string, isFocused: boolean, setRealtimeResults: (results: string[]) => void, setShowRealtimeSearch: (show: boolean) => void) {
    const debounceRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        // 이전 타이머 클리어
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        if (searchKeyword.trim() === '') {
            // 검색어가 없으면 실시간 검색 비활성화
            setShowRealtimeSearch(false);
            setRealtimeResults([]);
        } else {
            // 디바운스 적용하여 실시간 검색 실행
            debounceRef.current = setTimeout(() => {
                // 검색어가 포함된 결과 필터링 (최대 10개)
                // TODO: 실제 필터링 정규식 추가 필요 - 현재는 단순 includes 방식 사용
                const filteredResults = REALTIME_SEARCH_DATA.filter((item) => item.toLowerCase().includes(searchKeyword.toLowerCase())).slice(0, 10);

                setRealtimeResults(filteredResults);
                setShowRealtimeSearch(isFocused && filteredResults.length > 0);
            }, 200);
        }

        // 컴포넌트 언마운트 시 타이머 클리어
        return () => {
            if (debounceRef.current) {
                clearTimeout(debounceRef.current);
            }
        };
    }, [searchKeyword, isFocused, setRealtimeResults, setShowRealtimeSearch]);

    // 수동으로 실시간 검색 초기화
    const resetRealtimeSearch = () => {
        setShowRealtimeSearch(false);
        setRealtimeResults([]);
    };

    return {
        resetRealtimeSearch, // 실시간 검색 상태 초기화
    };
}
