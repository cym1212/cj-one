// 필터 옵션 인터페이스
interface FilterOption {
    value: string;
    label: string;
}

// 필터 객체 인터페이스
interface Filters {
    brand?: FilterOption[];
    style?: FilterOption[];
    color?: FilterOption[];
    type?: FilterOption[];
    [key: string]: FilterOption[] | undefined;
}

// 3차 카테고리 인터페이스
export interface ThirdCategory {
    name: string;
    path: string;
    filters?: Filters;
}

// 추천 브랜드 인터페이스
export interface RecommendedBrand {
    name: string;
    path: string;
    image: string;
}

// 일반 서브카테고리 인터페이스 (normal 타입용)
export interface NormalSubcategory {
    name: string;
    path: string;
    filters?: Filters;
    thirdCategory: ThirdCategory[];
}

// 특별 서브카테고리 인터페이스 (special 타입용)
export interface SpecialSubcategory {
    name: string;
    path: string;
    image: string;
}

export type CategoryType = 'normal' | 'special';

export interface SimplifiedCategory {
    name: string;
    type: CategoryType;
    image: string;
    subcategories: (NormalSubcategory | SpecialSubcategory)[];
    recommendedBrands?: RecommendedBrand[];
}

export const CATEGORY_ITEMS: SimplifiedCategory[] = [
    {
        name: '패션',
        type: 'normal',
        image: '/images/icon/fashion.png',
        subcategories: [
            {
                name: '패션 홈',
                path: '/category/fashion',
                thirdCategory: [],
            },
            {
                name: '의류',
                path: '/category/fashion/clothing',
                filters: {
                    brand: [
                        { value: 'nike', label: '나이키' },
                        { value: 'adidas', label: '아디다스' },
                    ],
                    style: [
                        { value: 'casual', label: '캐주얼' },
                        { value: 'formal', label: '포멀' },
                    ],
                    color: [
                        { value: 'black', label: '검정' },
                        { value: 'gray', label: '회색' },
                    ],
                },
                thirdCategory: [
                    {
                        name: '상의',
                        path: '/category/fashion/clothing/tops',
                        filters: {
                            type: [
                                { value: 't-shirts', label: '티셔츠' },
                                { value: 'hoodies', label: '후드' },
                            ],
                            brand: [
                                { value: 'nike', label: '나이키' },
                                { value: 'adidas', label: '아디다스' },
                            ],
                            style: [
                                { value: 'casual', label: '캐주얼' },
                                { value: 'formal', label: '포멀' },
                            ],
                            color: [
                                { value: 'black', label: '검정' },
                                { value: 'gray', label: '회색' },
                            ],
                        },
                    },
                    {
                        name: '하의',
                        path: '/category/fashion/clothing/bottoms',
                        filters: {
                            type: [
                                { value: 'jeans', label: '청바지' },
                                { value: 'shorts', label: '반바지' },
                            ],
                            brand: [
                                { value: 'nike', label: '나이키' },
                                { value: 'adidas', label: '아디다스' },
                            ],
                            style: [
                                { value: 'casual', label: '캐주얼' },
                                { value: 'formal', label: '포멀' },
                            ],
                            color: [
                                { value: 'black', label: '검정' },
                                { value: 'gray', label: '회색' },
                            ],
                        },
                    },
                ],
            },
            {
                name: '신발',
                path: '/category/fashion/shoes',
                filters: {},
                thirdCategory: [],
            },
            {
                name: '가방',
                path: '/category/fashion/bags',
                filters: {},
                thirdCategory: [],
            },
            {
                name: '액세서리',
                path: '/category/fashion/accessories',
                filters: {},
                thirdCategory: [],
            },
            {
                name: '언더웨어',
                path: '/category/fashion/underwear',
                filters: {},
                thirdCategory: [],
            },
        ],
        recommendedBrands: [
            {
                name: '나이키',
                path: '/brand/nike',
                image: '/images/brand/nike.png',
            },
            {
                name: '아디다스',
                path: '/brand/adidas',
                image: '/images/brand/adidas.png',
            },
            {
                name: '푸마',
                path: '/brand/puma',
                image: '/images/brand/puma.png',
            },
            {
                name: '뉴발란스',
                path: '/brand/new_balance',
                image: '/images/brand/new-balance.png',
            },
            {
                name: '컨버스',
                path: '/brand/converse',
                image: '/images/brand/converse.png',
            },
            {
                name: '반스',
                path: '/brand/vans',
                image: '/images/brand/vans.png',
            },
            {
                name: '휠라',
                path: '/brand/fila',
                image: '/images/brand/fila.png',
            },
            {
                name: '리복',
                path: '/brand/reebok',
                image: '/images/brand/reebok.png',
            },
            {
                name: '아식스',
                path: '/brand/asics',
                image: '/images/brand/asics.png',
            },
            {
                name: '언더아머',
                path: '/brand/under-armour',
                image: '/images/brand/under-armour.png',
            },
        ],
    },
    {
        name: '뷰티',
        type: 'normal',
        image: '/images/icon/beauty.png',
        subcategories: [
            {
                name: '뷰티 홈',
                path: '/category/beauty',
                filters: {},
                thirdCategory: [],
            },
            {
                name: '스킨케어',
                path: '/category/beauty/skincare',
                filters: {},
                thirdCategory: [],
            },
            {
                name: '메이크업',
                path: '/category/beauty/makeup',
                filters: {},
                thirdCategory: [],
            },
            {
                name: '헤어케어',
                path: '/category/beauty/haircare',
                filters: {},
                thirdCategory: [],
            },
            {
                name: '바디케어',
                path: '/category/beauty/bodycare',
                filters: {},
                thirdCategory: [],
            },
            {
                name: '향수',
                path: '/category/beauty/perfume',
                filters: {},
                thirdCategory: [],
            },
        ],
    },
    {
        name: '생활',
        type: 'normal',
        image: '/images/icon/life.png',
        subcategories: [
            {
                name: '생활 홈',
                path: '/category/life',
                filters: {},
                thirdCategory: [],
            },
            {
                name: '주방용품',
                path: '/category/life/kitchen',
                filters: {},
                thirdCategory: [],
            },
            {
                name: '생활용품',
                path: '/category/life/daily',
                filters: {},
                thirdCategory: [],
            },
            {
                name: '인테리어',
                path: '/category/life/interior',
                filters: {},
                thirdCategory: [],
            },
            {
                name: '욕실용품',
                path: '/category/life/bathroom',
                filters: {},
                thirdCategory: [],
            },
            {
                name: '청소용품',
                path: '/category/life/cleaning',
                filters: {},
                thirdCategory: [],
            },
        ],
    },
    {
        name: '디지털',
        type: 'normal',
        image: '/images/icon/digital.png',
        subcategories: [
            {
                name: '디지털 홈',
                path: '/category/digital',
                filters: {},
                thirdCategory: [],
            },
            {
                name: '휴대폰',
                path: '/category/digital/mobile',
                filters: {},
                thirdCategory: [],
            },
            {
                name: '컴퓨터',
                path: '/category/digital/computer',
                filters: {},
                thirdCategory: [],
            },
            {
                name: '카메라',
                path: '/category/digital/camera',
                filters: {},
                thirdCategory: [],
            },
            {
                name: '오디오',
                path: '/category/digital/audio',
                filters: {},
                thirdCategory: [],
            },
            {
                name: '게임',
                path: '/category/digital/game',
                filters: {},
                thirdCategory: [],
            },
        ],
    },
    {
        name: '스포츠',
        type: 'normal',
        image: '/images/icon/sports.png',
        subcategories: [
            {
                name: '스포츠 홈',
                path: '/category/sports',
                filters: {},
                thirdCategory: [],
            },
            {
                name: '운동복',
                path: '/category/sports/wear',
                filters: {},
                thirdCategory: [],
            },
            {
                name: '운동화',
                path: '/category/sports/shoes',
                filters: {},
                thirdCategory: [],
            },
            {
                name: '헬스용품',
                path: '/category/sports/fitness',
                filters: {},
                thirdCategory: [],
            },
            {
                name: '아웃도어',
                path: '/category/sports/outdoor',
                filters: {},
                thirdCategory: [],
            },
            {
                name: '수영용품',
                path: '/category/sports/swimming',
                filters: {},
                thirdCategory: [],
            },
        ],
    },
    {
        name: '식품',
        type: 'normal',
        image: '/images/icon/food.png',
        subcategories: [
            {
                name: '식품 홈',
                path: '/category/food',
                filters: {},
                thirdCategory: [],
            },
            {
                name: '신선식품',
                path: '/category/food/fresh',
                filters: {},
                thirdCategory: [],
            },
            {
                name: '가공식품',
                path: '/category/food/processed',
                filters: {},
                thirdCategory: [],
            },
            {
                name: '음료',
                path: '/category/food/beverage',
                filters: {},
                thirdCategory: [],
            },
            {
                name: '건강식품',
                path: '/category/food/health',
                filters: {},
                thirdCategory: [],
            },
            {
                name: '간편식',
                path: '/category/food/convenience',
                filters: {},
                thirdCategory: [],
            },
        ],
    },
    {
        name: '테마별 라이프스타일샵',
        type: 'special',
        image: '/images/icon/life-style.png',
        subcategories: [
            {
                name: '홈데코',
                path: '/specialty-shop/home-deco',
                image: '/images/specialty/home-deco.jpg',
            },
            {
                name: '주방용품',
                path: '/specialty-shop/kitchen',
                image: '/images/specialty/kitchen.jpg',
            },
            {
                name: '가전제품',
                path: '/specialty-shop/appliances',
                image: '/images/specialty/appliances.jpg',
            },
            {
                name: '반려동물',
                path: '/specialty-shop/pet',
                image: '/images/specialty/pet.jpg',
            },
            {
                name: '보양식',
                path: '/specialty-shop/food',
                image: '/images/specialty/food.jpg',
            },
            {
                name: '캠핑용품',
                path: '/specialty-shop/camping',
                image: '/images/specialty/camping.jpg',
            },
        ],
    },
];
