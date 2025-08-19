import { useEffect, useState, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, FreeMode } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';

import 'swiper/css';
import 'swiper/css/navigation';

// 실제 이미지를 사용하는 더미 데이터
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
}

interface Category {
    id: string;
    name: string;
    icon: string;
}

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

// HomeSectionTitle 컴포넌트 인라인화
function HomeSectionTitle({ title, description }: { title: string; description?: string }) {
    return (
        <div className="poj2-home-section-title space-y-1 mb-4 lg:mb-5">
            <h2 className="text-lg lg:text-xl font-bold">{title}</h2>
            {description && <p className="text-xs lg:text-sm text-description">{description}</p>}
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

function CategorySlider({ data }: { data: Category[] }) {
    const swiperRef = useRef<SwiperType | null>(null);
    const categoryChunks = chunkArray(data, 5);
    const [isBeginning, setIsBeginning] = useState(true);
    const [isEnd, setIsEnd] = useState(false);
    const [activeCategoryId, setActiveCategoryId] = useState(data[0]?.id || '');

    const handleCategoryClick = (categoryId: string) => {
        setActiveCategoryId(categoryId);
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
                        <div className="flex sm:justify-center gap-3 lg:gap-5">
                            {chunk.map((category) => (
                                <button
                                    key={category.id}
                                    className="flex flex-col items-center space-y-1 max-sm:w-[18%] w-[60px]"
                                    onClick={() => handleCategoryClick(category.id)}
                                >
                                    <div className={`flex items-center justify-center aspect-square w-full rounded-full overflow-hidden border transition-colors ${category.id === activeCategoryId ? 'border-2 border-black bg-white' : 'border-border bg-border/10'}`}>
                                        <img
                                            src={category.icon}
                                            alt={category.name}
                                            className="h-[50%] object-cover"
                                        />
                                    </div>
                                    <p className="text-[10px] lg:text-xs">{category.name}</p>
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

// ProductCard 컴포넌트 인라인화 (visibleLikeButton 포함)
function ProductCard({ data, visibleLikeButton }: { data: Product; visibleLikeButton?: boolean }) {
    const { id, type, title, brand, price, thumbnails, discount, purchases, flags, benefits, stars, reviews } = data;

    const handleLike = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        console.log(`${title} 상품을 찜했습니다`);
    };

    return (
        <div className="poj2-product-card">
            <Link to={`/product/${id}`} className="block">
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
                {stars && reviews && (
                    <div className="poj2-product-card-reviews pt-1">
                        <Review stars={stars} reviews={reviews} />
                    </div>
                )}
            </Link>
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
    const discountPrice = price && discount && price * (1 - discount / 100);

    return (
        <div>
            <h3 className="text-xs lg:text-sm leading-sm">
                {brand && <span className="pr-1 font-bold">{brand}</span>}
                {title}
            </h3>
            <div className="my-1">
                {discount && (
                    <p className="text-xs text-description line-through">
                        {price?.toLocaleString()}원{isSpecial && '~'}
                    </p>
                )}
                <div className="flex items-end justify-between">
                    <div className="flex items-center gap-1 lg:gap-1.5">
                        {discount && <p className="text-sm lg:text-base font-bold text-discount">{discount}%</p>}
                        <p>
                            <span className="text-sm lg:text-base font-bold">{discountPrice?.toLocaleString() || price?.toLocaleString()}</span>
                            <span className="text-xs">원</span>
                        </p>
                    </div>
                    {isSpecial && purchases && <p className="text-[10px] text-description">{purchases.toLocaleString()} 구매</p>}
                </div>
            </div>
        </div>
    );
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

// 메인 CategoryRanking 컴포넌트
export interface CategoryRankingProps {
    title?: string;
    categories?: Category[];
    products?: Product[];
}

export default function CategoryRanking({ 
    title = "카테고리별 랭킹",
    categories = CATEGORY_DATA,
    products = PRODUCT_DATA
}: CategoryRankingProps) {
    // Tailwind CDN 자동 로드
    useEffect(() => {
        if (typeof window !== 'undefined' && !document.querySelector('script[src*="cdn.tailwindcss.com"]')) {
            const script = document.createElement('script');
            script.src = 'https://cdn.tailwindcss.com';
            script.async = true;
            script.onload = () => {
                // Tailwind config 추가
                if (window.tailwind) {
                    window.tailwind.config = {
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
        <div className="pb-15 lg:pb-30">
            <HomeSectionTitle title={title} />
            <div className="z-2 sticky top-0 h-fit py-3 mb-4 lg:mb-7 bg-white">
                <CategorySlider data={categories} />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 sm:gap-x-5 gap-y-8 lg:gap-y-10">
                {products.map((product) => (
                    <ProductCard
                        key={product.id}
                        data={product}
                        visibleLikeButton
                    />
                ))}
            </div>
        </div>
    );
}