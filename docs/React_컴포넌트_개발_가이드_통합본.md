# React 컴포넌트 개발 가이드

## 프로젝트 개요

### 시스템 소개

이 프로젝트는 **동적 컴포넌트 시스템**을 위한 React 컴포넌트를 개발하는 것입니다. 이 시스템은 다음과 같은 특징을 가집니다:

1. **컴포넌트 기반 아키텍처**: 각 UI 요소(배너, 상품 목록, 장바구니 등)가 독립적인 컴포넌트로 구성
2. **동적 로딩**: 컴포넌트가 런타임에 동적으로 로드되어 사용됨
3. **스킨 시스템**: 하나의 컴포넌트가 여러 디자인 변형(스킨)을 가질 수 있음
4. **모드 구분**: 편집 모드(editor)와 실제 사용 모드(preview)로 구분 동작

### 개발 목표


- **독립적인 번들**: 각 컴포넌트는 단일 JS/CSS 파일로 빌드
- **표준 인터페이스**: 모든 컴포넌트는 동일한 Props 구조를 따름
- **액션 기반 상호작용**: 모든 사용자 상호작용은 actions를 통해 처리
- **반응형 디자인**: PC, 태블릿, 모바일 환경 지원

### 작동 방식

```
[시스템] → [컴포넌트 로드] → [Props 전달] → [스킨 렌더링]
                                    ↓
                              - data: 표시할 데이터
                              - actions: 이벤트 핸들러
                              - mode: 현재 모드
                              - utils: 유틸리티 함수
```

예를 들어, 상품 목록 컴포넌트는:
1. 시스템에서 상품 데이터를 `data`로 전달받음
2. 사용자가 "장바구니 추가" 버튼을 클릭하면 `actions.handleAddToCart()` 호출
3. 편집 모드일 때는 추가 UI 요소 표시
4. 모바일에서는 다른 레이아웃으로 표시

이 가이드는 이러한 시스템에서 작동하는 컴포넌트를 올바르게 개발하는 방법을 설명합니다.

## 핵심 요구사항

### 빌드 결과물
- **단일 JavaScript 파일** (UMD 형식)
- **단일 CSS 파일**
- **외부 의존성 제외** (React, ReactDOM은 런타임에 제공됨)
- **다른 라이브러리는 번들에 포함** (예: Swiper, Lodash 등)

### 기술 스택
- React 18+
- TypeScript
- Webpack 5
- CSS (BEM 방식 권장)

### 개발 시 고려사항

1. **컴포넌트는 완전히 독립적**이어야 함
   - 외부 API 직접 호출 금지
   - 라우팅 직접 처리 금지
   - 전역 상태 직접 접근 금지

2. **모든 상호작용은 시스템을 통해**
   - 데이터는 `data` prop으로 받음
   - 이벤트는 `actions`를 통해 전달
   - 유틸리티는 `utils`를 사용

3. **다양한 환경 대응**
   - 편집 모드와 실제 사용 모드 구분
   - PC, 태블릿, 모바일 반응형 디자인
   - 다국어 지원 고려

## 컴포넌트 개발 규칙

### 1. 템플릿 프리픽스 규칙

각 템플릿은 고유한 프리픽스를 사용해야 합니다:
- 템플릿명이 `abc`인 경우: 모든 클래스명은 `abc-`로 시작
- 예시: `abc-banner`, `abc-banner__title`, `abc-banner__button`

### 2. 표준 Props 인터페이스

모든 컴포넌트는 다음 인터페이스를 준수해야 합니다:

```typescript
interface ComponentSkinProps {
  data: {
    // 컴포넌트별 데이터
    [key: string]: any;
    // 공통 속성
    componentProps?: Record<string, any>;
    viewMode?: 'pc' | 'mobile' | 'tablet';
  };
  actions: Record<string, Function>;
  options: Record<string, any>;
  mode: 'editor' | 'preview'; // editor: 편집모드, preview: 미리보기 및 실제 사용 모드
  utils: {
    showError?: (message: string) => void;
    showSuccess?: (message: string) => void;
    [key: string]: any;
  };
  app: {
    theme?: 'light' | 'dark';
    [key: string]: any;
  };
  editor?: Record<string, any>;
}
```

### 3. 컴포넌트 구현 예시

**템플릿명이 `abc`인 경우의 예시:**

```typescript
// AbcBanner.tsx
import React from 'react';
import './AbcBanner.css';

const AbcBanner: React.FC<ComponentSkinProps> = ({ 
  data, 
  actions, 
  mode,
  utils 
}) => {
  // data에서 필요한 값 추출 (기본값 포함)
  const { 
    title = '제목을 입력하세요',
    subtitle = '',
    backgroundImage = '',
    backgroundColor = '#f8f9fa',
    textColor = '#333',
    buttonText = '자세히 보기',
    buttonLink = '#',
    alignment = 'center',
    height = '400px'
  } = data;

  // 버튼 클릭 핸들러
  const handleButtonClick = () => {
    // 항상 actions를 통해 이벤트 전달
    if (actions.onButtonClick) {
      actions.onButtonClick(buttonLink);
    }
  };

  // 배너 클릭 핸들러
  const handleBannerClick = () => {
    if (actions.onClick) {
      actions.onClick();
    }
  };

  // 에디터 모드 확인
  const isEditorMode = mode === 'editor';

  // 반응형 뷰 처리
  const viewClass = data.viewMode ? `banner--${data.viewMode}` : '';

  return (
    <div 
      className={`abc-banner ${viewClass} abc-banner--${alignment}`}
      style={{
        backgroundColor: backgroundImage ? 'transparent' : backgroundColor,
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
        color: textColor,
        height: height
      }}
      onClick={handleBannerClick}
    >
      <div className="abc-banner__content">
        {title && <h2 className="abc-banner__title">{title}</h2>}
        {subtitle && <p className="abc-banner__subtitle">{subtitle}</p>}
        {buttonText && (
          <button 
            className="abc-banner__button"
            onClick={(e) => {
              e.stopPropagation();
              handleButtonClick();
            }}
          >
            {buttonText}
          </button>
        )}
      </div>
      
      {isEditorMode && (
        <div className="abc-banner__editor-overlay">
          편집 모드
        </div>
      )}
    </div>
  );
};

export default AbcBanner;
```

### 4. CSS 작성 규칙

```css
/* AbcBanner.css */

/* 컴포넌트 루트 - 템플릿 프리픽스 사용 */
.abc-banner {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  transition: all 0.3s ease;
  cursor: pointer;
}

/* BEM 방식으로 하위 요소 정의 */
.abc-banner__content {
  text-align: center;
  padding: 40px 20px;
  max-width: 800px;
  width: 100%;
}

.abc-banner__title {
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
  line-height: 1.2;
}

.abc-banner__subtitle {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  opacity: 0.9;
}

.abc-banner__button {
  padding: 12px 30px;
  font-size: 1rem;
  font-weight: 500;
  border: none;
  border-radius: 4px;
  background-color: #007bff;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.abc-banner__button:hover {
  background-color: #0056b3;
}

/* 정렬 변형 */
.abc-banner--left .abc-banner__content {
  text-align: left;
  margin-left: 0;
  margin-right: auto;
}

.abc-banner--right .abc-banner__content {
  text-align: right;
  margin-left: auto;
  margin-right: 0;
}

/* 반응형 디자인 */
.abc-banner--mobile {
  min-height: 250px;
}

.abc-banner--mobile .abc-banner__title {
  font-size: 1.8rem;
}

.abc-banner--mobile .abc-banner__subtitle {
  font-size: 1rem;
}

.abc-banner--tablet {
  min-height: 350px;
}

/* 에디터 모드 오버레이 */
.abc-banner__editor-overlay {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 5px 10px;
  font-size: 12px;
  border-radius: 4px;
}

/* 미디어 쿼리 */
@media (max-width: 768px) {
  .abc-banner__title {
    font-size: 2rem;
  }
  
  .abc-banner__subtitle {
    font-size: 1rem;
  }
  
  .abc-banner__content {
    padding: 30px 15px;
  }
}
```

### 4. 이벤트 처리 규칙

모든 사용자 상호작용은 `actions` prop을 통해 처리:

```typescript
// ✅ 올바른 예시
const handleSubmit = (formData: any) => {
  if (actions.onSubmit) {
    actions.onSubmit(formData);
  }
};

const handleChange = (value: string) => {
  if (actions.onChange) {
    actions.onChange(value);
  }
};

// ❌ 잘못된 예시
const handleSubmit = async (formData: any) => {
  // 직접 API 호출 금지
  await fetch('/api/submit', { ... });
  
  // 직접 라우팅 금지
  window.location.href = '/success';
};
```

### 5. 상태 관리

```typescript
const MyFormComponent: React.FC<ComponentSkinProps> = ({ data, actions }) => {
  // 내부 상태는 useState 사용
  const [formData, setFormData] = useState({
    name: data.initialName || '',
    email: data.initialEmail || ''
  });

  // data prop 변경 시 상태 업데이트
  useEffect(() => {
    if (data.resetForm) {
      setFormData({
        name: '',
        email: ''
      });
    }
  }, [data.resetForm]);

  // 변경사항을 외부에 알림
  const handleInputChange = (field: string, value: string) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    
    if (actions.onFormChange) {
      actions.onFormChange(newData);
    }
  };

  return (
    // 폼 UI
  );
};
```

## 프로젝트 설정

### 1. 디렉토리 구조

```
my-component/
├── src/
│   ├── components/
│   │   ├── BannerComponent.tsx
│   │   ├── BannerComponent.css
│   │   └── index.ts
│   ├── types.ts            # 공통 타입 정의
│   └── index.ts            # 메인 엔트리
├── webpack.config.js
├── tsconfig.json
├── package.json
└── README.md
```

### 2. package.json

```json
{
  "name": "custom-banner-component",
  "version": "1.0.0",
  "main": "dist/component.js",
  "scripts": {
    "build": "webpack --mode production",
    "dev": "webpack --mode development --watch",
    "clean": "rm -rf dist"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "css-loader": "^6.8.1",
    "mini-css-extract-plugin": "^2.7.6",
    "ts-loader": "^9.4.4",
    "typescript": "^5.1.6",
    "webpack": "^5.88.2",
    "webpack-cli": "^5.1.4"
  },
  "peerDependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0"
  }
}
```

### 3. webpack.config.js

```javascript
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: './src/index.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'component.js',
    library: 'CustomComponent',
    libraryTarget: 'umd',
    globalObject: 'this',
    clean: true
  },
  externals: {
    // React와 ReactDOM만 제외
    react: {
      commonjs: 'react',
      commonjs2: 'react',
      amd: 'React',
      root: 'React'
    },
    'react-dom': {
      commonjs: 'react-dom',
      commonjs2: 'react-dom',
      amd: 'ReactDOM',
      root: 'ReactDOM'
    }
    // 다른 라이브러리(Swiper, Lodash 등)는 여기에 추가하지 않음
    // 번들에 포함되도록 함
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/,
        type: 'asset/inline'
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        type: 'asset/inline'
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.css']
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'component.css'
    })
  ]
};
```

### 4. tsconfig.json

```json
{
  "compilerOptions": {
    "target": "es5",
    "module": "commonjs",
    "lib": ["es2015", "dom"],
    "jsx": "react",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "declaration": true,
    "declarationDir": "./dist",
    "outDir": "./dist",
    "moduleResolution": "node",
    "resolveJsonModule": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### 5. 엔트리 포인트 (src/index.ts)

```typescript
// 단일 컴포넌트 export
import BannerComponent from './components/BannerComponent';
export default AbcBanner;

// 또는 여러 컴포넌트 export
import BannerComponent from './components/BannerComponent';
import CardComponent from './components/CardComponent';

export {
  BannerComponent,
  CardComponent
};
```

## 고급 패턴

### 1. 외부 라이브러리 사용 예시 (슬라이더)

```typescript
// ProductSlider.tsx
import React from 'react';
// Swiper를 번들에 포함
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './ProductSlider.css';

const ProductSlider: React.FC<ComponentSkinProps> = ({ data, actions }) => {
  const { products = [], slidesPerView = 3, autoplay = false } = data;

  return (
    <div className="abc-product-slider">
      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={20}
        slidesPerView={slidesPerView}
        navigation
        pagination={{ clickable: true }}
        autoplay={autoplay ? { delay: 3000 } : false}
        breakpoints={{
          640: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: slidesPerView }
        }}
      >
        {products.map((product, index) => (
          <SwiperSlide key={index}>
            <div 
              className="abc-product-slider__item"
              onClick={() => actions.onProductClick?.(product)}
            >
              <img src={product.image} alt={product.name} />
              <h3>{product.name}</h3>
              <p>{product.price}</p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ProductSlider;
```

### 2. 비동기 데이터 로딩

```typescript
const ProductListComponent: React.FC<ComponentSkinProps> = ({ 
  data, 
  actions, 
  utils 
}) => {
  const [products, setProducts] = useState(data.products || []);
  const [loading, setLoading] = useState(false);

  const loadProducts = async () => {
    setLoading(true);
    
    // actions를 통해 데이터 요청
    if (actions.loadProducts) {
      try {
        const result = await actions.loadProducts();
        setProducts(result);
      } catch (error) {
        if (utils.showError) {
          utils.showError('상품을 불러올 수 없습니다.');
        }
      }
    }
    
    setLoading(false);
  };

  useEffect(() => {
    if (data.autoLoad) {
      loadProducts();
    }
  }, [data.autoLoad]);

  return (
    <div className="product-list">
      {loading ? (
        <div className="product-list__loading">로딩중...</div>
      ) : (
        products.map(product => (
          <div key={product.id} className="product-list__item">
            {/* 상품 렌더링 */}
          </div>
        ))
      )}
    </div>
  );
};
```




## 개발 시 주의사항

### 필수 준수 사항

1. **모든 사용자 상호작용은 `actions`를 통해 처리**
   - 직접 API 호출 금지
   - 직접 라우팅 금지
   - 전역 상태 직접 수정 금지

2. **CSS 네임스페이스 사용**
   - **템플릿명을 프리픽스로 사용**: 예) `abc-banner`, `abc-card`
   - BEM 방식 권장: `[prefix]-[block]__[element]--[modifier]`
   - 전역 스타일 금지

3. **외부 라이브러리 사용 규칙**
   - 필요한 경우 외부 라이브러리 사용 가능
   - **반드시 번들에 포함**: 예) Swiper, Slick 등의 슬라이더 라이브러리
   - React, ReactDOM만 externals로 제외
   - 다른 라이브러리는 webpack 설정에서 제외하지 말고 번들에 포함
   - 최소한으로 사용하고 경량 라이브러리 선택

4. **에러 처리**
   - try-catch로 에러 포착
   - utils.showError로 사용자에게 알림
   - 에러 시에도 UI가 깨지지 않도록 처리

5. **타입 안전성**
   - TypeScript 사용
   - any 타입 최소화
   - 명확한 타입 정의

### 성능 최적화

```typescript
// 메모이제이션 활용
const ExpensiveComponent: React.FC<ComponentSkinProps> = ({ data }) => {
  const processedData = useMemo(() => {
    return data.items?.map(item => ({
      ...item,
      processed: true
    }));
  }, [data.items]);

  const handleClick = useCallback((id: string) => {
    if (actions.onItemClick) {
      actions.onItemClick(id);
    }
  }, [actions.onItemClick]);

  return (
    // UI 렌더링
  );
};
```

## 테스트 방법

개발 중 테스트를 위한 래퍼 컴포넌트:

```typescript
// test/TestApp.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import MyComponent from '../src/components/MyComponent';

const TestApp = () => {
  const mockProps: ComponentSkinProps = {
    data: {
      title: '테스트 제목',
      content: '테스트 내용',
      viewMode: 'pc'
    },
    actions: {
      onClick: () => console.log('Clicked!'),
      onSubmit: (data) => console.log('Submitted:', data)
    },
    options: {},
    mode: 'preview',
    utils: {
      showError: (msg) => alert(`Error: ${msg}`),
      showSuccess: (msg) => alert(`Success: ${msg}`)
    },
    app: {
      theme: 'light'
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>컴포넌트 테스트</h1>
      <MyComponent {...mockProps} />
    </div>
  );
};

// 렌더링
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(<TestApp />);
```

## 최종 체크리스트

제출 전 확인사항:

- [ ] **빌드 결과물**
  - [ ] dist/component.js 파일 생성
  - [ ] dist/component.css 파일 생성
  - [ ] 두 파일이 정상적으로 생성됨
  - [ ] 외부 라이브러리가 번들에 포함됨 (사용한 경우)

- [ ] **코드 품질**
  - [ ] TypeScript 컴파일 에러 없음
  - [ ] ESLint 경고 없음
  - [ ] 콘솔 에러 없음

- [ ] **인터페이스 준수**
  - [ ] ComponentSkinProps 타입 사용
  - [ ] 모든 이벤트가 actions를 통해 처리
  - [ ] CSS 클래스명이 템플릿 프리픽스 사용
  - [ ] 외부 라이브러리가 externals에 없음 (React/ReactDOM 제외)

- [ ] **기능 테스트**
  - [ ] PC/모바일/태블릿 뷰 대응
  - [ ] 에디터/프리뷰 모드 구분
  - [ ] 에러 처리 정상 작동



## 제출물 구조

```
component-deliverable/
├── dist/
│   ├── component.js      # UMD 번들
│   ├── component.css     # 스타일시트
│   └── component.d.ts    # 타입 정의 (선택)
├── src/                  # 소스 코드
├── examples/             # 사용 예시
├── README.md             # 사용 설명서
└── package.json          # 프로젝트 정보
```

## 컴포넌트별 액션 레퍼런스

이 섹션은 각 컴포넌트에서 사용 가능한 액션들을 설명합니다. 외주 개발자는 이를 참고하여 적절한 액션을 구현할 수 있습니다.

### 1. 게시판 (Board) 컴포넌트

게시판 관련 모든 기능을 처리하는 액션들:

```typescript
// 네비게이션 액션
actions.navigateToList() // 게시판 목록으로 이동
actions.navigateToDetail(postId: number) // 특정 게시글로 이동
actions.navigateToNew(boardCode?: string) // 새 글 작성 페이지로 이동

// 게시글 관련 액션
actions.handleSavePost() // 게시글 저장/생성/수정
actions.handleDeletePost() // 게시글 삭제
actions.handleInputChange(e: React.ChangeEvent) // 폼 입력 처리
actions.handleEditorChange(content: string) // 에디터 내용 변경

// 댓글 관련 액션
actions.handleCommentSubmit() // 댓글 작성
actions.handleUpdateComment() // 댓글 수정
actions.handleDeleteComment(commentId: number) // 댓글 삭제

// 페이지네이션
actions.handlePageChange(page: number) // 게시글 페이지 변경
actions.handleCommentPageChange(page: number) // 댓글 페이지 변경
```

### 2. 장바구니 (Cart) 컴포넌트

장바구니 기능을 처리하는 액션들:

```typescript
// 수량 관리
actions.handleIncreaseQuantity(item: any) // 수량 증가
actions.handleDecreaseQuantity(item: any) // 수량 감소

// 장바구니 관리
actions.handleRemoveFromCart(cartItemId: number) // 특정 상품 삭제
actions.handleClearCart() // 장바구니 비우기
actions.handleCheckout() // 결제 페이지로 이동

// 가격 계산
actions.calculateTotalPrice() // 총 상품 가격 계산
actions.calculateGrandTotal() // 배송비 포함 최종 가격 계산
```

### 3. 카테고리 메뉴 (CategoryMenu) 컴포넌트

카테고리 네비게이션 액션들:

```typescript
actions.handleMenuItemClick(item: CategoryMenuItem) // 카테고리 선택
actions.toggleExpanded() // 드롭다운 메뉴 토글
actions.handleBackToRoot() // 전체 카테고리로 돌아가기
```

### 4. 로그인 (Login) 컴포넌트

로그인 폼 관련 액션들:

```typescript
actions.handleChange(e: React.ChangeEvent<HTMLInputElement>) // 입력 필드 변경
actions.handleSubmit(e: React.FormEvent) // 로그인 폼 제출
actions.handleSignupClick() // 회원가입 페이지로 이동
```

### 5. 메인 배너 (MainBanner) 컴포넌트

배너 슬라이드 관련 액션들:

```typescript
// 슬라이드 네비게이션
actions.goToNext() // 다음 배너로
actions.goToPrev() // 이전 배너로
actions.goToSlide(index: number) // 특정 배너로 이동

// 이벤트 핸들러
actions.onBannerClick(banner: BannerItem) // 배너 클릭
actions.onMouseEnter() // 마우스 호버 (자동재생 일시정지)
actions.onMouseLeave() // 마우스 떠남 (자동재생 재개)

// 터치 이벤트 (모바일)
actions.onTouchStart(e: React.TouchEvent) // 터치 시작
actions.onTouchMove(e: React.TouchEvent) // 터치 이동
actions.onTouchEnd() // 터치 종료

// 비디오 관련 (비디오 배너인 경우)
actions.onVideoClick() // 비디오 재생/일시정지
actions.onVideoEnded() // 비디오 종료 시
actions.onVideoError(error: any) // 비디오 에러 처리
```

### 6. 주문 내역 (OrderHistory) 컴포넌트

주문 관리 관련 액션들:

```typescript
// 필터링 및 검색
actions.setSearchQuery(query: string) // 주문 검색
actions.setSelectedStatus(status: string) // 상태별 필터링
actions.setSelectedDateRange(range: string) // 날짜별 필터링

// 주문 관련 작업
actions.handleViewDetail(order: any) // 주문 상세 보기
actions.handleCancelOrder(orderId: number) // 주문 취소
actions.handleTrackShipment(trackingNumber: string) // 배송 추적
actions.handleAddToCartAgain(order: any) // 재주문

// 모달 관리
actions.openReviewModal(product: any, order: any) // 리뷰 작성 모달
actions.openDeliveryModal(order: any) // 배송 추적 모달

// 페이지네이션
actions.handlePageChange(page: number) // 페이지 변경
```

### 7. 상품 상세 (ProductDetail) 컴포넌트

상품 상세 페이지 액션들:

```typescript
// 옵션 선택
actions.handleOptionChange(groupId: number, valueId: number) // 옵션 변경
actions.handleQuantityChange(quantity: number) // 수량 변경
actions.increaseQuantity() // 수량 1 증가
actions.decreaseQuantity() // 수량 1 감소

// 구매 액션
actions.handleAddToCart() // 장바구니에 추가
actions.handleBuyNow() // 바로 구매

// UI 관련
actions.handleTabChange(tab: string) // 탭 전환
actions.handleImageChange(image: string) // 이미지 변경
actions.setShowBottomSheet(show: boolean) // 모바일 바텀시트
```

### 8. 상품 목록 (ProductList) 컴포넌트

상품 목록 관련 액션들:

```typescript
// 필터링 및 정렬
actions.handleCategoryChange(categoryId: string | null) // 카테고리 필터
actions.handleSearch(query: string) // 상품 검색
actions.handleSortChange(sortBy: string, sortOrder: string) // 정렬 변경

// 상품 액션
actions.handleAddToCart(product: any) // 장바구니에 추가
actions.handleProductClick(product: any) // 상품 상세로 이동

// 페이지네이션
actions.handlePageChange(page: number) // 페이지 변경
actions.handleLoadMore() // 더 보기 (무한 스크롤)
```

### 9. 상품 슬라이더 (ProductSlider) 컴포넌트

상품 슬라이더 관련 액션들:

```typescript
// 슬라이더 컨트롤
actions.moveSlide(direction: 'next' | 'prev') // 슬라이드 이동

// 상품 액션
actions.handleAddToCart(product: any, e: React.MouseEvent) // 장바구니 추가
actions.handleProductClick(product: any) // 상품 상세로 이동

// 터치 이벤트 (모바일)
actions.handleTouchStart(e: React.TouchEvent) // 터치 시작
actions.handleTouchMove(e: React.TouchEvent) // 터치 이동
actions.handleTouchEnd() // 터치 종료

// 필터링 (에디터 모드)
actions.handleFilterOptionChange(optionName: string, value: string) // 필터 변경
```

### 액션 사용 예시

#### 예시 1: 상품 목록 컴포넌트

```typescript
const MyProductListComponent: React.FC<ComponentSkinProps> = ({ data, actions, mode }) => {
  // data에서 필요한 정보 추출
  const { products = [], currentCategory, sortBy } = data;

  return (
    <div className="template-product-list">
      {/* 카테고리 필터 */}
      <select onChange={(e) => actions.handleCategoryChange(e.target.value)}>
        <option value="">전체 카테고리</option>
        <option value="electronics">전자제품</option>
        <option value="clothing">의류</option>
      </select>

      {/* 상품 목록 */}
      <div className="template-product-list__grid">
        {products.map(product => (
          <div key={product.id} className="template-product-list__item">
            <img 
              src={product.image} 
              alt={product.name}
              onClick={() => actions.handleProductClick(product)}
            />
            <h3>{product.name}</h3>
            <p>{product.price}원</p>
            <button onClick={() => actions.handleAddToCart(product)}>
              장바구니 담기
            </button>
          </div>
        ))}
      </div>

      {/* 편집 모드에서만 표시 */}
      {mode === 'editor' && (
        <div className="template-product-list__editor-info">
          현재 {products.length}개 상품 표시 중
        </div>
      )}
    </div>
  );
};
```

#### 예시 2: 배너 컴포넌트

```typescript
const MyBannerComponent: React.FC<ComponentSkinProps> = ({ data, actions, utils }) => {
  const { banners = [], currentIndex = 0, autoplay = true } = data;
  const currentBanner = banners[currentIndex];

  if (!currentBanner) return null;

  return (
    <div className="template-banner">
      <div 
        className="template-banner__slide"
        onClick={() => actions.onBannerClick(currentBanner)}
      >
        <img src={currentBanner.image} alt={currentBanner.title} />
        <div className="template-banner__content">
          <h2>{currentBanner.title}</h2>
          <p>{currentBanner.description}</p>
        </div>
      </div>

      {/* 네비게이션 */}
      <button 
        className="template-banner__nav template-banner__nav--prev"
        onClick={actions.goToPrev}
      >
        이전
      </button>
      <button 
        className="template-banner__nav template-banner__nav--next"
        onClick={actions.goToNext}
      >
        다음
      </button>

      {/* 인디케이터 */}
      <div className="template-banner__indicators">
        {banners.map((_, index) => (
          <button
            key={index}
            className={index === currentIndex ? 'active' : ''}
            onClick={() => actions.goToSlide(index)}
          />
        ))}
      </div>
    </div>
  );
};
```

### 주의사항

1. **액션 존재 여부 확인**: 항상 액션이 존재하는지 확인 후 호출
   ```typescript
   if (actions.handleAddToCart) {
     actions.handleAddToCart(product);
   }
   ```

2. **이벤트 처리**: React 이벤트 객체를 그대로 전달하거나 필요한 값만 추출
   ```typescript
   // 전체 이벤트 전달
   onChange={actions.handleChange}
   
   // 값만 전달
   onChange={(e) => actions.handleSearch(e.target.value)}
   ```

3. **비동기 액션**: 일부 액션은 Promise를 반환할 수 있음
   ```typescript
   const handleSubmit = async () => {
     try {
       await actions.handleSavePost();
       // 성공 처리
     } catch (error) {
       // 에러 처리
     }
   };
   ```

## 예상 질문과 답변

**Q: 왜 모든 이벤트를 actions로 처리해야 하나요?**
A: 컴포넌트가 다양한 환경에서 재사용되기 때문에, 환경별로 다른 동작을 할 수 있도록 유연성을 제공하기 위함입니다.

**Q: CSS를 인라인 스타일로 작성하면 안 되나요?**
A: 스타일 커스터마이징과 성능 최적화를 위해 별도 CSS 파일로 분리합니다. 인라인 스타일은 동적 값에만 사용하세요.

**Q: 외부 UI 라이브러리(Material-UI 등)를 사용할 수 있나요?**
A: 번들 크기와 스타일 충돌 문제로 권장하지 않습니다. 필요한 경우 최소한의 라이브러리만 사용하세요.

**Q: 상태 관리 라이브러리(Redux 등)를 사용할 수 있나요?**
A: 컴포넌트 내부 상태는 React hooks로 충분합니다. 외부 상태 관리는 actions를 통해 처리하세요.

---

이 가이드를 따라 개발하시면, 다양한 환경에서 안정적으로 동작하는 재사용 가능한 React 컴포넌트를 만들 수 있습니다. 추가 질문이 있으시면 언제든 문의해주세요.