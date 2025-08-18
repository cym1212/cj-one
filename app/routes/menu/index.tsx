import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router';

import { CATEGORY_ITEMS } from '@/constants/Navigation';
import { ArrowRightIcon } from '@/components/icons';

import { useThrottle } from '@/hooks/useThrottle';

export function meta() {
    return [
        {
            title: '',
        },
        {
            name: 'description',
            content: '',
        },
        {
            name: 'keywords',
            content: '',
        },
    ];
}

export default function Menu() {
    const [activeCategory, setActiveCategory] = useState<string>('');
    const [viewportHeight, setViewportHeight] = useState<number>(0);
    const scrollContainerRef = useRef<HTMLUListElement>(null);
    const sectionRefs = useRef<{ [key: string]: HTMLLIElement | null }>({});
    const observerRef = useRef<IntersectionObserver | null>(null);
    const isScrollingProgrammatically = useRef<boolean>(false);

    // special 타입과 normal 타입 분리
    const specialCategories = CATEGORY_ITEMS.filter((item) => item.type === 'special');
    const normalCategories = CATEGORY_ITEMS.filter((item) => item.type === 'normal');

    // 동적 뷰포트 높이 계산 (iOS Safari 대응)
    useEffect(() => {
        const BottomNavElem = document.querySelector('.poj2-mobile-bottom-nav');

        const updateViewportHeight = () => {
            // visualViewport API 사용 (지원하는 브라우저에서)
            if (BottomNavElem) {
                if (window.visualViewport) {
                    setViewportHeight(window.visualViewport.height - BottomNavElem.clientHeight);
                } else {
                    // fallback: window.innerHeight 사용
                    setViewportHeight(window.innerHeight - BottomNavElem.clientHeight);
                }
            }
        };

        // 초기 설정
        updateViewportHeight();

        // 뷰포트 변경 이벤트 리스너
        if (window.visualViewport) {
            window.visualViewport.addEventListener('resize', updateViewportHeight);
        } else {
            window.addEventListener('resize', updateViewportHeight);
            window.addEventListener('orientationchange', updateViewportHeight);
        }

        return () => {
            if (window.visualViewport) {
                window.visualViewport.removeEventListener('resize', updateViewportHeight);
            } else {
                window.removeEventListener('resize', updateViewportHeight);
                window.removeEventListener('orientationchange', updateViewportHeight);
            }
        };
    }, []);

    // 초기 로드 시 첫 번째 카테고리 활성화
    useEffect(() => {
        if (normalCategories.length > 0 && !activeCategory) {
            setActiveCategory(normalCategories[0].name);
        }
    }, [normalCategories, activeCategory]);

    // IntersectionObserver를 사용한 스크롤 위치 추적
    useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container) return;

        // IntersectionObserver 설정
        observerRef.current = new IntersectionObserver(
            (entries) => {
                // 프로그래밍적 스크롤 중에는 observer 업데이트 무시
                if (isScrollingProgrammatically.current) return;

                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const categoryName = entry.target.getAttribute('data-category');
                        if (categoryName && categoryName !== activeCategory) {
                            setActiveCategory(categoryName);
                        }
                    }
                });
            },
            {
                root: container,
                rootMargin: '-20% 0px -70% 0px', // 상단 20% 지점에서 활성화
                threshold: 0,
            }
        );

        // 각 카테고리의 첫 번째 아이템 관찰
        normalCategories.forEach((category) => {
            const element = sectionRefs.current[category.name];
            if (element && observerRef.current) {
                observerRef.current.observe(element);
            }
        });

        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, [normalCategories, activeCategory]);

    // 쓰로틀된 스크롤 핸들러 (맨 위/아래 감지용)
    const handleScroll = useThrottle(() => {
        const container = scrollContainerRef.current;
        if (!container || isScrollingProgrammatically.current) return;

        const scrollTop = container.scrollTop;
        const containerHeight = container.clientHeight;
        const scrollHeight = container.scrollHeight;

        // 스크롤이 맨 위에 있으면 첫 번째 카테고리를 활성화
        if (scrollTop <= 10) {
            const firstCategory = normalCategories[0];
            if (firstCategory && activeCategory !== firstCategory.name) {
                setActiveCategory(firstCategory.name);
            }
        }
        // 스크롤이 맨 아래에 가까우면 마지막 카테고리를 활성화
        else if (scrollTop + containerHeight >= scrollHeight - 10) {
            const lastCategory = normalCategories[normalCategories.length - 1];
            if (lastCategory && activeCategory !== lastCategory.name) {
                setActiveCategory(lastCategory.name);
            }
        }
    }, 100);

    // 스크롤 이벤트 리스너 등록
    useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container) return;

        container.addEventListener('scroll', handleScroll, { passive: true });
        return () => container.removeEventListener('scroll', handleScroll);
    }, [handleScroll, activeCategory, normalCategories]);

    // 카테고리 클릭 시 해당 섹션으로 스크롤
    const scrollToCategory = (categoryName: string) => {
        const element = sectionRefs.current[categoryName];
        const container = scrollContainerRef.current;

        if (element && container) {
            // 프로그래밍적 스크롤 시작
            isScrollingProgrammatically.current = true;

            const rect = element.getBoundingClientRect();
            const containerRect = container.getBoundingClientRect();
            const scrollTop = container.scrollTop;

            // 컨테이너 기준 상대 위치 계산
            const targetPosition = rect.top - containerRect.top + scrollTop;

            container.scrollTo({
                top: targetPosition,
                behavior: 'smooth',
            });

            // smooth 스크롤 완료 후 플래그 해제 (예상 시간)
            setTimeout(() => {
                isScrollingProgrammatically.current = false;
                setActiveCategory(categoryName);
            }, 500);
        }
    };

    return (
        <div
            className="poj2-mobile-menu flex flex-col bg-white"
            style={{
                height: viewportHeight > 0 ? `${viewportHeight}px` : 'calc(100vh - 64px)',
            }}
        >
            {/* 상단 특별 카테고리 배너 */}
            {specialCategories.length > 0 && (
                <div className="bg-white">
                    <div className="flex gap-4 p-4 overflow-x-auto">
                        {specialCategories.map((category) =>
                            category.subcategories.map((subcategory, index) => (
                                <Link
                                    key={`${subcategory.name}-${index}`}
                                    to={subcategory.path}
                                    className="shrink-0 text-center"
                                >
                                    <div className="w-16 h-16 mb-2 rounded-full overflow-hidden bg-white shadow-sm">
                                        {'image' in subcategory && (
                                            <img
                                                src={subcategory.image}
                                                alt={subcategory.name}
                                                className="w-full h-full object-cover"
                                            />
                                        )}
                                    </div>
                                    <p className="text-xs text-description">{subcategory.name}</p>
                                </Link>
                            ))
                        )}
                    </div>
                </div>
            )}

            {/* 스크롤 스파이 메인 영역 */}
            <div className="flex flex-1 overflow-hidden">
                {/* 좌측 1depth 카테고리 네비게이션 */}
                <div className="w-30 bg-border/50 overflow-y-auto shrink-0">
                    <ul>
                        {normalCategories.map((category) => {
                            const isActive = activeCategory === category.name;
                            return (
                                <li key={category.name}>
                                    <button
                                        type="button"
                                        onClick={() => scrollToCategory(category.name)}
                                        className={`w-full px-4 py-2 text-left transition-colors ${isActive ? 'bg-white font-bold' : 'text-description'}`}
                                    >
                                        <span className="text-sm">{category.name}</span>
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </div>

                {/* 우측 2depth 서브카테고리 리스트 */}
                <ul
                    ref={scrollContainerRef}
                    className="flex-1 overflow-y-auto pb-40"
                >
                    {normalCategories.map((category) =>
                        category.subcategories.map((subcategory, index) => (
                            <li
                                key={`${subcategory.name}-${index}`}
                                ref={(el) => {
                                    // 각 카테고리의 첫 번째 아이템에만 ref 설정
                                    if (index === 0) {
                                        sectionRefs.current[category.name] = el;
                                    }
                                }}
                                data-category={index === 0 ? category.name : undefined}
                            >
                                <Link
                                    to={subcategory.path}
                                    className="flex items-center justify-between pl-4 pr-2 py-3"
                                >
                                    <span className={`text-sm ${index === 0 ? 'text-accent font-bold' : 'text-black'}`}>{subcategory.name}</span>
                                    <ArrowRightIcon />
                                </Link>
                            </li>
                        ))
                    )}
                </ul>
            </div>
        </div>
    );
}
