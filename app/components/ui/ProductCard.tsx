import { Link } from 'react-router';

import { ImageBox } from '@/components/ui/ImageBox';
import { RollingText } from '@/components/ui/RollingText';
import { LikeIcon, PeopleIcon, StarIcon } from '@/components/icons';

import { useShoppingHistory } from '@/hooks/useShoppingHistory';

export type ProductStatus = 'selling' | 'sold-out' | 'closing';
export type ProductType = 'special' | 'product' | 'consultation';
export type ProductFlags = 'broadcast' | 'tomorrow' | 'weekend' | 'delivery' | 'return';
export type ProductBenefit = {
    type: 'coupon' | 'card';
    value: string;
};

export interface Product {
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

interface ProductCardProps {
    data: Product;
    activeRollingText?: boolean;
    visibleLikeButton?: boolean;
}

export function ProductCard({ data, activeRollingText, visibleLikeButton }: ProductCardProps) {
    const { id, status, type, title, brand, price, thumbnails, tagImage, discount, purchases, flags, benefits, stars, reviews, likes } = data;

    const { addShoppingHistory } = useShoppingHistory();

    const handleProductClick = () => {
        // 상품 클릭 시 처리 로직
        addShoppingHistory({
            id,
            status,
            type,
            thumbnail: thumbnails[0],
            title,
            price,
            createdAt: new Date().toLocaleDateString('ko-KR'),
        });
    };

    const handleLike = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        // 실제 장바구니 추가로직 구현
        alert(`${title} 상품을 찜했습니다`);
    };

    return (
        <div className="poj2-product-card">
            <Link
                to={`/product/${id}`}
                className="block"
                onClick={handleProductClick}
            >
                <div className="poj2-product-card-thumb relative">
                    <Thumbnail
                        title={title}
                        brand={brand}
                        thumbnails={thumbnails}
                        tagImage={tagImage}
                    />
                    {visibleLikeButton && (
                        <button
                            type="button"
                            className="absolute right-2 bottom-2 flex items-center justify-center w-9 h-9 rounded-full bg-white opacity-50 transition-colors transition-opacity hover:opacity-100 hover:fill-discount"
                            onClick={handleLike}
                        >
                            <LikeIcon tailwind="mt-0.5" />
                        </button>
                    )}
                    {activeRollingText && likes && (
                        <div className="absolute left-0 bottom-0 flex items-center w-full h-8 lg:h-10 px-4 lg:px-5 bg-black/50">
                            <RollingText>
                                <div
                                    data-rolling-item
                                    className="absolute flex items-center gap-1 lg:gap-2"
                                >
                                    <LikeIcon tailwind="w-4 h-4 lg:w-6 lg:h-6 fill-white" />
                                    <p className="text-white text-sm lg:text-base">{likes}명이 찜한 상품이에요</p>
                                </div>
                                <div
                                    data-rolling-item
                                    className="absolute flex items-center gap-2"
                                >
                                    <PeopleIcon tailwind="w-4 h-4 lg:w-6 lg:h-6 fill-white" />
                                    {/* 나중에 webSocket이나 내부 로직에 따라 수정 */}
                                    <p className="text-white text-sm lg:text-base">지금 355명이 이 상품을 보고있어요</p>
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
                {stars && reviews && (
                    <div className="poj2-product-card-reviews pt-2">
                        <Review
                            stars={stars}
                            reviews={reviews}
                        />
                    </div>
                )}
            </Link>
        </div>
    );
}

function Thumbnail({ title, brand, thumbnails, tagImage }: { title: string; thumbnails: string[]; brand?: string; tagImage?: string }) {
    return (
        <div className="overflow-hidden relative grid grid-cols-3 gap-1 min-h-[175px] lg:min-h-[240px]">
            {/* 단일 */}
            {thumbnails.length === 1 && (
                <div className="col-span-3">
                    <ImageBox
                        src={thumbnails[0]}
                        alt={`${brand || ''} ${title}`}
                    />
                </div>
            )}
            {/* 복수 */}
            {thumbnails.length > 1 &&
                thumbnails.slice(0, 3).map((thumbnail, index) => (
                    <div
                        className={index === 0 ? 'col-span-2 row-span-2' : 'col-span-1 row-span-1'}
                        key={index}
                    >
                        <ImageBox
                            src={thumbnail}
                            alt={`${brand || ''} ${title}`}
                        />
                    </div>
                ))}
            {/* 태그 이미지 */}
            {tagImage && (
                <span className="absolute top-0 left-0 block">
                    <img
                        src={tagImage}
                        alt=""
                        className="w-20 h-20"
                    />
                </span>
            )}
            {/* 카운팅 */}
            {thumbnails.length > 1 && <div className="absolute bottom-0 right-0 bg-black/70 text-white text-xs px-2 py-1">+{thumbnails.length - 3}</div>}
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
                        return (
                            <span
                                key={flag}
                                className="text-xs font-bold"
                            >
                                방송상품
                            </span>
                        );
                    case 'tomorrow':
                        return (
                            <span
                                key={flag}
                                className="text-xs"
                            >
                                <img
                                    src="/images/icon/tomorrow.svg"
                                    alt="내일배송"
                                    className="h-3"
                                />
                            </span>
                        );
                    case 'weekend':
                        return (
                            <span
                                key={flag}
                                className="text-xs"
                            >
                                <img
                                    src="/images/icon/weekend.svg"
                                    alt="주말배송"
                                    className="h-3"
                                />
                            </span>
                        );
                    case 'delivery':
                        return (
                            <span
                                key={flag}
                                className="text-xs"
                            >
                                무료배송
                            </span>
                        );
                    case 'return':
                        return (
                            <span
                                key={flag}
                                className="text-xs"
                            >
                                무료반품
                            </span>
                        );
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
            {benefits.map((benefit) => {
                switch (benefit.type) {
                    case 'coupon':
                        return (
                            <p
                                key={benefit.value}
                                className="flex items-center gap-1 border border-border rounded px-1.5 text-xs"
                            >
                                <img
                                    src="/images/icon/coupon.svg"
                                    alt="쿠폰"
                                    className="h-3"
                                />
                                <span>{benefit.value}</span>
                            </p>
                        );
                    case 'card':
                        return (
                            <p
                                key={benefit.value}
                                className="flex items-center gap-1 border border-border rounded px-1.5 text-xs"
                            >
                                <img
                                    src="/images/icon/card.svg"
                                    alt="카드"
                                    className="h-3"
                                />
                                <span>{benefit.value}</span>
                            </p>
                        );
                    default:
                        return null;
                }
            })}
        </div>
    );
}

function Review({ stars, reviews }: { stars: number; reviews: number }) {
    return (
        <div className="flex items-center">
            <StarIcon tailwind="w-5 h-5 fill-description" />
            <div className="flex gap-1 text-xs text-description">
                <p>{stars}점</p>
                <p>{reviews}건</p>
            </div>
        </div>
    );
}
