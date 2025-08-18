# ProductDetail 컴포넌트 외부 스킨 API 가이드

## 컴포넌트 개요

ProductDetail(상품 상세) 컴포넌트는 전자상거래 사이트의 상품 상세 페이지 기능을 제공하는 복합 컴포넌트입니다. 상품 이미지, 정보, 옵션 선택, 장바구니 추가, 바로구매 등의 기능을 포함합니다.

**주요 특징:**
- 상품 이미지 갤러리 (메인 이미지 + 추가 이미지)
- 상품 옵션 및 변형(variant) 선택 시스템
- 등급/직급별 할인 가격 계산
- 수량 선택 및 재고 관리
- 장바구니 추가 및 바로구매 기능
- 탭 기반 상세 정보 (설명, 리뷰, 재고)
- 관련 상품 표시
- 모바일 반응형 지원 (바텀시트)
- 다국어 지원

## ⚠️ 중요 사항: 상품 상세 이미지

**외부 스킨 개발자를 위한 중요 안내:**

ProductDetail 컴포넌트는 **별도의 `detailImage` 필드를 사용하지 않습니다**. 
상품 상세 이미지는 `product.description` 필드에 HTML 또는 마크다운 형식으로 포함되어 있습니다.

```typescript
// ❌ 잘못된 접근 방법
const detailImage = product.detailImage; // 이 필드는 존재하지 않음

// ✅ 올바른 접근 방법 (HTML 형식)
const descriptionImages = extractImagesFromDescription(product.description);
```

상품 상세 이미지를 표시하려면 반드시 `product.description`에서 이미지를 추출해야 합니다.
자세한 구현 방법은 "6.1 상품 상세 이미지 섹션"을 참조하세요.

## ComponentSkinProps 인터페이스

```typescript
interface ComponentSkinProps {
  data: {
    // 기본 정보
    id: string;
    style: CSSStyleDeclaration;
    componentProps: object;
    
    // 상품 데이터
    product: {
      id: number;
      title: string;
      description: string;
      config: {
        img_url: string;
        main_image: string;
        discounted_price: number;
        default_price: number;
        stock_count: number;
      };
      variants: Array<{
        id: number;
        sku: string;
        additionalPrice: number;
        stock: number;
        options: Array<{
          optionValueId: number;
          optionValue: {
            optionGroupId: number;
          };
        }>;
      }>;
      optionGroups: Array<{
        id: number;
        code: string;
        name: string;
        isRequired: boolean;
        optionValues: Array<{
          id: number;
          code: string;
          name: string;
          value: string;
          isActive: boolean;
        }>;
      }>;
      optionJson: {
        level2_price: Record<number, number>;
      };
      additionalImages: string[];
      
      // 리뷰 관련
      recentReviews?: Array<{
        id: number;
        userName: string;
        rating: number;
        content: string;
        createdAt: string;
      }>;
      totalReviews?: number;
      averageRating?: number;
      
      // 추가 정보
      sku?: string;        // 상품 코드/SKU
      features?: Array<{   // 상품 특징 목록
        label: string;
        value: string;
      }>;
      tags?: string;       // 상품 태그
      weights?: string[];  // 무게 옵션
      price?: number;      // 기본 가격
      
      // 배송 정보
      shippingInfo?: {
        method: string;    // 배송 방법
        cost: number;      // 배송비
        estimatedDays: number; // 예상 배송일
      };
    };
    
    // 상태 정보
    selectedOptions: Record<number, number>;
    quantity: number;
    loading: boolean;
    error: any;
    activeTab: string;
    mainImage: string;
    allImages: string[];
    relatedProducts: Array<{    // 관련 상품 목록
      id: number;
      title: string;
      image: string;
      price: number;
      rating?: number;
      newPrice?: number;
      oldPrice?: number;
    }>;
    selectedVariant: any;
    isMobile: boolean;
    showBottomSheet: boolean;
    isUserLoggedIn: boolean;
    isAdminMode: boolean;
    theme: object;
    
    // 가격 정보
    basePrice: number;
    priceInfo: {
      originalPrice: number;
      levelPrice: number;
      discount: number;
      discountRate: number;
      levelName: string | null;
    };
    finalPrice: number;
    isOutOfStock: boolean;
  };
  actions: {
    handleOptionChange: (groupId: number, valueId: number) => void;
    handleQuantityChange: (quantity: number) => void;
    handleAddToCart: () => Promise<void>;
    handleBuyNow: () => Promise<void>;
    handleTabChange: (tab: string) => void;
    handleImageChange: (image: string) => void;
    increaseQuantity: () => void;
    decreaseQuantity: () => void;
    setShowBottomSheet: (show: boolean) => void;
  };
  utils: {
    t: (key: string) => string;
  };
  mode: 'editor' | 'preview' | 'production';
  editor?: {
    isSelected: boolean;
  };
}
```

## 속성 패널 설정

### 탭 표시 설정

| 속성명 | 타입 | 기본값 | 설명 |
|--------|------|--------|------|
| `showDescriptionTab` | boolean | `true` | 설명(Description) 탭 표시 여부 |
| `showReviewsTab` | boolean | `true` | 리뷰(Reviews) 탭 표시 여부 |
| `showStock` | boolean | `false` | 재고 정보 표시 여부 |

**속성 패널 위치:** 탭 표시 설정
- 각 탭에 대한 토글 스위치로 표시/숨김 제어
- 재고 정보는 별도 옵션으로 관리

**참고사항:**
- `showSpecificationTab`은 현재 주석 처리되어 비활성화됨
- 모든 탭 설정의 기본값은 `true` (표시)

### 표시 옵션 설정

| 속성명 | 타입 | 기본값 | 설명 |
|--------|------|--------|------|
| `showRelatedProducts` | boolean | `true` | 관련 상품 표시 여부 |
| `showQuantitySelector` | boolean | `true` | 수량 선택기 표시 여부 |
| `showAddToCart` | boolean | `true` | 장바구니 버튼 표시 여부 |
| `showBuyNow` | boolean | `true` | 바로구매 버튼 표시 여부 |

**속성 패널 위치:** 표시 옵션
- 각 기능별 토글 스위치로 표시/숨김 제어
- 모든 옵션의 기본값은 `true` (표시)

### 스타일 설정

| 속성명 | 타입 | 기본값 | 설명 |
|--------|------|--------|------|
| `priceColor` | string | `'#ff6b6b'` | 가격 텍스트 색상 |
| `addToCartButtonColor` | string | `'#007bff'` | 장바구니 버튼 색상 |
| `buyNowButtonColor` | string | `'#28a745'` | 바로구매 버튼 색상 |
| `stockTextColor` | string | `'#28a745'` | 재고 텍스트 색상 |

**속성 패널 위치:** 스타일 설정
- 각 색상별 컬러 피커로 색상 선택
- HEX 색상 형식 사용

## 상품 데이터 구조

### 기본 상품 정보

```typescript
product: {
  id: number;                    // 상품 ID
  title: string;                 // 상품명
  description: string;           // 상품 설명 (마크다운 형식, 상품 상세 이미지 포함)
  config: {
    img_url: string;            // 메인 이미지 URL
    main_image: string;         // 대체 메인 이미지 URL
    discounted_price: number;   // 할인가
    default_price: number;      // 정가
    stock_count: number;        // 기본 재고량
  };
  additionalImages: string[];   // 추가 이미지 배열
}
```

### 상품 상세 이미지 처리

**중요**: ProductDetail 컴포넌트는 별도의 `detailImage` 필드를 사용하지 않습니다. 대신 `product.description` 필드에 HTML 또는 마크다운 형식으로 상품 상세 이미지가 포함되어 있습니다.

```html
<!-- HTML 형식 예시 (실제 API 응답) -->
<p><img src="https://example.com/detail-image-1.jpg" alt="상품 이미지"></p>

<!-- 마크다운 형식 예시 (하위 호환성) -->
![상품 상세 이미지](https://example.com/detail-image.jpg)
```

이미지 추출 방법은 위의 "6.1 상품 상세 이미지 섹션"을 참조하세요.

### 옵션 및 변형 시스템

```typescript
// 옵션 그룹 (색상, 사이즈 등)
optionGroups: Array<{
  id: number;           // 옵션 그룹 ID
  code: string;         // 옵션 그룹 코드
  name: string;         // 옵션 그룹 이름 (예: "색상", "사이즈")
  isRequired: boolean;  // 필수 선택 여부
  optionValues: Array<{
    id: number;         // 옵션 값 ID
    code: string;       // 옵션 값 코드
    name: string;       // 옵션 값 이름 (예: "빨강", "L")
  }>;
}>;

// 상품 변형 (옵션 조합별 정보)
variants: Array<{
  id: number;              // 변형 ID
  additionalPrice: number; // 추가 가격
  stock: number;           // 변형별 재고
  options: Array<{
    optionValueId: number;
    optionValue: {
      optionGroupId: number;
    };
  }>;
}>;
```

### 등급/직급별 가격 시스템

로그인된 사용자이고 optionJson이 있는 상품의 경우 등급/직급별 할인 가격이 자동으로 계산됩니다.

```typescript
// 상품의 등급/직급별 가격 설정
optionJson: {
  priority: "level1" | "level2"; // 사용할 가격 체계
  level1_price?: Record<number, number>; // 등급ID: 가격
  level2_price?: Record<number, number>; // 직급ID: 가격
};

// 계산된 가격 정보
priceInfo: {
  originalPrice: number;  // 원래 가격
  levelPrice: number;     // 등급 할인 적용 가격
  discount: number;       // 할인 금액
  discountRate: number;   // 할인율 (%)
  levelName: string;      // 등급명
};
```

## 핵심 기능 구현

### 1. 이미지 갤러리

```tsx
const { mainImage, allImages, actions } = data;

// 메인 이미지 표시
<img src={mainImage} alt={product.title} />

// 썸네일 이미지들
{allImages.map((image, index) => (
  <img 
    key={index}
    src={image}
    onClick={() => actions.handleImageChange(image)}
    className={mainImage === image ? 'active' : ''}
  />
))}
```

### 2. 옵션 선택 시스템

```tsx
{product?.optionGroups?.map(group => (
  <div key={group.id}>
    <label>{group.name} {group.isRequired && '*'}</label>
    <select
      value={selectedOptions[group.id] || ''}
      onChange={(e) => actions.handleOptionChange(group.id, parseInt(e.target.value))}
    >
      <option value="">선택하세요</option>
      {group.optionValues.map(value => (
        <option key={value.id} value={value.id}>
          {value.name}
        </option>
      ))}
    </select>
  </div>
))}
```

### 3. 가격 표시

```tsx
const { priceInfo, finalPrice, componentProps } = data;

// 등급 할인이 있는 경우
{priceInfo.discount > 0 ? (
  <div>
    <span className="original-price" style={{textDecoration: 'line-through'}}>
      {priceInfo.originalPrice.toLocaleString()}원
    </span>
    <span className="level-price" style={{color: componentProps.priceColor}}>
      {finalPrice.toLocaleString()}원
    </span>
    <span className="discount-badge">
      할인 적용됨
    </span>
  </div>
) : (
  <span style={{color: componentProps.priceColor}}>
    {finalPrice.toLocaleString()}원
  </span>
)}
```

### 4. 수량 선택기

```tsx
{componentProps.showQuantitySelector && (
  <div className="quantity-selector">
    <button onClick={actions.decreaseQuantity}>-</button>
    <input 
      type="number" 
      value={quantity} 
      onChange={(e) => actions.handleQuantityChange(parseInt(e.target.value))}
      min="1"
    />
    <button onClick={actions.increaseQuantity}>+</button>
  </div>
)}
```

### 5. 장바구니 및 구매 버튼

```tsx
{componentProps.showAddToCart && (
  <button 
    onClick={actions.handleAddToCart}
    disabled={isOutOfStock}
    style={{backgroundColor: componentProps.addToCartButtonColor}}
  >
    {isOutOfStock ? '품절' : '장바구니'}
  </button>
)}

{componentProps.showBuyNow && (
  <button 
    onClick={actions.handleBuyNow}
    disabled={isOutOfStock}
    style={{backgroundColor: componentProps.buyNowButtonColor}}
  >
    {isOutOfStock ? '품절' : '바로구매'}
  </button>
)}
```

### 6. 탭 시스템

```tsx
// 탭 헤더
<div className="tab-headers">
  {componentProps.showDescriptionTab && (
    <button 
      className={activeTab === 'description' ? 'active' : ''}
      onClick={() => actions.handleTabChange('description')}
    >
      상품설명
    </button>
  )}
  {componentProps.showReviewsTab && (
    <button 
      className={activeTab === 'reviews' ? 'active' : ''}
      onClick={() => actions.handleTabChange('reviews')}
    >
      리뷰
    </button>
  )}
</div>

// 탭 콘텐츠
<div className="tab-content">
  {activeTab === 'description' && (
    <div className="description-content">
      {/* 상품 상세 이미지 처리 - 아래 섹션 참조 */}
    </div>
  )}
  {activeTab === 'reviews' && (
    <div className="reviews-content">
      {/* 리뷰 목록 - 아래 섹션 참조 */}
    </div>
  )}
</div>
```

#### 6.1 상품 상세 이미지 섹션

상품 설명에서 이미지 URL을 추출하여 표시하는 방법:

```tsx
// 설명에서 이미지 URL 추출 함수 (HTML과 마크다운 모두 지원)
const extractImagesFromDescription = (description?: string): string[] => {
  if (!description) return [];
  const images: string[] = [];
  
  // HTML img 태그에서 src 추출
  const htmlRegex = /<img[^>]+src="([^">]+)"/g;
  let match;
  while ((match = htmlRegex.exec(description)) !== null) {
    if (match[1] && !match[1].includes('ProseMirror-separator')) {
      images.push(match[1]);
    }
  }
  
  // 마크다운 이미지 문법에서 URL 추출 (하위 호환성)
  const markdownRegex = /!\[.*?\]\((.*?)\)/g;
  while ((match = markdownRegex.exec(description)) !== null) {
    if (match[1]) {
      images.push(match[1]);
    }
  }
  
  return images;
};

// 상품 설명 탭 콘텐츠
{activeTab === 'description' && (
  <div className="description-tab-content">
    {/* 이미지 형식의 설명인 경우 */}
    {extractImagesFromDescription(product.description).length > 0 ? (
      <div className="description-images">
        {extractImagesFromDescription(product.description).map((imgUrl, index) => (
          <div key={index} className="description-image-item">
            <img 
              src={imgUrl} 
              alt={`상품 상세 이미지 ${index + 1}`}
              style={{ width: '100%', height: 'auto', marginBottom: '15px' }}
            />
          </div>
        ))}
      </div>
    ) : product?.description ? (
      // HTML 형식의 설명인 경우
      <div 
        className="description-html"
        dangerouslySetInnerHTML={{ 
          __html: product.description.replace(
            /!\[(.*?)\]\((.*?)\)/g, 
            '<img src="$2" alt="$1" style="width:100%; height:auto; margin:10px 0;" />'
          ) 
        }} 
      />
    ) : (
      <p>상품 설명이 없습니다.</p>
    )}
  </div>
)}
```

#### 6.2 리뷰 섹션

리뷰 데이터 구조와 표시 방법:

```tsx
// 리뷰 데이터 구조
interface Review {
  id: number;
  userName: string;
  rating: number;
  content: string;
  createdAt: string;
}

// 별점 표시 컴포넌트
const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
  const safeRating = Math.min(Math.max(0, rating), 5);
  const stars = [];
  
  for (let i = 1; i <= 5; i++) {
    if (i <= safeRating) {
      stars.push(
        <i key={i} className="star filled">★</i>
      );
    } else {
      stars.push(
        <i key={i} className="star empty">☆</i>
      );
    }
  }
  return <span className="star-rating">{stars}</span>;
};

// 리뷰 탭 콘텐츠
{activeTab === 'reviews' && (
  <div className="reviews-tab-content">
    <h4>고객 리뷰</h4>
    
    {/* 리뷰 통계 */}
    {product?.totalReviews > 0 && (
      <div className="review-stats">
        <p>총 리뷰 수: {product.totalReviews}개</p>
        <p>
          평균 평점: <StarRating rating={product.averageRating || 0} />
          <span>({product.averageRating?.toFixed(1) || '0.0'})</span>
        </p>
      </div>
    )}
    
    {/* 리뷰 목록 */}
    {product?.recentReviews && product.recentReviews.length > 0 ? (
      <div className="review-list">
        {product.recentReviews.map((review, index) => (
          <div key={index} className="review-item">
            <div className="review-header">
              <span className="review-author">{review.userName || '사용자'}</span>
              <StarRating rating={review.rating || 0} />
              <span className="review-date">
                {new Date(review.createdAt).toLocaleDateString()}
              </span>
            </div>
            <div className="review-content">
              <div dangerouslySetInnerHTML={{ __html: review.content }} />
            </div>
          </div>
        ))}
      </div>
    ) : (
      <p>아직 리뷰가 없습니다.</p>
    )}
  </div>
)}
```

### 7. 재고 정보 표시

```tsx
{componentProps.showStock && (
  <div style={{color: componentProps.stockTextColor}}>
    {selectedVariant ? (
      <span>재고: {selectedVariant.stock}개</span>
    ) : (
      <span>재고: {product.config.stock_count}개</span>
    )}
  </div>
)}
```

### 8. 모바일 바텀시트

```tsx
{isMobile && showBottomSheet && (
  <div className="bottom-sheet-overlay" onClick={() => actions.setShowBottomSheet(false)}>
    <div className="bottom-sheet">
      {/* 옵션 선택 UI */}
      {/* 수량 선택 UI */}
      {/* 버튼들 */}
      <button onClick={() => actions.setShowBottomSheet(false)}>
        닫기
      </button>
    </div>
  </div>
)}
```

## 기본 스킨 구현 예시

```tsx
import React from 'react';
import { ComponentSkinProps } from '../../../types/component-skin';

const MyProductDetailSkin: React.FC<ComponentSkinProps> = ({
  data,
  actions,
  utils,
  mode,
  editor
}) => {
  const {
    id,
    product,
    selectedOptions,
    quantity,
    loading,
    mainImage,
    allImages,
    priceInfo,
    finalPrice,
    isOutOfStock,
    activeTab,
    componentProps,
    isMobile,
    showBottomSheet,
    t
  } = data;

  // 별점 컴포넌트
  const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
    const safeRating = Math.min(Math.max(0, rating), 5);
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= safeRating) {
        stars.push(<i key={i} className="star filled">★</i>);
      } else {
        stars.push(<i key={i} className="star empty">☆</i>);
      }
    }
    return <span className="star-rating">{stars}</span>;
  };

  // 설명에서 이미지 추출 (HTML과 마크다운 모두 지원)
  const extractImagesFromDescription = (description?: string): string[] => {
    if (!description) return [];
    const images: string[] = [];
    
    // HTML img 태그에서 src 추출
    const htmlRegex = /<img[^>]+src="([^">]+)"/g;
    let match;
    while ((match = htmlRegex.exec(description)) !== null) {
      if (match[1] && !match[1].includes('ProseMirror-separator')) {
        images.push(match[1]);
      }
    }
    
    // 마크다운 이미지 문법에서 URL 추출 (하위 호환성)
    const markdownRegex = /!\[.*?\]\((.*?)\)/g;
    while ((match = markdownRegex.exec(description)) !== null) {
      if (match[1]) {
        images.push(match[1]);
      }
    }
    
    return images;
  };

  if (loading) {
    return <div className="loading">로딩 중...</div>;
  }

  if (!product) {
    return <div className="error">상품을 찾을 수 없습니다.</div>;
  }

  const descriptionImages = extractImagesFromDescription(product.description);

  return (
    <div id={id} className="my-product-detail">
      <div className="product-detail-container">
        {/* 상품 정보 섹션 */}
        <div className="product-info-section">
          {/* 상품 이미지 갤러리 */}
          <div className="product-images">
            <div className="main-image">
              <img src={mainImage} alt={product.title} />
            </div>
            <div className="thumbnail-images">
              {allImages.map((image, index) => (
                <img 
                  key={index}
                  src={image}
                  onClick={() => actions.handleImageChange(image)}
                  className={mainImage === image ? 'active' : ''}
                  alt={`${product.title} ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {/* 상품 정보 */}
          <div className="product-info">
            <h1>{product.title}</h1>
            
            {/* 상품 평점 */}
            {(product.averageRating || product.totalReviews > 0) && (
              <div className="product-rating">
                <StarRating rating={product.averageRating} />
                {product.totalReviews > 0 && (
                  <span className="review-count">({product.totalReviews})</span>
                )}
              </div>
            )}
            
            {/* 가격 표시 */}
            <div className="price-section">
              {priceInfo.discount > 0 ? (
                <>
                  <span className="original-price">
                    {priceInfo.originalPrice.toLocaleString()}원
                  </span>
                  <span className="level-price" style={{color: componentProps.priceColor}}>
                    {finalPrice.toLocaleString()}원
                  </span>
                  <span className="discount-info">
                    할인 적용됨
                  </span>
                </>
              ) : (
                <span className="price" style={{color: componentProps.priceColor}}>
                  {finalPrice.toLocaleString()}원
                </span>
              )}
            </div>

            {/* SKU 코드 */}
            {product.sku && (
              <div className="product-sku">
                <span>상품코드: {product.sku}</span>
              </div>
            )}
            
            {/* 태그 정보 */}
            {product.tags && product.tags.trim() !== "" && (
              <div className="product-tags">
                <strong>태그:</strong> {product.tags}
              </div>
            )}
            
            {/* 상품 특징 */}
            {product.features && product.features.length > 0 && (
              <div className="product-features">
                <ul>
                  {product.features.map((feature, index) => (
                    <li key={index}>
                      <strong>{feature.label}:</strong> {feature.value}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* 무게 옵션 */}
            {product.weights && product.weights.length > 0 && (
              <div className="product-weights">
                <span>무게:</span>
                <div className="weight-options">
                  {product.weights.map((weight, index) => (
                    <span key={index} className={`weight-option ${index === 0 ? 'active' : ''}`}>
                      {weight}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {/* 재고 정보 */}
            {componentProps.showStock && (
              <div className="stock-info" style={{color: componentProps.stockTextColor}}>
                재고: {selectedVariant ? selectedVariant.stock : product.config.stock_count}개
              </div>
            )}

            {/* 옵션 선택 */}
            {product.optionGroups?.map(group => (
              <div key={group.id} className="option-group">
                <label>
                  {group.name} {group.isRequired && <span className="required">*</span>}
                </label>
                <div className="option-values">
                  {group.optionValues.map(value => (
                    <button
                      key={value.id}
                      className={`option-button ${selectedOptions[group.id] === value.id ? 'active' : ''}`}
                      onClick={() => actions.handleOptionChange(group.id, value.id)}
                      disabled={!value.isActive}
                    >
                      {value.value}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            {/* 선택된 variant 정보 */}
            {selectedVariant && (
              <div className="variant-info">
                <p>선택된 상품: {selectedVariant.sku}</p>
                {selectedVariant.additionalPrice > 0 && (
                  <p>추가 금액: +{selectedVariant.additionalPrice.toLocaleString()}원</p>
                )}
              </div>
            )}

            {/* 수량 선택 */}
            {componentProps.showQuantitySelector && (
              <div className="quantity-selector">
                <button onClick={actions.decreaseQuantity}>-</button>
                <input 
                  type="number" 
                  value={quantity} 
                  onChange={(e) => actions.handleQuantityChange(parseInt(e.target.value))}
                  min="1"
                />
                <button onClick={actions.increaseQuantity}>+</button>
              </div>
            )}

            {/* 액션 버튼들 */}
            <div className="action-buttons">
              {componentProps.showAddToCart && (
                <button 
                  className="add-to-cart"
                  onClick={actions.handleAddToCart}
                  disabled={isOutOfStock}
                  style={{backgroundColor: componentProps.addToCartButtonColor}}
                >
                  {isOutOfStock ? t('품절') : t('장바구니')}
                </button>
              )}
              
              {componentProps.showBuyNow && (
                <button 
                  className="buy-now"
                  onClick={actions.handleBuyNow}
                  disabled={isOutOfStock}
                  style={{backgroundColor: componentProps.buyNowButtonColor}}
                >
                  {isOutOfStock ? t('품절') : t('바로구매')}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 탭 시스템 */}
        <div className="product-tabs">
          <div className="tab-headers">
            {componentProps.showDescriptionTab && (
              <button 
                className={activeTab === 'description' ? 'active' : ''}
                onClick={() => actions.handleTabChange('description')}
              >
                {t('상품설명')}
              </button>
            )}
            {componentProps.showReviewsTab && (
              <button 
                className={activeTab === 'reviews' ? 'active' : ''}
                onClick={() => actions.handleTabChange('reviews')}
              >
                {t('리뷰')}
              </button>
            )}
          </div>
          
          <div className="tab-content">
            {/* 상품 설명 탭 */}
            {activeTab === 'description' && (
              <div className="description-tab">
                {descriptionImages.length > 0 ? (
                  <div className="description-images">
                    {descriptionImages.map((imgUrl, index) => (
                      <img 
                        key={index}
                        src={imgUrl} 
                        alt={`상품 상세 이미지 ${index + 1}`}
                        style={{ width: '100%', height: 'auto', marginBottom: '15px' }}
                      />
                    ))}
                  </div>
                ) : product?.description ? (
                  <div 
                    className="description-html"
                    dangerouslySetInnerHTML={{ 
                      __html: product.description.replace(
                        /!\[(.*?)\]\((.*?)\)/g, 
                        '<img src="$2" alt="$1" style="width:100%; height:auto; margin:10px 0;" />'
                      ) 
                    }} 
                  />
                ) : (
                  <p>{t('상품 설명이 없습니다.')}</p>
                )}
              </div>
            )}
            
            {/* 리뷰 탭 */}
            {activeTab === 'reviews' && (
              <div className="reviews-tab">
                <h4>{t('고객 리뷰')}</h4>
                
                {/* 리뷰 통계 */}
                {product.totalReviews > 0 && (
                  <div className="review-stats">
                    <p>총 리뷰 수: {product.totalReviews}개</p>
                    <p>
                      평균 평점: <StarRating rating={product.averageRating || 0} />
                      <span> ({product.averageRating?.toFixed(1) || '0.0'})</span>
                    </p>
                  </div>
                )}
                
                {/* 리뷰 목록 */}
                {product.recentReviews && product.recentReviews.length > 0 ? (
                  <div className="review-list">
                    {product.recentReviews.map((review, index) => (
                      <div key={index} className="review-item">
                        <div className="review-header">
                          <span className="review-author">{review.userName || '사용자'}</span>
                          <StarRating rating={review.rating || 0} />
                          <span className="review-date">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="review-content">
                          <div dangerouslySetInnerHTML={{ __html: review.content }} />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>{t('아직 리뷰가 없습니다.')}</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* 관련 상품 */}
        {componentProps.showRelatedProducts && data.relatedProducts?.length > 0 && (
          <div className="related-products">
            <h3>{t('관련 상품')}</h3>
            <div className="related-products-grid">
              {data.relatedProducts.map(relatedProduct => (
                <div key={relatedProduct.id} className="related-product">
                  <img src={relatedProduct.image} alt={relatedProduct.title} />
                  <h4>{relatedProduct.title}</h4>
                  <span className="price">{relatedProduct.price.toLocaleString()}원</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 모바일 바텀시트 */}
      {isMobile && showBottomSheet && (
        <div className="bottom-sheet-overlay" onClick={() => actions.setShowBottomSheet(false)}>
          <div className="bottom-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="bottom-sheet-header">
              <h3>{product.title}</h3>
              <button onClick={() => actions.setShowBottomSheet(false)}>×</button>
            </div>
            <div className="bottom-sheet-content">
              {/* 옵션 선택 */}
              {product.optionGroups?.map(group => (
                <div key={group.id} className="option-group">
                  <label>
                    {group.name} {group.isRequired && '*'}
                  </label>
                  <div className="option-values">
                    {group.optionValues.map(value => (
                      <button
                        key={value.id}
                        className={`option-button ${selectedOptions[group.id] === value.id ? 'active' : ''}`}
                        onClick={() => actions.handleOptionChange(group.id, value.id)}
                        disabled={!value.isActive}
                      >
                        {value.value}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              
              {/* 선택된 variant 정보 */}
              {selectedVariant && (
                <div className="variant-info">
                  <p>선택된 상품: {selectedVariant.sku}</p>
                  {selectedVariant.additionalPrice > 0 && (
                    <p>추가 금액: +{selectedVariant.additionalPrice.toLocaleString()}원</p>
                  )}
                </div>
              )}
              
              {/* 총 금액 표시 */}
              <div className="total-price">
                <strong>{(finalPrice * quantity).toLocaleString()}원</strong>
              </div>
              
              {/* 액션 버튼 */}
              <div className="action-buttons">
                <button 
                  onClick={actions.handleAddToCart}
                  style={{backgroundColor: componentProps.addToCartButtonColor}}
                >
                  {t('장바구니')}
                </button>
                <button 
                  onClick={actions.handleBuyNow}
                  style={{backgroundColor: componentProps.buyNowButtonColor}}
                >
                  {t('바로구매')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyProductDetailSkin;
```

## 고급 기능 처리

### 1. 등급/직급별 가격 계산 로직

상품의 등급/직급별 가격은 다음 우선순위로 계산됩니다:

1. **optionJson.priority 확인**: "level1" 또는 "level2" 사용 결정
2. **상품별 등급/직급 가격**: 
   - level1: `product.optionJson.level1_price[userLevel1Id]`
   - level2: `product.optionJson.level2_price[userLevel2Id]`
3. **등급/직급 정책의 공급가 비율**: `levelPolicy.settingJson.supply_price_ratio`
3. **기본 가격**: 할인이 없는 경우

```typescript
// 등급/직급별 가격 정보 활용
const { priceInfo } = data;

// 로그인된 사용자 + optionJson 있으면 자동으로 할인가 계산됨
console.log(`최종 가격: ${priceInfo.levelPrice}원`);
```

### 2. 옵션 변형(Variant) 처리

옵션 선택에 따라 자동으로 해당 변형을 찾고 추가 가격과 재고를 적용합니다:

```typescript
// 선택된 변형 정보 활용
const { selectedVariant, finalPrice } = data;

if (selectedVariant) {
  // 변형별 추가 가격이 최종 가격에 포함됨
  console.log(`추가 가격: ${selectedVariant.additionalPrice}원`);
  console.log(`변형 재고: ${selectedVariant.stock}개`);
}
```

### 3. 장바구니 추가 처리

장바구니 추가는 다음과 같은 검증을 거칩니다:

1. **필수 옵션 선택 확인**
2. **재고 확인** (변형별 또는 기본 재고)
3. **로그인 상태 확인**
4. **서버 API 호출**

```typescript
// 장바구니 추가 전 상태 확인
const { isOutOfStock, selectedVariant, product } = data;

// 품절 상태 확인
if (isOutOfStock) {
  // 품절 상태 UI 표시
}

// 필수 옵션 선택 확인은 handleAddToCart에서 자동 처리됨
```

## CSS 클래스명 충돌 방지

기본 스킨의 CSS 클래스들과 충돌을 피하기 위해 고유한 클래스명을 사용하세요:

```css
/* 기본 스킨 클래스들 (사용 금지) */
.product-detail-component { }
.product-images { }
.product-info { }
.option-group { }
.quantity-selector { }
.action-buttons { }
.product-tabs { }
.bottom-sheet { }

/* 외부 스킨 권장 클래스명 */
.my-company-product-detail { }
.my-company-product-images { }
.my-company-product-info { }
.my-company-option-group { }
.my-company-quantity-selector { }
.my-company-action-buttons { }
.my-company-product-tabs { }
.my-company-bottom-sheet { }
```

## 반응형 디자인 고려사항

### 모바일 최적화

```tsx
const { isMobile } = data;

// 모바일에서 다른 레이아웃 적용
{isMobile ? (
  <div className="mobile-layout">
    {/* 모바일용 UI */}
  </div>
) : (
  <div className="desktop-layout">
    {/* 데스크톱용 UI */}
  </div>
)}
```

### 바텀시트 활용

모바일에서는 옵션 선택을 위한 바텀시트를 활용할 수 있습니다:

```tsx
// 모바일에서 옵션 선택 버튼 클릭 시
<button onClick={() => actions.setShowBottomSheet(true)}>
  옵션 선택
</button>
```

## 접근성 고려사항

### 1. 키보드 내비게이션

```tsx
// 탭 키로 접근 가능하도록 tabIndex 설정
<button tabIndex={0} onKeyDown={handleKeyDown}>
  장바구니
</button>
```

### 2. 스크린 리더 지원

```tsx
// 가격 정보에 대한 설명 제공
<div aria-label={`상품 가격 ${finalPrice.toLocaleString()}원`}>
  {finalPrice.toLocaleString()}원
</div>

// 재고 상태 안내
<div aria-live="polite">
  {isOutOfStock ? '품절된 상품입니다' : '구매 가능한 상품입니다'}
</div>
```

### 3. 색상 대비

```css
/* 충분한 색상 대비 확보 */
.price {
  color: #d73527; /* 4.5:1 이상의 대비율 */
}

.button {
  background-color: #0056b3;
  color: #ffffff; /* 7:1 이상의 대비율 */
}
```

## 성능 최적화

### 1. 이미지 최적화

```tsx
// 이미지 지연 로딩
<img 
  src={image} 
  loading="lazy"
  alt={product.title}
/>

// 반응형 이미지
<img 
  src={image}
  sizes="(max-width: 768px) 100vw, 50vw"
  alt={product.title}
/>
```

### 2. 메모이제이션 활용

대부분의 계산된 값들이 이미 메모이제이션되어 있어 추가 최적화는 필요하지 않습니다.

## 에러 처리

### 1. 상품 로딩 실패

```tsx
const { loading, error, product } = data;

if (loading) {
  return <div className="loading">로딩 중...</div>;
}

if (error) {
  return <div className="error">오류가 발생했습니다: {error.message}</div>;
}

if (!product) {
  return <div className="not-found">상품을 찾을 수 없습니다.</div>;
}
```

### 2. 장바구니 추가 실패

장바구니 추가 실패는 `handleAddToCart` 액션에서 자동으로 처리되며, 토스트 메시지로 사용자에게 알립니다.

## 호환성 체크리스트

- [ ] 모든 속성 패널 설정이 올바르게 반영되는가?
- [ ] 탭 표시/숨김 설정이 올바르게 작동하는가?
- [ ] 표시 옵션 설정이 올바르게 작동하는가?
- [ ] 스타일 색상 설정이 올바르게 적용되는가?
- [ ] 상품 이미지 갤러리가 올바르게 작동하는가?
- [ ] 상품 상세 이미지(description 필드)가 올바르게 표시되는가?
- [ ] 상품 평점과 리뷰 수가 올바르게 표시되는가?
- [ ] SKU, 태그, 특징 정보가 올바르게 표시되는가?
- [ ] 무게 옵션이 올바르게 표시되는가?
- [ ] 상품 옵션 선택이 올바르게 작동하는가?
- [ ] 수량 선택기가 올바르게 작동하는가?
- [ ] 장바구니 추가가 올바르게 작동하는가?
- [ ] 바로구매가 올바르게 작동하는가?
- [ ] 등급/직급별 할인 가격이 올바르게 표시되는가?
- [ ] 재고 관리가 올바르게 작동하는가?
- [ ] 리뷰 목록과 별점이 올바르게 표시되는가?
- [ ] 모바일 반응형이 올바르게 작동하는가?
- [ ] 바텀시트가 올바르게 작동하는가?
- [ ] 다국어가 올바르게 작동하는가?
- [ ] CSS 클래스명이 기본 스킨과 충돌하지 않는가?
- [ ] 접근성 요구사항을 충족하는가?

이 가이드를 따라 구현하면 기본 스킨과 동일한 기능을 제공하는 외부 스킨을 만들 수 있습니다.