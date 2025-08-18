import { useState } from 'react';
import { Link } from 'react-router';
import { useGSAP } from '@gsap/react';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import gsap from 'gsap';

gsap.registerPlugin(useGSAP, ScrollToPlugin);

import { Header } from '@/components/header/Header';
import { MainSlider } from '@/components/ui/MainSlider';
import { HomeSectionTitle } from '@/components/ui/HomeSectionTitle';
import { ProductCard } from '@/components/ui/ProductCard';
import { SideQuickMenu } from '@/components/ui/SideQuickMenu';
import { CreditCardBenefit } from '@/components/ui/CreditCardBenefit';
import { CategorySlider } from '@/components/ui/CategorySlider';

import { SPECIAL_PRODUCT_DATA, PRODUCT_DATA, CONSULTATION_PRODUCT_DATA } from '@/constants/product';
import { CATEGORY_DATA } from '@/constants/category';

export function meta() {
    return [
        {
            title: 'CJ온스타일',
        },
        {
            name: 'description',
            content: '매일 만나는 라이브커머스와 취향맞춤 영상 큐레이션까지! CJ온스타일에서 만나보세요.',
        },
        {
            name: 'keywords',
            content: '온스타일,ONSTYLE,CJ온스타일,CJONSTYLE,CJ홈쇼핑,씨제이홈쇼핑,최화정쇼,힛더스타일,굿라이프,브티나는생활,엣지쇼,더엣지,셀렙샷 에디션,오덴세,테일러센츠,오하루',
        },
        {
            name: 'og:title',
            content: 'CJ온스타일',
        },
        {
            name: 'og:description',
            content: '매일 만나는 라이브커머스와 취향맞춤 영상 큐레이션까지! CJ온스타일에서 만나보세요.',
        },
        {
            name: 'og:image',
            content: 'https://example.com/og-image.jpg',
        },
        {
            name: 'og:url',
            content: 'https://example.com',
        },
    ];
}

const SLIDES_DATA = [
    {
        content: '네이버페이로 결제하면\n~3,000p 적립',
        path: '/',
        badges: ['네이버포인트'],
        image: '/images/main-slide/n-pay.jpg',
        isAd: false,
    },
    {
        content: '식닥 위의 예술\n~빌레로이앤보흐~44%',
        path: '/',
        badges: ['백화점동일', '단독특가'],
        image: '/images/main-slide/villeroy-boch.jpg',
        isAd: true,
    },
    {
        content: '나에게 맞는 유산균\n드시모네 브랜드위크',
        path: '/',
        badges: ['CJ특가', '5% 카드할인'],
        image: '/images/main-slide/be-simone.jpg',
        isAd: true,
    },
    {
        content: '1일 섭취량은 100%\n~캡슐은 초미니로 작게',
        path: '/',
        badges: ['적립10%', '추가증정'],
        image: '/images/main-slide/ag-health.jpg',
        isAd: true,
    },
    {
        content: '정수기는 역시 코웨이\n최대 6개월 반값할인',
        path: '/',
        badges: ['상품권', '제휴카드'],
        image: '/images/main-slide/coway.jpg',
        isAd: true,
    },
    {
        content: '다이슨 에어랩id\n완벽 썸머 스타일링',
        path: '/',
        badges: ['5%쿠폰', '2종사은증정'],
        image: '/images/main-slide/dyson.jpg',
        isAd: true,
    },
    {
        content: '1일 섭취량은 100%\n~캡슐은 초미니로 작게',
        path: '/',
        badges: ['적립10%', '추가증정'],
        image: '/images/main-slide/ag-health.jpg',
        isAd: true,
    },
    {
        content: '정수기는 역시 코웨이\n최대 6개월 반값할인',
        path: '/',
        badges: ['상품권', '제휴카드'],
        image: '/images/main-slide/coway.jpg',
        isAd: true,
    },
];

const CREDIT_CARD_BENEFIT_DATA = [
    {
        logo: '/images/icon/lotte.png',
        name: '롯데카드',
        discount: '5',
        hasDiscountRange: true,
        href: '/',
        bgColor: '#D53225',
    },
    {
        logo: '/images/icon/woori.png',
        name: '우리카드',
        discount: '10',
        href: '/',
        bgColor: '#0F34A2',
        hasDiscountRange: false,
    },
    {
        logo: '/images/icon/kb.png',
        name: 'KB국민카드',
        discount: '7',
        href: '/',
        bgColor: '#62584C',
        hasDiscountRange: true,
    },
    {
        logo: '/images/icon/lotte.png',
        name: '롯데카드',
        discount: '5',
        hasDiscountRange: true,
        href: '/',
        bgColor: '#D53225',
    },
    {
        logo: '/images/icon/woori.png',
        name: '우리카드',
        discount: '10',
        href: '/',
        bgColor: '#0F34A2',
        hasDiscountRange: false,
    },
    {
        logo: '/images/icon/kb.png',
        name: 'KB국민카드',
        discount: '7',
        href: '/',
        bgColor: '#62584C',
        hasDiscountRange: true,
    },
];

export default function Home() {
    const handleTabClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        const clickedButton = e.currentTarget;
        const parentElement = clickedButton.closest('ul');

        if (parentElement) {
            const allButtons = parentElement.querySelectorAll('button');
            allButtons.forEach((button) => {
                button.classList.remove('poj2-home-tab-active');
            });
            clickedButton.classList.add('poj2-home-tab-active');
        }

        const tab = clickedButton.dataset.tab;
        if (tab) {
            const targetElement = document.getElementById(tab);
            if (targetElement) {
                gsap.to(window, {
                    duration: 0.9,
                    scrollTo: {
                        y: targetElement,
                        offsetY: 60,
                    },
                    ease: 'power2.inOut',
                });
            }
        }
    };

    return (
        <>
            <Header />

            {/* 메인 슬라이더 */}
            <section className="mb-10 lg:my-10">
                <MainSlider data={SLIDES_DATA} />
            </section>

            {/* 추천 서비스 */}
            <section className="poj2-global-wrapper pb-15 lg:pb-30">
                <HomeSectionTitle title="CJ온스타일 추천 서비스" />
                <ul className="poj2-recommend-service overflow-x-auto flex items-center min-[907px]:justify-center gap-4 lg:gap-8">
                    {/* 멤버십혜택 페이지는 없지만 레이아웃상 포함 */}
                    <li>
                        <Link
                            to="/"
                            className="block"
                        >
                            <div className="w-18 lg:w-24 text-center space-y-1 lg:space-y-2">
                                <img
                                    src="/images/icon/membership.png"
                                    alt="멤버십혜택"
                                />
                                <p className="text-xs lg:text-base">멤버십 혜택</p>
                            </div>
                        </Link>
                    </li>
                    {/* 출석체크 페이지는 없지만 레이아웃상 포함 */}
                    <li>
                        <Link
                            to="/"
                            className="block"
                        >
                            <div className="w-18 lg:w-24 text-center space-y-1 lg:space-y-2">
                                <img
                                    src="/images/icon/attendance-check.png"
                                    alt="출석체크"
                                />
                                <p className="text-xs lg:text-base">출석체크</p>
                            </div>
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/benefits"
                            className="block"
                        >
                            <div className="w-18 lg:w-24 text-center space-y-1 lg:space-y-2">
                                <img
                                    src="/images/icon/coupon.png"
                                    alt="혜택"
                                />
                                <p className="text-xs lg:text-base">혜택</p>
                            </div>
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/review-group"
                            className="block"
                        >
                            <div className="w-18 lg:w-24 text-center space-y-1 lg:space-y-2">
                                <img
                                    src="/images/icon/review-group.png"
                                    alt="체험단"
                                />
                                <p className="text-xs lg:text-base">체험단</p>
                            </div>
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/specialty-shop/department-store"
                            className="block"
                        >
                            <div className="w-18 lg:w-24 text-center space-y-1 lg:space-y-2">
                                <img
                                    src="/images/icon/department-store.png"
                                    alt="백화점"
                                />
                                <p className="text-xs lg:text-base">백화점</p>
                            </div>
                        </Link>
                    </li>
                </ul>
            </section>

            {/* 상품 영역 */}
            <section className="poj2-product-area poj2-global-wrapper relative grid grid-cols-1 min-[907px]:grid-cols-[calc(100%-100px)_100px] gap-4 lg:gap-5">
                {/* 상품 리스트 */}
                <div className="poj2-product-list w-full">
                    <div className="pb-15 lg:pb-30">
                        {/* 추후 재사용 시 이미지+배너+텍스트 컴포넌트화 가능 */}
                        <div className="poj2-img-title-banner pb-6">
                            <img
                                src="/images/banner/benefit.png"
                                alt="혜택ON. 오늘 혜택이 가장 좋아요"
                            />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 sm:gap-x-5 gap-y-8 lg:gap-y-10">
                            {SPECIAL_PRODUCT_DATA.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    data={product}
                                    activeRollingText
                                />
                            ))}
                        </div>
                    </div>

                    <div className="pb-15 lg:pb-30">
                        <HomeSectionTitle title="카드 혜택" />
                        <div className="overflow-x-auto flex items-center gap-4 lg:gap-5 min-[907px]:justify-center">
                            {CREDIT_CARD_BENEFIT_DATA.map((benefit, index) => (
                                <CreditCardBenefit
                                    key={benefit.name + index}
                                    logo={benefit.logo}
                                    name={benefit.name}
                                    discount={benefit.discount}
                                    href={benefit.href}
                                    bgColor={benefit.bgColor}
                                    hasDiscountRange={benefit.hasDiscountRange}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="pb-15 lg:pb-30">
                        <HomeSectionTitle
                            title="인기 특가"
                            description="지금 인기있는 MD 선정 상품"
                        />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 sm:gap-x-5 gap-y-8 lg:gap-y-10">
                            {SPECIAL_PRODUCT_DATA.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    data={product}
                                    activeRollingText
                                />
                            ))}
                        </div>
                    </div>

                    <div className="pb-15 lg:pb-30">
                        <HomeSectionTitle
                            title="혜택특가 모아보기"
                            description="놓치기 아까운 혜택 특가 모음"
                        />
                        <ul className="sticky top-0 z-2 flex items-center min-[907px]:justify-center gap-2 sm:gap-3 w-full overflow-x-auto py-3 bg-white">
                            <li>
                                <button
                                    type="button"
                                    className="poj2-home-tab-active px-3 sm:px-4 py-2 sm:py-3 leading-[1] text-xs sm:text-sm border border-border rounded-full bg-white transition-colors hover:bg-black hover:border-black hover:text-white hover:font-bold [&.poj2-home-tab-active]:bg-black [&.poj2-home-tab-active]:border-black [&.poj2-home-tab-active]:text-white [&.poj2-home-tab-active]:font-bold"
                                    onClick={handleTabClick}
                                    data-tab="broadcast-tab"
                                >
                                    방송임박 혜택
                                </button>
                            </li>
                            <li>
                                <button
                                    type="button"
                                    className="px-3 sm:px-4 py-2 sm:py-3 leading-[1] text-xs sm:text-sm border border-border rounded-full bg-white transition-colors hover:bg-black hover:border-black hover:text-white hover:font-bold [&.poj2-home-tab-active]:bg-black [&.poj2-home-tab-active]:border-black [&.poj2-home-tab-active]:text-white [&.poj2-home-tab-active]:font-bold"
                                    onClick={handleTabClick}
                                    data-tab="md-recommend-tab"
                                >
                                    MD추천
                                </button>
                            </li>
                        </ul>

                        <div
                            id="broadcast-tab"
                            className="pt-4 lg:pt-5 pb-10 lg:pb-20"
                        >
                            <h3 className="text-lg font-bold mb-4 lg:mb-5">방.송.임.박 특가 놓치지마세요</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 sm:gap-x-5 gap-y-8 lg:gap-y-10">
                                {SPECIAL_PRODUCT_DATA.map((product) => (
                                    <ProductCard
                                        key={product.id}
                                        data={product}
                                        activeRollingText
                                    />
                                ))}
                            </div>
                        </div>

                        <div
                            id="md-recommend-tab"
                            className="pt-4 lg:pt-5"
                        >
                            <h3 className="text-lg font-bold mb-4 lg:mb-5">#MD가 추천하는 트렌드상품이에요</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 sm:gap-x-5 gap-y-8 lg:gap-y-10">
                                {CONSULTATION_PRODUCT_DATA.map((product) => (
                                    <ProductCard
                                        key={product.id}
                                        data={product}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="pb-15 lg:pb-30">
                        <HomeSectionTitle title="카테고리별 랭킹" />
                        <div className="z-2 sticky top-0 h-fit py-3 mb-4 lg:mb-7 bg-white">
                            <CategorySlider data={CATEGORY_DATA} />
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 sm:gap-x-5 gap-y-8 lg:gap-y-10">
                            {PRODUCT_DATA.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    data={product}
                                    visibleLikeButton
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* 사이드 퀵 메뉴 */}
                <div className="hidden min-[907px]:block sticky top-0 h-fit">
                    <SideQuickMenu />
                </div>
            </section>
        </>
    );
}
