import React, { useEffect, useState, useRef } from 'react';

// toLocaleString을 사용하지 않는 완전히 안전한 숫자 포맷팅 함수 - JavaScript 버전
const safeNumberFormat = (value) => {
    // null, undefined, 빈 문자열 체크
    if (value === null || value === undefined || value === '') {
        return '0';
    }
    
    // 객체 타입 체크
    if (typeof value === 'object' && value !== null) {
        return '0';
    }
    
    // 숫자 변환
    let num;
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

// 더미 데이터 - CategoryRanking용 (QuickMenu API 호환)
const CATEGORY_DATA = [
    { id: 'fashion', name: '패션', icon: '../../public/images/icon/fashion.png' },
    { id: 'sundries', name: '잡화', icon: '../../public/images/icon/sundries.png' },
    { id: 'sports', name: '스포츠', icon: '../../public/images/icon/sports.png' },
    { id: 'beauty', name: '뷰티', icon: '../../public/images/icon/beauty.png' },
    { id: 'food', name: '식품/주방', icon: '../../public/images/icon/food.png' },
    { id: 'life-style', name: '유아동', icon: '../../public/images/icon/life-style.png' },
    { id: 'life', name: '가구', icon: '../../public/images/icon/life.png' },
    { id: 'digital', name: '생활', icon: '../../public/images/icon/digital.png' },
    { id: 'life2', name: '가전', icon: '../../public/images/icon/life.png' },
    { id: 'fashion2', name: 'TV상품', icon: '../../public/images/icon/fashion.png' },
];

const PRODUCT_DATA = [
    {
        id: 4,
        status: 'selling',
        type: 'product',
        brand: '바니스뉴욕',
        thumbnails: ['../../public/images/product/product-2.jpg'],
        title: '[최초가169,000원] 이반프린지 셔츠 원피스',
        price: 129000,
        stars: 4.7,
        reviews: 118,
        flags: ['broadcast', 'weekend', 'delivery', 'return'],
        benefits: [{ type: 'card', value: '무이자3' }],
    },
    {
        id: 5,
        status: 'selling',
        type: 'product',
        brand: '바니스뉴욕',
        thumbnails: ['../../public/images/product/product-2.jpg'],
        title: '[최초가169,000원] 이반프린지 셔츠 원피스',
        price: 129000,
        discount: 45,
        stars: 4.7,
        reviews: 550,
        flags: ['broadcast', 'delivery', 'return'],
        benefits: [
            { type: 'coupon', value: '45%' },
            { type: 'card', value: '무이자3' },
        ],
    },
    {
        id: 6,
        status: 'selling',
        type: 'product',
        brand: '바니스뉴욕',
        thumbnails: ['../../public/images/product/product-2.jpg'],
        title: '[최초가169,000원] 이반프린지 셔츠 원피스',
        price: 129000,
        discount: 5,
        stars: 2.5,
        reviews: 5,
        flags: ['broadcast', 'delivery', 'return'],
        benefits: [{ type: 'coupon', value: '5%' }],
    },
    {
        id: 7,
        status: 'selling',
        type: 'product',
        brand: '바니스뉴욕',
        thumbnails: ['../../public/images/product/product-2.jpg'],
        title: '[최초가169,000원] 이반프린지 셔츠 원피스',
        price: 129000,
        discount: 5,
        stars: 2.5,
        reviews: 5,
        flags: ['broadcast', 'delivery', 'return'],
        benefits: [{ type: 'coupon', value: '5%' }],
    },
    {
        id: 8,
        status: 'selling',
        type: 'product',
        brand: '바니스뉴욕',
        thumbnails: ['../../public/images/product/product-2.jpg'],
        title: '[최초가169,000원] 이반프린지 셔츠 원피스',
        price: 129000,
        discount: 5,
        stars: 2.5,
        reviews: 5,
        flags: ['broadcast', 'delivery', 'return'],
        benefits: [{ type: 'coupon', value: '5%' }],
    },
    {
        id: 9,
        status: 'selling',
        type: 'product',
        brand: '바니스뉴욕',
        thumbnails: ['../../public/images/product/product-2.jpg'],
        title: '[최초가169,000원] 이반프린지 셔츠 원피스',
        price: 129000,
        discount: 5,
        stars: 2.5,
        reviews: 5,
        flags: ['broadcast', 'delivery', 'return'],
        benefits: [{ type: 'coupon', value: '5%' }],
    }
];

function CategoryRankingComponent(props = {}) {
    const hasExternalData = !!props.data;
    const hasExternalActions = !!props.actions;
    const mode = props.mode || props.data?.mode || 'production';
    const componentProps = props.componentData?.componentProps || {};
    const { enableProductDisplay = true } = componentProps;  // 기본값을 true로 변경!
    
    // 디버깅 정보 출력 - 웹빌더에서 어떤 데이터를 전달하는지 확인
    console.log('[CategoryRanking Debug]', {
        hasExternalData,
        hasExternalActions, 
        enableProductDisplay,
        hasDisplayItems: !!(props.data?.displayItems),
        displayItemsLength: props.data?.displayItems?.length || 0,
        hasProducts: !!(props.data?.products),
        productsLength: props.data?.products?.length || 0,
        selectedCategoryId: props.data?.selectedCategoryId,
        productsLoading: props.data?.productsLoading,
        componentProps
    });
    
    // 확장 기능이 비활성화되어 있으면 기본 디자인으로 폴백
    if (hasExternalData && !enableProductDisplay) {
        return React.createElement('div', {
            className: 'pb-15 lg:pb-30'
        }, [
            React.createElement('h2', {
                key: 'title',
                className: 'text-lg lg:text-xl font-bold mb-4 lg:mb-5'
            }, props.title || "카테고리별 랭킹"),
            React.createElement('div', {
                key: 'message',
                className: 'text-center py-8'
            }, React.createElement('p', {
                className: 'text-gray-600'
            }, 'enableProductDisplay를 true로 설정해주세요.'))
        ]);
    }
    
    // QuickMenu 데이터 변환 함수들
    const convertQuickMenuToCategory = (displayItems) => {
        return displayItems.map(item => ({
            id: String(item.categoryId || item.id),
            name: item.categoryName || item.name || '카테고리',
            icon: item.imageUrl || item.customImageUrl || '../../public/images/icon/default.png'
        }));
    };
    
    const convertApiProductToLocal = (apiProducts) => {
        return apiProducts.map(product => {
            const price = product.config?.default_price || product.price || 0;
            const salePrice = product.config?.discounted_price || product.newPrice || product.price || 0;
            const discountRate = price > 0 && salePrice < price ? Math.round(((price - salePrice) / price) * 100) : 0;
            
            return {
                id: product.id,
                status: 'selling',
                type: 'product',
                thumbnails: [
                    product.config?.img_url || 
                    product.config?.main_image || 
                    product.image || 
                    product.thumbnail || 
                    '../../public/images/product/product-2.jpg'
                ],
                title: product.title || product.name || '상품명 없음',
                brand: product.brand,
                price: price,
                discount: discountRate > 0 ? discountRate : undefined,
                stars: product.stars,
                reviews: product.reviews,
                flags: (product.flags || []).filter(flag => 
                    ['broadcast', 'delivery', 'weekend', 'return'].includes(flag)
                ),
                benefits: (product.benefits || []).map(benefit => ({
                    type: benefit.type === 'coupon' ? 'coupon' : 'card',
                    value: benefit.value
                }))
            };
        });
    };
    
    // 데이터 구성
    const categories = hasExternalData && props.data.displayItems
        ? convertQuickMenuToCategory(props.data.displayItems)
        : props.categories || CATEGORY_DATA;
        
    const products = hasExternalData && props.data.products
        ? convertApiProductToLocal(props.data.products)
        : props.products || PRODUCT_DATA;
        
    const title = props.title || "카테고리별 랭킹";
    const loading = hasExternalData ? props.data.loading : false;
    const productsLoading = hasExternalData ? props.data.productsLoading : false;
    const selectedCategoryId = hasExternalData ? props.data.selectedCategoryId : null;
    
    // 액션 구성
    const actions = hasExternalActions ? props.actions : {
        handleItemClick: (item) => {
            console.log('카테고리 선택:', item);
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

    // 로딩 상태
    if (loading) {
        return React.createElement('div', {
            className: 'flex justify-center items-center py-20'
        }, React.createElement('div', {
            className: 'text-lg'
        }, '상품을 불러오는 중...'));
    }

    return React.createElement('div', {
        className: `pb-15 lg:pb-30 ${props.className || ''}`,
        style: props.style
    }, [
        // 타이틀
        React.createElement('h2', {
            key: 'title',
            className: 'text-lg lg:text-xl font-bold mb-4 lg:mb-5'
        }, title),
        
        // 카테고리 슬라이더 (Sticky)
        React.createElement('div', {
            key: 'category-slider',
            className: 'z-2 sticky top-0 h-fit py-3 mb-4 lg:mb-7 bg-white'
        }, React.createElement(CategorySlider, {
            data: categories,
            selectedCategoryId: selectedCategoryId,
            hasExternalData: hasExternalData,
            enableProductDisplay: enableProductDisplay,
            actions: actions
        })),
        
        // 상품 리스트
        React.createElement('div', {
            key: 'product-list',
            className: 'product-list'
        }, productsLoading ? React.createElement('div', {
            className: 'flex justify-center items-center py-20'
        }, React.createElement('div', {
            className: 'text-lg'
        }, '상품을 불러오는 중...')) : products && products.length > 0 ? React.createElement('div', {
            className: 'grid grid-cols-2 sm:grid-cols-3 gap-x-4 sm:gap-x-5 gap-y-8 lg:gap-y-10'
        }, products.map(product => React.createElement(ProductCard, {
            key: product.id,
            data: product,
            actions: actions,
            utils: props.utils
        }))) : hasExternalData && selectedCategoryId ? React.createElement('div', {
            className: 'text-center py-20'
        }, React.createElement('p', {
            className: 'text-gray-600'
        }, '선택한 카테고리에 상품이 없습니다.')) : hasExternalData ? React.createElement('div', {
            className: 'text-center py-20'
        }, React.createElement('p', {
            className: 'text-gray-600'
        }, '카테고리를 선택해주세요.')) : React.createElement('div', {
            className: 'grid grid-cols-2 sm:grid-cols-3 gap-x-4 sm:gap-x-5 gap-y-8 lg:gap-y-10'
        }, PRODUCT_DATA.map(product => React.createElement(ProductCard, {
            key: product.id,
            data: product
        }))))
    ]);
}

// CategorySlider 컴포넌트 (Swiper 없이 간단한 구현)
function CategorySlider({ data, selectedCategoryId, hasExternalData, enableProductDisplay, actions }) {
    const [activeCategoryId, setActiveCategoryId] = React.useState(data[0]?.id || '');

    const handleCategoryClick = (categoryId, category) => {
        setActiveCategoryId(categoryId);
        
        // QuickMenu 확장 API 사용 시 카테고리 선택 이벤트 발생
        if (actions?.handleItemClick && enableProductDisplay) {
            const categoryItem = {
                id: category.id,
                categoryId: parseInt(category.id),
                categoryName: category.name,
                imageUrl: category.icon
            };
            actions.handleItemClick(categoryItem);
            
            // 웹빌더 실제 fetchProducts 액션 호출 - 핵심 누락된 부분!
            if (actions.fetchProducts) {
                const categoryIdNum = parseInt(category.id);
                
                if (categoryIdNum === -1) {
                    // 전체 카테고리 선택 - category_id 없이 호출
                    actions.fetchProducts({ per_page: 20 });
                } else {
                    // 특정 카테고리 선택 - category_id (단수형) 사용
                    actions.fetchProducts({ 
                        category_id: categoryIdNum, 
                        per_page: 20 
                    });
                }
            }
        }
    };

    // 카테고리를 5개씩 그룹화
    const chunkArray = (array, chunkSize) => {
        const chunks = [];
        for (let i = 0; i < array.length; i += chunkSize) {
            chunks.push(array.slice(i, i + chunkSize));
        }
        return chunks;
    };

    const categoryChunks = chunkArray(data, 5);

    return React.createElement('div', {
        className: 'poj2-category-slider relative'
    }, React.createElement('div', {
        className: 'flex overflow-x-auto scrollbar-hide gap-4 sm:justify-center'
    }, categoryChunks.map((chunk, chunkIndex) => 
        React.createElement('div', {
            key: chunkIndex,
            className: 'flex gap-3 lg:gap-5 min-w-max sm:min-w-0'
        }, chunk.map(category =>
            React.createElement('button', {
                key: category.id,
                className: 'flex flex-col items-center space-y-1 max-sm:w-[18%] w-[60px]',
                onClick: () => handleCategoryClick(category.id, category)
            }, [
                React.createElement('div', {
                    key: 'icon',
                    className: `flex items-center justify-center aspect-square w-full rounded-full overflow-hidden border transition-colors ${
                        (hasExternalData && selectedCategoryId === parseInt(category.id)) || 
                        (!hasExternalData && category.id === activeCategoryId) 
                            ? 'border-2 border-black bg-white' 
                            : 'border-gray-300 bg-gray-50'
                    }`
                }, React.createElement('img', {
                    src: category.icon,
                    alt: category.name,
                    className: 'h-[50%] object-cover'
                })),
                React.createElement('p', {
                    key: 'name',
                    className: 'text-[10px] lg:text-xs'
                }, category.name)
            ])
        ))
    )));
}

// ProductCard 컴포넌트 (간소화된 버전)
function ProductCard({ data, actions, utils }) {
    const { id, type, title, brand, price, thumbnails, discount, purchases, flags, benefits, stars, reviews } = data;
    
    // 안전한 값 처리
    const safePrice = typeof price === 'number' && !isNaN(price) ? price : 0;
    const safeDiscount = typeof discount === 'number' && !isNaN(discount) ? discount : 0;
    const safePurchases = typeof purchases === 'number' && !isNaN(purchases) ? purchases : 0;

    const handleProductClick = () => {
        const productUrl = `/product/${id}`;
        if (utils?.navigate) {
            utils.navigate(productUrl);
        } else {
            console.log('Navigate to:', productUrl);
        }
    };

    return React.createElement('div', {
        className: 'poj2-product-card cursor-pointer',
        onClick: handleProductClick
    }, [
        // 썸네일
        React.createElement('div', {
            key: 'thumb',
            className: 'poj2-product-card-thumb relative'
        }, React.createElement('div', {
            className: 'overflow-hidden relative grid grid-cols-3 gap-1 min-h-[175px] lg:min-h-[240px]'
        }, thumbnails.length === 1 ? React.createElement('div', {
            className: 'col-span-3'
        }, React.createElement('div', {
            className: 'poj2-image-box relative overflow-hidden w-full h-full'
        }, React.createElement('img', {
            src: thumbnails[0],
            alt: `${brand || ''} ${title}`,
            className: 'w-full h-full object-cover transition-transform duration-300 ease-out hover:scale-103'
        }))) : thumbnails.slice(0, 3).map((thumbnail, index) => 
            React.createElement('div', {
                key: index,
                className: index === 0 ? 'col-span-2 row-span-2' : 'col-span-1 row-span-1'
            }, React.createElement('div', {
                className: 'poj2-image-box relative overflow-hidden w-full h-full'
            }, React.createElement('img', {
                src: thumbnail,
                alt: `${brand || ''} ${title}`,
                className: 'w-full h-full object-cover transition-transform duration-300 ease-out hover:scale-103'
            })))
        ))),

        // 상품 정보
        React.createElement('div', {
            key: 'info',
            className: 'poj2-product-card-info pt-2'
        }, [
            React.createElement('h3', {
                key: 'title',
                className: 'text-xs lg:text-sm leading-sm'
            }, [
                brand && React.createElement('span', {
                    key: 'brand',
                    className: 'pr-1 font-bold'
                }, brand),
                title
            ]),
            React.createElement('div', {
                key: 'price-area',
                className: 'my-1'
            }, [
                safeDiscount > 0 && React.createElement('p', {
                    key: 'original-price',
                    className: 'text-xs text-gray-500 line-through'
                }, `${safeNumberFormat(safePrice)}원`),
                React.createElement('div', {
                    key: 'current-price',
                    className: 'flex items-end justify-between'
                }, [
                    React.createElement('div', {
                        key: 'price-info',
                        className: 'flex items-center gap-1 lg:gap-1.5'
                    }, [
                        safeDiscount > 0 && React.createElement('p', {
                            key: 'discount',
                            className: 'text-sm lg:text-base font-bold text-red-600'
                        }, `${safeNumberFormat(safeDiscount)}%`),
                        React.createElement('p', {
                            key: 'final-price'
                        }, [
                            React.createElement('span', {
                                key: 'amount',
                                className: 'text-sm lg:text-base font-bold'
                            }, safeDiscount > 0 ? safeNumberFormat(safePrice > 0 && safeDiscount > 0 ? Math.floor(safePrice * (1 - safeDiscount / 100)) : safePrice) : safeNumberFormat(safePrice)),
                            React.createElement('span', {
                                key: 'currency',
                                className: 'text-xs'
                            }, '원')
                        ])
                    ]),
                    safePurchases > 0 && React.createElement('p', {
                        key: 'purchases',
                        className: 'text-[10px] text-gray-500'
                    }, `${safeNumberFormat(safePurchases)} 구매`)
                ])
            ])
        ]),

        // 플래그
        flags && flags.length > 0 && React.createElement('div', {
            key: 'flags',
            className: 'poj2-product-card-flags lg:pt-0.5'
        }, React.createElement('div', {
            className: 'flex items-center flex-wrap gap-x-1 gap-y-0.5 sm:gap-x-1.5'
        }, flags.map(flag => {
            switch (flag) {
                case 'broadcast':
                    return React.createElement('span', {
                        key: flag,
                        className: 'text-[10px] font-bold'
                    }, '방송상품');
                case 'delivery':
                    return React.createElement('span', {
                        key: flag,
                        className: 'text-[10px]'
                    }, '무료배송');
                case 'weekend':
                    return React.createElement('span', {
                        key: flag,
                        className: 'text-[10px]'
                    }, '주말배송');
                case 'return':
                    return React.createElement('span', {
                        key: flag,
                        className: 'text-[10px]'
                    }, '무료반품');
                default:
                    return null;
            }
        }))),

        // 혜택
        benefits && benefits.length > 0 && React.createElement('div', {
            key: 'benefits',
            className: 'poj2-product-card-benefits pt-1'
        }, React.createElement('div', {
            className: 'flex items-center flex-wrap gap-0.5'
        }, benefits.map((benefit, index) => 
            React.createElement('p', {
                key: index,
                className: 'flex items-center gap-0.5 border border-gray-300 rounded px-1 py-0.5 text-[10px]'
            }, [
                React.createElement('span', {
                    key: 'icon',
                    className: 'text-[8px]'
                }, benefit.type === 'coupon' ? '🎟️' : '💳'),
                React.createElement('span', {
                    key: 'value'
                }, benefit.value)
            ])
        ))),

        // 리뷰
        stars && reviews && React.createElement('div', {
            key: 'reviews',
            className: 'poj2-product-card-reviews pt-1'
        }, React.createElement('div', {
            className: 'flex items-center'
        }, [
            React.createElement('svg', {
                key: 'star',
                className: 'w-3 h-3 fill-gray-500',
                xmlns: 'http://www.w3.org/2000/svg',
                viewBox: '0 0 24 24'
            }, React.createElement('path', {
                d: 'M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z'
            })),
            React.createElement('div', {
                key: 'text',
                className: 'flex gap-0.5 text-[10px] text-gray-500'
            }, [
                React.createElement('p', {
                    key: 'stars'
                }, `${stars}점`),
                React.createElement('p', {
                    key: 'reviews'
                }, `${reviews}건`)
            ])
        ]))
    ]);
}

// UMD 빌드를 위한 래퍼 컴포넌트
const CategoryRanking = (props) => {
    // 웹빌더 환경인지 확인 (data, actions, componentData가 모두 있으면 웹빌더)
    const isWebbuilderEnv = props.data && props.actions && props.componentData;
    
    if (isWebbuilderEnv) {
        // 웹빌더 환경: ComponentSkinProps 구조 그대로 전달
        return React.createElement(CategoryRankingComponent, props);
    } else {
        // 독립 실행 환경: 기본 props 구조로 변환
        const componentProps = {
            title: props.title,
            categories: props.categories,
            products: props.products,
            className: props.className,
            style: props.style,
            mode: props.mode || 'production'
        };
        return React.createElement(CategoryRankingComponent, componentProps);
    }
};

export default CategoryRanking;