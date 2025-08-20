import React, { useEffect } from 'react';

// react-router Link 대체 (UMD 빌드용)
const Link = ({ to, children, ...props }) => (
    React.createElement('a', {
        href: to,
        onClick: (e) => {
            e.preventDefault();
            console.log('Navigate to:', to);
        },
        ...props
    }, children)
);

// 기본 상품 데이터 - MD 추천용 더미 데이터
const DEFAULT_PRODUCTS = [
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

function MDRecommendComponent(props = {}) {
    const hasExternalData = !!props.data;
    const hasExternalActions = !!props.actions;
    const mode = props.mode || 'production';
    
    // 상품 데이터 추출 및 처음 2개만 선택 (ProductSlider API 호환)
    const extractProducts = (data) => {
        let rawProducts = [];
        
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
    const data = hasExternalData ? {
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
    const actions = hasExternalActions ? props.actions : {
        handleAddToCart: (product, e) => {
            // 에디터 모드에서는 클릭 비활성화
            if (mode === 'editor') {
                e.preventDefault();
                return;
            }
            
            console.log('장바구니에 상품 추가:', product);
            if (props.utils && props.utils.navigate) {
                // 장바구니 페이지로 이동하거나 모달 표시 등
                console.log('장바구니 추가 완료');
            }
        },
        handleProductClick: (product) => {
            // 에디터 모드에서는 클릭 비활성화
            if (mode === 'editor') {
                return;
            }
            
            // ProductSlider API와 동일하게 /products/{id} 경로 사용
            const productUrl = `/products/${product.id}`;
            if (props.utils && props.utils.navigate) {
                props.utils.navigate(productUrl);
            } else {
                window.location.href = productUrl;
            }
        },
        formatPrice: (price) => {
            if (props.utils && props.utils.formatCurrency) {
                return props.utils.formatCurrency(price);
            }
            return new Intl.NumberFormat('ko-KR', {
                style: 'currency',
                currency: 'KRW'
            }).format(price);
        },
        translate: (text) => {
            if (props.utils && props.utils.t) {
                return props.utils.t(text);
            }
            return text;
        },
        isValidUrl: (url) => {
            if (!url) return false;
            if (url === '#') return false;
            return true;
        }
    };
    
    // Tailwind CDN 자동 로드
    React.useEffect(() => {
        if (typeof window !== 'undefined' && !document.querySelector('script[src*="cdn.tailwindcss.com"]')) {
            const script = document.createElement('script');
            script.src = 'https://cdn.tailwindcss.com';
            script.async = true;
            document.head.appendChild(script);
        }
    }, []);
    
    // 로딩 처리
    if (data.loading) {
        return React.createElement('section', {
            id: data.id,
            className: `poj2-global-wrapper pb-15 lg:pb-30 ${data.className || ''}`,
            style: data.style
        }, React.createElement('div', {
            className: 'text-center'
        }, React.createElement('p', null, '상품을 불러오는 중...')));
    }
    
    // 상품이 없는 경우 처리
    const productsToShow = data.allProducts || data.products || data.defaultProducts || DEFAULT_PRODUCTS;
    if (!productsToShow || productsToShow.length === 0) {
        return React.createElement('section', {
            id: data.id,
            className: `poj2-global-wrapper pb-15 lg:pb-30 ${data.className || ''}`,
            style: data.style
        }, React.createElement('div', {
            className: 'text-center'
        }, React.createElement('p', null, '표시할 상품이 없습니다.')));
    }
    
    // 사용자 로그인 상태 체크 (ProductSlider API 호환)
    const isUserLoggedIn = props.app && props.app.user ? true : false;
    const shouldDisplay = (isUserLoggedIn && data.is_logged) || (!isUserLoggedIn && data.is_not_logged);
    
    if (!shouldDisplay) {
        return null;
    }
    
    // 원래 MDRecommend 디자인 구현 (ProductSection 스타일 참조)
    return React.createElement('section', {
        className: 'poj2-md-recommend pb-15 lg:pb-30'
    }, [
        // 타이틀 영역
        React.createElement('h2', {
            key: 'title',
            className: 'text-xl lg:text-2xl font-bold mb-6 lg:mb-8'
        }, data.title || '#MD가 추천하는 트렌드상품이에요'),
        
        // 상품 그리드 - 처음 2개만 표시
        React.createElement('div', {
            key: 'products',
            className: 'grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6'
        }, productsToShow.slice(0, 2).map((product) => {
            // ProductSlider API 데이터 매핑
            const productName = product.title || product.name || '상품명 없음';
            const brand = product.brand;
            const price = product.config && product.config.default_price || product.price || 0;
            const imageUrl = product.config && product.config.img_url || product.config && product.config.main_image || product.image || product.thumbnail || '../../public/images/product/product-3.jpg';
            const purchases = product.purchases;
            const flags = product.flags;
            const benefits = product.benefits;
            const likes = product.likes;
            
            return React.createElement('div', {
                key: product.id,
                className: 'poj2-product-card cursor-pointer',
                onClick: () => actions.handleProductClick && actions.handleProductClick(product)
            }, [
                // 이미지 영역
                React.createElement('div', {
                    key: 'thumb',
                    className: 'poj2-product-card-thumb relative'
                }, [
                    React.createElement('div', {
                        key: 'imgbox',
                        className: 'overflow-hidden relative aspect-[16/10] bg-gray-100'
                    }, React.createElement('img', {
                        src: imageUrl,
                        alt: productName,
                        className: 'w-full h-full object-cover transition-transform duration-300 hover:scale-105',
                        onError: (e) => {
                            e.target.src = '../../public/images/product/product-3.jpg';
                        }
                    })),
                    // 좋아요 표시
                    likes && React.createElement('div', {
                        key: 'likes',
                        className: 'absolute left-0 bottom-0 flex items-center w-full h-8 lg:h-10 px-4 lg:px-5 bg-black/50'
                    }, React.createElement('div', {
                        className: 'flex items-center gap-1 lg:gap-2'
                    }, [
                        React.createElement('svg', {
                            key: 'icon',
                            className: 'w-4 h-4 lg:w-5 lg:h-5 fill-white',
                            xmlns: 'http://www.w3.org/2000/svg',
                            viewBox: '0 0 24 24'
                        }, React.createElement('path', {
                            d: 'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z'
                        })),
                        React.createElement('p', {
                            key: 'text',
                            className: 'text-white text-sm lg:text-base'
                        }, `${likes}명이 찜한 상품이에요`)
                    ]))
                ]),
                
                // 상품 정보
                React.createElement('div', {
                    key: 'info',
                    className: 'poj2-product-card-info pt-3'
                }, [
                    React.createElement('h3', {
                        key: 'name',
                        className: 'text-sm lg:text-lg leading-sm'
                    }, [
                        brand && React.createElement('span', {
                            key: 'brand',
                            className: 'pr-1 font-bold'
                        }, brand),
                        productName
                    ]),
                    React.createElement('div', {
                        key: 'pricearea',
                        className: 'my-1'
                    }, price > 0 ? React.createElement('div', {
                        className: 'flex items-end justify-between'
                    }, [
                        React.createElement('p', {
                            key: 'price'
                        }, [
                            React.createElement('span', {
                                key: 'amount',
                                className: 'text-lg lg:text-xl font-bold'
                            }, price.toLocaleString()),
                            React.createElement('span', {
                                key: 'won'
                            }, '원')
                        ]),
                        purchases && React.createElement('p', {
                            key: 'purchases',
                            className: 'text-xs text-gray-600'
                        }, `${purchases.toLocaleString()} 구매`)
                    ]) : React.createElement('p', {
                        className: 'text-base lg:text-lg text-gray-600'
                    }, '상담 상품'))
                ]),
                
                // 플래그
                flags && flags.length > 0 && React.createElement('div', {
                    key: 'flags',
                    className: 'poj2-product-card-flags lg:pt-1'
                }, React.createElement('div', {
                    className: 'flex items-center flex-wrap gap-x-1.5 gap-y-1 sm:gap-x-2'
                }, flags.map((flag) => {
                    switch (flag) {
                        case 'broadcast':
                            return React.createElement('span', {
                                key: flag,
                                className: 'text-xs font-bold'
                            }, '방송상품');
                        case 'delivery':
                            return React.createElement('span', {
                                key: flag,
                                className: 'text-xs'
                            }, '무료배송');
                        case 'weekend':
                            return React.createElement('span', {
                                key: flag,
                                className: 'text-xs'
                            }, '주말배송');
                        default:
                            return null;
                    }
                }))),
                
                // 혜택
                benefits && benefits.length > 0 && React.createElement('div', {
                    key: 'benefits',
                    className: 'poj2-product-card-benefits pt-2'
                }, React.createElement('div', {
                    className: 'flex items-center flex-wrap gap-1'
                }, benefits.map((benefit, index) => React.createElement('p', {
                    key: index,
                    className: 'flex items-center gap-1 border border-gray-300 rounded px-1.5 text-xs'
                }, [
                    React.createElement('span', {
                        key: 'icon'
                    }, benefit.type === 'coupon' ? '🎟️' : '💳'),
                    React.createElement('span', {
                        key: 'value'
                    }, benefit.value)
                ]))))
            ]);
        })),
        
        // 에디터 모드 표시 (디버깅용)
        mode === 'editor' && props.editor && React.createElement('div', {
            key: 'editor',
            className: 'mt-4 p-2 bg-yellow-100 text-xs'
        }, React.createElement('p', null, `에디터 모드 - 선택됨: ${props.editor.isSelected ? 'Yes' : 'No'}`))
    ]);
}

// UMD 빌드를 위한 래퍼 컴포넌트
const MDRecommend = (props) => {
    // 웹빌더 환경인지 확인 (data, actions, utils가 모두 있으면 웹빌더)
    const isWebbuilderEnv = props.data && props.actions && props.utils;
    
    if (isWebbuilderEnv) {
        // 웹빌더 환경: ComponentSkinProps 구조 그대로 전달
        return React.createElement(MDRecommendComponent, props);
    } else {
        // 독립 실행 환경: 기본 props 구조로 변환
        const componentProps = {
            products: props.products,
            title: props.title,
            subtitle: props.subtitle,
            sliderTitle: props.sliderTitle,
            className: props.className,
            style: props.style,
            mode: props.mode || 'production'
        };
        return React.createElement(MDRecommendComponent, componentProps);
    }
};

export default MDRecommend;