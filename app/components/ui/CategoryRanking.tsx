import { useEffect, useState, useRef, useMemo } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, FreeMode } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';

import 'swiper/css';
import 'swiper/css/navigation';

// QuickMenu 확장 API를 사용하는 CategoryRanking 컴포넌트
// toLocaleString을 사용하지 않는 완전히 안전한 숫자 포맷팅 함수
const safeNumberFormat = (value: any): string => {
    // null, undefined, 빈 문자열 체크
    if (value === null || value === undefined || value === '') {
        return '0';
    }
    
    // 객체 타입 체크
    if (typeof value === 'object' && value !== null) {
        return '0';
    }
    
    // 숫자 변환
    let num: number;
    try {
        num = Number(value);
    } catch {
        return '0';
    }
    
    // NaN, Infinity 체크
    if (isNaN(num) || !isFinite(num)) {
        return '0';
    }
    
    // toLocaleString 대신 직접 포맷팅 - 절대 오류가 나지 않음
    try {
        const integerPart = Math.floor(Math.abs(num));
        const formatted = integerPart.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        return num < 0 ? '-' + formatted : formatted;
    } catch {
        return String(Math.floor(Math.abs(num)));
    }
};

// 비결에서만 사용할 더미 데이터
const PRODUCT_DATA = [
    {
        id: 4,
        status: 'selling' as const,
        type: 'product' as const,
        brand: '바니스뉴욕',
        thumbnails: ['/images/product/product-2.jpg'],
        title: '[최초가169,000원] 이반프린지 셔츠 원피스',
        price: 129000,
        stars: 4.7,
        reviews: 118,
        flags: ['broadcast', 'weekend', 'delivery', 'return'] as const,
        benefits: [{ type: 'card' as const, value: '무이자3' }],
    },
    {
        id: 5,
        status: 'selling' as const,
        type: 'product' as const,
        brand: '바니스뉴욕',
        thumbnails: ['/images/product/product-2.jpg'],
        title: '[최초가169,000원] 이반프린지 셔츠 원피스',
        price: 129000,
        discount: 45,
        stars: 4.7,
        reviews: 550,
        flags: ['broadcast', 'delivery', 'return'] as const,
        benefits: [
            { type: 'coupon' as const, value: '45%' },
            { type: 'card' as const, value: '무이자3' },
        ],
    },
    {
        id: 6,
        status: 'selling' as const,
        type: 'product' as const,
        brand: '바니스뉴욕',
        thumbnails: ['/images/product/product-2.jpg'],
        title: '[최초가169,000원] 이반프린지 셔츠 원피스',
        price: 129000,
        discount: 5,
        stars: 2.5,
        reviews: 5,
        flags: ['broadcast', 'delivery', 'return'] as const,
        benefits: [{ type: 'coupon' as const, value: '5%' }],
    },
    {
        id: 7,
        status: 'selling' as const,
        type: 'product' as const,
        brand: '바니스뉴욕',
        thumbnails: ['/images/product/product-2.jpg'],
        title: '[최초가169,000원] 이반프린지 셔츠 원피스',
        price: 129000,
        discount: 5,
        stars: 2.5,
        reviews: 5,
        flags: ['broadcast', 'delivery', 'return'] as const,
        benefits: [{ type: 'coupon' as const, value: '5%' }],
    },
    {
        id: 8,
        status: 'selling' as const,
        type: 'product' as const,
        brand: '바니스뉴욕',
        thumbnails: ['/images/product/product-2.jpg'],
        title: '[최초가169,000원] 이반프린지 셔츠 원피스',
        price: 129000,
        discount: 5,
        stars: 2.5,
        reviews: 5,
        flags: ['broadcast', 'delivery', 'return'] as const,
        benefits: [{ type: 'coupon' as const, value: '5%' }],
    },
    {
        id: 9,
        status: 'selling' as const,
        type: 'product' as const,
        brand: '바니스뉴욕',
        thumbnails: ['/images/product/product-2.jpg'],
        title: '[최초가169,000원] 이반프린지 셔츠 원피스',
        price: 129000,
        discount: 5,
        stars: 2.5,
        reviews: 5,
        flags: ['broadcast', 'delivery', 'return'] as const,
        benefits: [{ type: 'coupon' as const, value: '5%' }],
    }
];

const CATEGORY_DATA = [
    { id: 'fashion', name: '패션', icon: '/images/icon/fashion.png' },
    { id: 'sundries', name: '잡화', icon: '/images/icon/sundries.png' },
    { id: 'sports', name: '스포츠', icon: '/images/icon/sports.png' },
    { id: 'beauty', name: '뷰티', icon: '/images/icon/beauty.png' },
    { id: 'food', name: '식품/주방', icon: '/images/icon/food.png' },
    { id: 'life-style', name: '유아동', icon: '/images/icon/life-style.png' },
    { id: 'life', name: '가구', icon: '/images/icon/life.png' },
    { id: 'digital', name: '생활', icon: '/images/icon/digital.png' },
    { id: 'life2', name: '가전', icon: '/images/icon/life.png' },
    { id: 'fashion2', name: 'TV상품', icon: '/images/icon/fashion.png' },
];

// 타입 정의
type ProductStatus = 'selling' | 'sold-out' | 'closing';
type ProductType = 'special' | 'product' | 'consultation';
type ProductFlags = 'broadcast' | 'tomorrow' | 'weekend' | 'delivery' | 'return';
type ProductBenefit = {
    type: 'coupon' | 'card';
    value: string;
};

interface Product {
    id: number;
    status: ProductStatus;
    type: ProductType;
    thumbnails: string[];
    title: string;
    brand?: string;
    price?: number;
    discount?: number;
    tagImage?: string;
    purchases?: number;
    flags?: ProductFlags[];
    benefits?: ProductBenefit[];
    stars?: number;
    reviews?: number;
    likes?: number;
    // 문서 기준 추가 필드
    stockCount?: number;
    hasDiscount?: boolean;
    description?: string;
    categoryId?: number;
}

interface Category {
    id: string;
    name: string;
    icon: string;
}

// QuickMenu 데이터 구조 (QuickMenu + 상품리스트 통합 API)
interface QuickMenuData {
    // 기본 QuickMenu 데이터
    displayItems: Array<{
        id: string;
        categoryId: number;
        categoryName: string;
        imageUrl?: string;
        customImageUrl?: string;
        linkUrl?: string;
        target?: string;
    }>;
    topCategories?: any[];
    loading: boolean;
    error?: string;
    
    // 확장 데이터 (enableProductDisplay가 true일 때만)
    selectedCategoryId?: number;
    products?: Array<{
        id: number;
        name: string;
        title?: string;
        price?: number;
        newPrice?: number;
        thumbnail?: string;
        image?: string;
        stockCount?: number;
        hasDiscount?: boolean;
        discountRate?: number;
        description?: string;
        categoryId?: number;
        brand?: string;
        flags?: string[];
        benefits?: Array<{ type: string; value: string }>;
        stars?: number;
        reviews?: number;
        config?: {
            default_price?: number;
            discounted_price?: number;
            img_url?: string;
            main_image?: string;
            stock_count?: number;
        };
        // 기타 속성
        [key: string]: any;
    }>;
    productsLoading?: boolean;
    productsTotalCount?: number;
}

interface QuickMenuActions {
    handleItemClick: (item: any) => void;
    handleProductClick?: (product: any) => void;  // 추가
    // Redux fetchProducts 액션 (문서 기준)
    fetchProducts?: (params: {
        category_id?: number;
        per_page?: number;
        page?: number;
        include_product_ids?: number[];
        exclude_product_ids?: number[];
    }) => void;
}

// ComponentSkinProps 인터페이스 - QuickMenu 확장 API 호환
export interface ComponentSkinProps {
    data: QuickMenuData;
    actions: QuickMenuActions;
    componentData?: {
        componentProps?: {
            enableProductDisplay?: boolean;
            productsPerRow?: number;
            showProductPrice?: boolean;
            maxProductsToShow?: number;
            initialCategoryId?: number;
            productListClassName?: string;
            categoryItems?: any[];
            columnsPerRow?: number;
            showCategoryName?: boolean;
        };
    };
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

export interface CategoryRankingProps extends Partial<ComponentSkinProps> {
    // 외부에서 주입받을 수 있는 추가 props
    title?: string;
    categories?: Category[];
    products?: Product[];
    className?: string;
    style?: React.CSSProperties;
}

// 아이콘 컴포넌트들 인라인화
const LikeIcon = ({ tailwind }: { tailwind?: string }) => (
    <svg className={tailwind} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
    </svg>
);

const StarIcon = ({ tailwind }: { tailwind?: string }) => (
    <svg className={tailwind} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
    </svg>
);

const ArrowLeftIcon = ({ tailwind }: { tailwind?: string }) => (
    <svg className={tailwind} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

const ArrowRightIcon = ({ tailwind }: { tailwind?: string }) => (
    <svg className={tailwind} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
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

// HomeSectionTitle 컴포넌트 인라인화
function HomeSectionTitle({ title, description }: { title: any; description?: any }) {
    const safeTitle = typeof title === 'string' ? title : (title ? String(title) : '카테고리별 랭킹');
    const safeDescription = typeof description === 'string' ? description : (description ? String(description) : undefined);
    
    return (
        <div className="poj2-home-section-title space-y-1 mb-4 lg:mb-5">
            {/*<h2 className="text-lg lg:text-xl font-bold">{safeTitle}</h2>*/}
            {safeDescription && <p className="text-xs lg:text-sm text-description">{safeDescription}</p>}
        </div>
    );
}

// CategorySlider 컴포넌트 인라인화
function chunkArray<T>(array: T[], chunkSize: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += chunkSize) {
        chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
}

function CategorySlider({ 
    data, 
    displayItems,  // 원본 QuickMenu displayItems 추가
    selectedCategoryId, 
    hasExternalData, 
    enableProductDisplay, 
    actions,
    maxProductsToShow = 20
}: { 
    data: Category[]; 
    displayItems?: any[];  // 원본 QuickMenu displayItems
    selectedCategoryId?: number; 
    hasExternalData: boolean; 
    enableProductDisplay: boolean; 
    actions?: QuickMenuActions;
    maxProductsToShow?: number;
}) {
    const swiperRef = useRef<SwiperType | null>(null);
    const categoryChunks = chunkArray(data, 5);
    const [isBeginning, setIsBeginning] = useState(true);
    const [isEnd, setIsEnd] = useState(false);
    
    // 초기값을 selectedCategoryId 기반으로 설정
    const [activeCategoryId, setActiveCategoryId] = useState(() => {
        if (selectedCategoryId !== null && selectedCategoryId !== undefined) {
            return String(selectedCategoryId);
        }
        return data[0]?.id || '';
    });
    
    // selectedCategoryId 변경 시 동기화
    useEffect(() => {
        if (selectedCategoryId !== null && selectedCategoryId !== undefined) {
            setActiveCategoryId(String(selectedCategoryId));
        }
    }, [selectedCategoryId]);

    const handleCategoryClick = (categoryId: string, category: Category) => {
        setActiveCategoryId(categoryId);
        
        // handleItemClick만 호출! (fetchProducts 직접 호출 제거)
        if (actions?.handleItemClick && enableProductDisplay && displayItems) {
            const quickMenuItem = displayItems.find(item => {
                const itemCategoryId = String(item.categoryId || item.id);
                return itemCategoryId === categoryId;
            });
            
            if (quickMenuItem) {
                actions.handleItemClick(quickMenuItem);  // 이것만 호출!
                // fetchProducts 호출 제거!
            }
        }
    };
    
    return (
        <div className="poj2-category-slider relative">
            <Swiper
                modules={[Navigation, FreeMode]}
                freeMode={{
                    enabled: true,
                    momentum: true,
                    sticky: false,
                }}
                spaceBetween={16}
                breakpoints={{
                    640: {
                        spaceBetween: 0,
                        freeMode: {
                            enabled: false,
                        },
                    },
                }}
                navigation={{
                    prevEl: '.poj2-category-slider-prev',
                    nextEl: '.poj2-category-slider-next',
                }}
                onSwiper={(swiper) => {
                    swiperRef.current = swiper;
                    setIsBeginning(swiper.isBeginning);
                    setIsEnd(swiper.isEnd);
                }}
                onSlideChange={(swiper) => {
                    setIsBeginning(swiper.isBeginning);
                    setIsEnd(swiper.isEnd);
                }}
            >
                {categoryChunks.map((chunk, chunkIndex) => (
                    <SwiperSlide key={chunkIndex} className="!w-full">
                        <div className="flex sm:justify-center gap-4 lg:gap-6">
                            {chunk.map((category) => (
                                <button
                                    key={category.id}
                                    className="flex flex-col items-center space-y-2 max-sm:w-[20%] w-[75px]"
                                    onClick={() => handleCategoryClick(category.id, category)}
                                >
                                    <div className={`flex items-center justify-center aspect-square w-full rounded-full overflow-hidden border transition-colors ${
                                        (hasExternalData && selectedCategoryId === parseInt(category.id)) || 
                                        (!hasExternalData && category.id === activeCategoryId) 
                                            ? 'border-2 border-black bg-white' 
                                            : 'border-border bg-border/10'
                                    }`}>
                                        <img
                                            src={category.icon}
                                            alt={category.name}
                                            className="h-[60%] object-cover"
                                        />
                                    </div>
                                    <p className="text-xs lg:text-sm">{category.name}</p>
                                </button>
                            ))}
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* PC 네비게이션 버튼 */}
            <button
                type="button"
                className={`poj2-category-slider-prev z-1 hidden lg:flex absolute left-0 top-1/2 -translate-y-1/2 items-center justify-center w-10 h-10 bg-white border border-border rounded-full transition-colors ${isBeginning ? 'opacity-30 cursor-not-allowed' : 'hover:border-black'}`}
                aria-label="이전 카테고리"
                disabled={isBeginning}
            >
                <ArrowLeftIcon tailwind="w-6 h-6 text-black" />
            </button>
            <button
                type="button"
                className={`poj2-category-slider-next z-1 hidden lg:flex absolute right-0 top-1/2 -translate-y-1/2 items-center justify-center w-10 h-10 bg-white border border-border rounded-full transition-colors ${isEnd ? 'opacity-30 cursor-not-allowed' : 'hover:border-black'}`}
                aria-label="다음 카테고리"
                disabled={isEnd}
            >
                <ArrowRightIcon tailwind="w-6 h-6 text-gray-600" />
            </button>
        </div>
    );
}

// ProductCard 컴포넌트 인라인화 (QuickMenu API 호환)
function ProductCard({ 
    data, 
    visibleLikeButton, 
    actions, 
    utils 
}: { 
    data: Product; 
    visibleLikeButton?: boolean;
    actions?: any;
    utils?: ComponentSkinProps['utils'];
}) {
    const { id, type, title, brand, price, thumbnails, discount, purchases, flags, benefits, stars, reviews } = data;

    const handleLike = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
    };

    return (
        <div className="poj2-product-card">
            <div className="block cursor-pointer" onClick={() => {
                if (actions?.handleProductClick) {
                    actions.handleProductClick(data);
                }
            }}>
                <div className="poj2-product-card-thumb relative">
                    <Thumbnail
                        title={title}
                        brand={brand}
                        thumbnails={thumbnails}
                    />
                    {visibleLikeButton && (
                        <button
                            type="button"
                            className="absolute right-1.5 bottom-1.5 flex items-center justify-center w-7 h-7 rounded-full bg-white opacity-50 transition-colors transition-opacity hover:opacity-100 hover:fill-discount"
                            onClick={handleLike}
                        >
                            <LikeIcon tailwind="w-4 h-4 mt-0.5" />
                        </button>
                    )}
                </div>
                <div className="poj2-product-card-info pt-2">
                    <PriceInfo
                        type={type}
                        brand={brand}
                        title={title}
                        price={price}
                        discount={discount}
                        purchases={purchases}
                    />
                </div>
                {flags && flags.length > 0 && (
                    <div className="poj2-product-card-flags lg:pt-0.5">
                        <Flags flags={flags} />
                    </div>
                )}
                {benefits && benefits.length > 0 && (
                    <div className="poj2-product-card-benefits pt-1">
                        <Benefits benefits={benefits} />
                    </div>
                )}
                {!!(stars && reviews) && (
                    <div className="poj2-product-card-reviews pt-1">
                        <Review stars={stars} reviews={reviews} />
                    </div>
                )}
            </div>
        </div>
    );
}

function Thumbnail({ title, brand, thumbnails }: { title: string; thumbnails: string[]; brand?: string; }) {
    return (
        <div className="overflow-hidden relative grid grid-cols-3 gap-1 min-h-[175px] lg:min-h-[240px]">
            {thumbnails.length === 1 && (
                <div className="col-span-3">
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
        </div>
    );
}

function PriceInfo({ type, brand, title, price, discount, purchases }: { type: ProductType; brand?: string; title: string; price?: number; discount?: number; purchases?: number }) {
    const isSpecial = type === 'special';
    
    try {
        // 안전한 가격 처리 - 추가 검증
        const safePrice = typeof price === 'number' && !isNaN(price) ? price : 0;
        const safeDiscount = typeof discount === 'number' && !isNaN(discount) ? discount : 0;
        const safePurchases = typeof purchases === 'number' && !isNaN(purchases) ? purchases : 0;
        
        const discountPrice = safeDiscount > 0 ? safePrice * (1 - safeDiscount / 100) : safePrice;
        const safeDiscountPrice = typeof discountPrice === 'number' && !isNaN(discountPrice) && isFinite(discountPrice) ? discountPrice : safePrice;
        
        // 가격이 0이면 상담 상품으로 처리
        if (safePrice === 0) {
            return (
                <div>
                    <h3 className="text-xs lg:text-sm leading-sm">
                        {brand && <span className="pr-1 font-bold">{brand}</span>}
                        {title}
                    </h3>
                    <div className="my-1">
                        <p className="text-sm lg:text-base text-description">상담 상품</p>
                    </div>
                </div>
            );
        }

        return (
            <div>
                <h3 className="text-xs lg:text-sm leading-sm">
                    {brand && <span className="pr-1 font-bold">{brand}</span>}
                    {title}
                </h3>
                <div className="my-1">
                    {safeDiscount > 0 && (
                        <p className="text-xs text-description line-through">
                            {safeNumberFormat(safePrice)}원{isSpecial && '~'}
                        </p>
                    )}
                    <div className="flex items-end justify-between">
                        <div className="flex items-center gap-1 lg:gap-1.5">
                            {safeDiscount > 0 && <p className="text-sm lg:text-base font-bold text-discount">{safeNumberFormat(safeDiscount)}%</p>}
                            <p>
                                <span className="text-sm lg:text-base font-bold">{safeNumberFormat(safeDiscountPrice >= 0 ? Math.floor(safeDiscountPrice) : 0)}</span>
                                <span className="text-xs">원</span>
                            </p>
                        </div>
                        {isSpecial && safePurchases > 0 && (
                            <p className="text-[10px] text-description">{safeNumberFormat(safePurchases)} 구매</p>
                        )}
                    </div>
                </div>
            </div>
        );
    } catch (error) {
        console.warn('PriceInfo error:', error, 'props:', { type, brand, title, price, discount, purchases });
        // 에러 발생 시 최소한의 정보라도 표시
        return (
            <div>
                <h3 className="text-xs lg:text-sm leading-sm">
                    {brand && <span className="pr-1 font-bold">{brand}</span>}
                    {title || '상품 정보 오류'}
                </h3>
                <div className="my-1">
                    <p className="text-sm lg:text-base text-description">가격 정보 오류</p>
                </div>
            </div>
        );
    }
}

function Flags({ flags }: { flags: ProductFlags[] }) {
    return (
        <div className="flex items-center flex-wrap gap-x-1 gap-y-0.5 sm:gap-x-1.5">
            {flags.map((flag) => {
                switch (flag) {
                    case 'broadcast':
                        return <span key={flag} className="text-[10px] font-bold">방송상품</span>;
                    case 'delivery':
                        return <span key={flag} className="text-[10px]">무료배송</span>;
                    case 'weekend':
                        return <span key={flag} className="text-[10px]">주말배송</span>;
                    case 'return':
                        return <span key={flag} className="text-[10px]">무료반품</span>;
                    default:
                        return null;
                }
            })}
        </div>
    );
}

function Benefits({ benefits }: { benefits: ProductBenefit[] }) {
    return (
        <div className="flex items-center flex-wrap gap-0.5">
            {benefits.map((benefit, index) => (
                <p key={index} className="flex items-center gap-0.5 border border-border rounded px-1 py-0.5 text-[10px]">
                    <span className="text-[8px]">{benefit.type === 'coupon' ? '🎟️' : '💳'}</span>
                    <span>{benefit.value}</span>
                </p>
            ))}
        </div>
    );
}

function Review({ stars, reviews }: { stars: number; reviews: number }) {
    return (
        <div className="flex items-center">
            <StarIcon tailwind="w-3 h-3 fill-description" />
            <div className="flex gap-0.5 text-[10px] text-description">
                <p>{stars}점</p>
                <p>{reviews}건</p>
            </div>
        </div>
    );
}

// 데이터 완전 정화 함수 - 모든 위험한 값들을 제거
const sanitizeData = (data: any): any => {
    if (data === null || data === undefined) {
        return {};
    }
    
    if (Array.isArray(data)) {
        return data.map(sanitizeData).filter(item => item !== null && item !== undefined);
    }
    
    if (typeof data === 'object') {
        const sanitized: any = {};
        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                const value = data[key];
                // 함수나 위험한 객체는 제거
                if (typeof value === 'function') {
                    continue;
                }
                sanitized[key] = sanitizeData(value);
            }
        }
        return sanitized;
    }
    
    // 원시값은 그대로 반환
    return data;
};

// 메인 CategoryRanking 컴포넌트 로직
function CategoryRankingComponent(props: CategoryRankingProps = {}) {
    // 완전한 오류 방지를 위한 전체 컴포넌트 try-catch
    try {
        // props에서 actions를 먼저 분리
        const { actions } = props;
        
        // sanitizedProps를 useMemo로 메모이제이션하여 무한 렌더링 방지
        const sanitizedProps = useMemo(() => {
            const { actions: _, ...otherProps } = props;  // actions를 제외한 나머지
            const sanitizedOtherProps = sanitizeData(otherProps);
            return {
                ...sanitizedOtherProps,
                actions: actions  // 원본 actions 그대로 사용 (함수 보존)
            };
        }, [props, actions]);
        
        const hasExternalData = !!(sanitizedProps.data);
        const hasExternalActions = !!(actions);  // 원본 actions 체크
        const mode = sanitizedProps.mode || 'production';
        const componentProps = sanitizedProps.componentData?.componentProps || {};
        
        // 실제 확장 기능 활성화 여부는 fetchProducts 액션 존재로 확인
        const hasExtendedData = !!(sanitizedProps.data?.products !== undefined);  // 상품 데이터가 있는지
        const hasFetchProducts = !!(actions?.fetchProducts);  // 원본 actions에서 fetchProducts 체크
        const isProductDisplayEnabled = hasExtendedData || hasFetchProducts;  // 둘 중 하나라도 있으면 활성화
        
        // 디버깅 정보 출력

    // 웹빌더에서 데이터를 받았는지 확인 - 조건 수정
    // fetchProducts가 없어도 displayItems가 있으면 진행
    if (hasExternalData && !hasFetchProducts && !sanitizedProps.data?.displayItems) {
        return (
            <div className="pb-15 lg:pb-30">
                <HomeSectionTitle title={sanitizedProps.title || "카테고리별 랭킹"} />
                <div className="text-center py-8">
                    <p className="text-gray-600">상품 데이터를 로드 중입니다...</p>
                    <p className="text-gray-500 text-sm mt-2">fetchProducts: {String(hasFetchProducts)}</p>
                    <p className="text-gray-500 text-sm">displayItems: {sanitizedProps.data?.displayItems?.length || 0}</p>
                </div>
            </div>
        );
    }
    
    // 데이터 매핑 및 변환
    const convertQuickMenuToCategory = (displayItems: any[]): Category[] => {
        return displayItems.map(item => ({
            id: String(item.categoryId || item.id),
            name: typeof item.categoryName === 'string' ? item.categoryName : '카테고리',
            icon: item.customImageUrl || item.imageUrl || '/images/icon/default.png'  // customImageUrl 우선순위
        }));
    };
    
    const convertApiProductToLocal = (apiProducts: any[]): Product[] => {
        if (!Array.isArray(apiProducts)) {
            return [];
        }
        
        return apiProducts.map(product => {
            try {
                if (!product || typeof product !== 'object') {
                    return null;
                }
                
                // 웹빌더 실제 데이터 구조에 맞춘 매핑
                const originalPrice = typeof product.price === 'number' ? product.price : (parseFloat(product.price) || 0);
                const newPrice = typeof product.newPrice === 'number' ? product.newPrice : (parseFloat(product.newPrice) || 0);
                const salePrice = newPrice > 0 ? newPrice : originalPrice;  // 할인가가 있으면 할인가, 없으면 원가
                const discountRateRaw = product.hasDiscount && typeof product.discountRate === 'number' ? product.discountRate : 0;
                
                // 모든 숫자 속성들을 안전하게 변환 - parseFloat 사용
                const safeId = typeof product.id === 'number' ? product.id : (parseFloat(product.id) || Math.random() * 1000000);
                const safeStars = product.stars ? (typeof product.stars === 'number' ? product.stars : parseFloat(product.stars)) : undefined;
                const safeReviews = product.reviews ? (typeof product.reviews === 'number' ? product.reviews : parseFloat(product.reviews)) : undefined;
                const safeStockCount = typeof product.stockCount === 'number' ? product.stockCount : (parseFloat(product.stockCount) || 0);
                const safeCategoryId = product.categoryId ? (typeof product.categoryId === 'number' ? product.categoryId : parseFloat(product.categoryId)) : undefined;
                
                return {
                    id: safeId,
                    status: 'selling' as const,
                    type: 'product' as const,
                    thumbnails: [
                        product.thumbnail || '/images/product/product-2.jpg'
                    ],
                    title: typeof product.name === 'string' ? product.name : (typeof product.title === 'string' ? product.title : '상품명 없음'),
                    brand: typeof product.brand === 'string' ? product.brand : undefined,
                    price: salePrice,
                    discount: discountRateRaw > 0 ? discountRateRaw : undefined,
                    stars: safeStars || 4,  // 기본값 4
                    reviews: safeReviews || 0,  // 기본값 0
                    flags: Array.isArray(product.flags) ? product.flags.filter((flag: string) => 
                        ['broadcast', 'delivery', 'weekend', 'return'].includes(flag)
                    ) as ProductFlags[] : [],
                    benefits: Array.isArray(product.benefits) ? product.benefits.map((benefit: any) => ({
                        type: benefit.type === 'coupon' ? 'coupon' as const : 'card' as const,
                        value: String(benefit.value || '')
                    })) : [],
                    // 추가 필드
                    stockCount: safeStockCount,
                    hasDiscount: Boolean(product.hasDiscount),
                    description: String(product.description || ''),
                    categoryId: safeCategoryId
                };
            } catch (error) {
                console.warn('convertApiProductToLocal error:', error, 'product:', product);
                return null;
            }
        }).filter(Boolean) as Product[]; // null 값 제거
    };
    
    // 데이터 구성
    const categories: Category[] = hasExternalData && sanitizedProps.data?.displayItems
        ? convertQuickMenuToCategory(sanitizedProps.data.displayItems)
        : sanitizedProps.categories || CATEGORY_DATA;
        
    const products: Product[] = hasExternalData && sanitizedProps.data?.products
        ? convertApiProductToLocal(sanitizedProps.data.products)
        : sanitizedProps.products || PRODUCT_DATA;
        
    const title = typeof sanitizedProps.title === 'string' ? sanitizedProps.title : "카테고리별 랭킹";
    const loading = hasExternalData ? sanitizedProps.data?.loading : false;
    const productsLoading = hasExternalData ? sanitizedProps.data?.productsLoading : false;
    const selectedCategoryId = hasExternalData ? sanitizedProps.data?.selectedCategoryId : null;
    
    // finalActions를 useMemo로 메모이제이션하여 무한 렌더링 방지
    const finalActions = useMemo(() => {
        if (hasExternalActions) {
            // 외부 actions가 있으면 handleProductClick이 없어도 기본 동작 추가
            return {
                ...actions,
                handleProductClick: actions?.handleProductClick || ((product: any) => {
                    // 상품 클릭 시 상품 상세 페이지로 이동
                    const productUrl = `/products/${product.id}`;
                    if (sanitizedProps.utils?.navigate) {
                        sanitizedProps.utils.navigate(productUrl);
                    } else {
                        window.location.href = productUrl;
                    }
                })
            };
        }
        
        // 기본 actions 구현
        return {
            handleItemClick: (item: any) => {
                console.log('Default handleItemClick:', item);
            },
            handleProductClick: (product: any) => {
                // 상품 클릭 시 상품 상세 페이지로 이동
                const productUrl = `/products/${product.id}`;
                if (sanitizedProps.utils?.navigate) {
                    sanitizedProps.utils.navigate(productUrl);
                } else {
                    window.location.href = productUrl;
                }
            }
        };
    }, [hasExternalActions, actions, sanitizedProps.utils]);

    // 초기 로드 제거 - 웹빌더가 알아서 초기 로드 처리
    // useEffect는 제거됨

    // Tailwind CDN 자동 로드
    useEffect(() => {
        if (typeof window !== 'undefined' && !document.querySelector('script[src*="cdn.tailwindcss.com"]')) {
            const script = document.createElement('script');
            script.src = 'https://cdn.tailwindcss.com';
            script.async = true;
            script.onload = () => {
                // Tailwind config 추가
                if ((window as any).tailwind) {
                    (window as any).tailwind.config = {
                        theme: {
                            extend: {
                                scale: {
                                    '103': '1.03',
                                }
                            }
                        }
                    };
                }
            };
            document.head.appendChild(script);
        }
    }, []);

    return (
        <div className={`relative pb-15 lg:pb-30 ${sanitizedProps.className || ''}`} style={sanitizedProps.style}>
            <HomeSectionTitle title={title} />
            <div className="sticky top-0 z-20 bg-white py-3 mb-4 lg:mb-7">
                <CategorySlider 
                    data={categories}
                    displayItems={sanitizedProps.data?.displayItems}  // 원본 displayItems 전달
                    selectedCategoryId={selectedCategoryId}
                    hasExternalData={hasExternalData}
                    enableProductDisplay={isProductDisplayEnabled}
                    actions={finalActions}
                    maxProductsToShow={componentProps.maxProductsToShow || 20}
                />
            </div>
            
            {/* 상품 리스트 */}
            <div className="product-list">
                {productsLoading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="text-lg">상품을 불러오는 중...</div>
                    </div>
                ) : products && products.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 sm:gap-x-5 gap-y-8 lg:gap-y-10">
                        {products.filter(product => {
                            // 강화된 제품 유효성 검사
                            if (!product || typeof product !== 'object') {
                                return false;
                            }
                            if (!product.id || (typeof product.id !== 'number' && typeof product.id !== 'string')) {
                                return false;
                            }
                            if (!product.title || typeof product.title !== 'string') {
                                return false;
                            }
                            // price가 undefined이거나 null인 경우도 허용 (상담 상품)
                            if (product.price !== undefined && product.price !== null && typeof product.price !== 'number') {
                                return false;
                            }
                            return true;
                        }).map((product) => (
                            <ProductCard
                                key={product.id}
                                data={product}
                                visibleLikeButton
                                actions={finalActions}
                                utils={sanitizedProps.utils}
                            />
                        ))}
                    </div>
                ) : hasExternalData && selectedCategoryId ? (
                    <div className="text-center py-20">
                        <p className="text-gray-600">선택한 카테고리에 상품이 없습니다.</p>
                    </div>
                ) : hasExternalData && !selectedCategoryId && selectedCategoryId !== -1 ? (
                    <div className="text-center py-20">
                        <p className="text-gray-600">카테고리를 선택해주세요.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 sm:gap-x-5 gap-y-8 lg:gap-y-10">
                        {PRODUCT_DATA.map((product) => (
                            <ProductCard
                                key={product.id}
                                data={product}
                                visibleLikeButton
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
    } catch (error) {
        console.error('CategoryRanking component error:', error);
        // 오류 발생 시 안전한 fallback UI 반환
        return (
            <div className="pb-15 lg:pb-30">
                <div className="text-center py-20">
                    <p className="text-gray-600">컴포넌트 렌더링 오류가 발생했습니다.</p>
                    <p className="text-sm text-gray-500 mt-2">잠시 후 다시 시도해주세요.</p>
                </div>
            </div>
        );
    }
}

// UMD 빌드를 위한 래퍼 컴포넌트
const CategoryRanking = (props: any) => {
    // props를 그대로 사용 (강제 설정 제거!)
    const { data, actions, componentProps, componentData, ...restProps } = props;
    

    // 웹빌더에서 받은 props를 그대로 전달
    return <CategoryRankingComponent {...props} />;
};

// CategoryRanking의 기본 설정을 export
export const CategoryRankingConfig = {
    enableProductDisplay: true,  // 필수! QuickMenu 상품 표시 기능 활성화
    maxProductsToShow: 20,
    showProductPrice: true,
    productsPerRow: 3
};

export default CategoryRanking;