# QuickMenu + 상품리스트 통합 가이드

## 개요
QuickMenu 컴포넌트의 확장 기능으로, 카테고리 선택 시 페이지 이동 없이 해당 카테고리의 상품을 즉시 표시할 수 있습니다. 이 기능은 외부 스킨을 위해 특별히 설계되었으며, 기존 QuickMenu 동작에는 영향을 주지 않습니다.

## 주요 특징
- ✅ 페이지 새로고침 없이 카테고리별 상품 표시
- ✅ 기존 컴포넌트와 완전히 독립적인 동작
- ✅ Redux를 통한 효율적인 상품 데이터 관리
- ✅ 외부 스킨에서 완전한 커스터마이징 가능

## 설정 방법

### 1. 웹빌더에서 컴포넌트 설정
```javascript
{
    type: 'QUICK_MENU',
        componentProps: {
        // 기본 QuickMenu 설정
        categoryItems: [
            {
                id: 'cat-1',
                categoryId: 5,           // 실제 카테고리 ID (API의 카테고리와 매칭)
                categoryName: '전자제품',
                imageUrl: '/images/electronics.jpg',
                routingPath: '/electronics',
                visible: true
            },
            {
                id: 'cat-2',
                categoryId: 8,
                categoryName: '의류',
                imageUrl: '/images/clothing.jpg',
                routingPath: '/clothing',
                visible: true
            }
            // ... 더 많은 카테고리
        ],
            columnsPerRow: 4,
            showCategoryName: true,

            // 🎯 확장 기능 활성화 (필수!)
            enableProductDisplay: true,

            // 확장 기능 옵션
            productsPerRow: 4,           // 한 줄에 표시할 상품 수
            showProductPrice: true,       // 가격 표시 여부
            maxProductsToShow: 20,        // 최대 상품 수
            initialCategoryId: 5,         // 초기 선택 카테고리 ID (전자제품)
            productListClassName: 'custom-products'  // 커스텀 클래스명 (선택사항)
    }
}
```

### 2. 중요 설정 플래그

| 플래그 | 타입 | 기본값 | 설명 |
|-------|------|--------|------|
| **enableProductDisplay** | boolean | false | 확장 기능 활성화 (필수!) |
| productsPerRow | number | 4 | 한 줄에 표시할 상품 수 |
| showProductPrice | boolean | true | 상품 가격 표시 여부 |
| maxProductsToShow | number | 20 | 표시할 최대 상품 수 |
| initialCategoryId | number | null | 초기 선택 카테고리 ID |
| onCategorySelect | function | null | 카테고리 선택 시 콜백 |

## 외부 스킨에서 받는 데이터

### 확장 데이터 구조
```javascript
const QuickMenuWithProductsSkin = (props) => {
  const {
    data: {
      // 기본 QuickMenu 데이터
      displayItems,           // 카테고리 목록
      topCategories,          // 최상위 카테고리
      loading,                // 카테고리 로딩 상태
      error,                  // 에러 메시지
      
      // 🎯 확장 데이터 (enableProductDisplay가 true일 때만)
      selectedCategoryId,     // 현재 선택된 카테고리 ID
      products,               // 선택된 카테고리의 상품 배열
      productsLoading,        // 상품 로딩 상태
      productsTotalCount      // 상품 총 개수
    },
    actions: {
      handleItemClick         // 카테고리 클릭 핸들러
    },
    componentData             // 컴포넌트 설정
  } = props;
};
```

### 상품 데이터 구조
```javascript
// products 배열의 각 상품 객체
{
  id: number,
  name: string,
  price: number,              // 원가
  newPrice: number,           // 판매가 (할인 적용)
  thumbnail: string,          // 상품 이미지 URL
  stockCount: number,         // 재고 수량
  hasDiscount: boolean,       // 할인 여부
  discountRate: number,       // 할인율 (%)
  description: string,        // 상품 설명
  categoryId: number,         // 카테고리 ID
  // ... 기타 상품 정보
}
```

## 구현 예제

### 기본 구현
```jsx
const QuickMenuWithProductsSkin = (props) => {
  const {
    data: { 
      displayItems, 
      products, 
      selectedCategoryId, 
      productsLoading 
    },
    actions: { handleItemClick },
    componentData
  } = props;
  
  const { componentProps = {} } = componentData;
  const { 
    productsPerRow = 4, 
    showProductPrice = true,
    enableProductDisplay = false 
  } = componentProps;
  
  // enableProductDisplay가 false면 다른 스킨으로 폴백
  if (!enableProductDisplay) {
    return <BasicQuickMenuSkin {...props} />;
  }
  
  return (
    <div className="quick-menu-with-products">
      {/* 카테고리 메뉴 */}
      <div className="category-menu">
        {displayItems.map((item) => (
          <div
            key={item.id}
            className={`category-item ${
              selectedCategoryId === item.categoryId ? 'active' : ''
            }`}
            onClick={() => handleItemClick(item)}
          >
            {item.imageUrl ? (
              <img src={item.imageUrl} alt={item.categoryName} />
            ) : (
              <div className="category-placeholder">
                {item.id === 'all-category' ? 'ALL' : item.categoryName[0]}
              </div>
            )}
            <span>{item.categoryName}</span>
          </div>
        ))}
      </div>
      
      {/* 상품 리스트 */}
      <div className="product-list">
        {productsLoading ? (
          <div className="loading">상품을 불러오는 중...</div>
        ) : products && products.length > 0 ? (
          <div 
            className="products-grid"
            style={{ 
              display: 'grid', 
              gridTemplateColumns: `repeat(${productsPerRow}, 1fr)`,
              gap: '20px'
            }}
          >
            {products.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                showPrice={showProductPrice}
              />
            ))}
          </div>
        ) : selectedCategoryId ? (
          <div className="no-products">
            선택한 카테고리에 상품이 없습니다.
          </div>
        ) : (
          <div className="select-category">
            카테고리를 선택해주세요.
          </div>
        )}
      </div>
    </div>
  );
};

// 상품 카드 컴포넌트
const ProductCard = ({ product, showPrice }) => (
  <div className="product-card">
    <div className="product-image">
      <img src={product.thumbnail} alt={product.name} loading="lazy" />
      {product.hasDiscount && (
        <span className="discount-badge">
          -{product.discountRate}%
        </span>
      )}
    </div>
    <h3 className="product-name">{product.name}</h3>
    {showPrice && (
      <div className="product-price">
        {product.hasDiscount && (
          <span className="original-price">
            {product.price.toLocaleString()}원
          </span>
        )}
        <span className="current-price">
          {product.newPrice.toLocaleString()}원
        </span>
      </div>
    )}
    <div className="product-stock">
      재고: {product.stockCount}개
    </div>
  </div>
);
```

### 고급 구현 (애니메이션 및 필터링)
```jsx
const AdvancedQuickMenuSkin = (props) => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [sortBy, setSortBy] = useState('default');
  
  const {
    data: { 
      displayItems, 
      products, 
      selectedCategoryId, 
      productsLoading 
    },
    actions: { handleItemClick }
  } = props;
  
  // 카테고리 변경 시 애니메이션
  const handleCategoryChange = (item) => {
    setIsTransitioning(true);
    setTimeout(() => {
      handleItemClick(item);
      setTimeout(() => setIsTransitioning(false), 100);
    }, 300);
  };
  
  // 상품 정렬
  const sortedProducts = useMemo(() => {
    if (!products) return [];
    
    const sorted = [...products];
    switch (sortBy) {
      case 'price-low':
        return sorted.sort((a, b) => a.newPrice - b.newPrice);
      case 'price-high':
        return sorted.sort((a, b) => b.newPrice - a.newPrice);
      case 'discount':
        return sorted.sort((a, b) => b.discountRate - a.discountRate);
      default:
        return sorted;
    }
  }, [products, sortBy]);
  
  return (
    <div className="advanced-quick-menu">
      {/* 카테고리 탭 */}
      <div className="category-tabs">
        {displayItems.map((item) => (
          <button
            key={item.id}
            className={`tab ${
              selectedCategoryId === item.categoryId ? 'active' : ''
            }`}
            onClick={() => handleCategoryChange(item)}
          >
            {item.categoryName}
          </button>
        ))}
      </div>
      
      {/* 정렬 옵션 */}
      {selectedCategoryId && products?.length > 0 && (
        <div className="sort-options">
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="default">기본 정렬</option>
            <option value="price-low">가격 낮은순</option>
            <option value="price-high">가격 높은순</option>
            <option value="discount">할인율순</option>
          </select>
        </div>
      )}
      
      {/* 상품 영역 */}
      <div className={`products-container ${
        isTransitioning ? 'transitioning' : ''
      }`}>
        {productsLoading ? (
          <SkeletonLoader count={8} />
        ) : (
          <div className="products-masonry">
            {sortedProducts.map((product, index) => (
              <div 
                key={product.id} 
                className="product-card animated"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
```

## API 호출 및 동작 흐름

### Redux 액션: fetchProducts

확장 기능은 기존 Redux의 `fetchProducts` 액션을 사용하여 상품을 로드합니다:

```javascript
// 카테고리별 상품 로드
dispatch(fetchProducts({ 
  category_id: selectedCategoryId,  // 선택된 카테고리 ID
  per_page: maxProductsToShow      // 최대 상품 수 (기본값: 20)
}));

// 전체 상품 로드 (categoryId가 -1인 경우)
dispatch(fetchProducts({ 
  per_page: maxProductsToShow 
}));
```

#### fetchProducts 파라미터

| 파라미터 | 타입 | 설명 |
|---------|------|------|
| category_id | number | 특정 카테고리의 상품만 조회 |
| per_page | number | 페이지당 상품 수 (기본값: 20) |
| page | number | 페이지 번호 (기본값: 1) |
| include_product_ids | number[] | 포함할 상품 ID 목록 |
| exclude_product_ids | number[] | 제외할 상품 ID 목록 |

### 동작 흐름

#### 1. 초기 로드
```
1. 컴포넌트 마운트
2. enableProductDisplay 플래그 체크
3. initialCategoryId가 설정되어 있으면:
   - setSelectedCategoryId(initialCategoryId)
   - fetchProducts({ category_id: initialCategoryId, per_page: maxProductsToShow })
4. 카테고리 메뉴 표시
```

#### 2. 카테고리 선택
```
1. 사용자가 카테고리 아이템 클릭
2. handleItemClick(item) 호출
3. enableProductDisplay가 true인 경우:
   - setSelectedCategoryId(item.categoryId) 상태 업데이트
   - dispatch(fetchProducts({ category_id: item.categoryId, per_page: maxProductsToShow }))
   - productsLoading 상태가 true로 변경
   - API 응답 후 products 배열 업데이트
4. 외부 스킨에서 새로운 products 데이터 수신 및 표시
```

#### 3. 전체 카테고리 선택
```
1. categoryId: -1인 "전체" 카테고리 클릭
2. setSelectedCategoryId(-1)
3. dispatch(fetchProducts({ per_page: maxProductsToShow })) - category_id 없이 호출
4. 모든 카테고리의 상품 로드
```

#### 4. Redux 상태 흐름
```
Redux Store
├── selectedCategoryId: number | null     (현재 선택된 카테고리)
├── products: Product[]                   (로드된 상품 목록)
├── productsLoading: boolean              (상품 로딩 상태)
├── productsTotalCount: number            (상품 총 개수)
└── productsError: string | null          (에러 메시지)
```

## 스타일링 가이드

### 추천 CSS 구조
```css
/* 컨테이너 */
.quick-menu-with-products {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

/* 카테고리 영역 */
.category-menu {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
  gap: 15px;
}

.category-item {
  cursor: pointer;
  text-align: center;
  transition: transform 0.3s;
}

.category-item.active {
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* 상품 영역 */
.products-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.product-card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.3s;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

/* 애니메이션 */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.product-card.animated {
  animation: fadeInUp 0.5s ease-out forwards;
}

/* 반응형 */
@media (max-width: 768px) {
  .products-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .products-grid {
    grid-template-columns: 1fr;
  }
}
```

## 성능 최적화

### 1. 이미지 최적화
```jsx
<img 
  src={product.thumbnail} 
  loading="lazy"
  alt={product.name}
  onError={(e) => {
    e.target.src = '/placeholder.jpg';
  }}
/>
```

### 2. 메모이제이션
```jsx
const MemoizedProductCard = React.memo(ProductCard, (prev, next) => {
  return prev.product.id === next.product.id && 
         prev.showPrice === next.showPrice;
});
```

### 3. 가상 스크롤 (많은 상품)
```jsx
import { FixedSizeGrid } from 'react-window';

const VirtualProductGrid = ({ products }) => (
  <FixedSizeGrid
    columnCount={4}
    columnWidth={250}
    height={600}
    rowCount={Math.ceil(products.length / 4)}
    rowHeight={350}
    width={1040}
  >
    {({ columnIndex, rowIndex, style }) => {
      const index = rowIndex * 4 + columnIndex;
      const product = products[index];
      if (!product) return null;
      
      return (
        <div style={style}>
          <ProductCard product={product} />
        </div>
      );
    }}
  </FixedSizeGrid>
);
```

## 주의사항

### ⚠️ 필수 확인 사항
1. **enableProductDisplay 설정**: 반드시 `true`로 설정해야 확장 기능 활성화
2. **외부 스킨 호환성**: 스킨이 확장 데이터를 처리할 수 있어야 함
3. **API 응답 시간**: 상품이 많을 경우 로딩 UI 필수
4. **메모리 관리**: 대량의 상품 표시 시 가상 스크롤 고려

### 🚫 하지 말아야 할 것
- enableProductDisplay 없이 products 데이터 접근 시도
- 카테고리 ID 하드코딩
- 로딩 상태 무시
- 에러 처리 생략

## 문제 해결

### 상품이 표시되지 않는 경우
```javascript
// 체크리스트
1. console.log(componentProps.enableProductDisplay); // true여야 함
2. console.log(data.products); // 배열이어야 함
3. console.log(data.productsLoading); // 로딩 상태 확인
4. console.log(data.selectedCategoryId); // 선택된 카테고리 확인
```

### 카테고리 클릭 시 페이지 이동
```javascript
// enableProductDisplay가 false인 경우 발생
// 해결: componentProps에서 enableProductDisplay: true 설정
```

### API 호출 에러
```javascript
// 네트워크 탭에서 /api/products/list 요청 확인
// 401: 인증 문제
// 404: API 엔드포인트 문제
// 500: 서버 에러
```

## 테스트 체크리스트

- [ ] enableProductDisplay: true 설정
- [ ] 카테고리 클릭 시 상품 로드 확인
- [ ] 전체 카테고리 선택 시 모든 상품 표시
- [ ] 로딩 상태 UI 표시
- [ ] 빈 카테고리 처리
- [ ] 반응형 레이아웃 확인
- [ ] 이미지 로딩 에러 처리
- [ ] 초기 카테고리 자동 선택 (initialCategoryId)

## QuickMenu categoryItems 설정

QuickMenu에서 표시할 카테고리는 `categoryItems` 배열에서 정의됩니다. 각 아이템은 실제 API의 카테고리 데이터와 연결됩니다.

### categoryItems 구조
```javascript
categoryItems: [
  {
    id: 'unique-item-id',           // 고유 아이템 ID
    categoryId: 5,                  // 실제 카테고리 ID (API와 매칭)
    categoryName: '전자제품',        // 표시될 카테고리 이름
    imageUrl: '/images/electronics.jpg', // 카테고리 이미지 (선택사항)
    routingPath: '/electronics',    // 기본 모드에서 사용될 라우팅 경로
    visible: true                   // 표시 여부
  }
]
```

### 중요 사항
- **categoryId**: 반드시 실제 API의 카테고리 ID와 일치해야 함
- **visible**: false로 설정하면 해당 카테고리 숨김
- **imageUrl**: 없으면 기본 플레이스홀더 표시
- **routingPath**: enableProductDisplay가 false일 때 사용

### API 카테고리와의 연결
QuickMenu는 다음 순서로 카테고리 데이터를 가져옵니다:
1. Redux에서 `fetchProductCategories()` 호출
2. 최상위 카테고리만 필터링 (parentId가 null)
3. `categoryItems`의 `categoryId`와 매칭하여 실제 카테고리 데이터 연결
4. 매칭되지 않는 아이템은 표시하지 않음

## 관련 파일
- `/src/components/module/QuickMenu/QuickMenuLogic.ts` - 확장 기능 로직 구현
- `/src/components/module/QuickMenu/QuickMenu.types.ts` - 확장된 타입 정의
- `/src/redux/WithcookieSlice.ts` - fetchProducts 액션 및 상품 상태 관리