import { useEffect } from 'react';

// react-router Link 대체 (UMD 빌드용)
const Link = ({ to, children, ...props }: any) => (
    <a href={to} onClick={(e) => { e.preventDefault();  }} {...props}>
        {children}
    </a>
);

// ProductItem 인터페이스 - ProductSlider API 호환
interface ProductItem {
    id: number;
    // 상품명 (title 또는 name 중 하나는 필수)
    title?: string;
    name?: string;
    // 가격 정보
    price?: number;
    salePrice?: number;
    sale_price?: number;
    // 이미지 (image 또는 thumbnail 중 하나는 필수)
    image?: string;
    thumbnail?: string;
    // 재고 정보
    stock_count?: number;
    stock?: number;
    // 외부 스킨 호환성을 위한 config 객체
    config?: {
        default_price?: number;
        discounted_price?: number;
        img_url?: string;
        stock_count?: number;
    };
    // 기타 속성
    [key: string]: any;
}

// 기본 상품 데이터 - MD 추천용 더미 데이터
const DEFAULT_PRODUCTS: ProductItem[] = [
    {
        id: 1,
        title: '한샘 이지홈 인테리어',
        name: '한샘 이지홈 인테리어',
        brand: '한샘',
        price: 0,
        image: '../../public/images/product/product-3.jpg',
        thumbnail: '../../public/images/product/product-3.jpg',
        purchases: 156,
        flags: ['broadcast'],
        benefits: [
            { type: 'coupon', value: '무료 상담' }
        ],
        likes: 89
    },
    {
        id: 2,
        title: '노랑풍선 큐슈 3일 #온천여행 #가을단풍',
        name: '노랑풍선 큐슈 3일 #온천여행 #가을단풍',
        brand: '노랑풍선',
        price: 0,
        image: '../../public/images/product/product-3.jpg',
        thumbnail: '../../public/images/product/product-3.jpg',
        purchases: 234,
        flags: ['broadcast'],
        benefits: [
            { type: 'card', value: '전문가 상담' }
        ],
        likes: 145
    }
];

// MDRecommendData 인터페이스 - ProductSlider API 기반
interface MDRecommendData {
    // 기본 정보
    id?: string;
    style?: React.CSSProperties;
    className?: string;
    mode?: 'editor' | 'preview' | 'production';
    
    // 상품 데이터 (ProductSlider API 호환)
    allProducts?: ProductItem[];
    defaultProducts?: ProductItem[];
    products?: ProductItem[];
    
    // 상태 관련
    loading?: boolean;
    
    // 콘텐츠 설정
    sliderTitle?: string;
    title?: string;
    headingText?: string; // 속성 패널에서 사용되는 제목
    subtitle?: string;
    
    // 표시 설정 (ProductSlider API 호환)
    showTitle?: boolean;
    showPrice?: boolean;
    showStock?: boolean;
    showAddToCart?: boolean;
    is_logged?: boolean;
    is_not_logged?: boolean;
    
    // 스타일 설정 (ProductSlider API 호환)
    titleFontSize?: string;
    titleFontWeight?: string;
    titleColor?: string;
    titleStyle?: React.CSSProperties;
    containerStyle?: React.CSSProperties;
    cartButtonColor?: string;
    
    // 유틸리티
    componentUniqueId?: string;
}

// MDRecommendActions 인터페이스 - ProductSlider API 기반
interface MDRecommendActions {
    // 상품 상호작용 액션 (ProductSlider API 호환)
    handleAddToCart?: (product: ProductItem, e: React.MouseEvent) => void;
    handleProductClick?: (product: ProductItem) => void;
    
    // 유틸리티 함수 (ProductSlider API 호환)
    formatPrice?: (price: number) => string;
    translate?: (text: string) => string;
    isValidUrl?: (url: string | undefined | null) => boolean;
}

// ComponentSkinProps - ProductSlider API 호환
export interface ComponentSkinProps {
    data: MDRecommendData;
    actions: MDRecommendActions;
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

// MDRecommendProps - 컴포넌트 props
export interface MDRecommendProps extends Partial<ComponentSkinProps> {
    // 추가 props (하위 호환성)
    products?: ProductItem[];
    title?: string;
    subtitle?: string;
    sliderTitle?: string;
}

function MDRecommendComponent(props: MDRecommendProps = {}) {
    const hasExternalData = !!props.data;
    const hasExternalActions = !!props.actions;
    const mode = props.mode || props.data?.mode || 'production';
    
    // 상품 데이터 추출 및 처음 2개만 선택 (ProductSlider API 호환)
    const extractProducts = (data: any): ProductItem[] => {
        let rawProducts: any[] = [];
        
        // 1순위: data.allProducts (ProductSlider API 호환)
        if (data.allProducts && data.allProducts.length > 0) {
            rawProducts = data.allProducts;
        }
        // 2순위: data.products
        else if (data.products && data.products.length > 0) {
            rawProducts = data.products;
        }
        // 3순위: data.defaultProducts
        else if (data.defaultProducts && data.defaultProducts.length > 0) {
            rawProducts = data.defaultProducts;
        }
        else {
            return DEFAULT_PRODUCTS;
        }
        
        // 처음 2개만 반환 (MD 추천은 항상 2개)
        return rawProducts.slice(0, 2);
    };
    
    // Data 구성 - ProductSlider API 구조에 맞춤
    const data: MDRecommendData = hasExternalData ? {
        ...props.data,
        allProducts: extractProducts(props.data),
        products: extractProducts(props.data),
        defaultProducts: DEFAULT_PRODUCTS,
        title: props.data.title || props.data.headingText || props.data.sliderTitle || 'MD 추천 상품',
        subtitle: props.data.subtitle || 'MD가 직접 선정한',
        className: props.data.className || 'md-recommend-component',
        showTitle: props.data.showTitle !== undefined ? props.data.showTitle : true,
        showPrice: props.data.showPrice !== undefined ? props.data.showPrice : true,
        showStock: props.data.showStock !== undefined ? props.data.showStock : false,
        showAddToCart: props.data.showAddToCart !== undefined ? props.data.showAddToCart : true,
        is_logged: props.data.is_logged !== undefined ? props.data.is_logged : true,
        is_not_logged: props.data.is_not_logged !== undefined ? props.data.is_not_logged : true,
        cartButtonColor: props.data.cartButtonColor || '#007bff',
        titleStyle: props.data.titleStyle || {
            fontSize: props.data.titleFontSize || '18px',
            fontWeight: props.data.titleFontWeight || '600',
            color: props.data.titleColor || '#333',
            marginBottom: '16px'
        },
        loading: props.data.loading || false
    } : {
        id: 'md-recommend',
        title: props.title || props.sliderTitle || 'MD 추천 상품',
        subtitle: props.subtitle || 'MD가 직접 선정한',
        allProducts: props.products ? props.products.slice(0, 2) : DEFAULT_PRODUCTS,
        products: props.products ? props.products.slice(0, 2) : DEFAULT_PRODUCTS,
        defaultProducts: DEFAULT_PRODUCTS,
        className: props.className || 'md-recommend-component',
        style: props.style,
        showTitle: true,
        showPrice: true,
        showStock: false,
        showAddToCart: true,
        is_logged: true,
        is_not_logged: true,
        cartButtonColor: '#007bff',
        titleStyle: {
            fontSize: '18px',
            fontWeight: '600',
            color: '#333',
            marginBottom: '16px'
        },
        loading: false,
        mode: mode
    };
    
    // Actions 구성 - ProductSlider API 구조에 맞춤
    const actions: MDRecommendActions = hasExternalActions ? props.actions! : {
        handleAddToCart: (product: ProductItem, e: React.MouseEvent) => {
            // 에디터 모드에서는 클릭 비활성화
            if (mode === 'editor') {
                e.preventDefault();
                return;
            }
        },
        handleProductClick: (product: ProductItem) => {
            // 에디터 모드에서는 클릭 비활성화
            if (mode === 'editor') {
                return;
            }
            
            // ProductSlider API와 동일하게 /products/{id} 경로 사용
            const productUrl = `/products/${product.id}`;
            if (props.utils?.navigate) {
                props.utils.navigate(productUrl);
            } else {
                window.location.href = productUrl;
            }
        },
        formatPrice: (price: number): string => {
            if (props.utils?.formatCurrency) {
                return props.utils.formatCurrency(price);
            }
            return new Intl.NumberFormat('ko-KR', {
                style: 'currency',
                currency: 'KRW'
            }).format(price);
        },
        translate: (text: string): string => {
            if (props.utils?.t) {
                return props.utils.t(text);
            }
            return text;
        },
        isValidUrl: (url: string | undefined | null): boolean => {
            if (!url) return false;
            if (url === '#') return false;
            return true;
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
    
    // 로딩 처리
    if (data.loading) {
        return (
            <section id={data.id} className={`poj2-global-wrapper pb-15 lg:pb-30 ${data.className || ''}`} style={data.style}>
                <div className="text-center">
                    <p>상품을 불러오는 중...</p>
                </div>
            </section>
        );
    }
    
    // 상품이 없는 경우 처리
    const productsToShow = data.allProducts || data.products || data.defaultProducts || DEFAULT_PRODUCTS;
    if (!productsToShow || productsToShow.length === 0) {
        return (
            <section id={data.id} className={`poj2-global-wrapper pb-15 lg:pb-30 ${data.className || ''}`} style={data.style}>
                <div className="text-center">
                    <p>표시할 상품이 없습니다.</p>
                </div>
            </section>
        );
    }
    
    // 사용자 로그인 상태 체크 (ProductSlider API 호환)
    const isUserLoggedIn = props.app?.user ? true : false;
    const shouldDisplay = (isUserLoggedIn && data.is_logged) || (!isUserLoggedIn && data.is_not_logged);
    
    if (!shouldDisplay) {
        return null;
    }
    
    // 원래 MDRecommend 디자인 구현 (ProductSection 스타일 참조)
    return (
        <section className="poj2-md-recommend pb-15 lg:pb-30">
            {/* 타이틀 영역 */}
            <h2 className="text-xl lg:text-2xl font-bold mb-8 lg:mb-10">
                {data.title || '#MD가 추천하는 트렌드상품이에요'}
            </h2>
            
            {/* 상품 그리드 - 처음 2개만 표시 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
                {productsToShow.slice(0, 2).map((product) => {
                    // ProductSlider API 데이터 매핑
                    const productName = product.title || product.name || '상품명 없음';
                    const brand = product.brand;
                    const price = product.config?.default_price || product.price || 0;
                    const imageUrl = product.config?.img_url || product.config?.main_image || product.image || product.thumbnail || '../../public/images/product/product-3.jpg';
                    const purchases = product.purchases;
                    const flags = product.flags;
                    const benefits = product.benefits;
                    const likes = product.likes;
                    
                    return (
                        <div 
                            key={product.id}
                            className="poj2-product-card cursor-pointer"
                            onClick={() => actions.handleProductClick && actions.handleProductClick(product)}
                        >
                            {/* 이미지 영역 */}
                            <div className="poj2-product-card-thumb relative">
                                <div className="overflow-hidden relative aspect-[16/10] bg-gray-100">
                                    <img
                                        src={imageUrl}
                                        alt={productName}
                                        className="w-full h-full object-cover object-center transition-transform duration-300 hover:scale-105"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = '../../public/images/product/product-3.jpg';
                                        }}
                                    />
                                </div>
                                {/* 좋아요 표시 */}
                                {likes && (
                                    <div className="absolute left-0 bottom-0 flex items-center w-full h-8 lg:h-10 px-4 lg:px-5 bg-black/50">
                                        <div className="flex items-center gap-1 lg:gap-2">
                                            <svg className="w-4 h-4 lg:w-5 lg:h-5 fill-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                                            </svg>
                                            <p className="text-white text-sm lg:text-base">{likes}명이 찜한 상품이에요</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                            
                            {/* 상품 정보 */}
                            <div className="poj2-product-card-info pt-3">
                                <h3 className="text-sm lg:text-lg leading-sm">
                                    {brand && <span className="pr-1 font-bold">{brand}</span>}
                                    {productName}
                                </h3>
                                <div className="my-1">
                                    {price > 0 ? (
                                        <div className="flex items-end justify-between">
                                            <p>
                                                <span className="text-lg lg:text-xl font-bold">{price.toLocaleString()}</span>
                                                <span>원</span>
                                            </p>
                                            {purchases && <p className="text-xs text-gray-600">{purchases.toLocaleString()} 구매</p>}
                                        </div>
                                    ) : (
                                        <p className="text-base lg:text-lg text-gray-600">상담 상품</p>
                                    )}
                                </div>
                            </div>
                            
                            {/* 플래그 */}
                            {flags && flags.length > 0 && (
                                <div className="poj2-product-card-flags lg:pt-1">
                                    <div className="flex items-center flex-wrap gap-x-1.5 gap-y-1 sm:gap-x-2">
                                        {flags.map((flag) => {
                                            switch (flag) {
                                                case 'broadcast':
                                                    return <span key={flag} className="text-xs font-bold">방송상품</span>;
                                                case 'delivery':
                                                    return <span key={flag} className="text-xs">무료배송</span>;
                                                case 'weekend':
                                                    return <span key={flag} className="text-xs">주말배송</span>;
                                                default:
                                                    return null;
                                            }
                                        })}
                                    </div>
                                </div>
                            )}
                            
                            {/* 혜택 */}
                            {benefits && benefits.length > 0 && (
                                <div className="poj2-product-card-benefits pt-2">
                                    <div className="flex items-center flex-wrap gap-1">
                                        {benefits.map((benefit, index) => (
                                            <p key={index} className="flex items-center gap-1 border border-gray-300 rounded px-1.5 text-xs">
                                                <span>{benefit.type === 'coupon' ? '🎟️' : '💳'}</span>
                                                <span>{benefit.value}</span>
                                            </p>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
            

        </section>
    );
}

// UMD 빌드를 위한 래퍼 컴포넌트
const MDRecommend = (props: any) => {
    // 웹빌더 환경인지 확인 (data, actions, utils가 모두 있으면 웹빌더)
    const isWebbuilderEnv = props.data && props.actions && props.utils;
    
    if (isWebbuilderEnv) {
        // 웹빌더 환경: ComponentSkinProps 구조 그대로 전달
        return <MDRecommendComponent {...props} />;
    } else {
        // 독립 실행 환경: 기본 props 구조로 변환
        const componentProps: MDRecommendProps = {
            products: props.products,
            title: props.title,
            subtitle: props.subtitle,
            sliderTitle: props.sliderTitle,
            className: props.className,
            style: props.style,
            mode: props.mode || 'production'
        };
        return <MDRecommendComponent {...componentProps} />;
    }
};

export default MDRecommend;