import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation, Autoplay } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';


// 기본 배너 데이터 (폴백용 - 실제로는 props로 전달받음)
const DEFAULT_BANNERS: BannerItem[] = [
    {
        text: '배너 제목',
        description: '배너 설명',
        url: '#',
        icon: 'https://via.placeholder.com/1200x400?text=Banner',
        position: '5',
        textColor: 'white',
        textShadow: '0 1px 2px rgba(0, 0, 0, 0.6)',
        buttonBgColor: '#ff6b6b',
        buttonTextColor: 'white',
        buttonHoverColor: '#ff5252',
        buttonText: '자세히 보기',
        showTitle: true,
        showButton: true,
        transparentButton: false,
        mediaType: 'image',
        hasBackground: false,
        
        // 광고 관련 기본값
        showAd: false,
        adText: '광고',
        adLink: '#',
        adPosition: '3',
        adPositionPc: '3',
        adPositionMobile: '3',
        adTextColor: '#fff',
        adBackgroundColor: 'rgba(0, 0, 0, 0.8)',
        adBorderColor: '',
        adOpacity: 1,
        
        // 카테고리 관련 기본값
        showCategory: false,
        categories: [],
        categoryPosition: '1',
        categoryPositionPc: '1',
        categoryPositionMobile: '1',
        categoryTextColor: 'white',
        categoryBackgroundColor: 'rgba(0, 0, 0, 0.7)',
        categoryBorderColor: '',
        categoryFontSize: '14px',
        categoryBorderRadius: '20px',
    }
];



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
    <div className="relative w-full aspect-[4/5] overflow-hidden">
        <img src={src} alt={alt} className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 ease-out hover:scale-105" />
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

// 위치 스타일 헬퍼 함수
const getPositionStyles = (position: string): React.CSSProperties => {
    switch (position) {
        case '1': return { top: '10%', left: '10%' };
        case '2': return { top: '10%', left: '50%', transform: 'translateX(-50%)' };
        case '3': return { top: '10%', right: '10%' };
        case '4': return { top: '50%', left: '10%', transform: 'translateY(-50%)' };
        case '5': return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
        case '6': return { top: '50%', right: '10%', transform: 'translateY(-50%)' };
        case '7': return { bottom: '10%', left: '10%' };
        case '8': return { bottom: '10%', left: '50%', transform: 'translateX(-50%)' };
        case '9': return { bottom: '10%', right: '10%' };
        default: return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }; // 기본값 5번 위치
    }
};

// BannerItem 인터페이스 (MainBanner API 문서 기준)
interface BannerItem {
    // 기본 속성
    icon?: string;              // 이미지 URL
    text?: string;              // 배너 제목
    description?: string;       // 배너 설명
    url?: string;              // 클릭 시 이동할 URL
    
    // 위치 관련
    position?: string;          // 텍스트 위치 (1-9)
    positionPc?: string;        // PC용 텍스트 위치 (1-9)
    positionMobile?: string;    // 모바일용 텍스트 위치 (1-9)
    horizontalPosition?: string; // 가로 위치 (레거시)
    verticalPosition?: string;   // 세로 위치 (레거시)
    
    // 스타일 관련
    textColor?: string;         // 텍스트 색상
    textShadow?: string;        // 텍스트 그림자
    buttonBgColor?: string;     // 버튼 배경색
    buttonTextColor?: string;   // 버튼 텍스트 색상
    buttonHoverColor?: string;  // 버튼 호버 색상
    buttonText?: string;        // 버튼 텍스트
    transparentButton?: boolean; // 투명 버튼 여부
    
    // 버튼 크기
    buttonWidth?: string;       // 버튼 너비
    buttonHeight?: string;      // 버튼 높이
    mobileButtonWidth?: string; // 모바일 버튼 너비
    mobileButtonHeight?: string;// 모바일 버튼 높이
    mobileFullWidth?: boolean;  // 모바일 전체 너비 사용
    
    // 표시 옵션
    showTitle?: boolean;        // 제목 표시 여부
    showButton?: boolean;       // 버튼 표시 여부
    hasBackground?: boolean;    // 배경 사용 여부
    
    // 미디어 관련
    mediaType?: 'image' | 'video'; // 미디어 타입
    videoUrl?: string;          // 비디오 URL
    autoplay?: boolean;         // 비디오 자동 재생
    muted?: boolean;            // 비디오 음소거
    loop?: boolean;             // 비디오 반복
    
    // 스타일
    style?: string | React.CSSProperties; // 커스텀 스타일
    
    // 광고 관련
    showAd?: boolean;           // 광고 표시 여부
    adImageUrl?: string;        // 광고 이미지 URL
    adText?: string;            // 광고 텍스트
    adLink?: string;            // 광고 링크 URL
    adPosition?: string;        // 광고 위치 (기본)
    adPositionPc?: string;      // 광고 위치 (PC)
    adPositionMobile?: string;  // 광고 위치 (모바일)
    adTextColor?: string;       // 광고 텍스트 색상
    adBackgroundColor?: string; // 광고 배경 색상
    adBorderColor?: string;     // 광고 테두리 색상
    adOpacity?: number;         // 광고 투명도 (0-1)
    
    // 카테고리 관련
    showCategory?: boolean;         // 카테고리 표시 여부
    categories?: string[];          // 카테고리 배열 (다중 지원)
    categoryPosition?: string;      // 카테고리 위치 (기본)
    categoryPositionPc?: string;    // 카테고리 위치 (PC)
    categoryPositionMobile?: string;// 카테고리 위치 (모바일)
    categoryTextColor?: string;     // 카테고리 텍스트 색상
    categoryBackgroundColor?: string;// 카테고리 배경 색상
    categoryBorderColor?: string;   // 카테고리 테두리 색상
    categoryFontSize?: string;      // 카테고리 폰트 크기
    categoryBorderRadius?: string;  // 카테고리 테두리 둥글기

    // 기존 Slider 인터페이스와의 호환성
    content?: string;
    path?: string;
    badges?: string[];
    image?: string;
    isAd?: boolean;
}

// MainBannerData 인터페이스
interface MainBannerData {
    // 상태 관련
    currentIndex: number;
    isTransitioning: boolean;
    isPaused: boolean;
    isLoading: boolean;
    isVideoPlaying: boolean;
    isHovering: boolean;
    
    // 배너 데이터
    banners: BannerItem[];
    
    // 설정 관련
    bannerMode: 'slider' | 'list';
    autoPlay: boolean;
    autoPlaySpeed: number;
    transitionSpeed: number;
    showDots: boolean;
    showArrows: boolean;
    pauseOnHover: boolean;
    infiniteLoop: boolean;
    containerHeight?: string;
    isMobile: boolean;
    
    // 렌더링 모드
    isEditorMode: boolean;
    isPreviewMode: boolean;
    
    // 유틸리티
    getImageSource: (banner: BannerItem, index: number) => string;
    videoRef: HTMLVideoElement | null;
    
    // 스타일
    props?: {
        style?: React.CSSProperties;
        className?: string;
    };
}

// MainBannerActions 인터페이스
interface MainBannerActions {
    // 네비게이션 액션
    goToNext: () => void;
    goToPrev: () => void;
    goToSlide: (index: number) => void;
    
    // 마우스 이벤트
    onMouseEnter: () => void;
    onMouseLeave: () => void;
    
    // 터치 이벤트
    onTouchStart: (e: React.TouchEvent) => void;
    onTouchMove: (e: React.TouchEvent) => void;
    onTouchEnd: () => void;
    
    // 배너 상호작용
    onBannerClick: (banner: BannerItem) => void;
    
    // 비디오 관련
    onVideoClick: () => void;
    onVideoEnded: () => void;
    onVideoPlaying: () => void;
    onVideoError: (error: any) => void;
    setVideoRef: (ref: HTMLVideoElement | null) => void;
}

// ComponentSkinProps 인터페이스
export interface ComponentSkinProps {
    data: MainBannerData;
    actions: MainBannerActions;
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

export interface MainSliderProps extends Partial<ComponentSkinProps> {
    // 외부에서 주입받을 수 있는 추가 props
    initialBanners?: BannerItem[];
    className?: string;
    style?: React.CSSProperties;
}

function MainSliderComponent(props: MainSliderProps = {}) {
    // Props 처리 및 기본값 설정
    const hasExternalData = !!props.data;
    const hasExternalActions = !!props.actions;
    const initialBanners = props.data?.banners || props.initialBanners || DEFAULT_BANNERS;
    const mode = props.mode || 'production';
    
    // 내부 상태 관리
    const swiperRef = useRef<SwiperType | null>(null);
    const sliderRef = useRef<HTMLDivElement>(null);
    const navigationPrevRef = useRef<HTMLButtonElement>(null);
    const navigationNextRef = useRef<HTMLButtonElement>(null);
    const userInteractionTimeout = useRef<NodeJS.Timeout | null>(null);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const touchStartX = useRef<number>(0);
    const touchEndX = useRef<number>(0);

    const [currentSlide, setCurrentSlide] = useState(1);
    const [isPlaying, setIsPlaying] = useState(true);
    const [isVisible, setIsVisible] = useState(true);
    const [isFocused, setIsFocused] = useState(false);
    const [isHovering, setIsHovering] = useState(false);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [isVideoPlaying, setIsVideoPlaying] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const totalSlides = initialBanners.length;
    const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;

    // MainBannerData 구성 - 외부 data가 있으면 그대로 사용, 없으면 내부 상태로 구성
    const data: MainBannerData = hasExternalData ? props.data! : {
        // 상태 관련
        currentIndex: currentSlide - 1, // 0-based index
        isTransitioning,
        isPaused: !isPlaying,
        isLoading,
        isVideoPlaying,
        isHovering,
        
        // 배너 데이터
        banners: initialBanners,
        
        // 설정 관련
        bannerMode: 'slider',
        autoPlay: true,
        autoPlaySpeed: 4000,
        transitionSpeed: 900,
        showDots: true,
        showArrows: true,
        pauseOnHover: true,
        infiniteLoop: true,
        containerHeight: undefined,
        isMobile,
        
        // 렌더링 모드
        isEditorMode: mode === 'editor',
        isPreviewMode: mode === 'preview',
        
        // 유틸리티
        getImageSource: (banner: BannerItem, index: number) => {
            return banner.icon || banner.image || `https://via.placeholder.com/1200x400?text=Banner${index + 1}`;
        },
        videoRef: videoRef.current,
        
        // 스타일
        props: {
            style: props.style,
            className: props.className,
        },
    };

    // MainBannerActions 구성 - 외부 actions가 있으면 그대로 사용, 없으면 내부 함수로 구성
    const actions: MainBannerActions = hasExternalActions ? props.actions! : {
        // 네비게이션 액션
        goToNext: () => {
            if (swiperRef.current) {
                swiperRef.current.slideNext();
            }
        },
        goToPrev: () => {
            if (swiperRef.current) {
                swiperRef.current.slidePrev();
            }
        },
        goToSlide: (index: number) => {
            if (swiperRef.current) {
                swiperRef.current.slideTo(index);
            }
        },
        
        // 마우스 이벤트
        onMouseEnter: () => {
            setIsHovering(true);
            if (swiperRef.current && isPlaying) {
                swiperRef.current.autoplay.stop();
            }
        },
        onMouseLeave: () => {
            setIsHovering(false);
            if (swiperRef.current && isPlaying && !isFocused) {
                swiperRef.current.autoplay.start();
            }
        },
        
        // 터치 이벤트
        onTouchStart: (e: React.TouchEvent) => {
            touchStartX.current = e.touches[0].clientX;
        },
        onTouchMove: (e: React.TouchEvent) => {
            touchEndX.current = e.touches[0].clientX;
        },
        onTouchEnd: () => {
            const swipeThreshold = 50;
            const diff = touchStartX.current - touchEndX.current;
            
            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    actions.goToNext();
                } else {
                    actions.goToPrev();
                }
            }
        },
        
        // 배너 상호작용
        onBannerClick: (banner: BannerItem) => {
            if (mode === 'editor') return;
            
            const url = banner.url || banner.path;
            if (url && url !== '#') {
                if (props.utils?.navigate) {
                    props.utils.navigate(url);
                } else {
                    console.log('Navigate to:', url);
                }
            }
        },
        
        // 비디오 관련
        onVideoClick: () => {
            if (videoRef.current) {
                if (isVideoPlaying) {
                    videoRef.current.pause();
                    setIsVideoPlaying(false);
                } else {
                    videoRef.current.play();
                    setIsVideoPlaying(true);
                }
            }
        },
        onVideoEnded: () => {
            setIsVideoPlaying(false);
            if (data.autoPlay) {
                actions.goToNext();
            }
        },
        onVideoPlaying: () => {
            setIsVideoPlaying(true);
        },
        onVideoError: (error: any) => {
            console.error('Video error:', error);
            setIsVideoPlaying(false);
        },
        setVideoRef: (ref: HTMLVideoElement | null) => {
            videoRef.current = ref;
        },
    };

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

    // Tailwind CDN 자동 로드
    useEffect(() => {
        if (typeof window !== 'undefined' && !document.querySelector('script[src*="cdn.tailwindcss.com"]')) {
            const script = document.createElement('script');
            script.src = 'https://cdn.tailwindcss.com';
            script.async = true;
            document.head.appendChild(script);
        }
    }, []);

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
            className={`poj2-main-slider w-full ${data.props?.className || ''}`}
            style={{
                height: data.containerHeight,
                ...data.props?.style
            }}
            onFocus={handleSliderFocus}
            onBlur={handleSliderBlur}
            onMouseEnter={actions.onMouseEnter}
            onMouseLeave={actions.onMouseLeave}
        >
            <Swiper
                modules={[Pagination, Navigation, Autoplay]}
                loop={data.infiniteLoop && (data.banners?.length || 0) > 3}
                autoplay={data.autoPlay ? {
                    delay: data.autoPlaySpeed,
                    disableOnInteraction: false,
                } : false}
                speed={data.transitionSpeed}
                spaceBetween={0}
                slidesPerView={1}
                breakpoints={{
                    640: {
                        slidesPerView: 'auto',
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
                    setIsTransitioning(true);
                    handleUserInteraction();
                    setTimeout(() => setIsTransitioning(false), data.transitionSpeed);
                }}
                onTouchStart={actions.onTouchStart}
                onTouchMove={actions.onTouchMove}
                onTouchEnd={actions.onTouchEnd}
                className="w-full"
            >
                {(data.banners || []).map((banner, idx) => {
                    const imageUrl = data.getImageSource(banner, idx);
                    const displayText = banner.text || banner.content || '';
                    const url = banner.url || banner.path || '#';
                    
                    return (
                        <SwiperSlide
                            key={`banner-${idx}`}
                            className="!w-full sm:!w-[384px]"
                        >
                            <div
                                className="relative block overflow-hidden w-full aspect-[4/5]"
                            >
                                {/* 미디어 렌더링 */}
                                {banner.mediaType === 'video' ? (
                                    <video
                                        ref={idx === data.currentIndex ? actions.setVideoRef : undefined}
                                        src={banner.videoUrl}
                                        autoPlay={banner.autoplay}
                                        muted={banner.muted}
                                        loop={banner.loop}
                                        onClick={actions.onVideoClick}
                                        onEnded={actions.onVideoEnded}
                                        onPlay={actions.onVideoPlaying}
                                        onError={actions.onVideoError}
                                        className="absolute inset-0 w-full h-full object-cover"
                                    />
                                ) : (
                                    <div 
                                        className="cursor-pointer"
                                        onClick={() => {
                                            if (hasExternalActions && props.actions?.onBannerClick) {
                                                props.actions.onBannerClick(banner);
                                            }
                                        }}
                                    >
                                        <ImageBox
                                            src={imageUrl}
                                            alt={displayText}
                                        />
                                    </div>
                                )}

                                {/* 광고 딱지 - API 문서 기준 */}
                                {banner.showAd && (
                                    <div 
                                        className="absolute z-30"
                                        style={{
                                            top: '10px',
                                            right: '10px',
                                            backgroundColor: banner.adBackgroundColor || 'rgba(0, 0, 0, 0.8)',
                                            color: banner.adTextColor || '#fff',
                                            borderRadius: '4px',
                                            padding: '6px 12px',
                                            fontSize: '12px',
                                            fontWeight: 'bold',
                                            border: banner.adBorderColor ? `1px solid ${banner.adBorderColor}` : 'none',
                                            opacity: banner.adOpacity !== undefined ? banner.adOpacity : 1,
                                            cursor: (banner.adLink && banner.adLink !== '#') ? 'pointer' : 'default',
                                            whiteSpace: 'nowrap'
                                        }}
                                        onClick={() => {
                                            if (banner.adLink && banner.adLink !== '#') {
                                                if (banner.adLink.startsWith('http') || banner.adLink.startsWith('//')) {
                                                    window.open(banner.adLink, '_blank');
                                                } else {
                                                    window.location.href = banner.adLink;
                                                }
                                            }
                                        }}
                                    >
                                        {banner.adText || '광고'}
                                    </div>
                                )}

                                {/* 레거시 광고 뱃지 호환 */}
                                {banner.isAd && !banner.showAd && <span className="absolute top-0 right-0 text-xs text-white px-2 py-0.5 font-bold bg-black/20">광고</span>}

                                {/* 텍스트 오버레이 */}
                                {banner.showTitle !== false && (
                                    <div 
                                        className="absolute px-[30px] z-20"
                                        style={{ 
                                            ...getPositionStyles(
                                                data.isMobile 
                                                    ? (banner.positionMobile || banner.position || '5')
                                                    : (banner.positionPc || banner.position || '5')
                                            ),
                                            color: banner.textColor || 'white',
                                            maxWidth: '80%',
                                            ...(banner.hasBackground && {
                                                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                                padding: '20px 30px',
                                                borderRadius: '8px'
                                            })
                                        }}
                                    >
                                        {displayText && (
                                            <h2 
                                                className="mb-2.5 text-2xl font-bold leading-tight text-white"
                                                style={{
                                                    color: banner.textColor || 'white',
                                                    textShadow: banner.textShadow || '0 2px 4px rgba(0, 0, 0, 0.8)',
                                                    fontSize: data.isMobile ? '1.5rem' : '2rem',
                                                    lineHeight: '1.2'
                                                }}
                                            >
                                                {displayText.split(/\\n|\n/).map((line, index, array) => (
                                                    <React.Fragment key={index}>
                                                        {line}
                                                        {index < array.length - 1 && <br />}
                                                    </React.Fragment>
                                                ))}
                                            </h2>
                                        )}
                                        {banner.description && (
                                            <p 
                                                className="text-lg mb-3 text-white"
                                                style={{
                                                    color: banner.textColor || 'white',
                                                    textShadow: banner.textShadow || '0 2px 4px rgba(0, 0, 0, 0.8)',
                                                    fontSize: data.isMobile ? '1rem' : '1.125rem',
                                                    lineHeight: '1.4'
                                                }}
                                            >
                                                {banner.description.split(/\\n|\n/).map((line, index, array) => (
                                                    <React.Fragment key={index}>
                                                        {line}
                                                        {index < array.length - 1 && <br />}
                                                    </React.Fragment>
                                                ))}
                                            </p>
                                        )}
                                        
                                        {/* 카테고리 영역 - 텍스트 설명 아래 배치 */}
                                        {banner.showCategory && banner.categories && banner.categories.length > 0 && (
                                            <div className="flex gap-2 flex-wrap mb-4">
                                                {banner.categories.filter(category => category && category.trim()).map((category, categoryIdx) => (
                                                    <div 
                                                        key={categoryIdx}
                                                        style={{
                                                            backgroundColor: banner.categoryBackgroundColor || 'rgba(0, 0, 0, 0.7)',
                                                            color: banner.categoryTextColor || 'white',
                                                            padding: '6px 14px',
                                                            borderRadius: banner.categoryBorderRadius || '20px',
                                                            fontSize: banner.categoryFontSize || '14px',
                                                            fontWeight: 'bold',
                                                            border: banner.categoryBorderColor ? `2px solid ${banner.categoryBorderColor}` : 'none'
                                                        }}
                                                    >
                                                        {category}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                        
                                        {/* 버튼 표시 - API 문서 조건에 따라 */}
                                        {banner.showButton !== false && url && url !== '#' && (
                                            <button
                                                className="px-6 py-2 rounded transition-colors"
                                                style={{
                                                    backgroundColor: banner.transparentButton 
                                                        ? 'transparent' 
                                                        : banner.buttonBgColor || '#ff6b6b',
                                                    color: banner.buttonTextColor || 'white',
                                                    border: banner.transparentButton 
                                                        ? `2px solid ${banner.buttonTextColor || 'white'}` 
                                                        : 'none',
                                                    width: data.isMobile 
                                                        ? (banner.mobileFullWidth ? '100%' : (banner.mobileButtonWidth || 'auto'))
                                                        : (banner.buttonWidth || 'auto'),
                                                    height: data.isMobile
                                                        ? (banner.mobileButtonHeight || 'auto')
                                                        : (banner.buttonHeight || 'auto')
                                                }}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    e.preventDefault();
                                                    if (hasExternalActions && props.actions?.onBannerClick) {
                                                        props.actions.onBannerClick(banner);
                                                    } else {
                                                        // 내부 처리
                                                        const targetUrl = banner.url || banner.path;
                                                        if (targetUrl && targetUrl !== '#') {
                                                            if (props.utils?.navigate) {
                                                                props.utils.navigate(targetUrl);
                                                            } else {
                                                                console.log('Navigate to:', targetUrl);
                                                            }
                                                        }
                                                    }
                                                }}
                                                onMouseEnter={(e) => {
                                                    if (banner.buttonHoverColor && !banner.transparentButton) {
                                                        e.currentTarget.style.backgroundColor = banner.buttonHoverColor;
                                                    }
                                                }}
                                                onMouseLeave={(e) => {
                                                    if (!banner.transparentButton) {
                                                        e.currentTarget.style.backgroundColor = banner.buttonBgColor || '#ff6b6b';
                                                    }
                                                }}
                                            >
                                                {banner.buttonText || '자세히 보기'}
                                            </button>
                                        )}

                                        {/* 배지 (레거시 호환) */}
                                        {banner.badges && !banner.showCategory && (
                                            <div className="flex gap-1.5 mt-2">
                                                {banner.badges.map((badge, badgeIdx) => (
                                                    <span
                                                        key={badge + badgeIdx}
                                                        className="text-xs text-white px-2 py-0.5 font-bold bg-black/20 border border-border/25"
                                                    >
                                                        {badge}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </SwiperSlide>
                    );
                })}
            </Swiper>
            {/* 컨트롤러 영역 */}
            <div className="poj2-main-slider-controller poj2-global-wrapper flex items-center justify-center gap-3 sm:gap-5 p-4 sm:p-5">
                {/* 프로그레스 바 (점 네비게이션 대체 가능) */}
                {data.showDots && (
                    <div className="flex-1 h-0.5 bg-gray-200 relative">
                        <div 
                            className="h-full bg-black transition-all duration-300 ease-out"
                            style={{ width: `${(currentSlide / totalSlides) * 100}%` }}
                        ></div>
                    </div>
                )}
                
                {/* 슬라이드 번호 표시 */}
                <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
                    <span className="font-bold">{currentSlide}</span>
                    <span className="text-description">|</span>
                    <span>{totalSlides}</span>
                </div>
                
                {/* 화살표 네비게이션 */}
                {data.showArrows && (data.banners?.length || 0) > 1 && (
                    <div className="hidden sm:flex items-center px-1 border border-black/25 rounded-full">
                        <button
                            ref={navigationPrevRef}
                            type="button"
                            className="flex items-center justify-center w-9 h-9 hover:fill-accent"
                            aria-label="이전 슬라이드"
                            onClick={() => {
                                actions.goToPrev();
                                handleUserInteraction();
                            }}
                            disabled={!data.infiniteLoop && currentSlide === 1}
                        >
                            <ArrowLeftIcon tailwind="transition-colors" />
                        </button>
                        <button
                            ref={navigationNextRef}
                            type="button"
                            className="flex items-center justify-center w-9 h-9 hover:fill-accent"
                            aria-label="다음 슬라이드"
                            onClick={() => {
                                actions.goToNext();
                                handleUserInteraction();
                            }}
                            disabled={!data.infiniteLoop && currentSlide === totalSlides}
                        >
                            <ArrowRightIcon tailwind="transition-colors" />
                        </button>
                    </div>
                )}
                
                {/* 자동재생 컨트롤 */}
                {data.autoPlay && (
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
                )}
            </div>
            

        </div>
    );
}

// UMD 빌드를 위한 래퍼 컴포넌트
const MainSlider = (props: any) => {
    // 웹빌더 환경인지 확인
    const isWebbuilderEnv = props.data && props.actions && props.utils;
    
    if (isWebbuilderEnv) {
        // 웹빌더 환경: ComponentSkinProps 구조 그대로 전달
        return <MainSliderComponent {...props} />;
    } else {
        // 독립 실행 환경: 기본 props 구조로 변환
        const componentProps: MainSliderProps = {
            initialBanners: props.banners || props.initialBanners,
            className: props.className,
            style: props.style,
            options: props.options,
            mode: props.mode || 'production'
        };
        return <MainSliderComponent {...componentProps} />;
    }
};

export default MainSlider;