import { useRef, useEffect } from 'react';

import { SearchIcon, CloseIcon, OutWardIcon } from '@/components/icons';
import { useSearch } from '@/hooks/useSearch';
import { POPULAR_KEYWORDS } from '@/constants/Search';

export function DesktopSearchBar() {
    const { searchKeyword, setSearchKeyword, recentKeywords, isFocused, setIsFocused, activeTab, setActiveTab, realtimeResults, showRealtimeSearch, setShowRealtimeSearch, handleSearch, handleKeywordClick, handleRealtimeItemClick, handleRemoveRecentKeyword, handleClearAllRecentKeywords } =
        useSearch();

    const rootRef = useRef<HTMLFormElement | null>(null);

    // 포커스 아웃 이벤트 처리
    useEffect(() => {
        const FocusOut = (e: MouseEvent) => {
            const formElement = rootRef.current;
            if (formElement && !formElement.contains(e.target as Node)) {
                setIsFocused(false);
                setShowRealtimeSearch(false);
                setActiveTab('popular');
            }
        };

        document.addEventListener('mousedown', FocusOut);
        return () => {
            document.removeEventListener('mousedown', FocusOut);
        };
    }, [setIsFocused, setShowRealtimeSearch, setActiveTab]);

    return (
        <form
            ref={rootRef}
            className="poj2-pc-search-bar relative w-[460px]"
            onSubmit={handleSearch}
        >
            <label
                className="block relative w-full h-12 border-2 border-accent rounded-full"
                htmlFor="poj2-search"
            >
                <input
                    id="poj2-search"
                    type="text"
                    placeholder="검색어를 입력하세요"
                    className="w-full h-full pr-12 pl-6 leading-[1] focus:outline-none"
                    autoComplete="off"
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                />
                <button
                    type="submit"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                    <SearchIcon tailwind="fill-accent w-[27px] h-[27px]" />
                </button>
            </label>

            {/* 실시간 검색 리스트 */}
            {showRealtimeSearch && (
                <div className="poj2-auto-complete absolute top-[calc(100%+10px)] left-0 w-full bg-white border-2 border-accent rounded-2xl shadow-lg z-9">
                    <ul className="p-2">
                        {realtimeResults.map((result, index) => (
                            <li key={index}>
                                <button
                                    type="button"
                                    className="flex items-center justify-between w-full px-4 py-2 transition-colors hover:bg-accent/5 rounded"
                                    onClick={() => handleRealtimeItemClick(result)}
                                >
                                    <p>{result}</p>
                                    <OutWardIcon tailwind="fill-accent w-[21px] h-[21px]" />
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* 검색어 자동완성/추천 드롭다운 */}
            {isFocused && !showRealtimeSearch && (
                <div className="poj2-auto-keyword absolute top-[calc(100%+10px)] left-0 w-full bg-white border-2 border-accent rounded-2xl shadow-lg z-10">
                    {/* 탭 헤더 */}
                    <div className="flex">
                        <button
                            type="button"
                            className={`flex-1 py-3 border-b-2 transition-colors ${activeTab === 'popular' ? 'text-accent border-accent' : 'text-description border-border hover:text-black'}`}
                            onClick={() => setActiveTab('popular')}
                        >
                            인기검색어
                        </button>
                        <button
                            type="button"
                            className={`flex-1 py-3 border-b-2 transition-colors ${activeTab === 'recent' ? 'text-accent border-accent' : 'text-description border-border hover:text-black'}`}
                            onClick={() => setActiveTab('recent')}
                        >
                            최근검색어
                        </button>
                    </div>
                    {/* 탭 콘텐츠 */}
                    <div>
                        {activeTab === 'popular' ? (
                            /* 인기검색어 목록 */
                            <div className="p-2">
                                <ol className="grid grid-cols-2">
                                    {POPULAR_KEYWORDS.map((keyword, index) => (
                                        <li
                                            key={index}
                                            className="w-full"
                                        >
                                            <button
                                                key={index}
                                                type="button"
                                                className="flex items-center w-full px-4 py-2.5 transition-colors hover:bg-accent/5 rounded"
                                                onMouseDown={() => handleKeywordClick(keyword)}
                                            >
                                                <span className="font-bold text-sm text-accent mr-2 min-w-[18px]">{index + 1}</span>
                                                <span className="text-sm text-left">{keyword}</span>
                                            </button>
                                        </li>
                                    ))}
                                </ol>
                            </div>
                        ) : (
                            /* 최근검색어 목록 */
                            <div className="p-2">
                                {recentKeywords.length > 0 ? (
                                    <>
                                        <ol className="w-full">
                                            {recentKeywords.map((item, index) => (
                                                <li
                                                    key={`${item.keyword}-${item.createdAt}-${index}`}
                                                    className="flex items-center justify-between pl-4 pr-2 py-2 transition-colors hover:bg-accent/5 rounded"
                                                >
                                                    <span
                                                        className="text-sm cursor-pointer"
                                                        onMouseDown={() => handleKeywordClick(item.keyword)}
                                                    >
                                                        {item.keyword}
                                                    </span>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-description text-xs">{item.createdAt}</span>
                                                        <button
                                                            type="button"
                                                            className="transition-colors mb-0.5 hover:bg-accent/10 rounded"
                                                            onClick={() => handleRemoveRecentKeyword(index)}
                                                        >
                                                            <CloseIcon tailwind="fill-accent w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </li>
                                            ))}
                                        </ol>
                                        <div className="flex justify-end px-4 pt-2.5 pb-0.5 border-t border-border">
                                            <button
                                                type="button"
                                                className="text-description transition-colors hover:text-black text-xs"
                                                onClick={() => handleClearAllRecentKeywords()}
                                            >
                                                전체삭제
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <div className="py-6 text-sm text-center text-description">최근 검색어가 없습니다.</div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </form>
    );
}
