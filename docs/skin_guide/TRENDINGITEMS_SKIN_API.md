# 📦 TrendingItems 컴포넌트 스킨 API 문서

> TrendingItems 컴포넌트의 외부 스킨 개발을 위한 상세 API 명세서입니다.

## 📋 목차

1. [개요](#개요)
2. [ComponentSkinProps 구조](#componentskinprops-구조)
3. [data Props 목록](#data-props-목록)
4. [actions 목록](#actions-목록)
5. [타입 정의](#타입-정의)
6. [필수/선택 구분](#필수선택-구분)
7. [기본값](#기본값)
8. [예제 코드](#예제-코드)
9. [에지 케이스](#에지-케이스)
10. [마이그레이션 가이드](#마이그레이션-가이드)

---

## 🎯 개요

TrendingItems는 트렌딩 아이템들을 그리드 형태로 표시하는 컴포넌트로, 큐레이션된 콘텐츠나 추천 상품 등을 효과적으로 노출할 수 있습니다.

### 주요 기능
- 🖼️ 이미지 기반 아이템 그리드 표시
- 📱 반응형 그리드 레이아웃
- 🔗 개별 아이템 및 MORE 버튼 링크 지원
- 🎨 커스터마이징 가능한 버튼 스타일
- 🌐 다국어 번역 지원
- 📝 에디터 모드 대응
- ✨ 호버 효과 및 상호작용

---

## 📦 ComponentSkinProps 구조

외부 스킨이 받는 props의 전체 구조입니다:

```typescript
interface ComponentSkinProps {
   data: TrendingItemsData;      // 컴포넌트 상태 및 설정
   actions: TrendingItemsActions; // 이벤트 핸들러
   options: Record<string, any>; // 사용자 설정 옵션
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

### 기본 정보

| 속성명 | 타입 | 설명 |
|--------|------|------|
| `id` | `string` | 컴포넌트 고유 ID |
| `style` | `React.CSSProperties` | 컨테이너 스타일 |
| `className` | `string` | CSS 클래스명 (기본: 'trending-items-component') |
| `mode` | `'editor' \| 'preview' \| 'production'` | 렌더링 모드 |

### 콘텐츠 설정

| 속성명 | 타입 | 설명 | 기본값 |
|--------|------|------|--------|
| `title` | `string` | 메인 제목 | `'Trending now'` |
| `subtitle` | `string` | 부제목 | `'에디터가 선정한'` |
| `items` | `TrendingItem[]` | 트렌딩 아이템 배열 | 기본 샘플 아이템 3개 |

### 표시 설정

| 속성명 | 타입 | 설명 | 기본값 |
|--------|------|------|--------|
| `is_logged` | `boolean` | 로그인 사용자에게 표시 | `true` |
| `is_not_logged` | `boolean` | 비로그인 사용자에게 표시 | `true` |
| `imageRadius` | `string` | 이미지 둥글기 | `'4px'` |

### MORE 버튼 설정

| 속성명 | 타입 | 설명 | 기본값 |
|--------|------|------|--------|
| `showMoreButton` | `boolean` | MORE 버튼 표시 여부 | `true` |
| `moreButtonText` | `string` | MORE 버튼 텍스트 | `'MORE'` |
| `moreButtonUrl` | `string` | MORE 버튼 링크 URL | `'#'` |
| `moreButtonStyle` | `React.CSSProperties` | MORE 버튼 스타일 | 계산된 스타일 |
| `hasValidMoreUrl` | `boolean` | MORE 버튼 URL 유효성 | 자동 계산 |

### 상태값

| 속성명 | 타입 | 설명 |
|--------|------|------|
| `hoveredItemId` | `string \| number \| null` | 현재 호버된 아이템 ID |
| `isMoreButtonHovered` | `boolean` | MORE 버튼 호버 상태 |

### 유틸리티

| 속성명 | 타입 | 설명 |
|--------|------|------|
| `componentUniqueId` | `string` | 컴포넌트 고유 식별자 |

---

## 🎬 actions 목록

### 상호작용 액션

| 액션명 | 타입 | 설명 |
|--------|------|------|
| `handleItemClick` | `(item: TrendingItem, e: React.MouseEvent) => void` | 아이템 클릭 처리 |
| `handleMoreButtonClick` | `(e: React.MouseEvent) => void` | MORE 버튼 클릭 처리 |

### 호버 이벤트

| 액션명 | 타입 | 설명 |
|--------|------|------|
| `handleItemHover` | `(itemId: string \| number \| null) => void` | 아이템 호버 상태 변경 |
| `handleMoreButtonHover` | `(isHovered: boolean) => void` | MORE 버튼 호버 상태 변경 |

### 유틸리티 함수

| 액션명 | 타입 | 설명 |
|--------|------|------|
| `isValidUrl` | `(url: string \| undefined \| null) => boolean` | URL 유효성 검사 |
| `translate` | `(text: string) => string` | 번역 함수 |

---

## 📝 타입 정의

### TrendingItem 인터페이스

```typescript
interface TrendingItem {
  /** 아이템 ID */
  id: number | string;
  /** 이미지 URL */
  image: string;
  /** 아이템 제목 */
  title: string;
  /** 링크 URL */
  url: string;
}
```

### MORE 버튼 스타일 설정

```typescript
interface MoreButtonStyle {
  /** 텍스트 색상 */
  moreButtonTextColor?: string;
  /** 테두리 색상 */
  moreButtonBorderColor?: string;
  /** 배경 색상 */
  moreButtonBgColor?: string;
  /** 호버 텍스트 색상 */
  moreButtonHoverTextColor?: string;
  /** 호버 배경 색상 */
  moreButtonHoverBgColor?: string;
}
```

---

## ✅ 필수/선택 구분

### 필수 Props
모든 props는 선택사항이며, 기본값이 제공됩니다.

### 권장 Props
- `data.items`: 최소 1개 이상의 트렌딩 아이템
- `data.title`: 섹션 제목
- `data.subtitle`: 섹션 부제목

---

## 🔢 기본값

### TrendingItem 기본값
```typescript
{
  id: '',
  image: '',
  title: '',
  url: '#'
}
```

### 컴포넌트 설정 기본값
```typescript
{
  title: "Trending now",
  subtitle: "에디터가 선정한",
  is_logged: true,
  is_not_logged: true,
  imageRadius: "4px",
  showMoreButton: true,
  moreButtonText: "MORE",
  moreButtonUrl: "#",
  moreButtonTextColor: "#8a7a6d",
  moreButtonBorderColor: "#8a7a6d",
  moreButtonBgColor: "transparent",
  moreButtonHoverTextColor: "#ffffff",
  moreButtonHoverBgColor: "#8a7a6d",
  items: [
    {
      id: 1,
      image: "https://via.placeholder.com/400x400",
      title: "민감성 피부 스킨&케어",
      url: "#"
    },
    {
      id: 2,
      image: "https://via.placeholder.com/400x400",
      title: "수분 마스크팩 듀오 할인",
      url: "#"
    },
    {
      id: 3,
      image: "https://via.placeholder.com/400x400",
      title: "저자극 버블 클렌저 기획전",
      url: "#"
    }
  ]
}
```

---

## 💻 예제 코드

### 기본 그리드 스킨

```javascript
import React from 'react';

const CustomTrendingItemsSkin = ({ data, actions, utils, mode }) => {
  const { 
    id,
    style,
    className,
    title,
    subtitle,
    items,
    imageRadius,
    showMoreButton,
    moreButtonText,
    moreButtonStyle,
    hasValidMoreUrl,
    hoveredItemId
  } = data;

  const {
    handleItemClick,
    handleMoreButtonClick,
    handleItemHover,
    handleMoreButtonHover,
    isValidUrl,
    translate
  } = actions;

  // 아이템이 없는 경우 처리
  if (!items || items.length === 0) {
    return (
      <div id={id} className={className} style={style}>
        <div className="empty-state">
          <p>표시할 아이템이 없습니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div id={id} className={`trending-items-custom ${className}`} style={style}>
      {/* 헤더 영역 */}
      <div className="trending-header">
        <div className="trending-subtitle">{translate(subtitle)}</div>
        <h2 className="trending-title">{translate(title)}</h2>
      </div>

      {/* 아이템 그리드 */}
      <div className="trending-grid">
        {items.map((item, index) => {
          const hasValidUrl = isValidUrl(item.url);
          const isHovered = hoveredItemId === item.id;
          
          const itemContent = (
            <div className={`trending-item ${isHovered ? 'hovered' : ''}`}>
              <div 
                className="trending-image-wrapper"
                style={{ borderRadius: imageRadius }}
              >
                <img
                  src={item.image}
                  alt={translate(item.title)}
                  style={{ 
                    borderRadius: imageRadius,
                    objectFit: 'cover',
                    width: '100%',
                    aspectRatio: '1/1'
                  }}
                />
              </div>
              <div className="trending-content">
                <h3 className="trending-item-title">
                  {translate(item.title)}
                </h3>
              </div>
            </div>
          );

          return (
            <div 
              key={item.id || index}
              onMouseEnter={() => handleItemHover(item.id)}
              onMouseLeave={() => handleItemHover(null)}
            >
              {hasValidUrl ? (
                <a 
                  href={item.url}
                  className="trending-item-link"
                  onClick={(e) => handleItemClick(item, e)}
                >
                  {itemContent}
                </a>
              ) : (
                <div 
                  className="trending-item-link"
                  onClick={(e) => handleItemClick(item, e)}
                >
                  {itemContent}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* MORE 버튼 */}
      {showMoreButton && (
        <div className="trending-more-container">
          {hasValidMoreUrl ? (
            <a 
              href={data.moreButtonUrl}
              className="trending-more-button"
              style={moreButtonStyle}
              onClick={handleMoreButtonClick}
              onMouseEnter={() => handleMoreButtonHover(true)}
              onMouseLeave={() => handleMoreButtonHover(false)}
            >
              {translate(moreButtonText)}
            </a>
          ) : (
            <button 
              className="trending-more-button"
              style={moreButtonStyle}
              onClick={handleMoreButtonClick}
              onMouseEnter={() => handleMoreButtonHover(true)}
              onMouseLeave={() => handleMoreButtonHover(false)}
            >
              {translate(moreButtonText)}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default CustomTrendingItemsSkin;
```

### 반응형 그리드 예제

```javascript
const ResponsiveTrendingItemsSkin = ({ data, actions, utils }) => {
  const { items } = data;

  // 반응형 그리드 설정
  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
    
    // 미디어 쿼리는 CSS에서 처리하거나 JS로 동적 설정
    '@media (max-width: 768px)': {
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '15px'
    },
    '@media (max-width: 480px)': {
      gridTemplateColumns: '1fr',
      gap: '10px'
    }
  };

  return (
    <div className="responsive-trending">
      <div style={gridStyle}>
        {items.map((item, index) => (
          <div key={item.id || index} className="responsive-item">
            {/* 아이템 내용 */}
          </div>
        ))}
      </div>
    </div>
  );
};
```

### 호버 효과 예제

```javascript
const HoverEffectSkin = ({ data, actions }) => {
  const { items, hoveredItemId } = data;
  const { handleItemHover } = actions;

  return (
    <div className="hover-effect-trending">
      {items.map((item, index) => {
        const isHovered = hoveredItemId === item.id;
        
        return (
          <div
            key={item.id || index}
            className={`hover-item ${isHovered ? 'is-hovered' : ''}`}
            onMouseEnter={() => handleItemHover(item.id)}
            onMouseLeave={() => handleItemHover(null)}
            style={{
              transform: isHovered ? 'scale(1.05)' : 'scale(1)',
              transition: 'transform 0.3s ease',
              opacity: hoveredItemId && !isHovered ? 0.7 : 1
            }}
          >
            {/* 아이템 내용 */}
          </div>
        );
      })}
    </div>
  );
};
```

---

## ⚠️ 에지 케이스

### 1. 빈 아이템 배열

```javascript
// 항상 아이템 존재 여부 확인
if (!data.items || data.items.length === 0) {
  return <EmptyState message="표시할 아이템이 없습니다." />;
}
```

### 2. 잘못된 이미지 URL

```javascript
// 이미지 로드 실패 처리
const SafeImage = ({ src, alt, ...props }) => {
  const [hasError, setHasError] = useState(false);
  
  if (hasError) {
    return (
      <div className="image-placeholder" {...props}>
        <span>이미지를 불러올 수 없습니다</span>
      </div>
    );
  }
  
  return (
    <img
      src={src}
      alt={alt}
      onError={() => setHasError(true)}
      {...props}
    />
  );
};
```

### 3. 에디터 모드 처리

```javascript
// 에디터 모드에서는 클릭 이벤트 비활성화
const handleClick = (item, e) => {
  if (mode === 'editor') {
    e.preventDefault();
    return;
  }
  actions.handleItemClick(item, e);
};
```

### 4. URL 유효성 검사

```javascript
// MORE 버튼 표시 조건
{showMoreButton && hasValidMoreUrl && (
  <button onClick={actions.handleMoreButtonClick}>
    {moreButtonText}
  </button>
)}

// 개별 아이템 링크 처리
{actions.isValidUrl(item.url) ? (
  <a href={item.url}>링크</a>
) : (
  <div>링크 없음</div>
)}
```

### 5. 번역 처리

```javascript
// 번역 가능한 모든 텍스트에 translate 함수 적용
<h2>{actions.translate(data.title)}</h2>
<p>{actions.translate(data.subtitle)}</p>
{items.map(item => (
  <h3>{actions.translate(item.title)}</h3>
))}
```

### 6. 호버 스타일 동적 적용

```javascript
// 컴포넌트에서 동적으로 생성되는 호버 스타일 처리
// data.componentUniqueId를 활용한 고유 클래스명 사용
const uniqueId = data.componentUniqueId;

return (
  <div className={uniqueId}>
    {/* MORE 버튼 호버 효과는 자동으로 적용됨 */}
    <button className="trending-items-more-button">
      {moreButtonText}
    </button>
  </div>
);
```

---

## 🎨 CSS 스타일링 가이드

외부 스킨은 **독립적인 디자인**을 가져야 합니다. 기본 스킨의 CSS가 영향을 주지 않도록 다음을 준수하세요:

### CSS 클래스명 충돌 방지

```javascript
// ❌ 피해야 할 방법 (기본 스킨과 동일한 클래스명)
<div className="trending-items-container">
  <h2 className="trending-items-title">제목</h2>
</div>

// ✅ 권장 방법 (고유한 prefix 사용)
<div className="my-custom-trending-container">
  <h2 className="my-custom-trending-title">제목</h2>
</div>
```

### 필수 스타일 직접 구현

```css
/* 외부 스킨은 모든 스타일을 직접 정의해야 함 */
.my-custom-trending-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.my-custom-trending-item {
  cursor: pointer;
  transition: transform 0.3s ease;
}

.my-custom-trending-item:hover {
  transform: translateY(-5px);
}
```

---

## 📋 속성 패널 매핑 가이드

현재 TrendingItems 속성 패널에서 설정 가능한 항목들:

### 속성 패널에서 직접 설정 가능한 항목

| 속성 패널 항목 | 저장되는 속성 | 설명 |
|---------------|--------------|------|
| 제목 | `componentProps.headingText` | 메인 제목 (어댑터에서 title로 매핑) |
| 부제목 | `componentProps.subtitle` | 부제목 |
| 이미지 둥글기 | `componentProps.imageRadius` | 이미지 테두리 둥글기 |
| 버튼 표시 | `componentProps.showMoreButton` | MORE 버튼 표시 여부 |
| 버튼 텍스트 | `componentProps.moreButtonText` | MORE 버튼 텍스트 |
| 버튼 URL | `componentProps.moreButtonUrl` | MORE 버튼 링크 |
| 버튼 배경색 | `componentProps.moreButtonBgColor` | 버튼 배경 색상 |
| 버튼 텍스트 색상 | `componentProps.moreButtonTextColor` | 버튼 글자 색상 |
| 버튼 테두리 색상 | `componentProps.moreButtonBorderColor` | 버튼 테두리 색상 |
| 호버 배경색 | `componentProps.moreButtonHoverBgColor` | 버튼 호버 배경색 |
| 호버 텍스트 색상 | `componentProps.moreButtonHoverTextColor` | 버튼 호버 글자색 |

### 🔴 외부 스킨 개발 시 주의사항

1. **MORE 버튼 표시 로직**:
   ```javascript
   // showMoreButton이 true이고 hasValidMoreUrl이 true일 때만 표시
   {data.showMoreButton && data.hasValidMoreUrl && (
     <button>MORE</button>
   )}
   ```

2. **아이템 클릭 처리**:
   ```javascript
   // 유효한 URL이 있을 때만 링크로 처리
   {actions.isValidUrl(item.url) ? (
     <a href={item.url} onClick={(e) => actions.handleItemClick(item, e)}>
       {content}
     </a>
   ) : (
     <div onClick={(e) => actions.handleItemClick(item, e)}>
       {content}
     </div>
   )}
   ```

3. **번역 처리**:
   ```javascript
   // 모든 텍스트는 translate 함수를 통해 번역
   <h2>{actions.translate(data.title)}</h2>
   <h3>{actions.translate(item.title)}</h3>
   ```

4. **호버 효과**:
   ```javascript
   // hoveredItemId를 활용한 호버 상태 처리
   const isHovered = data.hoveredItemId === item.id;
   
   <div 
     className={isHovered ? 'hovered' : ''}
     onMouseEnter={() => actions.handleItemHover(item.id)}
     onMouseLeave={() => actions.handleItemHover(null)}
   >
   ```

---

## 🔄 마이그레이션 가이드

### 기존 내부 스킨을 외부 스킨으로 전환

#### 1단계: 기존 코드 분석
```javascript
// 기존 내부 스킨 (Before)
const OldTrendingComponent = ({ items, title, onItemClick }) => {
   return <div>...</div>;
};
```

#### 2단계: ComponentSkinProps 구조로 변환
```javascript
// 외부 스킨 (After)
const NewTrendingItemsSkin = ({ data, actions, utils, mode }) => {
   // props 매핑
   const items = data.items;
   const title = data.title;
   const onItemClick = actions.handleItemClick;

   return <div>...</div>;
};
```

#### 3단계: 액션 핸들러 업데이트
```javascript
// Before
<div onClick={() => handleClick(item)}>

   // After
   <div onClick={(e) => actions.handleItemClick(item, e)}>
```

#### 4단계: 번역 기능 추가
```javascript
// Before
<h2>{title}</h2>

// After
<h2>{actions.translate(title)}</h2>
```

### 주요 변경사항 체크리스트

- [ ] props 구조를 `data`, `actions`, `utils`로 분리
- [ ] 상태 관리 코드 제거 (로직에서 처리됨)
- [ ] 클릭 이벤트를 적절한 액션으로 변경
- [ ] 번역 함수 적용
- [ ] 에디터 모드 대응 추가
- [ ] 호버 효과 구현
- [ ] URL 유효성 검사 활용

---

## 🎁 추가 팁

### 성능 최적화
```javascript
// 메모이제이션 활용
import { memo, useMemo } from 'react';

const OptimizedSkin = memo(({ data, actions }) => {
   const validItems = useMemo(() => {
      return data.items.filter(item => item.image && item.title);
   }, [data.items]);

   return <div>...</div>;
});
```

### 접근성 개선
```javascript
// 키보드 네비게이션 지원
<div
        role="grid"
        aria-label="트렌딩 아이템"
>
   {items.map((item, index) => (
           <div
                   key={item.id}
                   role="gridcell"
                   tabIndex={0}
                   aria-label={`트렌딩 아이템: ${item.title}`}
                   onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                         actions.handleItemClick(item, e);
                      }
                   }}
           >
              {/* 아이템 내용 */}
           </div>
   ))}
</div>
```

---

## 📚 참고 자료

- [외부 스킨 시스템 가이드](/docs/EXTERNAL_SKIN_SYSTEM_GUIDE.md)
- [ComponentSkinProps 인터페이스 정의](/src/types/component-skin.d.ts)
- [TrendingItems 컴포넌트 소스 코드](/src/components/module/TrendingItems/)

---

## 🤝 지원

질문이나 이슈가 있으신가요?

- **기술 지원**: support@webbuilder.com
- **개발자 포럼**: https://forum.webbuilder.com
- **GitHub Issues**: https://github.com/withcookie/webbuilder/issues

---

*이 문서는 TrendingItems v1.0 기준으로 작성되었습니다.*