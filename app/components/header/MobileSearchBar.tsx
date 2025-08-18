import { useState } from 'react';

import { SearchIcon, ArrowLeftIcon, OutWardIcon, CloseIcon } from '@/components/icons';
import { useSearch } from '@/hooks/useSearch';
import { POPULAR_KEYWORDS } from '@/constants/Search';

export function MobileSearchBar() {
    const [openSearchView, setOpenSearchView] = useState<boolean>(false);

    const handleCloseSearchView = () => {
        setOpenSearchView(false);
    };

    return (
        <>
            <div className="poj2-m-search-bar relative w-24">
                <button
                    type="button"
                    className="flex items-center justify-end w-full h-9 pr-2 border-1 border-border rounded-full bg-border/25"
                    onClick={() => setOpenSearchView(true)}
                >
                    <SearchIcon tailwind="fill-accent w-[24px] h-[24px]" />
                </button>
            </div>
            {openSearchView && <MobileSearchView onClose={handleCloseSearchView} />}
        </>
    );
}

function MobileSearchView({ onClose }: { onClose: () => void }) {
    const { searchKeyword, setSearchKeyword, recentKeywords, setIsFocused, realtimeResults, showRealtimeSearch, handleSearch, handleKeywordClick, handleRealtimeItemClick, handleRemoveRecentKeyword, handleClearAllRecentKeywords } = useSearch();

    return (
        <div className="poj2-m-search-view z-11 fixed top-0 left-0 w-screen h-screen bg-white">
            {/* 검색바 */}
            <div className="flex items-center gap-2 w-full h-15 px-2 py-2.5 border-b border-border bg-white">
                <button
                    type="button"
                    className="aspect-square h-full"
                    onClick={onClose}
                >
                    <ArrowLeftIcon tailwind="fill-black w-full h-full" />
                </button>
                <form
                    className="flex gap-1 items-center w-full h-full"
                    onSubmit={handleSearch}
                >
                    <input
                        id="poj2-search"
                        type="text"
                        placeholder="검색어를 입력하세요"
                        className="w-full h-full px-4 text-sm border-1 border-border rounded-full bg-border/25 focus:outline-none"
                        autoComplete="off"
                        value={searchKeyword}
                        onChange={(e) => setSearchKeyword(e.target.value)}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                    />
                    <button
                        type="submit"
                        className="aspect-square h-full flex items-center justify-center"
                    >
                        <SearchIcon tailwind="fill-accent w-7 h-7" />
                    </button>
                </form>
            </div>

            <div className="overflow-y-auto w-full h-[calc(100vh-60px)]">
                {/* 실시간 검색 리스트 */}
                {showRealtimeSearch && (
                    <div className="poj2-auto-complete-m">
                        <ul className="px-4 py-2">
                            {realtimeResults.map((result, index) => (
                                <li key={index}>
                                    <button
                                        type="button"
                                        className="flex items-center justify-between gap-2 w-full py-3"
                                        onClick={() => handleRealtimeItemClick(result)}
                                    >
                                        <p className="text-sm">{result}</p>
                                        <OutWardIcon tailwind="fill-accent w-[18px] h-[18px] shrink-0" />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* 최근검색어 */}
                {!showRealtimeSearch && recentKeywords.length > 0 && (
                    <div className="poj2-recent-keyword-m mt-6">
                        <div className="flex items-center justify-between px-4 py-2">
                            <h3 className="w-full flex items-end gap-2">
                                <p className="text-sm font-bold">최근 검색어</p>
                                <span className="text-xs text-description">00:00 기준</span>
                            </h3>
                            <button
                                type="button"
                                className="text-xs text-accent font-bold shrink-0"
                                onClick={handleClearAllRecentKeywords}
                            >
                                전체삭제
                            </button>
                        </div>
                        <ol className="overflow-x-auto flex items-center gap-2 px-4 py-2">
                            {recentKeywords.map((item, index) => (
                                <li
                                    key={`${item.keyword}-${item.createdAt}-${index}`}
                                    className="flex items-center gap-2 pl-3 pr-2 py-2 border border-border rounded-full"
                                >
                                    <p
                                        className="text-sm truncate"
                                        onMouseDown={() => handleKeywordClick(item.keyword)}
                                    >
                                        {item.keyword}
                                    </p>
                                    <button
                                        type="button"
                                        className="transition-colors"
                                        onClick={() => handleRemoveRecentKeyword(index)}
                                    >
                                        <CloseIcon tailwind="fill-accent w-4 h-4" />
                                    </button>
                                </li>
                            ))}
                        </ol>
                    </div>
                )}

                {/* 인기검색어 */}
                {!showRealtimeSearch && (
                    <div className="poj2-popular-keyword-m mt-6">
                        <h3 className="w-full flex items-end gap-2 px-4 py-2">
                            <p className="text-sm font-bold">인기 검색어</p>
                            <span className="text-xs text-description">00:00 기준</span>
                        </h3>
                        <ol className="grid grid-cols-2">
                            {POPULAR_KEYWORDS.map((keyword, index) => (
                                <li
                                    key={index}
                                    className="w-full"
                                >
                                    <button
                                        key={index}
                                        type="button"
                                        className="flex items-center px-4 py-2"
                                        onMouseDown={() => handleKeywordClick(keyword)}
                                    >
                                        <span className="font-bold text-sm text-accent mr-2 min-w-[18px]">{index + 1}</span>
                                        <span className="text-sm text-left">{keyword}</span>
                                    </button>
                                </li>
                            ))}
                        </ol>
                    </div>
                )}
            </div>
        </div>
    );
}
