import React, { useEffect, useState, useRef, useCallback } from 'react';

// Product 인터페이스 (API 문서 기준)
interface Product {
    id: number | string;
    name: string;  // API의 title 필드에서 매핑
    price: number; // 최종 가격 (등급/직급 할인 적용된 가격)
    originalPrice: number; // 원래 가격 (할인 전 basePrice)
    image: string; // API의 thumbnail 필드에서 매핑
    stock?: number; // 재고 수량
    hasOptions?: boolean; // 옵션 상품 여부
    category_id?: string; // 카테고리 ID
    description?: string; // 상품 설명
    created_at?: string; // 생성일
    variant_id?: number; // 변형 ID
    
    // 등급/직급별 가격 정보
    levelPrice?: number | null; // 등급/직급 할인 가격
    levelName?: string | null;  // 할인 등급/직급명
    hasLevelPrice: boolean;     // 등급/직급 할인 적용 여부
    
    // PV (포인트 가치) 정보
    pv: number; // 등급/직급별 PV 또는 기본 PV
    
    // 호환성을 위한 기존 필드들
    title?: string;
    thumbnail?: string;
    brand?: string;
    discount?: number;
    purchases?: number;
    flags?: string[];
    benefits?: Array<{ type: string; value: string }>;
    likes?: number;
}

// ProductListData 인터페이스 (API 문서 기준)
interface ProductListData {
    products: Product[];
    loading: boolean; // Redux 로딩 상태
    currentPage: number; // 현재 페이지 (PC용)
    totalPages: number; // 전체 페이지 수
    totalProducts: number; // 전체 상품 수
    selectedCategory: string | null; // 선택된 카테고리
    searchQuery: string; // 검색어
    sortBy: string; // 정렬 기준
    sortOrder: string; // 정렬 순서
    isUserLoggedIn: boolean; // 로그인 여부
    isAdminMode: boolean; // 관리자/에디터 모드 여부
    itemsPerRow: number; // 한 줄당 상품 수
    showStock: boolean; // 재고 표시 여부
    theme: Record<string, any>; // 테마 설정
    
    // 모바일 관련
    isMobile: boolean; // 모바일 환경 여부
    mobileProducts: Product[]; // 모바일용 누적 상품 목록
    mobilePage: number; // 모바일 페이지 번호
    isLoadingMore: boolean; // 더보기 로딩 상태
    loadMoreButtonRef: React.RefObject<HTMLButtonElement | null>; // 더보기 버튼 ref
}

// ProductListActions 인터페이스 (API 문서 기준)  
interface ProductListActions {
    handleAddToCart: (product: Product) => Promise<void>; // 장바구니 추가
    handleCategoryChange: (categoryId: string | null) => void; // 카테고리 변경
    handleSearch: (query: string) => void; // 검색
    handleSortChange: (sortBy: string, sortOrder: string) => void; // 정렬 변경
    handlePageChange: (page: number) => void; // 페이지 변경
    handleLoadMore: () => Promise<void>; // 더보기
    handleProductClick: (product: Product) => void; // 상품 클릭
}

// ComponentSkinProps 인터페이스
export interface ComponentSkinProps {
    data: ProductListData;
    actions: ProductListActions;
    options?: {
        showPrice?: boolean;
        showAddToCart?: boolean;
        showPagination?: boolean;
        priceColor?: string;
        cartButtonColor?: string;
        stockTextColor?: string;
    };
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

export interface ProductSectionProps extends Partial<ComponentSkinProps> {
    // 외부에서 주입받을 수 있는 추가 props
    initialProducts?: Product[];
    className?: string;
    style?: React.CSSProperties;
}

// 더미 데이터 (API 문서 형식으로 변환)
const DEFAULT_PRODUCTS: Product[] = [
    {
        id: 1,
        name: '프리미엄 무선 이어폰',
        price: 105000, // 등급 할인 적용된 가격 (30% 할인)
        originalPrice: 150000,
        image: 'https://picsum.photos/400/400?random=1',
        stock: 50,
        hasOptions: false,
        category_id: '1',
        description: '고품질 무선 이어폰',
        created_at: '2024-01-01',
        
        // 등급별 가격 정보
        levelPrice: 105000,
        levelName: 'VIP 할인',
        hasLevelPrice: true,
        pv: 210,
        
        // 호환성 필드
        title: '프리미엄 무선 이어폰',
        thumbnail: 'https://picsum.photos/400/400?random=1',
        brand: 'TechBrand',
        discount: 30,
        purchases: 523,
        flags: ['delivery', 'weekend'],
        benefits: [
            { type: 'coupon', value: '10% 추가할인' },
            { type: 'card', value: '5% 청구할인' }
        ],
        likes: 234
    },
    {
        id: 2,
        name: '스마트 워치 프로',
        price: 210000, // 등급 할인 적용된 가격 (25% 할인)
        originalPrice: 280000,
        image: 'https://picsum.photos/400/400?random=4',
        stock: 30,
        hasOptions: true,
        category_id: '2',
        description: '프리미엄 스마트 워치',
        created_at: '2024-01-02',
        
        // 등급별 가격 정보
        levelPrice: 210000,
        levelName: '멤버 할인',
        hasLevelPrice: true,
        pv: 420,
        
        // 호환성 필드
        title: '스마트 워치 프로',
        thumbnail: 'https://picsum.photos/400/400?random=4',
        brand: 'SmartTech',
        discount: 25,
        purchases: 892,
        flags: ['broadcast', 'delivery'],
        benefits: [
            { type: 'coupon', value: '15% 할인쿠폰' }
        ],
        likes: 567
    },
    {
        id: 3,
        name: '고급 커피머신',
        price: 292500, // 등급 할인 적용된 가격 (35% 할인)
        originalPrice: 450000,
        image: 'https://picsum.photos/400/400?random=5',
        stock: 10,
        hasOptions: false,
        category_id: '3',
        description: '프로페셔널 커피머신',
        created_at: '2024-01-03',
        
        // 등급별 가격 정보
        levelPrice: 292500,
        levelName: 'VIP 할인',
        hasLevelPrice: true,
        pv: 585,
        
        // 호환성 필드
        title: '고급 커피머신',
        thumbnail: 'https://picsum.photos/400/400?random=5',
        brand: 'CafeExpert',
        discount: 35,
        purchases: 234,
        flags: ['delivery'],
        benefits: [
            { type: 'card', value: '12개월 무이자' }
        ],
        likes: 123
    },
    {
        id: 4,
        name: '프리미엄 공기청정기',
        price: 348000, // 등급 할인 적용된 가격 (40% 할인)
        originalPrice: 580000,
        image: 'https://picsum.photos/400/400?random=7',
        stock: 20,
        hasOptions: true,
        category_id: '4',
        description: '대용량 공기청정기',
        created_at: '2024-01-04',
        
        // 등급별 가격 정보  
        levelPrice: 348000,
        levelName: 'VIP 할인',
        hasLevelPrice: true,
        pv: 696,
        
        // 호환성 필드
        title: '프리미엄 공기청정기',
        thumbnail: 'https://picsum.photos/400/400?random=7',
        brand: 'CleanAir',
        discount: 40,
        purchases: 456,
        flags: ['broadcast', 'delivery', 'weekend'],
        benefits: [
            { type: 'coupon', value: '20% 추가할인' },
            { type: 'card', value: '6개월 무이자' }
        ],
        likes: 789
    }
];


// Link 대체 컴포넌트
const Link = ({ to, children, ...props }: any) => (
    <a href={to} onClick={(e) => { e.preventDefault(); console.log('Navigate to:', to); }} {...props}>
        {children}
    </a>
);

// ImageBox 컴포넌트 인라인화
const ImageBox = ({ src, alt = '' }: { src: string; alt?: string }) => (
    <div className="poj2-image-box relative overflow-hidden w-full h-full">
        <img 
            src={src} 
            alt={alt} 
            className="w-full h-full object-cover transition-transform duration-300 ease-out hover:scale-103" 
        />
    </div>
);

// 아이콘 컴포넌트들 인라인화
const LikeIcon = ({ tailwind }: { tailwind?: string }) => (
    <svg className={tailwind} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
    </svg>
);

const PeopleIcon = ({ tailwind }: { tailwind?: string }) => (
    <svg className={tailwind} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
    </svg>
);

const StarIcon = ({ tailwind }: { tailwind?: string }) => (
    <svg className={tailwind} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
    </svg>
);

// RollingText 컴포넌트 간단 구현
const RollingText = ({ children }: { children: React.ReactNode }) => (
    <div className="relative h-full overflow-hidden">
        {children}
    </div>
);

// ProductCard 컴포넌트 (기존 디자인 유지, API 데이터 구조만 적용)
function ProductCard({ 
    product, 
    data, 
    actions, 
    activeRollingText = true
}: { 
    product: Product; 
    data: ProductListData; 
    actions: ProductListActions;
    activeRollingText?: boolean;
}) {
    // 기존 디자인용 데이터 매핑
    const thumbnails = product.thumbnail ? [product.thumbnail] : [product.image];
    const title = product.name || product.title || '';
    const brand = product.brand;
    const price = product.price;
    const discount = product.discount;
    const purchases = product.purchases;
    const flags = product.flags;
    const benefits = product.benefits;
    const likes = product.likes;

    return (
        <div className="poj2-product-card">
            <Link to={`/product/${product.id}`} className="block">
                <div className="poj2-product-card-thumb relative">
                    <Thumbnail
                        title={title}
                        brand={brand}
                        thumbnails={thumbnails}
                        tagImage={undefined}
                    />
                    {activeRollingText && likes && (
                        <div className="absolute left-0 bottom-0 flex items-center w-full h-8 lg:h-10 px-4 lg:px-5 bg-black/50">
                            <RollingText>
                                <div className="absolute flex items-center gap-1 lg:gap-2">
                                    <LikeIcon tailwind="w-4 h-4 lg:w-6 lg:h-6 fill-white" />
                                    <p className="text-white text-sm lg:text-base">{likes}명이 찜한 상품이에요</p>
                                </div>
                            </RollingText>
                        </div>
                    )}
                </div>
                <div className="poj2-product-card-info pt-3">
                    <PriceInfo
                        product={product}
                        brand={brand}
                        title={title}
                    />
                </div>
                {flags && flags.length > 0 && (
                    <div className="poj2-product-card-flags lg:pt-1">
                        <Flags flags={flags} />
                    </div>
                )}
                {benefits && benefits.length > 0 && (
                    <div className="poj2-product-card-benefits pt-2">
                        <Benefits benefits={benefits} />
                    </div>
                )}
            </Link>
        </div>
    );
}

function Thumbnail({ title, brand, thumbnails, tagImage }: { title: string; thumbnails: string[]; brand?: string; tagImage?: string }) {
    return (
        <div className="overflow-hidden relative grid grid-cols-3 gap-1 min-h-[175px] lg:min-h-[240px]">
            {thumbnails.length === 1 && (
                <div className="col-span-2 row-span-2">
                    <ImageBox src={thumbnails[0]} alt={`${brand || ''} ${title}`} />
                </div>
            )}
            {thumbnails.length > 1 &&
                thumbnails.slice(0, 3).map((thumbnail, index) => (
                    <div
                        className={index === 0 ? 'col-span-2 row-span-2' : 'col-span-1 row-span-1'}
                        key={index}
                    >
                        <ImageBox src={thumbnail} alt={`${brand || ''} ${title}`} />
                    </div>
                ))}
            {tagImage && (
                <span className="absolute top-0 left-0 block">
                    <img src={tagImage} alt="" className="w-20 h-20" />
                </span>
            )}
            {thumbnails.length > 3 && (
                <div className="absolute bottom-0 right-0 bg-black/70 text-white text-xs px-2 py-1">
                    +{thumbnails.length - 3}
                </div>
            )}
        </div>
    );
}

function PriceInfo({ product, brand, title }: { product: Product; brand?: string; title: string }) {
    // API 데이터 구조에서 가격 정보 추출
    const price = product.price;
    const originalPrice = product.originalPrice;
    const hasDiscount = product.hasLevelPrice || (originalPrice && originalPrice > price);
    const discount = hasDiscount && originalPrice ? Math.round((1 - price / originalPrice) * 100) : product.discount;
    const purchases = product.purchases;

    return (
        <div>
            <h3 className="text-sm lg:text-lg leading-sm">
                {brand && <span className="pr-1 font-bold">{brand}</span>}
                {title}
            </h3>
            <div className="my-1">
                {/* 등급 할인이 있거나 원래 가격이 있을 때 */}
                {hasDiscount && originalPrice && (
                    <p className="text-sm text-description line-through">
                        {originalPrice.toLocaleString()}원
                    </p>
                )}
                <div className="flex items-end justify-between">
                    <div className="flex items-center gap-1 lg:gap-2">
                        {discount && <p className="text-lg lg:text-xl font-bold text-discount">{discount}%</p>}
                        <p>
                            <span className="text-lg lg:text-xl font-bold">{price.toLocaleString()}</span>
                            <span>원</span>
                        </p>
                    </div>
                    {purchases && <p className="text-xs text-description">{purchases.toLocaleString()} 구매</p>}
                </div>
                {/* 등급 할인 표시 */}
                {product.hasLevelPrice && product.levelName && (
                    <p className="text-xs text-blue-600 mt-1">{product.levelName}</p>
                )}
                {/* PV 표시 */}
                {product.pv > 0 && (
                    <p className="text-xs text-gray-600 mt-1">PV: {product.pv}</p>
                )}
            </div>
        </div>
    );
}

function Flags({ flags }: { flags: string[] }) {
    return (
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
    );
}

function Benefits({ benefits }: { benefits: Array<{ type: string; value: string }> }) {
    return (
        <div className="flex items-center flex-wrap gap-1">
            {benefits.map((benefit, index) => (
                <p key={index} className="flex items-center gap-1 border border-border rounded px-1.5 text-xs">
                    <span>{benefit.type === 'coupon' ? '🎟️' : '💳'}</span>
                    <span>{benefit.value}</span>
                </p>
            ))}
        </div>
    );
}

// 메인 ProductSection 컴포넌트
function ProductSectionComponent(props: ProductSectionProps = {}) {
    // Props 처리 및 기본값 설정
    const hasExternalData = !!props.data;
    const hasExternalActions = !!props.actions;
    const initialProducts = props.data?.products || props.initialProducts || DEFAULT_PRODUCTS;
    const mode = props.mode || 'production';
    
    // 내부 상태 관리
    const loadMoreButtonRef = useRef<HTMLButtonElement>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [sortBy, setSortBy] = useState('created');
    const [sortOrder, setSortOrder] = useState('desc');
    const [loading, setLoading] = useState(false);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [mobileProducts, setMobileProducts] = useState<Product[]>([]);
    const [mobilePage, setMobilePage] = useState(1);

    // 모바일 감지
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        
        checkMobile();
        window.addEventListener('resize', checkMobile);
        
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // 초기 모바일 상품 설정
    useEffect(() => {
        if (isMobile && initialProducts.length > 0) {
            setMobileProducts(initialProducts.slice(0, 8)); // 초기 8개 로드
        }
    }, [isMobile, initialProducts]);

    // ProductListData 구성
    const data: ProductListData = hasExternalData ? props.data! : {
        products: initialProducts,
        loading,
        currentPage,
        totalPages: Math.ceil(initialProducts.length / 8),
        totalProducts: initialProducts.length,
        selectedCategory,
        searchQuery,
        sortBy,
        sortOrder,
        isUserLoggedIn: true, // 기본값
        isAdminMode: false,
        itemsPerRow: 2, // 그리드 2열
        showStock: true,
        theme: {},
        
        // 모바일 관련
        isMobile,
        mobileProducts,
        mobilePage,
        isLoadingMore,
        loadMoreButtonRef
    };

    // ProductListActions 구성
    const actions: ProductListActions = hasExternalActions ? props.actions! : {
        handleAddToCart: async (product: Product) => {
            console.log('장바구니에 추가:', product.name);
            // 옵션이 있는 상품은 상세페이지로 이동
            if (product.hasOptions) {
                if (props.utils?.navigate) {
                    props.utils.navigate(`/product/${product.id}`);
                } else {
                    console.log('상품 상세페이지로 이동:', product.id);
                }
            } else {
                // 바로 장바구니 추가 로직
                alert(`${product.name}이(가) 장바구니에 추가되었습니다.`);
            }
        },
        
        handleCategoryChange: (categoryId: string | null) => {
            setSelectedCategory(categoryId);
        },
        
        handleSearch: (query: string) => {
            setSearchQuery(query);
        },
        
        handleSortChange: (newSortBy: string, newSortOrder: string) => {
            setSortBy(newSortBy);
            setSortOrder(newSortOrder);
        },
        
        handlePageChange: (page: number) => {
            setCurrentPage(page);
            // PC에서는 스크롤을 최상단으로 이동
            if (!isMobile) {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        },
        
        handleLoadMore: async () => {
            if (isMobile && mobilePage < data.totalPages) {
                setIsLoadingMore(true);
                
                // 시뮬레이션: 다음 페이지 상품 로드
                setTimeout(() => {
                    const nextPageStart = mobilePage * 8;
                    const nextPageEnd = nextPageStart + 8;
                    const nextProducts = initialProducts.slice(nextPageStart, nextPageEnd);
                    
                    setMobileProducts(prev => [...prev, ...nextProducts]);
                    setMobilePage(prev => prev + 1);
                    setIsLoadingMore(false);
                }, 1000);
            }
        },
        
        handleProductClick: (product: Product) => {
            // 모바일에서 상태 저장
            if (isMobile) {
                sessionStorage.setItem('productListState', JSON.stringify({
                    mobileProducts: data.mobileProducts,
                    mobilePage: data.mobilePage,
                    scrollPosition: window.scrollY,
                    totalPages: data.totalPages
                }));
            }
            
            if (props.utils?.navigate) {
                props.utils.navigate(`/product/${product.id}`);
            } else {
                console.log('상품 상세페이지로 이동:', product.id);
            }
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

    // 로딩 상태
    if (data.loading) {
        return (
            <div className="flex justify-center items-center py-20">
                <div className="text-lg">상품을 불러오는 중...</div>
            </div>
        );
    }

    // 표시할 상품 결정 (모바일/PC)
    const displayProducts = data.isMobile ? data.mobileProducts : data.products;

    return (
        <div className={`pb-15 lg:pb-30 ${props.className || ''}`} style={props.style}>
            {/* 상품 그리드 */}
            <div className={`grid grid-cols-1 sm:grid-cols-${data.itemsPerRow} gap-x-4 sm:gap-x-5 gap-y-8 lg:gap-y-10`}>
                {displayProducts.map((product) => (
                    <ProductCard
                        key={product.id}
                        product={product}
                        data={data}
                        actions={actions}
                        activeRollingText
                    />
                ))}
            </div>

            {/* PC 페이지네이션 */}
            {!data.isMobile && data.totalPages > 1 && props.options?.showPagination !== false && (
                <div className="flex justify-center mt-10">
                    <div className="flex gap-2">
                        {Array.from({ length: data.totalPages }, (_, i) => i + 1).map(page => (
                            <button
                                key={page}
                                onClick={() => actions.handlePageChange(page)}
                                className={`px-3 py-2 rounded ${
                                    page === data.currentPage
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-gray-200 hover:bg-gray-300'
                                }`}
                            >
                                {page}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* 모바일 더보기 버튼 */}
            {data.isMobile && data.mobilePage < data.totalPages && (
                <div className="flex justify-center mt-8">
                    <button
                        ref={loadMoreButtonRef}
                        onClick={actions.handleLoadMore}
                        disabled={data.isLoadingMore}
                        className="px-6 py-3 bg-blue-500 text-white rounded-lg disabled:bg-gray-400"
                    >
                        {data.isLoadingMore ? '로딩 중...' : '더보기'}
                    </button>
                </div>
            )}
        </div>
    );
}

// UMD 빌드를 위한 래퍼 컴포넌트
const ProductSection = (props: any) => {
    // 웹빌더 환경인지 확인
    const isWebbuilderEnv = props.data && props.actions && props.utils;
    
    if (isWebbuilderEnv) {
        // 웹빌더 환경: ComponentSkinProps 구조 그대로 전달
        return <ProductSectionComponent {...props} />;
    } else {
        // 독립 실행 환경: 기본 props 구조로 변환
        const componentProps: ProductSectionProps = {
            initialProducts: props.products || props.initialProducts,
            className: props.className,
            style: props.style,
            options: props.options,
            mode: props.mode || 'production'
        };
        return <ProductSectionComponent {...componentProps} />;
    }
};

export default ProductSection;