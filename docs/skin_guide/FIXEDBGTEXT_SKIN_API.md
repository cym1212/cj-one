# FixedBgText 컴포넌트 외부 스킨 API 가이드

## 컴포넌트 개요

FixedBgText(고정 배경 텍스트) 컴포넌트는 배경 이미지 위에 텍스트나 HTML 콘텐츠를 표시하는 정적 컴포넌트입니다. 배경 이미지는 고정(fixed)되어 스크롤 시에도 움직이지 않는 특징을 가지고 있습니다.

**주요 특징:**
- 배경 이미지 위에 텍스트/HTML 콘텐츠 표시
- 오버레이 색상 및 투명도 조절 가능
- 디바이스별(PC/모바일) 콘텐츠 설정 지원
- 리치 에디터를 통한 HTML 콘텐츠 편집 지원
- 반응형 높이 설정

## ComponentSkinProps 인터페이스

```typescript
interface ComponentSkinProps {
  data: {
    // 기본 정보
    id: string;
    style: CSSStyleDeclaration;
    componentProps: object;
    content: string | HtmlContent;
    
    // 이미지 및 콘텐츠
    imageUrl?: string;
    title?: string;
    description?: string;
    finalImageUrl: string;
    finalTitle: string;
    finalDescription: string;
    htmlContent: string;
    
    // 스타일 및 설정
    overlayStyle: { backgroundColor: string };
    contentStyle: { justifyContent: string };
    textColor: string;
    htmlContentStyle: { color: string };
    rootStyle: CSSStyleDeclaration;
    height: number;
    overlayOpacity: number;
    overlayColor: string;
    contentAlignment: 'top' | 'center' | 'bottom';
    
    // 상태
    isLoaded: boolean;
    hasError: boolean;
    componentRef: React.RefObject<HTMLDivElement>;
    
    // 기타
    debug: boolean;
    viewMode: string;
    isPreview: boolean;
    dataAttributes: object;
    t: (key: string) => string; // 다국어 번역 함수
  };
  actions: {
    // FixedBgText는 정적 컴포넌트로 액션이 없음
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

### 배경 이미지 설정

| 속성명 | 타입 | 기본값 | 설명 |
|--------|------|--------|------|
| `bgImageUrl` | string | `'https://via.placeholder.com/1920x1080'` | 배경 이미지 URL |

**속성 패널 위치:** 배경 이미지 설정 > 배경 이미지
- 텍스트 입력으로 URL 직접 입력 가능
- "업로드" 버튼으로 이미지 파일 업로드 가능

### 오버레이 설정

| 속성명 | 타입 | 기본값 | 설명 |
|--------|------|--------|------|
| `overlayColor` | string | `'#000000'` | 오버레이 색상 (HEX 형식) |
| `overlayOpacity` | number | `0.3` | 오버레이 투명도 (0.0 ~ 1.0) |

**속성 패널 위치:**
- 오버레이 설정 > 오버레이 색상: 컬러 피커로 색상 선택
- 오버레이 설정 > 오버레이 불투명도: 슬라이더로 0~100% 조절

### 텍스트 설정

| 속성명 | 타입 | 기본값 | 설명 |
|--------|------|--------|------|
| `textColor` | string | `'#ffffff'` | 텍스트 색상 (HEX 형식) |

**속성 패널 위치:** 텍스트 설정 > 텍스트 색상
- 컬러 피커로 색상 선택
- 리치 에디터를 통한 HTML 콘텐츠 편집

**리치 에디터 기능:**
- HTML 콘텐츠 작성 및 편집
- 미리보기 기능 제공
- 디바이스별(PC/모바일) 콘텐츠 설정 지원

### 크기 설정

| 속성명 | 타입 | 기본값 | 설명 |
|--------|------|--------|------|
| `height` | number | PC: `500`, 모바일: `400` | 컴포넌트 높이 (px) |

**속성 패널 위치:** 크기 설정 > 높이 (px)
- 숫자 입력으로 최소 100px부터 설정 가능
- 디바이스별로 다른 높이 설정 가능

## 콘텐츠 구조

### HTML 콘텐츠 처리

FixedBgText 컴포넌트는 `content` 속성을 통해 HTML 콘텐츠를 표시합니다:

```typescript
// 단순 HTML 문자열
content: string

// 디바이스별 콘텐츠 객체
content: {
  deviceProperty?: {
    pc: string;     // PC용 HTML 콘텐츠
    mobile: string; // 모바일용 HTML 콘텐츠
  };
  html?: string;    // 기본 HTML 콘텐츠
}
```

### 콘텐츠 우선순위

1. **디바이스별 콘텐츠**: `content.deviceProperty[device]`
2. **기본 HTML**: `content.html`
3. **단순 문자열**: `content` (문자열인 경우)
4. **title/description 조합**: HTML 콘텐츠가 없을 때 사용

## 숨겨진 속성 (Hidden Properties)

다음 속성들은 속성 패널에 표시되지 않지만 로직에서 사용됩니다:

### contentAlignment (주석 처리됨)
- **타입**: `'top' | 'center' | 'bottom'`
- **기본값**: `'center'`
- **설명**: 콘텐츠 수직 정렬 (현재 속성 패널에서 비활성화)

### title, description
- **타입**: `string`
- **설명**: HTML 콘텐츠가 없을 때 표시되는 기본 제목과 설명

## 기본 스킨 구현 예시

```tsx
import React from 'react';
import { ComponentSkinProps } from '../../../types/component-skin';

const MyFixedBgTextSkin: React.FC<ComponentSkinProps> = ({
  data,
  actions,
  utils,
  mode,
  editor
}) => {
  const {
    id,
    htmlContent,
    finalTitle,
    finalDescription,
    overlayStyle,
    contentStyle,
    textColor,
    htmlContentStyle,
    rootStyle,
    dataAttributes,
    componentRef,
    t
  } = data;

  return (
    <div 
      id={id}
      className="my-fixed-bg-text"
      ref={componentRef}
      style={rootStyle}
      {...dataAttributes}
    >
      {/* 오버레이 */}
      <div className="overlay" style={overlayStyle} />
      
      {/* 콘텐츠 */}
      <div className="content" style={contentStyle}>
        {htmlContent ? (
          <div 
            className="html-content" 
            style={htmlContentStyle}
            dangerouslySetInnerHTML={{ __html: htmlContent }} 
          />
        ) : (
          <>
            <h2 style={{ color: textColor }}>
              {t(finalTitle)}
            </h2>
            <p style={{ color: textColor }}>
              {t(finalDescription)}
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default MyFixedBgTextSkin;
```

## CSS 스타일링 주의사항

### 1. CSS 클래스명 충돌 방지

기본 스킨의 CSS 클래스들:
- `.fixed-bg-text-component`
- `.overlay`
- `.content`
- `.html-content`
- `.title`
- `.description`
- `.debug-info`
- `.editor-hint`

외부 스킨에서는 **고유한 CSS 클래스명**을 사용하세요:

```css
/* 좋은 예 - 고유한 클래스명 */
.my-company-fixed-bg-text { }
.my-company-fixed-bg-overlay { }
.my-company-fixed-bg-content { }

/* 나쁜 예 - 기본 스킨과 동일한 클래스명 */
.fixed-bg-text-component { }
.overlay { }
.content { }
```

### 2. 배경 이미지 처리

배경 이미지는 `rootStyle`에 자동으로 설정됩니다:

```typescript
rootStyle: {
  backgroundImage: `url(${finalImageUrl})`,
  backgroundPosition: 'center center',
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat',
  minHeight: `${height}px`
}
```

### 3. 반응형 디자인

디바이스별 높이가 자동으로 적용됩니다:
- PC: 기본 500px
- 모바일: 기본 400px

## 필수 구현 요소

외부 스킨에서 반드시 구현해야 하는 요소들:

### 1. 오버레이 적용
```tsx
<div style={overlayStyle} />
```

### 2. HTML 콘텐츠 렌더링
```tsx
{htmlContent ? (
  <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
) : (
  // 기본 title/description 표시
)}
```

### 3. 텍스트 색상 적용
```tsx
<div style={htmlContentStyle}>
  {/* HTML 콘텐츠 */}
</div>
<h2 style={{ color: textColor }}>
  {/* 제목 */}
</h2>
```

### 4. 다국어 지원
```tsx
{t(finalTitle)}
{t(finalDescription)}
```

## 디버그 모드

개발 시 `debug` 속성을 활용하여 정보를 표시할 수 있습니다:

```tsx
{data.debug && (
  <div className="debug-info">
    <p>Image URL: {data.finalImageUrl}</p>
    <p>Is Loaded: {data.isLoaded ? 'Yes' : 'No'}</p>
    <p>Has Error: {data.hasError ? 'Yes' : 'No'}</p>
  </div>
)}
```

## 에디터 모드 지원

에디터에서 선택된 상태일 때 힌트를 표시할 수 있습니다:

```tsx
{mode === 'editor' && editor?.isSelected && (
  <div className="editor-hint">
    {t('고정 배경 텍스트')}
  </div>
)}
```

## 접근성 고려사항

### Alt 텍스트
배경 이미지는 CSS로 적용되므로 필요시 `aria-label` 속성을 추가하세요:

```tsx
<div 
  aria-label={t('배경 이미지: ') + finalTitle}
  role="img"
>
```

### 키보드 접근성
정적 컴포넌트이므로 키보드 접근성은 일반적으로 필요하지 않지만, 상호작용 요소가 있다면 `tabIndex`를 고려하세요.

## 성능 최적화

### 이미지 로딩
- `data.isLoaded`와 `data.hasError` 상태를 활용하여 로딩 상태 표시
- 이미지 로드 실패 시 대체 콘텐츠 제공

### 메모이제이션
대부분의 계산된 값들이 이미 메모이제이션되어 있어 추가 최적화는 필요하지 않습니다.

## 호환성 체크리스트

- [ ] 모든 속성 패널 설정이 올바르게 반영되는가?
- [ ] 디바이스별 콘텐츠가 올바르게 표시되는가?
- [ ] 오버레이 색상과 투명도가 올바르게 적용되는가?
- [ ] 텍스트 색상이 HTML 콘텐츠에 올바르게 적용되는가?
- [ ] 배경 이미지가 올바르게 표시되는가?
- [ ] 반응형 높이가 올바르게 적용되는가?
- [ ] 다국어가 올바르게 작동하는가?
- [ ] CSS 클래스명이 기본 스킨과 충돌하지 않는가?

이 가이드를 따라 구현하면 기본 스킨과 동일한 기능을 제공하는 외부 스킨을 만들 수 있습니다.