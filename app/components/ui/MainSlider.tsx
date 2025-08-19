import { useState, useRef, useEffect, useCallback } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation, Autoplay } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';

// react-router Link 대체 (UMD 빌드용)
const Link = ({ to, children, ...props }: any) => (
    <a href={to} onClick={(e) => { e.preventDefault(); console.log('Navigate to:', to); }} {...props}>
        {children}
    </a>
);

// ImageBox 컴포넌트 인라인화
interface ImageBoxProps {
    src: string;
    alt?: string;
    sizes?: string;
    priority?: boolean;
}

const ImageBox = ({ src, alt = '' }: ImageBoxProps) => (
    <div className="relative w-full h-full overflow-hidden">
        <img src={src} alt={alt} className="w-full h-full object-cover" />
    </div>
);

// 아이콘 컴포넌트들 인라인화
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

const PlayIcon = ({ tailwind }: { tailwind?: string }) => (
    <svg className={tailwind} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M8 5V19L19 12L8 5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

const PauseIcon = ({ tailwind }: { tailwind?: string }) => (
    <svg className={tailwind} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
        <rect x="6" y="4" width="4" height="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <rect x="14" y="4" width="4" height="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

interface Slider {
    content: string;
    path: string;
    badges: string[];
    image: string;
    isAd: boolean;
}

export interface MainSliderProps {
    data: Slider[];
}

export default function MainSlider({ data }: MainSliderProps) {
    const swiperRef = useRef<SwiperType | null>(null);
    const sliderRef = useRef<HTMLDivElement>(null);
    const progressRef = useRef<HTMLDivElement>(null);
    const navigationPrevRef = useRef<HTMLButtonElement>(null);
    const navigationNextRef = useRef<HTMLButtonElement>(null);
    const userInteractionTimeout = useRef<NodeJS.Timeout | null>(null);

    const [currentSlide, setCurrentSlide] = useState(1);
    const [isPlaying, setIsPlaying] = useState(true);
    const [isVisible, setIsVisible] = useState(true);
    const [isFocused, setIsFocused] = useState(false);

    const totalSlides = data.length;

    // IntersectionObserver 설정
    useEffect(() => {
        if (!window.IntersectionObserver) {
            console.warn('IntersectionObserver를 지원하지 않는 브라우저입니다.');
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                const entry = entries[0];
                if (entry) {
                    const visible = entry.isIntersecting;
                    setIsVisible(visible);

                    if (swiperRef.current) {
                        if (!visible && isPlaying && !isFocused) {
                            swiperRef.current.autoplay.stop();
                        } else if (visible && isPlaying && !isFocused) {
                            swiperRef.current.autoplay.start();
                        }
                    }
                }
            },
            {
                threshold: 0.1,
                rootMargin: '0px',
            }
        );

        const currentSliderRef = sliderRef.current;
        if (currentSliderRef) {
            observer.observe(currentSliderRef);
        }

        return () => {
            if (currentSliderRef) {
                observer.unobserve(currentSliderRef);
            }
            if (userInteractionTimeout.current) {
                clearTimeout(userInteractionTimeout.current);
            }
        };
    }, [isPlaying, isFocused]);

    // 자동 재생 여부 판단
    const shouldAutoplay = useCallback(() => {
        return isPlaying && isVisible && !isFocused;
    }, [isPlaying, isVisible, isFocused]);

    // 사용자 상호작용 처리
    const handleUserInteraction = useCallback(() => {
        if (userInteractionTimeout.current) {
            clearTimeout(userInteractionTimeout.current);
        }

        if (swiperRef.current && swiperRef.current.autoplay && shouldAutoplay()) {
            swiperRef.current.autoplay.stop();
            userInteractionTimeout.current = setTimeout(() => {
                if (swiperRef.current && shouldAutoplay()) {
                    swiperRef.current.autoplay.start();
                }
            }, 3000);
        }
    }, [shouldAutoplay]);

    // 자동 재생 토글
    const toggleAutoplay = useCallback(() => {
        if (swiperRef.current) {
            if (isPlaying) {
                swiperRef.current.autoplay.stop();
            } else {
                if (shouldAutoplay()) {
                    swiperRef.current.autoplay.start();
                }
            }
            setIsPlaying(!isPlaying);
        }
    }, [isPlaying, shouldAutoplay]);

    // 슬라이더 포커스 처리
    const handleSliderFocus = useCallback(() => {
        setIsFocused(true);
        if (swiperRef.current && isPlaying) {
            swiperRef.current.autoplay.stop();
        }
    }, [isPlaying]);

    // 슬라이더 블러 처리
    const handleSliderBlur = useCallback(() => {
        setIsFocused(false);
        if (swiperRef.current && shouldAutoplay()) {
            swiperRef.current.autoplay.start();
        }
    }, [shouldAutoplay]);

    return (
        <div
            ref={sliderRef}
            className="poj2-main-slider w-full"
            onFocus={handleSliderFocus}
            onBlur={handleSliderBlur}
        >
            <Swiper
                modules={[Pagination, Navigation, Autoplay]}
                loop={data.length > 3}
                autoplay={{
                    delay: 4000,
                    disableOnInteraction: false,
                }}
                speed={900}
                spaceBetween={0}
                slidesPerView={1}
                breakpoints={{
                    640: {
                        slidesPerView: 3,
                        spaceBetween: 20,
                    },
                    1024: {
                        slidesPerView: 4,
                        spaceBetween: 20,
                    },
                }}
                pagination={false}
                navigation={{
                    prevEl: navigationPrevRef.current,
                    nextEl: navigationNextRef.current,
                }}
                onSwiper={(swiper) => {
                    swiperRef.current = swiper;
                }}
                onSlideChange={(swiper) => {
                    setCurrentSlide(swiper.realIndex + 1);
                    handleUserInteraction();
                }}
                className="w-full sm:h-[480px]"
            >
                {data.map((slide, idx) => (
                    <SwiperSlide
                        key={slide.content + idx}
                        className=""
                    >
                        <Link
                            to={slide.path}
                            className="relative block overflow-hidden w-full h-full"
                        >
                            {/* 이미지 박스 */}
                            <ImageBox
                                src={slide.image}
                                alt={slide.content}
                            />

                            {/* 광고 뱃지 */}
                            {slide.isAd && <span className="absolute top-0 right-0 text-xs  text-white px-2 py-0.5 font-bold bg-black/20">광고</span>}

                            {/* 내용 및 배지 */}
                            <div className="absolute bottom-[45px] left-0 right-0 w-full px-[30px] text-white">
                                <p className="mb-2.5  text-2xl font-bold leading-sm whitespace-pre">{slide.content}</p>
                                {slide.badges && (
                                    <div className="flex gap-1.5">
                                        {slide.badges.map((badge, badgeIdx) => (
                                            <span
                                                key={badge + badgeIdx}
                                                className="text-xs  text-white px-2 py-0.5 font-bold bg-black/20 border border-border/25"
                                            >
                                                {badge}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </Link>
                    </SwiperSlide>
                ))}
            </Swiper>
            <div className="poj2-main-slider-controller poj2-global-wrapper flex items-center justify-center gap-3 sm:gap-5 p-4 sm:p-5">
                <div className="flex-1 h-0.5 bg-gray-200 relative">
                    <div 
                        className="h-full bg-black transition-all duration-300 ease-out"
                        style={{ width: `${(currentSlide / totalSlides) * 100}%` }}
                    ></div>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
                    <span className="font-bold">{currentSlide}</span>
                    <span className="text-description">|</span>
                    <span>{totalSlides}</span>
                </div>
                <div className="hidden sm:flex items-center px-1 border border-black/25 rounded-full">
                    <button
                        ref={navigationPrevRef}
                        type="button"
                        className="flex items-center justify-center w-9 h-9 hover:fill-accent"
                        aria-label="이전 슬라이드"
                        onClick={handleUserInteraction}
                    >
                        <ArrowLeftIcon tailwind="transition-colors" />
                    </button>
                    <button
                        ref={navigationNextRef}
                        type="button"
                        className="flex items-center justify-center w-9 h-9 hover:fill-accent"
                        aria-label="다음 슬라이드"
                        onClick={handleUserInteraction}
                    >
                        <ArrowRightIcon tailwind="transition-colors" />
                    </button>
                </div>
                <div>
                    <button
                        onClick={toggleAutoplay}
                        type="button"
                        className="flex items-center justify-center w-6 sm:w-9 h-6 sm:h-9 border border-black/25 rounded-full transition-colors hover:fill-accent"
                        aria-label={isPlaying ? '자동재생 정지' : '자동재생 시작'}
                        aria-pressed={isPlaying}
                    >
                        {isPlaying ? <PauseIcon tailwind="w-[18px] sm:w-[24px]" /> : <PlayIcon tailwind="w-[18px] sm:w-[24px]" />}
                    </button>
                </div>
            </div>
        </div>
    );
}