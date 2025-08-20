import React, { useEffect, useState, useRef, useCallback } from 'react';

// Product 인터페이스 (실제 API 응답 구조 기준)
interface Product {
    id: number | string;
    companyId?: number;
    code?: string | null;
    
    // config 객체 - 실제 API 응답 구조
    config?: {
        img_url?: string;
        main_image?: string;
        generate_pv?: number | string;
        stock_count?: number | string;
        system_price?: number | string;
        default_price?: number | string;
        discounted_price?: number | string;
        is_shipping_fee_exempt?: boolean;
    };
    
    // 기본 필드들
    title?: string;  // 상품명 (API 응답)
    name?: string;   // 상품명 (호환성)
    tags?: string;
    description?: string;
    categoryId?: number | null;
    orderIndex?: number;
    
    // 추가 이미지 배열 - 실제 API 응답 구조
    additionalImages?: string[] | null;
    
    // 옵션 관련
    optionJson?: any;
    hasOptions?: boolean;
    
    // 날짜 정보
    createdAt?: string;
    updatedAt?: string;
    deletedAt?: string | null;
    
    // 재고 및 배송 관련
    sku?: string | null;
    barcode?: string | null;
    weight?: number | null;
    cartonQty?: number;
    minStock?: number;
    leadTime?: number;
    moq?: number;
    cost?: number | null;
    shippingFee?: string;
    shippingType?: string;
    storageType?: string;
    canBundle?: boolean;
    isShippingFeeExempt?: boolean;
    
    // 제조 정보
    countryOfOrigin?: string | null;
    manufacturer?: string | null;
    manufacturerCountry?: string | null;
    
    // 타입 및 이벤트
    type?: string;
    pv_rate?: string | null;
    enableCombinedShipping?: boolean;
    eventParamM?: number | null;
    eventParamN?: number | null;
    
    // 카테고리 정보
    category?: {
        id: number;
        name: string;
        description?: string | null;
        parentId?: number | null;
        path?: string | null;
        level?: number;
        orderNum?: number;
    };
    
    // 계산된 필드들 (컴포넌트에서 처리)
    price?: number; // 최종 가격
    originalPrice?: number; // 원래 가격
    image?: string; // 메인 이미지
    thumbnails?: string[]; // 썸네일 배열
    
    // 등급/직급별 가격 정보
    levelPrice?: number | null;
    levelName?: string | null;
    hasLevelPrice?: boolean;
    pv?: number;
    
    // 호환성 필드들
    brand?: string;
    discount?: number;
    purchases?: number;
    flags?: string[];
    benefits?: Array<{ type: string; value: string }>;
    likes?: number;
    stock?: number;
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

// 더미 데이터 (실제 API 응답 구조에 맞춤)
const DEFAULT_PRODUCTS: Product[] = [
    {
        id: 1,
        companyId: 21,
        config: {
            main_image: 'https://picsum.photos/400/400?random=1',
            img_url: 'https://picsum.photos/400/400?random=1',
            default_price: 150000,
            discounted_price: 105000,
            stock_count: 50,
            generate_pv: 210
        },
        title: '프리미엄 무선 이어폰',
        description: '고품질 무선 이어폰',
        categoryId: 1,
        additionalImages: [
            'https://picsum.photos/400/400?random=1', // 메인 이미지 (첫 번째)
            'https://picsum.photos/400/400?random=2', // 추가 이미지 1
            'https://picsum.photos/400/400?random=3'  // 추가 이미지 2
        ],
        hasOptions: false,
        createdAt: '2024-01-01T00:00:00.000Z',
        
        // 호환성 필드
        brand: 'TechBrand',
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
        companyId: 21,
        config: {
            main_image: 'https://picsum.photos/400/400?random=4',
            img_url: 'https://picsum.photos/400/400?random=4',
            default_price: 27000,
            discounted_price: 27000,
            stock_count: 30,
            generate_pv: 420
        },
        title: '스맥스 코리아 초보자 레저용 라켓',
        description: '스맥스 코리아 초보자용 배드민턴 라켓',
        categoryId: 2,
        additionalImages: [
            'https://picsum.photos/400/400?random=4', // 메인 이미지 (첫 번째)
            'https://picsum.photos/400/400?random=5', // 추가 이미지 1
            'https://picsum.photos/400/400?random=6', // 추가 이미지 2
            'https://picsum.photos/400/400?random=7'  // 추가 이미지 3 (총 4개 이미지)
        ],
        hasOptions: true,
        createdAt: '2024-01-02T00:00:00.000Z',
        
        // 호환성 필드
        brand: '스맥스 코리아',
        purchases: 892,
        flags: ['broadcast', 'delivery'],
        benefits: [
            { type: 'coupon', value: '15% 할인쿠폰' }
        ],
        likes: 567
    },
    {
        id: 3,
        companyId: 21,
        config: {
            main_image: 'https://picsum.photos/400/400?random=5',
            img_url: 'https://picsum.photos/400/400?random=5',
            default_price: 450000,
            discounted_price: 292500,
            stock_count: 10,
            generate_pv: 585
        },
        title: '고급 커피머신',
        description: '프로페셔널 커피머신',
        categoryId: 3,
        additionalImages: [
            'https://picsum.photos/400/400?random=5', // 메인 이미지 (첫 번째)
            'https://picsum.photos/400/400?random=6'  // 추가 이미지 1
        ],
        hasOptions: false,
        createdAt: '2024-01-03T00:00:00.000Z',
        
        // 호환성 필드
        brand: 'CafeExpert',
        purchases: 234,
        flags: ['delivery'],
        benefits: [
            { type: 'card', value: '12개월 무이자' }
        ],
        likes: 123
    },
    {
        id: 4,
        companyId: 21,
        config: {
            main_image: 'https://picsum.photos/400/400?random=7',
            img_url: 'https://picsum.photos/400/400?random=7',
            default_price: 580000,
            discounted_price: 348000,
            stock_count: 20,
            generate_pv: 696
        },
        title: '프리미엄 공기청정기',
        description: '대용량 공기청정기',
        categoryId: 4,
        additionalImages: [
            'https://picsum.photos/400/400?random=7' // 메인 이미지만 (첫 번째)
        ],
        hasOptions: true,
        createdAt: '2024-01-04T00:00:00.000Z',
        
        // 호환성 필드
        brand: 'CleanAir',
        purchases: 456,
        flags: ['broadcast', 'delivery', 'weekend'],
        benefits: [
            { type: 'coupon', value: '20% 추가할인' },
            { type: 'card', value: '6개월 무이자' }
        ],
        likes: 789
    }
];


// ImageBox 컴포넌트 인라인화
const ImageBox = ({ src, alt = '' }: { src: string; alt?: string }) => {
    const [isLoading, setIsLoading] = React.useState(true);
    
    return (
        <div className="poj2-image-box relative overflow-hidden w-full h-full bg-gray-100">
            {isLoading && (
                <div className="absolute inset-0 bg-gray-200 animate-pulse" />
            )}
            <img 
                src={src} 
                alt={alt} 
                className={`w-full h-full object-cover transition-transform duration-300 ease-out hover:scale-105 ${
                    isLoading ? 'opacity-0' : 'opacity-100'
                }`}
                onLoad={() => setIsLoading(false)}
                loading="lazy"
            />
        </div>
    );
};

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
    // 실제 API 응답에서 썸네일 이미지 추출 (description에서 추가 이미지 파싱)
    const getThumbnails = () => {
        const images = [];
        
        // 1. 메인 이미지 추가
        const mainImage = product.image || product.config?.main_image || product.config?.img_url;
        if (mainImage) images.push(mainImage);
        
        // 2. imageTwo 추가 (메인 이미지와 다른 경우에만)
        if (product.imageTwo && product.imageTwo !== mainImage) {
            images.push(product.imageTwo);
        }
        
        // 3. additionalImages 배열에서 추가 (중복 제외)
        if (product.additionalImages && product.additionalImages.length > 0) {
            product.additionalImages.forEach(imgUrl => {
                if (imgUrl && !images.includes(imgUrl)) {
                    images.push(imgUrl);
                }
            });
        }
        
        // 4. description HTML에서 img 태그 추출
        if (product.description && images.length < 3) {
            const imgRegex = /<img[^>]*src=['""]([^'""]*)['""][^>]*>/g;
            let match;
            while ((match = imgRegex.exec(product.description)) !== null && images.length < 3) {
                const imgUrl = match[1];
                if (imgUrl && !images.includes(imgUrl)) {
                    images.push(imgUrl);
                }
            }
        }
        
        // 5. 최대 3개까지만 사용
        const finalImages = images.slice(0, 3);
        

        return finalImages.length > 0 ? finalImages : ['https://via.placeholder.com/400'];
    };
    
    const thumbnails = getThumbnails();
    const title = product.title || product.name || '';
    const brand = product.brand;
    const price = product.config?.discounted_price || product.config?.default_price || product.price;
    const originalPrice = product.config?.default_price || product.originalPrice;
    const discount = product.discount || (originalPrice && price ? Math.round((1 - price / originalPrice) * 100) : 0);
    const purchases = product.purchases;
    const flags = product.flags;
    const benefits = product.benefits;
    const likes = product.likes;

    return (
        <div 
            className="poj2-product-card cursor-pointer"
            onClick={() => actions.handleProductClick(product)}
        >
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
        </div>
    );
}

function Thumbnail({ title, brand, thumbnails, tagImage }: { title: string; thumbnails: string[]; brand?: string; tagImage?: string }) {
    return (
        <div className="overflow-hidden relative grid grid-cols-3 gap-1 aspect-[16/10]">
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
            // 옵션이 있는 상품은 상세페이지로 이동
            if (product.hasOptions) {
                if (props.utils?.navigate) {
                    props.utils.navigate(`/product/${product.id}`);
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
            }
        }
    };

    // Tailwind CDN 자동 로드 (최적화)
    useEffect(() => {
        if (typeof window !== 'undefined' && !document.querySelector('script[src*="cdn.tailwindcss.com"]')) {
            const script = document.createElement('script');
            script.src = 'https://cdn.tailwindcss.com';
            script.async = false; // 동기적으로 로드하여 스타일 적용 보장
            document.head.appendChild(script);
            
            // Tailwind 설정 추가
            script.onload = () => {
                if (window.tailwind) {
                    window.tailwind.config = {
                        corePlugins: {
                            preflight: false // 기본 스타일 리셋 비활성화
                        }
                    };
                }
            };
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

    // 선택한 상품만 표시 (페이지네이션 없음)
    const displayProducts = initialProducts;

    return (
        <div className={`pb-15 lg:pb-30 ${props.className || ''}`} style={props.style}>
            {/* 초기 레이아웃 안정성을 위한 스타일 */}
            <style>{`
                .poj2-product-card {
                    contain: layout;
                }
                .poj2-product-card-thumb {
                    position: relative;
                    background: #f3f4f6;
                }
                .poj2-image-box img {
                    will-change: transform;
                }
            `}</style>
            
            {/* 상품 그리드 - 기존 디자인 그대로 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 sm:gap-x-5 gap-y-8 lg:gap-y-10">
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