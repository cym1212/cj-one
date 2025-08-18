# Cart 컴포넌트 외부 스킨 API 가이드

## 컴포넌트 개요

Cart(장바구니) 컴포넌트는 전자상거래 사이트의 장바구니 기능을 제공하는 컴포넌트입니다. 상품 목록 표시, 수량 조절, 가격 계산, 배송비 계산, 결제 진행 등의 기능을 포함합니다.

**주요 특징:**
- 장바구니 상품 목록 표시
- 수량 증가/감소 기능
- 상품별 옵션 표시
- 등급/직급별 할인 가격 자동 계산 (회사 설정에 따라 level1 또는 level2 정책 기반)
- 재고 수량 확인
- 배송비 자동 계산 (무료배송 기준금액 적용)
- 전체 금액 실시간 계산
- 개별 상품 삭제
- 전체 상품 비우기
- 결제 페이지로 이동
- 다국어 지원

## ComponentSkinProps 인터페이스

```typescript
interface ComponentSkinProps {
  data: {
    // 기본 정보
    id: string;
    style: CSSStyleDeclaration;
    componentProps: object;
    
    // 장바구니 데이터
    cartItems: Array<{
      id: number;
      count: number;
      productId: number;
      variantId?: number | null;
      variant?: {
        id: number;
        sku: string;
        additionalPrice: string;
        stock: number;
        options?: Array<{
          optionValue: {
            value: string;
            optionGroup: {
              name: string;
            };
          };
        }>;
      };
      product: {
        id: number;
        title: string;
        config?: {
          img_url?: string;
          default_price?: number;
          discounted_price?: number;
          stock_count?: number;
        };
        optionGroups?: Array<{
          id: number;
          name: string;
          code: string;
          optionValues?: Array<{
            id: number;
            value: string;
            code: string;
          }>;
        }>;
      };
    }>;
    
    // 상태 정보
    loading: boolean;
    error?: any;
    localQuantities: Record<number, number>; // 로컬 수량 상태
    
    // 계산된 값
    calculations: {
      subtotal: number;      // 상품 총액
      shippingFee: number;   // 배송비
      total: number;         // 최종 결제 금액
    };
    
    // 사용자 정보
    isUserLoggedIn: boolean;
    isAdminLoggedIn: boolean;
    withcookieData?: any;
    userInfo?: any;
    
    // 설정값
    freeShippingLimit: number;  // 무료배송 기준금액
    title: string;              // 장바구니 제목
    emptyText: string;          // 빈 장바구니 메시지
    shippingFee: number;        // 기본 배송비
    showStock: boolean;         // 재고 표시 여부
    theme: object;
  };
  
  actions: {
    handleIncreaseQuantity: (item: any) => void;
    handleDecreaseQuantity: (item: any) => void;
    handleRemoveFromCart: (cartItemId: number) => Promise<void>;
    handleCheckout: () => void;
    handleClearCart: () => Promise<void>;
    calculateLevelPrice: (basePrice: number, product: any) => {
      originalPrice: number;      // 원가
      levelPrice: number;         // 등급/직급별 할인가
      discount: number;           // 할인 금액
      discountRate: number;       // 할인율(%)
      levelName: string | null;   // 등급/직급명 (예: "VIP", "골드회원" 등)
    };
    calculateTotalPrice: () => number;
    calculateGrandTotal: () => number;
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

### 기본 설정

| 속성명 | 타입 | 기본값 | 설명 |
|--------|------|--------|------|
| `title` | string | `'장바구니'` | 장바구니 페이지 제목 |
| `emptyText` | string | `'장바구니가 비어 있습니다.'` | 빈 장바구니 메시지 |

### 가격 설정

| 속성명 | 타입 | 기본값 | 설명 |
|--------|------|--------|------|
| `shippingFee` | number | `4000` | 기본 배송비 |
| `freeShippingLimit` | number | `50000` | 무료배송 기준금액 (회사 설정에서 자동 로드) |

### 표시 옵션

| 속성명 | 타입 | 기본값 | 설명 |
|--------|------|--------|------|
| `showStock` | boolean | `true` | 재고 수량 표시 여부 |
| `showImage` | boolean | `true` | 상품 이미지 표시 여부 |
| `showQuantitySelector` | boolean | `true` | 수량 선택기 표시 여부 |
| `showRemoveButton` | boolean | `true` | 삭제 버튼 표시 여부 |
| `showCoupon` | boolean | `true` | 쿠폰 영역 표시 여부 |
| `showSummary` | boolean | `true` | 결제 요약 표시 여부 |
| `showCheckout` | boolean | `true` | 결제하기 버튼 표시 여부 |

### 스타일 설정

| 속성명 | 타입 | 기본값 | 설명 |
|--------|------|--------|------|
| `primaryButtonColor` | string | `'#007bff'` | 주요 버튼 색상 |
| `secondaryButtonColor` | string | `'#6c757d'` | 보조 버튼 색상 |
| `dangerButtonColor` | string | `'#dc3545'` | 삭제 버튼 색상 |
| `priceColor` | string | `'#ff6b6b'` | 가격 텍스트 색상 |
| `summaryBackgroundColor` | string | `'#f8f9fa'` | 결제 요약 배경색 |

## 장바구니 데이터 구조

### CartItem 인터페이스

```typescript
interface CartItem {
  id: number;                    // 장바구니 아이템 ID
  count: number;                 // 수량
  productId: number;             // 상품 ID
  variantId?: number | null;     // 변형 ID (옵션 조합)
  variant?: {
    id: number;
    sku: string;                 // 변형 SKU
    additionalPrice: string;     // 추가 가격
    stock: number;               // 변형별 재고
    options?: Array<{
      optionValue: {
        value: string;           // 옵션 값 (예: "빨강", "L")
        optionGroup: {
          name: string;          // 옵션 그룹명 (예: "색상", "사이즈")
        };
      };
    }>;
  };
  product: {
    id: number;
    title: string;               // 상품명
    config?: {
      img_url?: string;          // 상품 이미지 URL
      default_price?: number;    // 정가
      discounted_price?: number; // 할인가
      stock_count?: number;      // 기본 재고
    };
  };
}
```

## 핵심 기능 구현

### 1. 장바구니 아이템 목록 표시

```tsx
const { cartItems, showImage, showStock } = data;

{cartItems.length === 0 ? (
  <div className="empty-cart">
    <p>{data.emptyText}</p>
  </div>
) : (
  <div className="cart-items">
    {cartItems.map((item) => (
      <div key={item.id} className="cart-item">
        {/* 상품 이미지 */}
        {showImage && (
          <div className="item-image">
            <img src={item.product.config?.img_url} alt={item.product.title} />
          </div>
        )}
        
        {/* 상품 정보 */}
        <div className="item-info">
          <h3>{item.product.title}</h3>
          
          {/* 옵션 표시 */}
          {item.variant?.options && (
            <div className="item-options">
              {item.variant.options.map((opt, idx) => (
                <span key={idx}>
                  {opt.optionValue.optionGroup.name}: {opt.optionValue.value}
                </span>
              ))}
            </div>
          )}
          
          {/* 재고 표시 */}
          {showStock && (
            <div className="stock-info">
              재고: {item.variant ? item.variant.stock : item.product.config?.stock_count}개
            </div>
          )}
        </div>
      </div>
    ))}
  </div>
)}
```

### 2. 수량 조절

```tsx
{data.showQuantitySelector && (
  <div className="quantity-selector">
    <button 
      onClick={() => actions.handleDecreaseQuantity(item)}
      disabled={item.count <= 1}
    >
      -
    </button>
    <span>{data.localQuantities[item.id] || item.count}</span>
    <button 
      onClick={() => actions.handleIncreaseQuantity(item)}
      disabled={item.count >= (item.variant ? item.variant.stock : item.product.config?.stock_count)}
    >
      +
    </button>
  </div>
)}
```

### 3. 가격 표시 (등급/직급별 할인 적용)

```tsx
// 1. 기본 가격 결정: discounted_price가 있으면 사용, 없으면 default_price 사용
const basePrice = item.product.config?.discounted_price || item.product.config?.default_price || 0;

// 2. 등급/직급별 가격 계산 (로그인된 사용자 + optionJson이 있는 경우 자동 할인 적용)
const priceInfo = actions.calculateLevelPrice(basePrice, item.product);

// 3. variant 추가 가격
const additionalPrice = item.variant ? parseInt(item.variant.additionalPrice) : 0;

// 4. 최종 가격 = 등급/직급 할인가 + variant 추가 가격
const finalPrice = priceInfo.levelPrice + additionalPrice;

<div className="price-info">
  {/* 로그인된 사용자 + optionJson 있으면 자동으로 할인가 계산됨 */}
  <span className="price">
    {priceInfo.levelPrice.toLocaleString()}원
  </span>
  
  {/* variant 추가 가격이 있는 경우 */}
  {additionalPrice > 0 && (
    <span className="variant-additional-price">
      (+{additionalPrice.toLocaleString()}원)
    </span>
  )}
</div>

{/* 수량 x 가격 = 소계 */}
<div className="item-total">
  {(finalPrice * item.count).toLocaleString()}원
</div>
```

### 4. 상품 삭제

```tsx
{data.showRemoveButton && (
  <button
    className="remove-button"
    style={{ backgroundColor: data.dangerButtonColor }}
    onClick={() => actions.handleRemoveFromCart(item.id)}
  >
    삭제
  </button>
)}
```

### 5. 결제 요약

```tsx
{data.showSummary && (
  <div 
    className="order-summary"
    style={{ backgroundColor: data.summaryBackgroundColor }}
  >
    <h3>주문 요약</h3>
    
    <div className="summary-row">
      <span>상품 총액</span>
      <span>{data.calculations.subtotal.toLocaleString()}원</span>
    </div>
    
    <div className="summary-row">
      <span>배송비</span>
      <span>
        {data.calculations.subtotal >= data.freeShippingLimit ? (
          <span className="free-shipping">무료</span>
        ) : (
          `${data.shippingFee.toLocaleString()}원`
        )}
      </span>
    </div>
    
    {data.calculations.subtotal < data.freeShippingLimit && (
      <div className="free-shipping-notice">
        {(data.freeShippingLimit - data.calculations.subtotal).toLocaleString()}원 
        더 구매하시면 무료배송!
      </div>
    )}
    
    <div className="summary-total">
      <span>총 결제금액</span>
      <span style={{ color: data.priceColor }}>
        {data.calculations.total.toLocaleString()}원
      </span>
    </div>
  </div>
)}
```

### 6. 결제 진행

```tsx
<div className="cart-actions">
  <button
    className="clear-cart-button"
    style={{ backgroundColor: data.secondaryButtonColor }}
    onClick={actions.handleClearCart}
  >
    장바구니 비우기
  </button>
  
  {data.showCheckout && (
    <button
      className="checkout-button"
      style={{ backgroundColor: data.primaryButtonColor }}
      onClick={actions.handleCheckout}
      disabled={cartItems.length === 0}
    >
      결제하기
    </button>
  )}
</div>
```

## 기본 스킨 구현 예시

```tsx
import React from 'react';
import { ComponentSkinProps } from '../../../types/component-skin';

const MyCartSkin: React.FC<ComponentSkinProps> = ({
  data,
  actions,
  utils,
  mode,
  editor
}) => {
  const { cartItems, loading, calculations, showImage, showStock, showQuantitySelector, showRemoveButton } = data;
  const { t } = utils;
  
  if (loading) {
    return <div className="loading">로딩 중...</div>;
  }
  
  return (
    <div className="my-cart-container">
      <h1>{data.title}</h1>
      
      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <p>{data.emptyText}</p>
          <a href="/shop">쇼핑 계속하기</a>
        </div>
      ) : (
        <>
          {/* 장바구니 아이템 목록 */}
          <div className="cart-items">
            {cartItems.map((item) => {
              const basePrice = item.product.config?.discounted_price || item.product.config?.default_price || 0;
              const priceInfo = actions.calculateLevelPrice(basePrice, item.product);
              const additionalPrice = item.variant ? parseInt(item.variant.additionalPrice) : 0;
              const finalPrice = priceInfo.levelPrice + additionalPrice;
              const quantity = data.localQuantities[item.id] || item.count;
              
              return (
                <div key={item.id} className="cart-item">
                  {/* 상품 이미지 */}
                  {showImage && (
                    <div className="item-image">
                      <img 
                        src={item.product.config?.img_url || '/placeholder.png'} 
                        alt={item.product.title} 
                      />
                    </div>
                  )}
                  
                  {/* 상품 정보 */}
                  <div className="item-details">
                    <h3>{item.product.title}</h3>
                    
                    {/* 옵션 표시 */}
                    {item.variant?.options && (
                      <div className="item-options">
                        {item.variant.options.map((opt, idx) => (
                          <span key={idx} className="option-tag">
                            {opt.optionValue.optionGroup.name}: {opt.optionValue.value}
                          </span>
                        ))}
                      </div>
                    )}
                    
                    {/* 재고 표시 */}
                    {showStock && (
                      <div className="stock-info">
                        재고: {item.variant ? item.variant.stock : item.product.config?.stock_count || 0}개
                      </div>
                    )}
                    
                    {/* 가격 표시 (등급/직급별 할인 포함) */}
                    <div className="price-info">
                      {priceInfo.discount > 0 ? (
                        <>
                          <span className="original-price">
                            {(priceInfo.originalPrice + additionalPrice).toLocaleString()}원
                          </span>
                          <span className="level-price" style={{ color: data.priceColor }}>
                            {finalPrice.toLocaleString()}원
                          </span>
                          {priceInfo.levelName && (
                            <span className="discount-badge">
                              {priceInfo.levelName} {priceInfo.discountRate}% 할인
                            </span>
                          )}
                        </>
                      ) : (
                        <span style={{ color: data.priceColor }}>
                          {finalPrice.toLocaleString()}원
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* 수량 및 액션 */}
                  <div className="item-actions">
                    {/* 수량 선택기 */}
                    {showQuantitySelector && (
                      <div className="quantity-selector">
                        <button 
                          onClick={() => actions.handleDecreaseQuantity(item)}
                          disabled={quantity <= 1}
                        >
                          -
                        </button>
                        <span>{quantity}</span>
                        <button 
                          onClick={() => actions.handleIncreaseQuantity(item)}
                          disabled={quantity >= (item.variant ? item.variant.stock : item.product.config?.stock_count || 99)}
                        >
                          +
                        </button>
                      </div>
                    )}
                    
                    {/* 소계 */}
                    <div className="item-subtotal">
                      {(finalPrice * quantity).toLocaleString()}원
                    </div>
                    
                    {/* 삭제 버튼 */}
                    {showRemoveButton && (
                      <button
                        className="remove-button"
                        style={{ backgroundColor: data.dangerButtonColor }}
                        onClick={() => actions.handleRemoveFromCart(item.id)}
                      >
                        ×
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* 결제 요약 */}
          {data.showSummary && (
            <div 
              className="order-summary"
              style={{ backgroundColor: data.summaryBackgroundColor }}
            >
              <h3>주문 요약</h3>
              
              <div className="summary-row">
                <span>상품 총액</span>
                <span>{calculations.subtotal.toLocaleString()}원</span>
              </div>
              
              <div className="summary-row">
                <span>배송비</span>
                <span>
                  {calculations.subtotal >= data.freeShippingLimit ? (
                    <span className="free-shipping">무료</span>
                  ) : (
                    `${data.shippingFee.toLocaleString()}원`
                  )}
                </span>
              </div>
              
              {calculations.subtotal < data.freeShippingLimit && (
                <div className="free-shipping-notice">
                  <i className="info-icon">ℹ️</i>
                  {(data.freeShippingLimit - calculations.subtotal).toLocaleString()}원 
                  더 구매하시면 무료배송!
                </div>
              )}
              
              {data.showCoupon && (
                <div className="coupon-section">
                  <input 
                    type="text" 
                    placeholder="쿠폰 코드 입력"
                    className="coupon-input"
                  />
                  <button className="coupon-button">적용</button>
                </div>
              )}
              
              <div className="summary-total">
                <span>총 결제금액</span>
                <span style={{ color: data.priceColor, fontSize: '1.5em', fontWeight: 'bold' }}>
                  {calculations.total.toLocaleString()}원
                </span>
              </div>
              
              {/* 액션 버튼 */}
              <div className="cart-actions">
                <button
                  className="continue-shopping"
                  style={{ backgroundColor: data.secondaryButtonColor }}
                  onClick={() => window.location.href = '/shop'}
                >
                  쇼핑 계속하기
                </button>
                
                {data.showCheckout && (
                  <button
                    className="checkout-button"
                    style={{ backgroundColor: data.primaryButtonColor }}
                    onClick={actions.handleCheckout}
                  >
                    결제하기
                  </button>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MyCartSkin;
```

## 고급 기능 처리

### 1. 등급/직급별 가격 계산

`calculateLevelPrice` 액션은 회사 설정에 따라 사용자의 등급(level1) 또는 직급(level2)에 따라 자동으로 할인 가격을 계산합니다:

```typescript
const priceInfo = actions.calculateLevelPrice(basePrice, product);
// 반환값:

```

**가격 계산 순서:**

1. **기본 가격 결정**:
   - `product.config.discounted_price`가 있으면 사용 (이미 할인된 가격)
   - 없으면 `product.config.default_price` 사용 (정가)

2. **등급/직급별 할인 적용 조건**:
   - 사용자가 로그인되어 있고
   - 회사가 등급제를 사용하면 level1, 직급제를 사용하면 level2가 설정되어 있을 때 적용

3. **등급/직급별 가격 결정 방식**:
   - **직급제(level2) 사용 시**: `product.optionJson.level2_price[userLevel2Id]`가 있으면 → 해당 직급의 개별 가격 사용
   - **등급제(level1) 사용 시**: `product.optionJson.level1_price[userLevel1Id]`가 있으면 → 해당 등급의 개별 가격 사용
   - 없으면 → 등급/직급 정책의 `supply_price_ratio`로 계산 (basePrice × ratio)

4. **할인이 적용되지 않는 경우**:
   - 로그인하지 않은 사용자 → 기본 가격 그대로
   - 등급/직급이 없는 사용자 → 기본 가격 그대로
   - optionJson이 없거나 등급/직급별 가격이 설정되지 않은 상품 → supply_price_ratio로 계산 가능

**참고:** 
- 회사마다 등급제(level1) 또는 직급제(level2) 중 하나를 선택하여 사용합니다
- 현재 기본 구현은 level2(직급)로 되어 있지만, level1(등급)도 동일한 방식으로 작동합니다
- 기본 가격이 이미 할인된 가격(discounted_price)인 경우, 등급/직급별 할인은 추가로 적용됩니다

### 2. 실시간 수량 업데이트

수량 변경은 디바운싱 처리되어 서버 부하를 줄입니다:
- 사용자가 수량을 변경하면 `localQuantities`에 즉시 반영
- 1초 후 서버에 업데이트 요청 전송
- 업데이트 중 추가 변경 시 이전 요청 취소

### 3. 무료배송 기준금액

무료배송 기준금액은 회사 설정에서 자동으로 가져옵니다:
1. `withcookieData.company.companySettingJson.free_shipping_limit` 확인
2. 없으면 기본값 50,000원 사용

## CSS 클래스명 충돌 방지

기본 스킨의 CSS 클래스들과 충돌을 피하기 위해 고유한 클래스명을 사용하세요:

```css
/* 기본 스킨 클래스들 (사용 금지) */
.cart-container { }
.cart-item { }
.order-summary { }
.quantity-selector { }

/* 외부 스킨 권장 클래스명 */
.my-company-cart-container { }
.my-company-cart-item { }
.my-company-order-summary { }
.my-company-quantity-selector { }
```

## 반응형 디자인 고려사항

### 모바일 최적화

```css
@media (max-width: 768px) {
  .cart-item {
    flex-direction: column;
  }
  
  .item-image {
    width: 100%;
    max-width: 200px;
    margin: 0 auto;
  }
  
  .order-summary {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    border-radius: 20px 20px 0 0;
  }
}
```

## 에러 처리

### 1. 재고 부족

```tsx
// 수량 증가 시 재고 확인
const maxStock = item.variant ? item.variant.stock : item.product.config?.stock_count || 99;
if (quantity >= maxStock) {
  alert('재고가 부족합니다.');
  return;
}
```

### 2. 로그인 필요

```tsx
if (!data.isUserLoggedIn) {
  return (
    <div className="login-required">
      <p>장바구니를 이용하려면 로그인이 필요합니다.</p>
      <a href="/login">로그인하기</a>
    </div>
  );
}
```

## 호환성 체크리스트

- [ ] 모든 속성 패널 설정이 올바르게 반영되는가?
- [ ] 상품 이미지가 올바르게 표시되는가?
- [ ] 옵션(variant) 정보가 올바르게 표시되는가?
- [ ] 수량 증가/감소가 올바르게 작동하는가?
- [ ] 재고 제한이 올바르게 작동하는가?
- [ ] 등급/직급별 할인 가격이 올바르게 계산되는가?
- [ ] 배송비가 올바르게 계산되는가?
- [ ] 무료배송 기준이 올바르게 적용되는가?
- [ ] 상품 삭제가 올바르게 작동하는가?
- [ ] 장바구니 비우기가 올바르게 작동하는가?
- [ ] 결제하기 버튼이 올바르게 작동하는가?
- [ ] 빈 장바구니 상태가 올바르게 표시되는가?
- [ ] 로딩 상태가 올바르게 표시되는가?
- [ ] CSS 클래스명이 기본 스킨과 충돌하지 않는가?
- [ ] 반응형 디자인이 올바르게 작동하는가?

이 가이드를 따라 구현하면 기본 스킨과 동일한 기능을 제공하는 외부 스킨을 만들 수 있습니다.