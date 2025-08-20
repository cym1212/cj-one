# 📦 ProductSlider 컴포넌트 스킨 API 문서

> ProductSlider 컴포넌트의 외부 스킨 개발을 위한 상세 API 명세서입니다.

## 📋 목차

1. [개요](#개요)
2. [ComponentSkinProps 구조](#componentskinprops-구조)
3. [data Props 목록](#data-props-목록)
4. [actions 목록](#actions-목록)
5. [타입 정의](#타입-정의)
6. [속성 패널 매핑 가이드](#속성-패널-매핑-가이드)
7. [필수 조건부 렌더링](#필수-조건부-렌더링)
8. [CSS 스타일링 가이드](#css-스타일링-가이드)
9. [기본값](#기본값)
10. [예제 코드](#예제-코드)
11. [에지 케이스](#에지-케이스)
12. [마이그레이션 가이드](#마이그레이션-가이드)

---

## 🎯 개요

ProductSlider는 상품 목록을 슬라이드 형태로 표시하는 컴포넌트로, 자동 슬라이드, 필터링, 장바구니 추가 등의 기능을 제공합니다.

### 주요 기능
- 🛍️ 상품 슬라이드 표시
- 🔄 자동/수동 슬라이드 전환
- 🔍 상품/카테고리 필터링
- 🛒 장바구니 직접 추가
- 📱 반응형 디자인
- 📊 재고 정보 표시

---

## 📦 ComponentSkinProps 구조

외부 스킨이 받는 props의 전체 구조입니다:

```typescript
interface ComponentSkinProps {
    data: ProductSliderData;      // 컴포넌트 상태 및 설정
    actions: ProductSliderActions; // 이벤트 핸들러
    options: Record<string, any>;  // 사용자 설정 옵션
    mode: 'editor' | 'preview' | 'production';
    utils: {
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
```

---

## 📊 data Props 목록

### 상품 데이터

| 속성명 | 타입 | 설명 |
|--------|------|------|
| `allProducts` | `ProductItem[]` | 필터링된 전체 상품 목록 (무한 슬라이드용 3배 복제됨) |
| `defaultProducts` | `ProductItem[]` | 외부 스킨에서 사용할 수 있는 기본 상품 데이터 (API 오류시 대체용) |
| `products` | `ProductItem[]` | allProducts의 별칭 (외부 스킨 호환성) |

### 상태 관련 Props

| 속성명 | 타입 | 설명 |
|--------|------|------|
| `loading` | `boolean` | 상품 데이터 로딩 중 여부 |
| `translateX` | `number` | 슬라이드 X축 이동값 (CSS transform용) |
| `slideWidth` | `number` | 개별 슬라이드 너비 |
| `isTransitioning` | `boolean` | 슬라이드 전환 애니메이션 상태 |
| `isMobile` | `boolean` | 모바일 화면 감지 여부 |
| `isTablet` | `boolean` | 태블릿 화면 감지 여부 |
| `innerContainerWidth` | `number` | 컨테이너 내부 너비 |

### 설정 관련 Props

| 속성명 | 타입 | 설명 | 기본값 |
|--------|------|------|--------|
| `sliderTitle` | `string` | 슬라이더 제목 | `'인기 상품'` |
| `showTitle` | `boolean` | 제목 표시 여부 | `true` |
| `titleFontSize` | `string` | 제목 폰트 크기 | `'18px'` |
| `titleFontWeight` | `string` | 제목 폰트 두께 | `'600'` |
| `titleColor` | `string` | 제목 색상 | `'#333'` |
| `showPrice` | `boolean` | 가격 표시 여부 | `true` |
| `showAddToCart` | `boolean` | 장바구니 버튼 표시 여부 | `true` |
| `showStock` | `boolean` | 재고 정보 표시 여부 | `false` |
| `cartButtonColor` | `string` | 장바구니 버튼 색상 | `'#007bff'` |

### 스타일 Props

| 속성명 | 타입 | 설명 |
|--------|------|------|
| `containerStyle` | `React.CSSProperties` | 컨테이너 스타일 |
| `titleStyle` | `React.CSSProperties` | 제목 스타일 |

### 터치/스와이프 상태

| 속성명 | 타입 | 설명 |
|--------|------|------|
| `touchStart` | `number \| null` | 터치 시작 위치 |
| `touchEnd` | `number \| null` | 터치 종료 위치 |

### 편집기 관련 Props

| 속성명 | 타입 | 설명 |
|--------|------|------|
| `isEditingTitle` | `boolean` | 제목 편집 모드 여부 |
| `titleEditValue` | `string` | 편집 중인 제목 값 |

### 필터링 설정 Props

| 속성명 | 타입 | 설명 |
|--------|------|------|
| `include_product_ids` | `string` | 포함할 상품 ID 목록 (쉼표로 구분) |
| `exclude_product_ids` | `string` | 제외할 상품 ID 목록 (쉼표로 구분) |
| `include_category_ids` | `string` | 포함할 카테고리 ID 목록 (쉼표로 구분) |
| `exclude_category_ids` | `string` | 제외할 카테고리 ID 목록 (쉼표로 구분) |

### 참조 객체

| 속성명 | 타입 | 설명 |
|--------|------|------|
| `containerRef` | `React.RefObject<HTMLDivElement \| null>` | 컨테이너 DOM 참조 |
| `sliderRef` | `React.RefObject<HTMLDivElement \| null>` | 슬라이더 DOM 참조 |
| `slideRef` | `React.RefObject<HTMLDivElement \| null>` | 슬라이드 DOM 참조 |

---

## 🎬 actions 목록

### 슬라이드 제어 액션

| 액션명 | 타입 | 설명 |
|--------|------|------|
| `moveSlide` | `(direction: 'next' \| 'prev') => void` | 슬라이드 이동 (무한 슬라이드) |

### 상품 상호작용 액션

| 액션명 | 타입 | 설명 |
|--------|------|------|
| `handleAddToCart` | `(product: any, e: React.MouseEvent) => void` | 장바구니에 상품 추가 |
| `handleProductClick` | `(product: any) => void` | 상품 클릭 시 `/products/{id}` 페이지로 이동 |

### 터치/스와이프 이벤트

| 액션명 | 타입 | 설명 |
|--------|------|------|
| `handleTouchStart` | `(e: React.TouchEvent) => void` | 터치 시작 이벤트 |
| `handleTouchMove` | `(e: React.TouchEvent) => void` | 터치 이동 이벤트 |
| `handleTouchEnd` | `() => void` | 터치 종료 이벤트 |

### 제목 편집 액션

| 액션명 | 타입 | 설명 |
|--------|------|------|
| `handleTitleDoubleClick` | `() => void` | 제목 더블클릭 (편집 모드 진입) |
| `handleTitleBlur` | `() => void` | 제목 편집 완료 (편집 모드 종료) |
| `setTitleEditValue` | `(value: string) => void` | 편집 중인 제목 값 설정 |

### 필터링 액션

| 액션명 | 타입 | 설명 |
|--------|------|------|
| `handleFilterOptionChange` | `(optionName: string, value: string) => void` | 필터링 옵션 변경 |
| `renderFilteringSettings` | `() => boolean` | 필터링 설정 렌더링 여부 |

### 유틸리티 액션

| 액션명 | 타입 | 설명 |
|--------|------|------|
| `formatPrice` | `(price: number) => string` | 가격 포맷팅 |

---

## 📝 타입 정의

### ProductItem 인터페이스

```typescript
interface ProductItem {
  id: number;
  
  // 상품명 (title 또는 name 중 하나는 필수)
  title?: string;
  name?: string;
  
  // 가격 정보
  price?: number;
  salePrice?: number;
  
  // 이미지 (image 또는 thumbnail 중 하나는 필수)
  image?: string;
  thumbnail?: string;
  
  // 재고 정보
  stock_count?: number;
  
  // 외부 스킨 호환성을 위한 config 객체
  config?: {
    default_price?: number;
    discounted_price?: number;
    img_url?: string;
    stock_count?: number;
  };
  
  // 기타 속성
  [key: string]: any;
}
```

### ⚠️ 중요: 상품 데이터 호환성

외부 스킨은 다양한 데이터 구조를 지원해야 합니다:

```javascript
// 상품명 확인 (title 우선)
const productName = product.title || product.name;

// 가격 확인 (여러 필드 체크)
const price = product.config?.default_price || product.price;
const salePrice = product.config?.discounted_price || product.salePrice || product.sale_price;

// 이미지 확인
const imageUrl = product.config?.img_url || product.image || product.thumbnail;

// 재고 확인
const stock = product.config?.stock_count || product.stock_count || product.stock;
```

---

## ⚠️ 속성 패널 매핑 가이드 (중요!)

### 속성 패널에서 설정 가능한 항목:

| 속성 패널 항목 | 저장되는 속성 | 타입 | 기본값 |
|---------------|--------------|------|--------|
| 슬라이더 타이틀 | `sliderTitle` | `string` | `'인기 상품'` |
| 타이틀 표시 | `showTitle` | `boolean` | `true` |
| 타이틀 글자 크기 | `titleFontSize` | `string` | `'18px'` |
| 타이틀 색상 | `titleColor` | `string` | `'#333333'` |
| 자동 슬라이드 | `autoSlide` | `boolean` | `true` |
| 자동 슬라이드 간격 | `autoSlideInterval` | `number` | `3000` |
| 포함할 상품 ID | `include_product_ids` | `string` | `''` |
| 제외할 상품 ID | `exclude_product_ids` | `string` | `''` |
| 포함할 카테고리 ID | `include_category_ids` | `string` | `''` |
| 제외할 카테고리 ID | `exclude_category_ids` | `string` | `''` |
| 슬라이드당 상품 수 | `itemsPerSlide` | `number` | `4` |
| 가격 표시 | `showPrice` | `boolean` | `true` |
| 재고 정보 표시 | `showStock` | `boolean` | `false` |
| 장바구니 버튼 | `showAddToCart` | `boolean` | `true` |

### ⚠️ 중요: data 객체에서 모든 설정값 접근:

```javascript
const BasicProductSliderSkin = ({ data, actions, utils }) => {
  // ❌ 잘못된 방법: options에서 추출하지 않음
  // const { sliderTitle } = options;
  
  // ✅ 올바른 방법: data 객체에서 모든 설정값 추출
  const {
    sliderTitle,
    showTitle,
    titleFontSize,
    titleColor,
    showPrice,
    showAddToCart,
    titleStyle, // 이미 계산된 스타일 객체 사용
    // ... 기타 속성들
  } = data;
  
  // 사용 예시
  {showTitle && (
    <h2 style={titleStyle}>
      {sliderTitle}
    </h2>
  )}
};
```

---

## ✅ 필수 조건부 렌더링

### 1. 상품 데이터 존재 확인
```javascript
// ⚠️ 중요: allProducts 사용 (products 아님)
if (!data.allProducts || data.allProducts.length === 0) {
  return <div>상품이 없습니다.</div>;
}

// 외부 스킨의 경우 defaultProducts도 활용 가능
const productsToShow = data.allProducts?.length > 0 ? data.allProducts : data.defaultProducts;
```

### 2. 로딩 상태 처리
```javascript
if (data.loading) {
  return <div>상품을 불러오는 중...</div>;
}
```

### 3. 타이틀 표시 조건
```javascript
{data.showTitle && (
  data.isEditingTitle ? (
    <input 
      type="text" 
      value={data.titleEditValue}
      onChange={(e) => actions.setTitleEditValue(e.target.value)}
      onBlur={actions.handleTitleBlur}
      style={data.titleStyle}
    />
  ) : (
    <h2 
      style={data.titleStyle}
      onDoubleClick={actions.handleTitleDoubleClick}
    >
      {data.sliderTitle}
    </h2>
  )
)}
```

### 4. 가격 표시 조건
```javascript
{data.showPrice && (
  <div className="price">
    {salePrice ? (
      <>
        <span className="original-price">{actions.formatPrice(price)}</span>
        <span className="sale-price">{actions.formatPrice(salePrice)}</span>
      </>
    ) : (
      <span>{actions.formatPrice(price)}</span>
    )}
  </div>
)}
```

### 5. 재고 표시 조건
```javascript
{data.showStock && stock !== undefined && (
  <div className="stock">
    {stock > 0 ? `재고: ${stock}개` : '품절'}
  </div>
)}
```

### 6. 장바구니 버튼 표시 조건
```javascript
{data.showAddToCart && (
  <button 
    onClick={(e) => actions.handleAddToCart(product, e)}
    style={{ backgroundColor: data.cartButtonColor }}
  >
    장바구니 담기
  </button>
)}
```

### 7. 상품 클릭 시 상세 페이지 이동

상품 이미지나 상품명을 클릭하면 자동으로 `/products/{id}` 페이지로 이동합니다:

```javascript
// 상품 이미지 클릭
<div 
  className="product-image"
  onClick={() => actions.handleProductClick(product)}
  style={{ cursor: 'pointer' }}
>
  <img src={imageUrl} alt={productName} />
</div>

// 상품명 클릭
<h3 
  className="product-name"
  onClick={() => actions.handleProductClick(product)}
  style={{ cursor: 'pointer' }}
>
  {productName}
</h3>
```

**`handleProductClick` 동작 방식:**
- React Router가 있는 경우: `navigate('/products/' + product.id)`
- 없는 경우: `window.location.href = '/products/' + product.id`

---

## 🎨 CSS 스타일링 가이드 (중요!)

### CSS 클래스명 규칙
```javascript
// ❌ 피해야 할 방법 (기본 스킨과 충돌)
<div className="product-slider-container">
  <div className="product-card">...</div>
</div>

// ✅ 권장 방법 (고유한 prefix 사용)
<div className="my-custom-slider-container">
  <div className="my-custom-product-card">...</div>
</div>
```

### 필수 레이아웃 스타일
```css
/* 슬라이더 컨테이너 */
.my-custom-slider-container {
  position: relative;
  overflow: hidden;
}

/* 슬라이드 래퍼 */
.my-custom-slide-wrapper {
  display: flex;
  transition: transform 0.5s ease;
  transform: translateX(-${currentSlide * 100}%);
}

/* 개별 슬라이드 */
.my-custom-slide {
  width: 100%;
  flex-shrink: 0;
  display: grid;
  grid-template-columns: repeat(${itemsPerSlide}, 1fr);
  gap: 20px;
}
```

---

## 🔢 기본값

### 컴포넌트 설정 기본값
```javascript
{
  sliderTitle: '인기 상품',
  showTitle: true,
  titleFontSize: '18px',
  titleColor: '#333333',
  itemsPerSlide: 4,
  autoSlide: true,
  autoSlideInterval: 3000, // 실제 기본값
  showPrice: true,
  showStock: false,
  showAddToCart: true
}
```

---

## 💻 예제 코드

### 기본 슬라이더 구현

```javascript
import React from 'react';

const CustomProductSliderSkin = ({ data, actions, utils, mode }) => {
  const { t } = utils;
  
  // 데이터 추출 (모든 설정은 data 객체에서 가져옴)
  const { 
    allProducts,
    defaultProducts, 
    loading,
    sliderTitle,
    showTitle,
    titleStyle,
    containerStyle,
    showPrice,
    showStock,
    showAddToCart,
    cartButtonColor,
    translateX,
    slideWidth,
    isTransitioning,
    containerRef,
    sliderRef
  } = data;
  
  // 로딩 처리
  if (loading) {
    return <div className="my-slider-loading">상품을 불러오는 중...</div>;
  }
  
  // 상품이 없는 경우 (defaultProducts 사용 가능)
  const productsToShow = allProducts?.length > 0 ? allProducts : defaultProducts;
  if (!productsToShow || productsToShow.length === 0) {
    return <div className="my-slider-empty">표시할 상품이 없습니다.</div>;
  }
  
  return (
    <div 
      ref={containerRef}
      className="my-custom-slider-container"
      style={containerStyle}
      onTouchStart={actions.handleTouchStart}
      onTouchMove={actions.handleTouchMove}
      onTouchEnd={actions.handleTouchEnd}
    >
      {/* 타이틀 */}
      {showTitle && (
        <div className="my-slider-header">
          <h2 style={titleStyle}>
            {sliderTitle}
          </h2>
        </div>
      )}
      
      {/* 무한 슬라이더 본체 */}
      <div className="my-slider-wrapper">
        <div 
          ref={sliderRef}
          className="my-slider-track"
          style={{
            transform: `translateX(${translateX}px)`,
            transition: isTransitioning ? 'transform 0.5s ease' : 'none',
            display: 'flex'
          }}
        >
          {productsToShow.map((product, index) => {
            // 상품 데이터 호환성 처리
            const productName = product.title || product.name;
            const price = product.config?.default_price || product.price;
            const salePrice = product.config?.discounted_price || product.salePrice;
            const imageUrl = product.config?.img_url || product.image || product.thumbnail;
            const stock = product.config?.stock_count || product.stock_count;
            
            return (
              <div 
                key={`${product.id}-${index}`} 
                className="my-product-card"
                style={{ 
                  width: `${slideWidth}px`,
                  flexShrink: 0
                }}
              >
                {/* 상품 이미지 */}
                <div 
                  className="my-product-image"
                  onClick={() => actions.handleProductClick(product)}
                >
                  <img src={imageUrl} alt={productName} />
                </div>
                
                {/* 상품 정보 */}
                <div className="my-product-info">
                  <h3 
                    className="my-product-name"
                    onClick={() => actions.handleProductClick(product)}
                    style={{ cursor: 'pointer' }}
                  >
                    {productName}
                  </h3>
                  
                  {/* 가격 표시 */}
                  {showPrice && (
                    <div className="my-product-price">
                      {salePrice ? (
                        <>
                          <span className="original-price">
                            {actions.formatPrice(price)}
                          </span>
                          <span className="sale-price">
                            {actions.formatPrice(salePrice)}
                          </span>
                        </>
                      ) : (
                        <span>{actions.formatPrice(price)}</span>
                      )}
                    </div>
                  )}
                  
                  {/* 재고 표시 */}
                  {showStock && stock !== undefined && (
                    <div className="my-product-stock">
                      {stock > 0 ? (
                        <span className="in-stock">재고: {stock}개</span>
                      ) : (
                        <span className="out-of-stock">품절</span>
                      )}
                    </div>
                  )}
                  
                  {/* 장바구니 버튼 */}
                  {showAddToCart && (
                    <button
                      className="my-cart-button"
                      style={{ backgroundColor: cartButtonColor }}
                      onClick={(e) => actions.handleAddToCart(product, e)}
                    >
                      장바구니 담기
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        
        {/* 네비게이션 화살표 */}
        <button 
          className="my-slider-prev"
          onClick={() => actions.moveSlide('prev')}
        >
          ‹
        </button>
        <button 
          className="my-slider-next"
          onClick={() => actions.moveSlide('next')}
        >
          ›
        </button>
      </div>
    </div>
  );
};

export default CustomProductSliderSkin;
```

### 반응형 처리

```javascript
// 반응형 itemsPerSlide 계산
const getResponsiveItemsPerSlide = () => {
  if (typeof window === 'undefined') return itemsPerSlide;
  
  const width = window.innerWidth;
  if (width < 576) return 1;  // 모바일
  if (width < 768) return 2;  // 태블릿
  if (width < 992) return 3;  // 작은 데스크톱
  return itemsPerSlide;        // 기본값
};
```

---

## ⚠️ 에지 케이스

### 1. 빈 상품 배열
```javascript
// allProducts 확인 후 defaultProducts로 fallback
const productsToShow = data.allProducts?.length > 0 ? data.allProducts : data.defaultProducts;
if (!productsToShow || productsToShow.length === 0) {
  return <EmptyState />;
}
```

### 2. 상품 데이터 호환성
```javascript
// 다양한 필드명 처리
const getProductData = (product) => ({
  name: product.title || product.name || '상품명 없음',
  price: product.config?.default_price || product.price || 0,
  image: product.config?.img_url || product.image || product.thumbnail || '/placeholder.jpg'
});
```

### 3. 에디터 모드 처리
```javascript
// 에디터 모드에서는 실제 장바구니 추가 방지
const handleAddToCart = async (product) => {
  if (mode === 'editor') {
    console.log('에디터 모드에서는 장바구니 추가가 동작하지 않습니다.');
    return;
  }
  await actions.handleAddToCart(product);
};
```

### 4. 비로그인 사용자 처리
```javascript
// 비로그인 시 장바구니 버튼 대신 로그인 유도
{showAddToCart && !isUserLoggedIn && (
  <button onClick={() => utils.navigate('/login')}>
    로그인하고 구매하기
  </button>
)}
```

### 5. 슬라이드 경계 처리
```javascript
// 첫/마지막 슬라이드에서 버튼 비활성화
<button 
  onClick={actions.handlePrevSlide}
  disabled={currentSlide === 0}
>
  이전
</button>
```

---

## 🔄 마이그레이션 가이드

### 기존 스킨을 외부 스킨으로 전환

#### 1단계: props 구조 변경
```javascript
// Before
const ProductSlider = ({ products, itemsPerSlide, onAddToCart }) => {
  // ...
};

// After
const ProductSliderSkin = ({ data, actions, utils }) => {
  const { allProducts, showTitle, sliderTitle } = data;  // 모든 설정이 data에서 옴
  const { handleAddToCart } = actions;
  // ...
};
```

#### 2단계: 상품 데이터 접근
```javascript
// Before
products.map(product => (
  <div>{product.name}</div>
))

// After
data.allProducts.map(product => (
  <div>{product.title || product.name}</div>
))
```

#### 3단계: 속성 패널 값 사용
```javascript
// Before (하드코딩)
<h2>인기 상품</h2>

// After (data 객체에서 모든 설정 가져옴)
{data.showTitle && (
  <h2 style={data.titleStyle}>{data.sliderTitle}</h2>
)}
```

### 주요 변경사항 체크리스트

- [ ] `data.allProducts` 사용하되 `data.defaultProducts`로 fallback 처리
- [ ] 모든 설정값을 `data` 객체에서 가져오기 (❌ options 사용 안함!)
- [ ] 상품 데이터 호환성 처리 (title/name, price 등)
- [ ] 조건부 렌더링 적용 (data.showTitle, data.showPrice 등)
- [ ] 무한 슬라이드 구현 (`translateX`, `slideWidth` 사용)
- [ ] 터치/스와이프 이벤트 처리
- [ ] CSS 클래스명 충돌 방지
- [ ] `actions.formatPrice` 함수 사용 (한국어 통화 형식 지원)
- [ ] 장바구니 추가 시 이벤트 객체 전달 (`handleAddToCart(product, e)`)
- [ ] 에디터 모드 대응
- [ ] 상품 클릭 시 `/products/{id}` URL 사용 (복수형 주의)

---

## 🎁 추가 팁

### 성능 최적화
```javascript
// 이미지 lazy loading
<img 
  loading="lazy"
  src={imageUrl}
  alt={productName}
/>

// 불필요한 리렌더링 방지
const ProductCard = React.memo(({ product, onAddToCart }) => {
  // ...
});
```

### 접근성 개선
```javascript
<div
    role="region"
    aria-label="상품 슬라이더"
    aria-roledescription="carousel"
>
    <div
        role="group"
        aria-label={`${totalSlides}개 중 ${currentSlide + 1}번째 슬라이드`}
    >
        {/* 상품 목록 */}
    </div>
</div>
```

---

## 📚 참고 자료

- [외부 스킨 시스템 가이드](/docs/EXTERNAL_SKIN_SYSTEM_GUIDE.md)
- [ComponentSkinProps 인터페이스 정의](/src/types/component-skin.d.ts)
- [ProductSlider 컴포넌트 소스 코드](/src/components/module/ProductSlider/)

---

## 🤝 지원

질문이나 이슈가 있으신가요?

- **기술 지원**: support@webbuilder.com
- **개발자 포럼**: https://forum.webbuilder.com
- **GitHub Issues**: https://github.com/withcookie/webbuilder/issues

---

*이 문서는 ProductSlider v2.0 기준으로 작성되었습니다.*