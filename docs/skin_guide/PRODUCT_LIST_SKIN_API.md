# ProductList 컴포넌트 스킨 API

ProductList 컴포넌트는 상품 목록을 그리드 형태로 표시하는 컴포넌트입니다. 카테고리별 필터링, 검색, 정렬, 페이지네이션, 등급별 할인가격, 모바일 무한스크롤 등의 기능을 지원합니다.

## 스킨 Props

### data

스킨에 전달되는 데이터 객체입니다.

```typescript
{
  products: Array<{
    id: number | string;
    name: string;  // 상품명 (API의 title 필드에서 매핑)
    price: number; // 최종 가격 (등급/직급 할인 적용된 가격)
    originalPrice: number; // 원래 가격 (할인 전 basePrice)
    image: string; // 상품 이미지 URL (API의 thumbnail 필드에서 매핑)
    stock?: number; // 재고 수량
    hasOptions?: boolean; // 옵션 상품 여부
    category_id?: string; // 카테고리 ID
    description?: string; // 상품 설명
    created_at?: string; // 생성일
    variant_id?: number; // 변형 ID
    
    // 등급/직급별 가격 정보 (normalizeProduct에서 추가)
    levelPrice?: number | null; // 등급/직급 할인 가격
    levelName?: string | null;  // 할인 등급/직급명 (예: "VIP 할인", "매니저 할인")
    hasLevelPrice: boolean;     // 등급/직급 할인 적용 여부
    
    // PV (포인트 가치) 정보
    pv: number; // 등급/직급별 PV 또는 기본 PV
  }>;
  loading: boolean; // Redux 로딩 상태
  currentPage: number; // 현재 페이지 (PC용)
  totalPages: number; // 전체 페이지 수 (서버 사이드 페이지네이션)
  totalProducts: number; // 전체 상품 수 (API totalCount)
  selectedCategory: string | null; // 선택된 카테고리
  searchQuery: string; // 검색어
  sortBy: string; // 정렬 기준 ('name', 'price', 'created', 'stock')
  sortOrder: string; // 정렬 순서 ('asc', 'desc')
  isUserLoggedIn: boolean; // 로그인 여부
  isAdminMode: boolean; // 관리자/에디터 모드 여부
  itemsPerRow: number; // 한 줄당 상품 수 (기본: 4)
  showStock: boolean; // 재고 표시 여부
  theme: Record<string, any>; // 테마 설정
  
  // 모바일 관련 (768px 이하 자동 활성화)
  isMobile: boolean; // 모바일 환경 여부
  mobileProducts: Product[]; // 모바일용 누적 상품 목록
  mobilePage: number; // 모바일 페이지 번호
  isLoadingMore: boolean; // 더보기 로딩 상태
  loadMoreButtonRef: React.RefObject<HTMLButtonElement | null>; // 더보기 버튼 ref
}
```

### actions

스킨에서 사용할 수 있는 액션 함수들입니다.

```typescript
{
  handleAddToCart: (product: Product) => Promise<void>; // 장바구니 추가 (옵션 상품은 상세페이지로 이동)
  handleCategoryChange: (categoryId: string | null) => void; // 카테고리 변경
  handleSearch: (query: string) => void; // 검색 (title, name, description 검색)
  handleSortChange: (sortBy: string, sortOrder: string) => void; // 정렬 변경
  handlePageChange: (page: number) => void; // 페이지 변경 (PC용, 스크롤 최상단 이동)
  handleLoadMore: () => Promise<void>; // 더보기 (모바일 무한스크롤)
  handleProductClick: (product: Product) => void; // 상품 클릭 (모바일 상태 저장 포함)
}
```

### options

스킨 커스터마이징 옵션입니다.

```typescript
{
  showPrice?: boolean; // 가격 표시 여부 (기본값: true)
  showAddToCart?: boolean; // 장바구니 버튼 표시 여부 (기본값: true)
  showPagination?: boolean; // 페이지네이션 표시 여부 (기본값: true)
  priceColor?: string; // 가격 색상 (기본값: '#ff6b6b')
  cartButtonColor?: string; // 장바구니 버튼 색상 (기본값: '#007bff')
  stockTextColor?: string; // 재고 텍스트 색상 (기본값: '#28a745')
}
```

### utils

유틸리티 함수들입니다.

```typescript
{
  t: (key: string) => string; // 번역 함수
  navigate: (path: string) => void; // 네비게이션
}
```

## 주요 기능

### 1. 상품 표시

- 그리드 레이아웃으로 상품 표시 (itemsPerRow 설정 가능)
- 상품 이미지, 이름, 가격, 재고, PV 정보 표시
- 서버 사이드 페이지네이션 지원

### 2. 등급/직급별 가격 시스템

사용자 등급(level1, level2)에 따라 자동으로 할인 가격이 계산됩니다.

```javascript
// API 상품 데이터 예시
{
  id: 1,
  title: "상품명",
  newPrice: 50000,
  optionJson: {
    level1_price: { "1": 45000, "2": 47000 }, // 등급별 가격
    level2_price: { "155": 46000, "156": 48000 }, // 직급별 가격
    level1_pv: { "1": 90, "2": 94 }, // 등급별 PV
    level2_pv: { "155": 92, "156": 96 } // 직급별 PV
  },
  config: {
    generate_pv: 100 // 기본 PV
  }
}

// normalizeProduct 함수에 의해 변환된 상품 데이터
{
  id: 1,
  name: "상품명",
  price: 45000, // 등급 할인 적용된 최종 가격
  originalPrice: 50000, // 원래 가격
  levelPrice: 45000, // 등급 할인 가격
  levelName: "VIP 할인", // 등급명 + "할인"
  hasLevelPrice: true, // 등급 할인 적용 여부
  pv: 90 // 등급별 PV 또는 기본 PV
}
```

스킨에서 등급별 가격 표시:
```jsx
{product.hasLevelPrice ? (
  <div className="price-info">
    <span className="original-price">{product.originalPrice.toLocaleString()}원</span>
    <span className="level-price">{product.price.toLocaleString()}원</span>
    <span className="level-name">{product.levelName}</span>
    <span className="pv">PV: {product.pv}</span>
  </div>
) : (
  <div className="price">
    {product.price.toLocaleString()}원
    <span className="pv">PV: {product.pv}</span>
  </div>
)}
```

### 3. 검색 및 필터링

- 실시간 검색 지원 (name, title, description)
- 카테고리별 필터링 (Redux selectedCategoryId와 연동)
- URL 파라미터 't'를 통한 제목 검색
- include/exclude 상품 ID, 카테고리 ID 필터링

### 4. 정렬

- created: 생성일순 (기본)
- name: 이름순 (name 또는 title 필드)
- price: 가격순 (등급 할인 적용된 최종 가격)
- stock: 재고순

### 5. 반응형 페이지네이션

- **PC (768px 초과)**: 일반 페이지네이션, 페이지 변경 시 스크롤 최상단 이동
- **모바일 (768px 이하)**: 무한 스크롤, Intersection Observer를 통한 자동 더보기

### 6. 모바일 상태 저장

- 상품 클릭 시 모바일 상태(상품 목록, 페이지, 스크롤 위치)를 세션 스토리지에 저장
- 뒤로가기 시 저장된 상태 복원

### 7. 장바구니 추가

- 로그인 체크 후 처리
- 옵션이 없는 상품: Redux addToCart 액션으로 바로 추가
- 옵션이 있는 상품(hasOptions: true): 상품 상세 페이지로 이동

## 커스텀 스킨 만들기

```jsx
// CustomProductListSkin.jsx
import React from 'react';

const CustomProductListSkin = ({ data, actions, options, utils }) => {
  const { t } = utils;
  const { 
    products, 
    loading, 
    currentPage, 
    totalPages,
    isMobile,
    mobileProducts,
    mobilePage,
    isLoadingMore,
    loadMoreButtonRef,
    isUserLoggedIn 
  } = data;
  const { handleAddToCart, handleProductClick, handlePageChange, handleLoadMore } = actions;
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  // 모바일/PC에 따라 다른 상품 배열 사용
  const displayProducts = isMobile ? mobileProducts : products;
  
  return (
    <div className="product-list">
      <div className="product-grid">
        {displayProducts.map(product => (
          <div 
            key={product.id} 
            className="product-card" 
            onClick={() => handleProductClick(product)}
          >
            <img src={product.image} alt={product.name} />
            <h3>{product.name}</h3>
            
            {/* 등급/직급별 가격 표시 */}
            {product.hasLevelPrice ? (
              <div className="price-info">
                <div className="original-price">{product.originalPrice.toLocaleString()}원</div>
                <div className="level-price">{product.price.toLocaleString()}원</div>
                <div className="level-name">{product.levelName}</div>
                <div className="pv">PV: {product.pv}</div>
              </div>
            ) : (
              <div className="price-info">
                <div className="price">{product.price.toLocaleString()}원</div>
                <div className="pv">PV: {product.pv}</div>
              </div>
            )}
            
            {/* 로그인된 사용자만 장바구니 버튼 표시 */}
            {isUserLoggedIn && (
              <button onClick={(e) => {
                e.stopPropagation();
                handleAddToCart(product);
              }}>
                {product.hasOptions ? t('옵션 선택') : t('장바구니 담기')}
              </button>
            )}
          </div>
        ))}
      </div>
      
      {/* PC 페이지네이션 */}
      {!isMobile && totalPages > 1 && (
        <div className="pagination">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={page === currentPage ? 'active' : ''}
            >
              {page}
            </button>
          ))}
        </div>
      )}
      
      {/* 모바일 더보기 버튼 */}
      {isMobile && mobilePage < totalPages && (
        <button
          ref={loadMoreButtonRef}
          onClick={handleLoadMore}
          disabled={isLoadingMore}
          className="load-more-button"
        >
          {isLoadingMore ? t('로딩 중...') : t('더보기')}
        </button>
      )}
    </div>
  );
};

export default CustomProductListSkin;
```

## 모바일 대응

### 1. 자동 모바일 감지
- 768px 이하에서 자동으로 모바일 모드 활성화
- resize 이벤트 리스너로 실시간 감지

### 2. 무한 스크롤 구현
- `mobileProducts` 배열에 상품 누적 저장
- Intersection Observer로 더보기 버튼 자동 감지
- 중복 상품 방지 메커니즘

```jsx
// 모바일 무한 스크롤 예시
{data.isMobile && (
  <>
    {/* 모바일용 상품 목록 */}
    {data.mobileProducts.map(product => (
      <ProductCard key={product.id} product={product} />
    ))}
    
    {/* 더보기 버튼 */}
    {data.mobilePage < data.totalPages && (
      <button
        ref={data.loadMoreButtonRef}
        onClick={actions.handleLoadMore}
        disabled={data.isLoadingMore}
      >
        {data.isLoadingMore ? '로딩 중...' : '더보기'}
      </button>
    )}
  </>
)}
```

### 3. 상태 저장 및 복원
- 상품 상세페이지 이동 시 세션 스토리지에 상태 저장
- 뒤로가기 시 이전 상태 복원 (상품 목록, 페이지, 스크롤 위치)

```javascript
// 세션 스토리지 저장 데이터 구조
{
  mobileProducts: Product[], // 누적된 상품 목록
  mobilePage: number,        // 현재 페이지
  scrollPosition: number,    // 스크롤 위치
  totalPages: number         // 전체 페이지 수
}
```

## 주요 API 함수

### normalizeProduct 함수
상품 데이터 정규화 및 등급별 가격 계산을 담당합니다.

```javascript
const normalizeProduct = (product, userInfo, levelPolicies) => {
  // 1. 기본 가격 설정
  const basePrice = product.newPrice || product.price;
  
  // 2. 사용자 등급에 따른 할인 가격 계산
  // level1 우선, level2 차순으로 적용
  
  // 3. PV 계산 (등급별 PV 또는 기본 PV)
  
  // 4. 필드명 매핑 및 반환
  return {
    ...product,
    name: product.title || product.name,
    price: finalPrice,        // 최종 가격
    originalPrice: basePrice, // 원래 가격
    image: product.thumbnail || product.image,
    levelPrice,              // 등급 할인 가격
    levelName,               // 등급명
    hasLevelPrice,           // 할인 적용 여부
    pv                       // PV 값
  };
};
```

## 컴포넌트 Props 설정

### 기본 설정 예시
```javascript
const componentData = {
  props: {
    itemsPerRow: 4,         // 한 행당 상품 수
    itemsPerPage: 20,       // 페이지당 상품 수
    sortBy: 'created',      // 기본 정렬
    sortOrder: 'desc',      // 정렬 순서
    showStock: true,        // 재고 표시
    
    // 필터링 옵션
    categoryId: null,
    include_product_ids: [],
    exclude_product_ids: [],
    include_category_ids: [],
    exclude_category_ids: []
  }
};
```

## 주의사항

### 1. 등급별 가격 시스템
- `hasLevelPrice`를 확인하여 할인가 표시 여부 결정
- level1이 level2보다 우선 적용
- levelPolicies 배열에서 등급명 조회

### 2. 모바일/PC 구분
- `isMobile` 상태에 따라 `products` vs `mobileProducts` 배열 사용
- 페이지네이션과 무한스크롤 구분 처리

### 3. 장바구니 추가
- 로그인 상태 확인 필수
- `hasOptions: true` 상품은 상세페이지로 이동
- Redux addToCart 액션 사용

### 4. 상태 관리
- Redux를 통한 전역 상태 관리
- 세션 스토리지를 통한 모바일 상태 저장
- 사용자 정보 우선순위: `userInfoFromState` > `userInfo` > `user`

### 5. 성능 최적화
- 서버 사이드 페이지네이션으로 데이터 로드 최적화
- Intersection Observer를 통한 효율적인 무한스크롤
- 중복 상품 방지 메커니즘