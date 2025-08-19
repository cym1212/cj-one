import { useEffect } from 'react';

// 더미 데이터
const CONSULTATION_PRODUCT_DATA = [
    {
        id: 1,
        status: 'selling' as const,
        type: 'consultation' as const,
        thumbnails: ['https://picsum.photos/720/360?random=11', 'https://picsum.photos/720/360?random=12', 'https://picsum.photos/720/360?random=13'],
        title: '무료 헬스케어 상담',
        brand: 'HealthCare',
        price: 0,
        discount: 0,
        purchases: 156,
        flags: ['delivery'] as const,
        benefits: [
            { type: 'coupon' as const, value: '무료 상담' }
        ],
        likes: 89
    },
    {
        id: 2,
        status: 'selling' as const,
        type: 'consultation' as const,
        thumbnails: ['https://picsum.photos/720/360?random=14'],
        title: '1:1 맞춤 뷰티 컨설팅',
        brand: 'BeautyConsult',
        price: 0,
        discount: 0,
        purchases: 234,
        flags: ['weekend'] as const,
        benefits: [
            { type: 'card' as const, value: '전문가 상담' }
        ],
        likes: 145
    },
    {
        id: 3,
        status: 'selling' as const,
        type: 'consultation' as const,
        thumbnails: ['https://picsum.photos/720/360?random=15', 'https://picsum.photos/720/360?random=16'],
        title: '펫케어 전문 상담',
        brand: 'PetCare',
        price: 0,
        discount: 0,
        purchases: 78,
        flags: ['broadcast', 'delivery'] as const,
        benefits: [
            { type: 'coupon' as const, value: '24시간 상담' }
        ],
        likes: 67
    },
    {
        id: 4,
        status: 'selling' as const,
        type: 'consultation' as const,
        thumbnails: ['https://picsum.photos/720/360?random=17'],
        title: '라이프스타일 컨설팅',
        brand: 'LifeStyle',
        price: 0,
        discount: 0,
        purchases: 123,
        flags: ['delivery', 'weekend'] as const,
        benefits: [
            { type: 'card' as const, value: '맞춤 솔루션' }
        ],
        likes: 234
    }
];

// ProductCard 타입 정의
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

// ProductCard 컴포넌트 인라인화
function ProductCard({ data, activeRollingText }: { data: Product; activeRollingText?: boolean }) {
    const { id, status, type, title, brand, price, thumbnails, tagImage, discount, purchases, flags, benefits, stars, reviews, likes } = data;

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
                        tagImage={tagImage}
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
                        type={type}
                        brand={brand}
                        title={title}
                        price={price}
                        discount={discount}
                        purchases={purchases}
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
        <div className="overflow-hidden relative w-full aspect-[2/1]">
            {thumbnails.length === 1 && (
                <ImageBox src={thumbnails[0]} alt={`${brand || ''} ${title}`} />
            )}
            {thumbnails.length > 1 && (
                <div className="grid grid-cols-3 gap-1 w-full h-full">
                    {thumbnails.slice(0, 3).map((thumbnail, index) => (
                        <div
                            className={index === 0 ? 'col-span-2 row-span-2' : 'col-span-1 row-span-1'}
                            key={index}
                        >
                            <ImageBox src={thumbnail} alt={`${brand || ''} ${title}`} />
                        </div>
                    ))}
                </div>
            )}
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

function PriceInfo({ type, brand, title, price, discount, purchases }: { type: ProductType; brand?: string; title: string; price?: number; discount?: number; purchases?: number }) {
    const isSpecial = type === 'special';
    const isConsultation = type === 'consultation';
    const discountPrice = price && discount && price * (1 - discount / 100);

    return (
        <div>
            <h3 className="text-sm lg:text-lg leading-sm">
                {brand && <span className="pr-1 font-bold">{brand}</span>}
                {title}
            </h3>
            <div className="my-1">
                {discount && (
                    <p className="text-sm text-description line-through">
                        {price?.toLocaleString()}원{isSpecial && '~'}
                    </p>
                )}
                {isConsultation ? (
                    <p className="text-sm">상담신청</p>
                ) : (
                    <div className="flex items-end justify-between">
                        <div className="flex items-center gap-1 lg:gap-2">
                            {discount && <p className="text-lg lg:text-xl font-bold text-discount">{discount}%</p>}
                            <p>
                                <span className="text-lg lg:text-xl font-bold">{discountPrice?.toLocaleString() || price?.toLocaleString()}</span>
                                <span>원</span>
                            </p>
                        </div>
                        {isSpecial && purchases && <p className="text-xs text-description">{purchases.toLocaleString()} 구매</p>}
                    </div>
                )}
            </div>
        </div>
    );
}

function Flags({ flags }: { flags: ProductFlags[] }) {
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

function Benefits({ benefits }: { benefits: ProductBenefit[] }) {
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

// 메인 MDRecommend 컴포넌트
export interface MDRecommendProps {
    title?: string;
    products?: Product[];
}

export default function MDRecommend({ 
    title = "#MD가 추천하는 트렌드상품이에요",
    products = CONSULTATION_PRODUCT_DATA
}: MDRecommendProps) {
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
        <div className="pt-4 lg:pt-5">
            <h3 className="text-lg font-bold mb-4 lg:mb-5">{title}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 sm:gap-x-5 gap-y-8 lg:gap-y-10">
                {products.map((product) => (
                    <ProductCard
                        key={product.id}
                        data={product}
                    />
                ))}
            </div>
        </div>
    );
}