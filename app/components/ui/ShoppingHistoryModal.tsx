import { useState, useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

gsap.registerPlugin(useGSAP);

import { ImageBox } from '@/components/ui/ImageBox';
import { CloseIcon, LikeIcon } from '@/components/icons';
import { Checkbox } from '@/components/ui/Checkbox';

import type { ShoppingHistoryItem } from '@/hooks/useShoppingHistory';

interface ShoppingHistoryModalProps {
    shoppingHistory: ShoppingHistoryItem[];
    removeHistory: (index: number) => void;
    clearAllShoppingHistory: () => void;
    isOpen: boolean;
    onClose: () => void;
}

interface GroupedHistoryItem extends ShoppingHistoryItem {
    selected: boolean;
}

interface GroupedHistory {
    date: string;
    items: GroupedHistoryItem[];
}

export function ShoppingHistoryModal({ shoppingHistory, removeHistory, clearAllShoppingHistory, isOpen, onClose }: ShoppingHistoryModalProps) {
    const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());
    const [showProductsOnly, setShowProductsOnly] = useState(false);

    // 날짜별 그룹화
    const groupedHistory: GroupedHistory[] = shoppingHistory.reduce((groups, item, index) => {
        const date = item.createdAt;
        const existingGroup = groups.find((group) => group.date === date);

        const historyItem: GroupedHistoryItem = {
            ...item,
            selected: selectedItems.has(index),
        };

        if (existingGroup) {
            existingGroup.items.push(historyItem);
        } else {
            groups.push({
                date,
                items: [historyItem],
            });
        }
        return groups;
    }, [] as GroupedHistory[]);

    // 필터링: 제품만 표시
    const filteredHistory = showProductsOnly
        ? groupedHistory
              .map((group) => ({
                  ...group,
                  items: group.items.filter((item) => item.type !== 'consultation'),
              }))
              .filter((group) => group.items.length > 0)
        : groupedHistory;

    const totalItems = filteredHistory.reduce((sum, group) => sum + group.items.length, 0);
    const selectedCount = selectedItems.size;

    const handleItemSelect = (index: number, checked: boolean) => {
        const newSelected = new Set(selectedItems);
        if (checked) {
            newSelected.add(index);
        } else {
            newSelected.delete(index);
        }
        setSelectedItems(newSelected);
    };

    const handleDeleteSelected = () => {
        if (selectedCount === 0) return;

        // 인덱스를 내림차순으로 정렬하여 뒤쪽부터 제거
        const sortedIndexes = Array.from(selectedItems).sort((a, b) => b - a);
        sortedIndexes.forEach((index) => removeHistory(index));
        setSelectedItems(new Set());
    };

    const handleClearAll = () => {
        clearAllShoppingHistory();
        setSelectedItems(new Set());
    };

    const handleLike = (e: React.MouseEvent, item: ShoppingHistoryItem) => {
        e.preventDefault();
        e.stopPropagation();
        alert(`${item.title} 상품을 찜했습니다`);
    };

    // 컴포넌트가 닫힐 때 선택된 아이템과 필터 상태 초기화
    useEffect(() => {
        if (!isOpen) {
            setSelectedItems(new Set());
            setShowProductsOnly(false);
        }
    }, [isOpen]);

    useGSAP(() => {
        const elem = document.querySelector('.poj2-shopping-history-modal');

        if (!elem) return;

        gsap.to(elem, {
            x: isOpen ? 0 : 20,
            opacity: isOpen ? 1 : 0,
            visibility: 'visible',
            duration: 0.6,
            ease: 'power2.inOut',
            onComplete: () => {
                if (!isOpen) {
                    gsap.set(elem, {
                        visibility: 'hidden',
                    });
                }
            },
        });
    }, [isOpen]);

    if (shoppingHistory.length === 0) return null;

    return (
        <div className="poj2-shopping-history-modal isolation hidden sm:block absolute top-[108px] right-0 opacity-0 invisible translate-x-[20px] z-9 flex items-center justify-center">
            <div className="relative w-full max-w-md bg-white border border-border max-h-[75vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-2 border-b border-border">
                    <h2 className="text-lg font-bold">쇼핑 히스토리 ({totalItems})</h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="hover:bg-black/5 rounded transition-colors"
                    >
                        <CloseIcon tailwind="w-6 h-6" />
                    </button>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                    <Checkbox
                        checked={showProductsOnly}
                        onChange={(checked) => setShowProductsOnly(checked)}
                        label="상품만 보기"
                    />
                    <button
                        type="button"
                        onClick={handleClearAll}
                        className="text-sm font-bold text-description hover:text-accent transition-colors"
                    >
                        전체삭제
                    </button>
                </div>

                {/* Item List */}
                <div className="flex-1 overflow-y-auto">
                    {filteredHistory.length === 0 ? (
                        <div className="flex items-center justify-center h-40 text-description">쇼핑 히스토리가 없습니다</div>
                    ) : (
                        filteredHistory.map((group) => (
                            <div key={group.date}>
                                {group.items.map((item, itemIndex) => {
                                    const originalIndex = shoppingHistory.findIndex((historyItem) => historyItem.id === item.id && historyItem.createdAt === item.createdAt);

                                    return (
                                        <div
                                            key={`${item.id}-${itemIndex}`}
                                            className="border-b border-border last:border-b-0"
                                        >
                                            {/* Date Header */}
                                            {itemIndex === 0 && (
                                                <div className="px-4 py-1 bg-description/75">
                                                    <p className="text-sm text-white">{group.date}</p>
                                                </div>
                                            )}

                                            {/* Item */}
                                            <div className="flex items-center gap-3 p-4">
                                                <Checkbox
                                                    checked={selectedItems.has(originalIndex)}
                                                    onChange={(checked) => handleItemSelect(originalIndex, checked)}
                                                />

                                                <div className="w-16 h-16 rounded border border-border overflow-hidden flex-shrink-0">
                                                    <ImageBox
                                                        src={item.thumbnail}
                                                        alt={item.title}
                                                    />
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <h3 className="text-sm text-black truncate">{item.title}</h3>
                                                    {item.price && <p className="text-sm font-bold mt-1">{item.price.toLocaleString()}원</p>}
                                                </div>

                                                <button
                                                    type="button"
                                                    onClick={(e) => handleLike(e, item)}
                                                    className="hover:fill-discount transition-colors"
                                                >
                                                    <LikeIcon tailwind="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ))
                    )}
                </div>

                {/* Selected Items Actions */}
                {selectedCount > 0 && (
                    <div className="p-4 border-t border-border bg-gray-50">
                        <button
                            type="button"
                            onClick={handleDeleteSelected}
                            className="w-full bg-accent text-white py-2 px-4 rounded font-medium hover:bg-accent/90 transition-colors"
                        >
                            선택된 {selectedCount}개 삭제
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
