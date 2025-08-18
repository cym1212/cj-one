import { useState, useEffect } from 'react';
import { LocalStorageUtil, STORAGE_DURATION } from '@/utils/localStorage';

import type { ProductStatus, ProductType } from '@/components/ui/ProductCard';

export interface ShoppingHistoryItem {
    id: number;
    status: ProductStatus;
    type: ProductType;
    thumbnail: string;
    title: string;
    price?: number;
    createdAt: string;
}

/**
 * 쇼핑 히스토리 localStorage 관리를 담당하는 훅
 */
export function useShoppingHistory() {
    const shoppingHistoryStorage = new LocalStorageUtil('poj2');
    const [shoppingHistory, setShoppingHistory] = useState<ShoppingHistoryItem[]>([]);

    // 쇼핑 히스토리를 localStorage에서 로드
    const loadShoppingHistory = () => {
        const history = shoppingHistoryStorage.get<ShoppingHistoryItem[]>('shopping-history', []) || [];
        setShoppingHistory(history);
    };

    // 새 쇼핑 히스토리 추가 (중복 제거 + 최대 10개 유지)
    const addShoppingHistory = (item: ShoppingHistoryItem) => {
        if (!item) return;

        const existingHistory = shoppingHistoryStorage.get<ShoppingHistoryItem[]>('shopping-history', []) || [];

        const newHistory: ShoppingHistoryItem = {
            id: item.id,
            status: item.status,
            type: item.type,
            thumbnail: item.thumbnail,
            title: item.title,
            price: item.price,
            createdAt: new Date().toLocaleDateString('ko-KR'),
        };

        // 중복 제거
        const filteredHistory = existingHistory.filter((historyItem) => historyItem.id !== newHistory.id);

        // 새로운 쇼핑 히스토리를 맨 앞에 추가하고 최대 20개까지만 유지
        const updatedHistory = [newHistory, ...filteredHistory].slice(0, 20);

        shoppingHistoryStorage.set('shopping-history', updatedHistory, {
            expiresIn: STORAGE_DURATION.WEEK,
        });

        setShoppingHistory(updatedHistory);
    };

    // 특정 쇼핑 히스토리 삭제
    const removeHistory = (index: number) => {
        const currentHistory = shoppingHistoryStorage.get<ShoppingHistoryItem[]>('shopping-history', []) || [];
        const updatedHistory = currentHistory.filter((_, i) => i !== index);

        shoppingHistoryStorage.set('shopping-history', updatedHistory, {
            expiresIn: STORAGE_DURATION.WEEK,
        });

        setShoppingHistory(updatedHistory);
    };

    // 모든 쇼핑 히스토리 삭제
    const clearAllShoppingHistory = () => {
        shoppingHistoryStorage.delete('shopping-history');
        setShoppingHistory([]);
    };

    // 컴포넌트 마운트 시 localStorage에서 로드
    useEffect(() => {
        loadShoppingHistory();
    }, []);

    return {
        shoppingHistory,
        addShoppingHistory, // 새 쇼핑 히스토리 추가
        removeHistory, // 특정 쇼핑 히스토리 삭제
        clearAllShoppingHistory, // 모든 쇼핑 히스토리 삭제
        loadShoppingHistory, // 수동으로 다시 로드
    };
}
