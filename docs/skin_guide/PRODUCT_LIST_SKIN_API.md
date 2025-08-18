# ProductList 컴포넌트 스킨 API

ProductList 컴포넌트는 상품 목록을 그리드 형태로 표시하는 컴포넌트입니다. 카테고리별 필터링, 검색, 정렬, 페이지네이션 등의 기능을 지원합니다.

## 스킨 Props

### data

스킨에 전달되는 데이터 객체입니다.

```typescript
{
  products: Array<{
    id: number | string;
    name: string;  // 상품명 (title과 동일)
    price: number; // 최종 가격 (등급/직급 할인 적용된 가격)
    originalPrice?: number; // 원래 가격
    image?: string; // 상품 이미지 URL
    stock?: number; // 재고 수량
    hasOptions?: boolean; // 옵션 상품 여부
    // 등급/직급별 가격 정보
  }>;
  loading: boolean; // 로딩 상태
  currentPage: number; // 현재 페이지
  totalPages: number; // 전체 페이지 수
  totalProducts: number; // 전체 상품 수
  selectedCategory: string | null; // 선택된 카테고리
  searchQuery: string; // 검색어
  sortBy: string; // 정렬 기준
  sortOrder: string; // 정렬 순서
  isUserLoggedIn: boolean; // 로그인 여부
  isAdminMode: boolean; // 관리자 모드
  itemsPerRow: number; // 한 줄당 상품 수
  showStock: boolean; // 재고 표시 여부
  theme: Record<string, any>; // 테마 설정
  // 모바일 관련
  isMobile: boolean; // 모바일 여부
  mobileProducts: any[]; // 모바일 상품 목록
  mobilePage: number; // 모바일 현재 페이지
  isLoadingMore: boolean; // 더보기 로딩 중
  loadMoreButtonRef: React.RefObject<HTMLButtonElement | null>; // 더보기 버튼 ref
}
```

### actions

스킨에서 사용할 수 있는 액션 함수들입니다.

```typescript
{
  handleAddToCart: (product: any) => Promise<void>; // 장바구니 추가
  handleCategoryChange: (categoryId: string | null) => void; // 카테고리 변경
  handleSearch: (query: string) => void; // 검색
  handleSortChange: (sortBy: string, sortOrder: string) => void; // 정렬 변경
  handlePageChange: (page: number) => void; // 페이지 변경
  handleLoadMore: () => Promise<void>; // 더보기 (모바일)
  handleProductClick: (product: any) => void; // 상품 클릭
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

- 그리드 레이아웃으로 상품 표시
- 상품 이미지, 이름, 가격, 재고 정보 표시
- 호버 효과 지원

### 2. 등급/직급별 가격

로그인된 사용자이고 optionJson이 있는 상품의 경우 등급/직급별 할인 가격이 자동으로 계산되어 표시됩니다.

```javascript
// API 응답 예시
{
  id: 1,
  title: "상품명",
  newPrice: 50000,
  optionJson: {
    priority: "level1", // 또는 "level2"
    level1_price: { "1": 45000, "2": 47000 },
    level2_price: { "1": 46000, "2": 48000 }
  }
}
```

스킨에서 표시 예시:
```jsx
{/* 로그인된 사용자 + optionJson 있으면 자동으로 할인가 계산됨 */}
<div style={priceStyle}>
  {formatPrice(product.price)}
</div>
```

### 3. 검색 및 필터링

- 실시간 검색 지원
- 카테고리별 필터링
- 제목, 설명 검색

### 4. 정렬

- 최신순/오래된순
- 낮은 가격순/높은 가격순
- 이름순

### 5. 페이지네이션

- PC: 일반 페이지네이션
- 모바일: 무한 스크롤 (더보기 버튼)

### 6. 장바구니 추가

- 옵션이 없는 상품: 바로 장바구니 추가
- 옵션이 있는 상품: 상품 상세 페이지로 이동

## 커스텀 스킨 만들기

```jsx
// CustomProductListSkin.jsx
import React from 'react';

const CustomProductListSkin = ({ data, actions, options, utils }) => {
  const { t } = utils;
  const { products, loading, currentPage, totalPages } = data;
  const { handleAddToCart, handleProductClick, handlePageChange } = actions;
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  return (
    <div className="product-list">
      <div className="product-grid">
        {products.map(product => (
          <div key={product.id} className="product-card" onClick={() => handleProductClick(product)}>
            <img src={product.image} alt={product.name} />
            <h3>{product.name}</h3>
            
            {/* 등급/직급별 가격 표시 */}
            {product.hasLevelPrice ? (
              <div className="price-info">
                <span className="original-price">{product.originalPrice}원</span>
                <span className="level-price">{product.price}원</span>
                <span className="level-name">{product.levelName}</span>
              </div>
            ) : (
              <div className="price">{product.price}원</div>
            )}
            
            <button onClick={(e) => {
              e.stopPropagation();
              handleAddToCart(product);
            }}>
              {t('장바구니 담기')}
            </button>
          </div>
        ))}
      </div>
      
      {/* 페이지네이션 */}
      {totalPages > 1 && (
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
    </div>
  );
};

export default CustomProductListSkin;
```

## 모바일 대응

모바일에서는 무한 스크롤이 자동으로 적용됩니다:

```jsx
{data.isMobile && (
  <button
    ref={data.loadMoreButtonRef}
    onClick={actions.handleLoadMore}
    disabled={data.isLoadingMore}
  >
    {data.isLoadingMore ? '로딩 중...' : '더보기'}
  </button>
)}
```

## 주의사항

1. **등급/직급별 가격**: optionJson이 null인 경우 일반 할인가(discounted_price)를 사용합니다
2. **옵션 상품**: hasOptions가 true인 상품은 장바구니 추가 시 상세 페이지로 이동합니다
3. **재고**: stock이 0인 상품은 장바구니 추가 버튼이 비활성화됩니다
4. **모바일**: 768px 이하에서 자동으로 모바일 모드로 전환됩니다