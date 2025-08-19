import { useEffect } from 'react';

// react-router Link 대체 (UMD 빌드용)
const Link = ({ to, children, ...props }: any) => (
    <a href={to} onClick={(e) => { e.preventDefault();  }} {...props}>
        {children}
    </a>
);

// RecommendServiceItem 인터페이스 - TrendingItem과 유사한 구조
interface RecommendServiceItem {
    id: string | number;
    title: string;
    iconUrl: string;  // TrendingItem의 image에 해당
    linkUrl: string;  // TrendingItem의 url에 해당
    alt?: string;
}

// 기본 서비스 데이터 - TrendingItems API 문서 기준 샘플 아이템 3개
const DEFAULT_SERVICES: RecommendServiceItem[] = [
    {
        id: '1',
        title: '멤버십 혜택',
        iconUrl: 'https://withcookie.b-cdn.net/c/default/0.37495945473729053.png',
        linkUrl: 'https://naver.com',
        alt: '멤버십혜택'
    },
    {
        id: '2',
        title: '출석체크',
        iconUrl: 'https://withcookie.b-cdn.net/c/default/0.37495945473729053.png',
        linkUrl: 'https://naver.com',
        alt: '출석체크'
    },
    {
        id: '3',
        title: '혜택',
        iconUrl: 'https://withcookie.b-cdn.net/c/default/0.37495945473729053.png',
        linkUrl: 'https://naver.com',
        alt: '혜택'
    }
];

// RecommendServiceData 인터페이스 - TrendingItemsData와 유사한 구조
interface RecommendServiceData {
    // 기본 정보
    id?: string;
    style?: React.CSSProperties;
    className?: string; // 기본값: 'recommend-service-component'
    mode?: 'editor' | 'preview' | 'production';
    
    // 콘텐츠 설정
    title?: string;
    subtitle?: string;
    headingText?: string; // 속성 패널에서 사용되는 제목 (title로 매핑됨)
    services?: RecommendServiceItem[];  // TrendingItems의 items에 해당
    
    // 표시 설정
    is_logged?: boolean;
    is_not_logged?: boolean;
    
    // 상태값
    hoveredItemId?: string | number | null;
    
    // 유틸리티
    componentUniqueId?: string;
}

// RecommendServiceActions 인터페이스 - TrendingItemsActions와 유사한 구조
interface RecommendServiceActions {
    // 상호작용 액션
    handleServiceClick?: (service: RecommendServiceItem, e: React.MouseEvent) => void;
    
    // 호버 이벤트
    handleServiceHover?: (serviceId: string | number | null) => void;
    
    // 유틸리티 함수
    isValidUrl?: (url: string | undefined | null) => boolean;
    translate?: (text: string) => string;
}

// ComponentSkinProps - TrendingItems API 문서 기준
export interface ComponentSkinProps {
    data: RecommendServiceData;
    actions: RecommendServiceActions;
    options?: Record<string, any>;
    mode?: 'editor' | 'preview' | 'production';
    utils?: {
        t: (key: string) => string;
        navigate: (path: string) => void;
        formatCurrency: (amount: number) => string;
        formatDate: (date: Date) => string;
        getAssetUrl: (path: string) => string;
        cx: (...classes: string[]) => string;
    };
    app?: {
        user?: any;
        company?: any;
        currentLanguage?: string;
        theme?: any;
    };
    editor?: {
        isSelected: boolean;
        onSelect: () => void;
        onEdit: () => void;
        onDelete: () => void;
    };
}

// RecommendServiceProps - 컴포넌트 props
export interface RecommendServiceProps extends Partial<ComponentSkinProps> {
    // 추가 props (하위 호환성)
    services?: RecommendServiceItem[];
    title?: string;
    subtitle?: string;
}

function RecommendServiceComponent(props: RecommendServiceProps = {}) {
    const hasExternalData = !!props.data;
    const hasExternalActions = !!props.actions;
    const mode = props.mode || props.data?.mode || 'production';
    

    // TrendingItems 데이터를 RecommendService 형식으로 변환
    const convertTrendingItemToService = (item: any): RecommendServiceItem => {
        return {
            id: item.id || item.trendingItemId || Math.random().toString(36),
            title: item.title || item.name || '제목 없음',
            iconUrl: item.image || item.iconUrl || item.thumbnail || 'https://via.placeholder.com/100x100?text=No+Image',
            linkUrl: item.url || item.linkUrl || item.link || '#',
            alt: item.alt || item.title || item.name || '이미지'
        };
    };

    // 웹빌더 데이터 구조에서 services 추출 및 변환
    const extractServices = (data: any): RecommendServiceItem[] => {
        let rawItems: any[] = [];
        
        // 1순위: data.services (이미 RecommendService 형식)
        if (data.services && data.services.length > 0) {
            return data.services;
        }
        // 2순위: data.items (TrendingItems 형식 - 변환 필요)
        else if (data.items && data.items.length > 0) {
            rawItems = data.items;
        }
        // 3순위: data.props.services
        else if (data.props?.services && data.props.services.length > 0) {
            return data.props.services;
        }
        // 4순위: data.props.items
        else if (data.props?.items && data.props.items.length > 0) {
            rawItems = data.props.items;
        }
        // 5순위: data.componentProps.services
        else if (data.componentProps?.services && data.componentProps.services.length > 0) {
            return data.componentProps.services;
        }
        // 6순위: data.componentProps.items
        else if (data.componentProps?.items && data.componentProps.items.length > 0) {
            rawItems = data.componentProps.items;
        }
        else {
            return DEFAULT_SERVICES;
        }

        // TrendingItems 형식을 RecommendService 형식으로 변환
        return rawItems.map(convertTrendingItemToService);
    };

    // Data 구성 - TrendingItems API 구조에 맞춤
    const data: RecommendServiceData = hasExternalData ? {
        ...props.data,
        services: extractServices(props.data),
        title: props.data.title || props.data.headingText || props.data.props?.title || props.data.props?.headingText || props.data.componentProps?.title || 'CJ온스타일 추천 서비스', // headingText 지원
        subtitle: props.data.subtitle || props.data.props?.subtitle || props.data.componentProps?.subtitle || '에디터가 선정한',
        className: props.data.className || 'recommend-service-component', // 기본 className 설정
        hoveredItemId: props.data.hoveredItemId || null,
        is_logged: props.data.is_logged !== undefined ? props.data.is_logged : true,
        is_not_logged: props.data.is_not_logged !== undefined ? props.data.is_not_logged : true,
    } : {
        id: 'recommend-service',
        title: props.title || 'CJ온스타일 추천 서비스',
        subtitle: props.subtitle || '에디터가 선정한',
        services: (props.services && props.services.length > 0) ? props.services : DEFAULT_SERVICES,
        className: props.className || 'recommend-service-component', // 기본 className 설정
        style: props.style,
        hoveredItemId: null,
        is_logged: true,
        is_not_logged: true,
        mode: mode
    };
    

    // Actions 구성 - TrendingItems API 구조에 맞춤
    const actions: RecommendServiceActions = hasExternalActions ? props.actions! : {
        handleServiceClick: (service: RecommendServiceItem, e: React.MouseEvent) => {
            // 에디터 모드에서는 클릭 비활성화
            if (mode === 'editor') {
                e.preventDefault();
                return;
            }
            
            const url = service.linkUrl;
            if (url && url !== '#') {
                if (props.utils?.navigate) {
                    props.utils.navigate(url);
                } else if (url.startsWith('http') || url.startsWith('//')) {
                    window.open(url, '_blank');
                } else {
                    window.location.href = url;
                }
            }
        },
        handleServiceHover: (serviceId: string | number | null) => {
            // 호버 상태 관리 (필요시 구현)
        },

        isValidUrl: (url: string | undefined | null): boolean => {
            if (!url) return false;
            if (url === '#') return false;
            return true;
        },
        translate: (text: string): string => {
            // 번역 함수 (utils.t가 있으면 사용, 없으면 원본 반환)
            if (props.utils?.t) {
                return props.utils.t(text);
            }
            return text;
        }
    };
    
    // Tailwind CDN 자동 로드
    useEffect(() => {
        if (typeof window !== 'undefined' && !document.querySelector('script[src*="cdn.tailwindcss.com"]')) {
            const script = document.createElement('script');
            script.src = 'https://cdn.tailwindcss.com';
            script.async = true;
            document.head.appendChild(script);
        }
    }, []);
    
    // 서비스가 없는 경우 처리
    if (!data.services || data.services.length === 0) {
        return (
            <section id={data.id} className={`poj2-global-wrapper pb-15 lg:pb-30 ${data.className || ''}`} style={data.style}>
                <div className="text-center">
                    <p>표시할 서비스가 없습니다.</p>
                </div>
            </section>
        );
    }
    
    // 사용자 로그인 상태 체크 (필요시)
    const isUserLoggedIn = props.app?.user ? true : false;
    const shouldDisplay = (isUserLoggedIn && data.is_logged) || (!isUserLoggedIn && data.is_not_logged);
    
    if (!shouldDisplay) {
        return null;
    }
    
    return (
        <section 
            id={data.id} 
            className={`poj2-global-wrapper pb-15 lg:pb-30 ${data.className || ''} ${data.componentUniqueId || ''}`} 
            style={data.style}
        >
            {/* 헤더 영역 */}
            {(data.title || data.subtitle) && (
                <div className="text-center mb-8 lg:mb-12">
                    {data.subtitle && (
                        <p className="text-sm lg:text-base text-gray-600 mb-2">
                            {actions.translate ? actions.translate(data.subtitle) : data.subtitle}
                        </p>
                    )}
                    {data.title && (
                        <h2 className="text-xl lg:text-2xl font-bold">
                            {actions.translate ? actions.translate(data.title) : data.title}
                        </h2>
                    )}
                </div>
            )}
            
            {/* 서비스 아이템 그리드 */}
            <ul className="poj2-recommend-service overflow-x-auto flex items-center min-[907px]:justify-center gap-4 lg:gap-8">
                {(data.services || DEFAULT_SERVICES).map((service) => {
                    const hasValidUrl = actions.isValidUrl ? actions.isValidUrl(service.linkUrl) : true;
                    const isHovered = data.hoveredItemId === service.id;
                    
                    const serviceContent = (
                        <div 
                            className={`w-18 lg:w-24 text-center space-y-1 lg:space-y-2 transition-transform duration-300 ${
                                isHovered ? 'transform scale-110' : ''
                            }`}
                        >
                            <img
                                src={service.iconUrl}
                                alt={service.alt || service.title}
                                className="w-full h-auto"
                                onError={(e) => {
                                    // 이미지 로드 실패 시 기본 이미지로 대체
                                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/100x100?text=No+Image';
                                }}
                            />
                            <p className="text-xs lg:text-base">
                                {actions.translate ? actions.translate(service.title) : service.title}
                            </p>
                        </div>
                    );
                    
                    return (
                        <li 
                            key={service.id}
                            onMouseEnter={() => actions.handleServiceHover && actions.handleServiceHover(service.id)}
                            onMouseLeave={() => actions.handleServiceHover && actions.handleServiceHover(null)}
                        >
                            {hasValidUrl ? (
                                <a
                                    href={service.linkUrl}
                                    className="block cursor-pointer"
                                    onClick={(e) => {
                                        if (actions.handleServiceClick) {
                                            actions.handleServiceClick(service, e);
                                        }
                                    }}
                                >
                                    {serviceContent}
                                </a>
                            ) : (
                                <div
                                    className="block cursor-pointer"
                                    onClick={(e) => {
                                        if (actions.handleServiceClick) {
                                            actions.handleServiceClick(service, e);
                                        }
                                    }}
                                >
                                    {serviceContent}
                                </div>
                            )}
                        </li>
                    );
                })}
            </ul>
            
            {/* 에디터 모드 표시 (디버깅용) */}
            {mode === 'editor' && props.editor && (
                <div className="mt-4 p-2 bg-yellow-100 text-xs">
                    <p>에디터 모드 - 선택됨: {props.editor.isSelected ? 'Yes' : 'No'}</p>
                </div>
            )}
        </section>
    );
}

// UMD 빌드를 위한 래퍼 컴포넌트
const RecommendService = (props: any) => {
    // 웹빌더 환경인지 확인 (data, actions, utils가 모두 있으면 웹빌더)
    const isWebbuilderEnv = props.data && props.actions && props.utils;
    
    if (isWebbuilderEnv) {
        // 웹빌더 환경: ComponentSkinProps 구조 그대로 전달
        return <RecommendServiceComponent {...props} />;
    } else {
        // 독립 실행 환경: 기본 props 구조로 변환
        const componentProps: RecommendServiceProps = {
            services: props.services,
            title: props.title,
            subtitle: props.subtitle,
            className: props.className,
            style: props.style,
            mode: props.mode || 'production'
        };
        return <RecommendServiceComponent {...componentProps} />;
    }
};

export default RecommendService;