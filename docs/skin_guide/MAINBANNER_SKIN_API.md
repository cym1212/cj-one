# 📦 MainBanner 컴포넌트 스킨 API 문서

> MainBanner 컴포넌트의 외부 스킨 개발을 위한 상세 API 명세서입니다.

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

MainBanner는 웹사이트의 메인 비주얼 영역을 담당하는 컴포넌트로, 이미지/비디오 슬라이더, 캐러셀, 페이드 등 다양한 전환 효과를 지원합니다.

### 주요 기능
- 🖼️ 이미지/비디오 배너 지원
- 🔄 다양한 전환 효과 (슬라이더, 캐러셀, 페이드)
- 📱 반응형 디자인
- ⚡ 자동 재생 및 수동 제어
- 🎨 커스터마이징 가능한 UI 요소
- 📢 광고 딱지 표시 기능 (텍스트 기반)
- 🏷️ 다중 카테고리 태그 표시 기능
- ✍️ 텍스트에서 줄바꿈(\n) 지원
- 🎛️ PC/모바일 별도 위치 설정 지원

---

## 📦 ComponentSkinProps 구조

외부 스킨이 받는 props의 전체 구조입니다:

```typescript
interface ComponentSkinProps {
  data: MainBannerData;      // 컴포넌트 상태 및 설정
  actions: MainBannerActions; // 이벤트 핸들러
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

### 상태 관련 Props

| 속성명 | 타입 | 설명 |
|--------|------|------|
| `currentIndex` | `number` | 현재 활성 배너의 인덱스 (0부터 시작) |
| `isTransitioning` | `boolean` | 전환 애니메이션 진행 중 여부 |
| `isPaused` | `boolean` | 자동 재생 일시정지 상태 |
| `isLoading` | `boolean` | 배너 데이터 로딩 중 여부 |
| `isVideoPlaying` | `boolean` | 비디오 재생 중 여부 |
| `isHovering` | `boolean` | 마우스 호버 상태 |

### 배너 데이터

| 속성명 | 타입 | 설명 |
|--------|------|------|
| `banners` | `BannerItem[]` | 배너 아이템 배열 |

### 설정 관련 Props

| 속성명 | 타입 | 설명 | 기본값 |
|--------|------|------|--------|
| `bannerMode` | `'slider' \| 'list'` | 배너 표시 모드 | `'slider'` |
| `autoPlay` | `boolean` | 자동 재생 여부 | `true` |
| `autoPlaySpeed` | `number` | 자동 재생 간격 (ms) | `5000` |
| `transitionSpeed` | `number` | 전환 애니메이션 속도 (ms) | `500` |
| `showDots` | `boolean` | 하단 점 네비게이션 표시 | `true` |
| `showArrows` | `boolean` | 좌우 화살표 표시 | `true` |
| `pauseOnHover` | `boolean` | 마우스 호버 시 일시정지 | `true` |
| `infiniteLoop` | `boolean` | 무한 루프 여부 | `true` |
| `containerHeight` | `string` | 컨테이너 높이 | 반응형 |
| `isMobile` | `boolean` | 모바일 디바이스 여부 | 자동 감지 |

### 렌더링 모드

| 속성명 | 타입 | 설명 |
|--------|------|------|
| `isEditorMode` | `boolean` | 에디터 모드 여부 |
| `isPreviewMode` | `boolean` | 미리보기 모드 여부 |

### 유틸리티

| 속성명 | 타입 | 설명 |
|--------|------|------|
| `getImageSource` | `(banner: BannerItem, index: number) => string` | 배너 이미지 URL 가져오기 |
| `videoRef` | `HTMLVideoElement \| null` | 비디오 엘리먼트 참조 |

### 스타일 Props

| 속성명 | 타입 | 설명 |
|--------|------|------|
| `props.style` | `React.CSSProperties` | 컨테이너 스타일 |
| `props.className` | `string` | 추가 CSS 클래스명 |

---

## 🎬 actions 목록

### 네비게이션 액션

| 액션명 | 타입 | 설명 |
|--------|------|------|
| `goToNext` | `() => void` | 다음 배너로 이동 |
| `goToPrev` | `() => void` | 이전 배너로 이동 |
| `goToSlide` | `(index: number) => void` | 특정 인덱스의 배너로 이동 |

### 마우스 이벤트

| 액션명 | 타입 | 설명 |
|--------|------|------|
| `onMouseEnter` | `() => void` | 마우스 진입 시 호출 |
| `onMouseLeave` | `() => void` | 마우스 이탈 시 호출 |

### 터치 이벤트

| 액션명 | 타입 | 설명 |
|--------|------|------|
| `onTouchStart` | `(e: React.TouchEvent) => void` | 터치 시작 |
| `onTouchMove` | `(e: React.TouchEvent) => void` | 터치 이동 |
| `onTouchEnd` | `() => void` | 터치 종료 |

### 배너 상호작용

| 액션명 | 타입 | 설명 |
|--------|------|------|
| `onBannerClick` | `(banner: BannerItem) => void` | 배너 클릭 시 호출 |

### 비디오 관련

| 액션명 | 타입 | 설명 |
|--------|------|------|
| `onVideoClick` | `() => void` | 비디오 클릭 (재생/일시정지) |
| `onVideoEnded` | `() => void` | 비디오 종료 시 호출 |
| `onVideoPlaying` | `() => void` | 비디오 재생 시작 시 호출 |
| `onVideoError` | `(error: any) => void` | 비디오 오류 시 호출 |
| `setVideoRef` | `(ref: HTMLVideoElement \| null) => void` | 비디오 ref 설정 |

---

## 📝 타입 정의

### BannerItem 인터페이스

```typescript
interface BannerItem {
  // 기본 속성
  icon?: string;              // 이미지 URL
  text?: string;              // 배너 제목
  description?: string;       // 배너 설명
  url?: string;              // 클릭 시 이동할 URL
  
  // 위치 관련
  position?: string;          // 텍스트 위치 (1-9)
  horizontalPosition?: string; // 가로 위치 (레거시)
  verticalPosition?: string;   // 세로 위치 (레거시)
  
  // 스타일 관련
  textColor?: string;         // 텍스트 색상
  textShadow?: string;        // 텍스트 그림자
  buttonBgColor?: string;     // 버튼 배경색
  buttonTextColor?: string;   // 버튼 텍스트 색상
  buttonHoverColor?: string;  // 버튼 호버 색상
  buttonText?: string;        // 버튼 텍스트
  transparentButton?: boolean; // 투명 버튼 여부
  
  // 버튼 크기
  buttonWidth?: string;       // 버튼 너비
  buttonHeight?: string;      // 버튼 높이
  mobileButtonWidth?: string; // 모바일 버튼 너비
  mobileButtonHeight?: string;// 모바일 버튼 높이
  mobileFullWidth?: boolean;  // 모바일 전체 너비 사용
  
  // 표시 옵션
  showTitle?: boolean;        // 제목 표시 여부
  showButton?: boolean;       // 버튼 표시 여부
  hasBackground?: boolean;    // 배경 사용 여부
  
  // 미디어 관련
  mediaType?: 'image' | 'video'; // 미디어 타입
  videoUrl?: string;          // 비디오 URL
  autoplay?: boolean;         // 비디오 자동 재생
  muted?: boolean;            // 비디오 음소거
  loop?: boolean;             // 비디오 반복
  
  // 스타일
  style?: string | React.CSSProperties; // 커스텀 스타일
  
  // 광고 관련
  showAd?: boolean;           // 광고 표시 여부
  adImageUrl?: string;        // 광고 이미지 URL
  adText?: string;            // 광고 텍스트
  adLink?: string;            // 광고 링크 URL
  adPosition?: string;        // 광고 위치 (기본)
  adPositionPc?: string;      // 광고 위치 (PC)
  adPositionMobile?: string;  // 광고 위치 (모바일)
  adTextColor?: string;       // 광고 텍스트 색상
  adBackgroundColor?: string; // 광고 배경 색상
  adBorderColor?: string;     // 광고 테두리 색상
  adOpacity?: number;         // 광고 투명도 (0-1)
  
  // 카테고리 관련
  showCategory?: boolean;         // 카테고리 표시 여부
  categories?: string[];          // 카테고리 배열 (다중 지원)
  categoryPosition?: string;      // 카테고리 위치 (기본)
  categoryPositionPc?: string;    // 카테고리 위치 (PC)
  categoryPositionMobile?: string;// 카테고리 위치 (모바일)
  categoryTextColor?: string;     // 카테고리 텍스트 색상
  categoryBackgroundColor?: string;// 카테고리 배경 색상
  categoryBorderColor?: string;   // 카테고리 테두리 색상
  categoryFontSize?: string;      // 카테고리 폰트 크기
  categoryBorderRadius?: string;  // 카테고리 테두리 둥글기
}
```

### 위치 값 매핑

```typescript
// position 값 (1-9)는 다음과 같이 매핑됩니다:
// 1: 상단 왼쪽    2: 상단 중앙    3: 상단 오른쪽
// 4: 중앙 왼쪽    5: 중앙 중앙    6: 중앙 오른쪽
// 7: 하단 왼쪽    8: 하단 중앙    9: 하단 오른쪽
```

---

## ✅ 필수/선택 구분

### 필수 Props
모든 props는 선택사항이며, 기본값이 제공됩니다.

### 권장 Props
- `data.banners`: 최소 1개 이상의 배너 아이템
- `data.currentIndex`: 현재 표시할 배너
- `actions.goToNext`, `actions.goToPrev`: 네비게이션 기능

---

## 🔢 기본값

### 배너 아이템 기본값
```typescript
{
  text: '',
  description: '',
  url: '#',
  icon: 'https://via.placeholder.com/1200x400',
  position: '5',
  textColor: 'white',
  textShadow: '0 1px 2px rgba(0, 0, 0, 0.6)',
  buttonBgColor: '#ff6b6b',
  buttonTextColor: 'white',
  buttonHoverColor: '#ff5252',
  buttonText: '자세히 보기',
  showTitle: true,
  showButton: true,
  transparentButton: false,
  mediaType: 'image',
  autoplay: true,
  muted: true,
  loop: true,
  hasBackground: false,
  
  // 광고 관련 기본값
  showAd: false,
  adText: '광고',
  adLink: '#',
  adPosition: '3',
  adPositionPc: '3',
  adPositionMobile: '3',
  adTextColor: '#fff',
  adBackgroundColor: 'rgba(0, 0, 0, 0.8)',
  adBorderColor: '',
  adOpacity: 1,
  
  // 카테고리 관련 기본값
  showCategory: false,
  categories: [],
  categoryPosition: '1',
  categoryPositionPc: '1',
  categoryPositionMobile: '1',
  categoryTextColor: 'white',
  categoryBackgroundColor: 'rgba(0, 0, 0, 0.7)',
  categoryBorderColor: '',
  categoryFontSize: '14px',
  categoryBorderRadius: '20px'
}
```

### 컴포넌트 설정 기본값
```typescript
{
  bannerMode: 'slider',
  autoPlay: true,
  autoPlaySpeed: 5000,
  transitionSpeed: 500,
  showDots: true,
  showArrows: true,
  pauseOnHover: true,
  infiniteLoop: true,
  desktopHeight: '600px',
  mobileHeight: '400px'
}
```

---

## 💻 예제 코드

### 기본 슬라이더 스킨

```javascript
import React from 'react';

const CustomSliderSkin = ({ data, actions, utils, mode }) => {
  const { 
    banners, 
    currentIndex, 
    isTransitioning,
    showDots,
    showArrows,
    containerHeight
  } = data;

  // 배너가 없는 경우 처리
  if (!banners || banners.length === 0) {
    return (
      <div style={{ height: containerHeight, background: '#f0f0f0' }}>
        <p>배너가 없습니다.</p>
      </div>
    );
  }

  const currentBanner = banners[currentIndex] || banners[0];

  return (
    <div 
      className="custom-slider"
      style={{ height: containerHeight, position: 'relative' }}
      onMouseEnter={actions.onMouseEnter}
      onMouseLeave={actions.onMouseLeave}
    >
      {/* 배너 이미지 */}
      <div className="banner-wrapper">
        {currentBanner.mediaType === 'video' ? (
          <video
            ref={actions.setVideoRef}
            src={currentBanner.videoUrl}
            autoPlay={currentBanner.autoplay}
            muted={currentBanner.muted}
            loop={currentBanner.loop}
            onClick={actions.onVideoClick}
            onEnded={actions.onVideoEnded}
            onPlay={actions.onVideoPlaying}
            onError={actions.onVideoError}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <img
            src={data.getImageSource(currentBanner, currentIndex)}
            alt={currentBanner.text || '배너 이미지'}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onClick={() => actions.onBannerClick(currentBanner)}
          />
        )}
      </div>

      {/* 텍스트 오버레이 */}
      {currentBanner.showTitle && (
        <div 
          className={`text-overlay position-${currentBanner.position || '5'}`}
          style={{ color: currentBanner.textColor }}
        >
          {currentBanner.text && (
            <h2 style={{ textShadow: currentBanner.textShadow }}>
              {currentBanner.text.split(/\\n|\n/).map((line, index, array) => (
                <React.Fragment key={index}>
                  {line}
                  {index < array.length - 1 && <br />}
                </React.Fragment>
              ))}
            </h2>
          )}
          {currentBanner.description && (
            <p>
              {currentBanner.description.split(/\\n|\n/).map((line, index, array) => (
                <React.Fragment key={index}>
                  {line}
                  {index < array.length - 1 && <br />}
                </React.Fragment>
              ))}
            </p>
          )}
          
          {currentBanner.showButton && currentBanner.url && currentBanner.url !== '#' && (
            <button
              className="banner-button"
              style={{
                backgroundColor: currentBanner.transparentButton 
                  ? 'transparent' 
                  : currentBanner.buttonBgColor,
                color: currentBanner.buttonTextColor,
                border: currentBanner.transparentButton 
                  ? `2px solid ${currentBanner.buttonTextColor}` 
                  : 'none'
              }}
              onClick={() => actions.onBannerClick(currentBanner)}
            >
              {currentBanner.buttonText}
            </button>
          )}
        </div>
      )}

      {/* 광고 딱지 */}
      {currentBanner.showAd && (
        <div 
          className={`ad-overlay position-${currentBanner.adPosition || '3'}`}
          style={{
            position: 'absolute',
            zIndex: 10,
            backgroundColor: currentBanner.adBackgroundColor || 'rgba(0, 0, 0, 0.8)',
            color: currentBanner.adTextColor || '#fff',
            borderRadius: '4px',
            padding: '6px 12px',
            fontSize: '12px',
            fontWeight: 'bold',
            border: currentBanner.adBorderColor ? `1px solid ${currentBanner.adBorderColor}` : 'none',
            opacity: currentBanner.adOpacity || 1,
            cursor: currentBanner.adLink && currentBanner.adLink !== '#' ? 'pointer' : 'default'
          }}
          onClick={() => {
            if (currentBanner.adLink && currentBanner.adLink !== '#') {
              if (currentBanner.adLink.startsWith('http') || currentBanner.adLink.startsWith('//')) {
                window.open(currentBanner.adLink, '_blank');
              } else {
                window.location.href = currentBanner.adLink;
              }
            }
          }}
        >
          {currentBanner.adText || '광고'}
        </div>
      )}

      {/* 카테고리 영역 - 다중 카테고리 지원 */}
      {currentBanner.showCategory && currentBanner.categories && currentBanner.categories.length > 0 && (
        <div className="category-container" style={{
          position: 'absolute',
          zIndex: 10,
          display: 'flex',
          gap: '8px',
          flexWrap: 'wrap'
        }}>
          {currentBanner.categories.filter(category => category && category.trim()).map((category, index) => (
            <div 
              key={index}
              className={`category-tag position-${currentBanner.categoryPosition || '1'}`}
              style={{
                backgroundColor: currentBanner.categoryBackgroundColor || 'rgba(0, 0, 0, 0.7)',
                color: currentBanner.categoryTextColor || 'white',
                padding: '6px 14px',
                borderRadius: currentBanner.categoryBorderRadius || '20px',
                fontSize: currentBanner.categoryFontSize || '14px',
                fontWeight: 'bold',
                border: currentBanner.categoryBorderColor ? `2px solid ${currentBanner.categoryBorderColor}` : 'none'
              }}
            >
              {category}
            </div>
          ))}
        </div>
      )}

      {/* 네비게이션 화살표 */}
      {showArrows && banners.length > 1 && (
        <>
          <button 
            className="nav-arrow prev" 
            onClick={actions.goToPrev}
            aria-label="이전 배너"
          >
            ‹
          </button>
          <button 
            className="nav-arrow next" 
            onClick={actions.goToNext}
            aria-label="다음 배너"
          >
            ›
          </button>
        </>
      )}

      {/* 점 네비게이션 */}
      {showDots && banners.length > 1 && (
        <div className="dots-navigation">
          {banners.map((_, index) => (
            <button
              key={index}
              className={`dot ${index === currentIndex ? 'active' : ''}`}
              onClick={() => actions.goToSlide(index)}
              aria-label={`${index + 1}번째 배너로 이동`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomSliderSkin;
```

### 반응형 처리 예제

```javascript
const ResponsiveBannerSkin = ({ data, actions, utils }) => {
  const { isMobile, banners, currentIndex } = data;
  const currentBanner = banners[currentIndex] || banners[0];

  // 모바일 전용 스타일
  const buttonStyle = isMobile ? {
    width: currentBanner.mobileFullWidth 
      ? '100%' 
      : currentBanner.mobileButtonWidth || 'auto',
    height: currentBanner.mobileButtonHeight || 'auto',
    fontSize: '14px',
    padding: '10px 20px'
  } : {
    width: currentBanner.buttonWidth || '300px',
    height: currentBanner.buttonHeight || 'auto',
    fontSize: '16px',
    padding: '15px 30px'
  };

  return (
    <div className={`banner ${isMobile ? 'mobile' : 'desktop'}`}>
      {/* 반응형 레이아웃 구현 */}
    </div>
  );
};
```

### 터치 지원 예제

```javascript
const TouchEnabledSkin = ({ data, actions }) => {
  return (
    <div
      className="touch-slider"
      onTouchStart={actions.onTouchStart}
      onTouchMove={actions.onTouchMove}
      onTouchEnd={actions.onTouchEnd}
    >
      {/* 슬라이더 컨텐츠 */}
    </div>
  );
};
```

---

## ⚠️ 에지 케이스

### 1. 빈 배너 배열
```javascript
// 항상 배너 존재 여부 확인
if (!data.banners || data.banners.length === 0) {
  return <EmptyState />;
}
```

### 2. 잘못된 currentIndex
```javascript
// 안전한 인덱스 접근
const safeIndex = Math.max(0, Math.min(currentIndex, banners.length - 1));
const currentBanner = banners[safeIndex] || banners[0];
```

### 3. 비디오 로드 실패
```javascript
// 비디오 에러 처리
<video
  onError={(e) => {
    console.error('비디오 로드 실패:', e);
    actions.onVideoError(e);
    // 대체 이미지 표시 등
  }}
/>
```

### 4. 에디터 모드 처리
```javascript
// 에디터 모드에서는 클릭 이벤트 비활성화
const handleClick = (banner) => {
  if (mode === 'editor') return;
  actions.onBannerClick(banner);
};
```

### 5. 무한 루프 처리
```javascript
// infiniteLoop가 false일 때 경계 체크
const canGoNext = data.infiniteLoop || currentIndex < banners.length - 1;
const canGoPrev = data.infiniteLoop || currentIndex > 0;

{canGoNext && <button onClick={actions.goToNext}>다음</button>}
{canGoPrev && <button onClick={actions.goToPrev}>이전</button>}
```

### 6. 레거시 위치 속성 호환
```javascript
// position이 없으면 horizontalPosition/verticalPosition 사용
const position = banner.position || 
  getPositionFromLegacy(banner.horizontalPosition, banner.verticalPosition);
```

### 7. ⚠️ 버튼 표시 조건 (중요!)
```javascript
// 버튼이 표시되려면 3가지 조건이 모두 충족되어야 합니다:
// 1. showButton이 true
// 2. url이 존재
// 3. url이 '#'이 아님
{banner.showButton && banner.url && banner.url !== '#' && (
  <button>버튼</button>
)}

// 잘못된 예 (동작하지 않음):
{banner.showButton && <button>버튼</button>}  // ❌ URL 체크 누락
```

### 8. 텍스트 위치 클래스 적용
```javascript
// position 값(1-9)을 CSS 클래스로 적용
<div className={`text-overlay position-${banner.position || '5'}`}>
  {/* 텍스트 콘텐츠 */}
</div>

// CSS에서 위치 스타일 정의 예시:
.position-1 { top: 10%; left: 10%; }      // 상단 왼쪽
.position-2 { top: 10%; left: 50%; transform: translateX(-50%); }  // 상단 중앙
.position-3 { top: 10%; right: 10%; }     // 상단 오른쪽
.position-4 { top: 50%; left: 10%; transform: translateY(-50%); }  // 중앙 왼쪽
.position-5 { top: 50%; left: 50%; transform: translate(-50%, -50%); } // 중앙
.position-6 { top: 50%; right: 10%; transform: translateY(-50%); } // 중앙 오른쪽
.position-7 { bottom: 10%; left: 10%; }   // 하단 왼쪽
.position-8 { bottom: 10%; left: 50%; transform: translateX(-50%); } // 하단 중앙
.position-9 { bottom: 10%; right: 10%; }  // 하단 오른쪽
```

### 9. 🎨 CSS 스타일링 가이드 (중요!)

외부 스킨은 **독립적인 디자인**을 가져야 합니다. 기본 스킨의 CSS가 영향을 주지 않도록 다음을 준수하세요:

#### CSS 클래스명 충돌 방지:
```javascript
// ❌ 피해야 할 방법 (기본 스킨과 동일한 클래스명)
<div className="mainbanner-container">
  <h2 className="mainbanner-title">제목</h2>
</div>

// ✅ 권장 방법 (고유한 prefix 사용)
<div className="my-custom-banner-container">
  <h2 className="my-custom-banner-title">제목</h2>
</div>
```

#### CSS Module 또는 CSS-in-JS 사용:
```javascript
// CSS Module 예시
import styles from './MyCustomBannerSkin.module.css';

<div className={styles.container}>
  <h2 className={styles.title}>제목</h2>
</div>

// Styled Components 예시
import styled from 'styled-components';

const BannerContainer = styled.div`
  position: relative;
  height: ${props => props.height};
`;
```

#### 필수 스타일 직접 구현:
```css
/* 외부 스킨은 position 클래스도 직접 정의해야 함 */
.my-custom-position-1 { position: absolute; top: 10%; left: 10%; }
.my-custom-position-2 { position: absolute; top: 10%; left: 50%; transform: translateX(-50%); }
/* ... position-9까지 */

/* 기본 레이아웃 스타일도 필요 */
.my-custom-banner-container {
  position: relative;
  overflow: hidden;
}
```

#### 기본 스킨 CSS 참고하지 않기:
- BasicMainBannerSkin.css의 스타일이 자동으로 적용되지 않습니다
- 모든 스타일을 처음부터 구현해야 합니다
- 기본 스킨과 다른 디자인을 원한다면 완전히 다른 구조로 만드세요

---

## ⚠️ 속성 패널 매핑 가이드 (중요!)

현재 MainBanner 속성 패널에서 설정 가능한 항목들과 실제 컴포넌트 속성 매핑:

### 속성 패널에서 직접 설정 가능한 항목:
| 속성 패널 항목 | 저장되는 속성 | 설명 |
|---------------|--------------|------|
| 배너 제목 | `banner.text` | 배너에 표시되는 메인 텍스트 |
| 배너 설명 | `banner.description` | 배너 서브 텍스트 |
| 링크 URL | `banner.url` | 클릭 시 이동할 URL |
| 텍스트 위치 | `banner.position` | 1-9 그리드 위치 |
| 텍스트 색상 | `banner.textColor` | 텍스트 색상 |
| 텍스트 그림자 | `banner.textShadow` | 텍스트 그림자 효과 |
| 버튼 배경색 | `banner.buttonBgColor` | 버튼 배경 색상 |
| 버튼 텍스트 색상 | `banner.buttonTextColor` | 버튼 글자 색상 |
| 버튼 호버 색상 | `banner.buttonHoverColor` | 버튼 호버 시 색상 |
| 버튼 텍스트 | `banner.buttonText` | 버튼에 표시할 텍스트 |
| 투명 버튼 | `banner.transparentButton` | 투명 버튼 스타일 |
| 버튼 너비 | `banner.buttonWidth` | 버튼 너비 (PC) |
| 버튼 높이 | `banner.buttonHeight` | 버튼 높이 (PC) |
| 배경 사용 | `banner.hasBackground` | 텍스트 배경 표시 |
| 광고 표시 | `banner.showAd` | 광고 영역 표시 여부 |
| 광고 텍스트 | `banner.adText` | 광고 텍스트 |
| 광고 링크 | `banner.adLink` | 광고 클릭 시 이동할 URL |
| 광고 위치 | `banner.adPosition` | 광고 위치 (1-9) |
| 광고 텍스트 색상 | `banner.adTextColor` | 광고 텍스트 색상 |
| 광고 배경 색상 | `banner.adBackgroundColor` | 광고 배경 색상 |
| 광고 테두리 색상 | `banner.adBorderColor` | 광고 테두리 색상 |
| 광고 투명도 | `banner.adOpacity` | 광고 투명도 (0-1) |
| 카테고리 표시 | `banner.showCategory` | 카테고리 표시 여부 |
| 카테고리 목록 | `banner.categories` | 카테고리 배열 (다중 입력) |
| 카테고리 위치 | `banner.categoryPosition` | 카테고리 위치 (1-9) |
| 카테고리 텍스트 색상 | `banner.categoryTextColor` | 카테고리 텍스트 색상 |
| 카테고리 배경 색상 | `banner.categoryBackgroundColor` | 카테고리 배경 색상 |
| 카테고리 테두리 색상 | `banner.categoryBorderColor` | 카테고리 테두리 색상 |
| 카테고리 폰트 크기 | `banner.categoryFontSize` | 카테고리 폰트 크기 |
| 카테고리 둥글기 | `banner.categoryBorderRadius` | 카테고리 테두리 둥글기 |

### ⚠️ 속성 패널에 없지만 로직에서 처리되는 속성:
| 속성명 | 기본값 | 설명 | 중요도 |
|--------|--------|------|--------|
| `showTitle` | `true` | 제목/설명 표시 여부 | **높음** |
| `showButton` | `true` | 버튼 표시 여부 | **높음** |
| `mobileButtonWidth` | `'auto'` | 모바일 버튼 너비 | 중간 |
| `mobileButtonHeight` | `'auto'` | 모바일 버튼 높이 | 중간 |
| `mobileFullWidth` | `false` | 모바일 전체 너비 사용 | 중간 |

### 🔴 외부 스킨 개발 시 주의사항:

1. **버튼 표시 로직**:
   ```javascript
   // 속성 패널은 URL만 체크하지만, 실제 로직은 3가지 조건 모두 확인
   {banner.showButton && banner.url && banner.url !== '#' && (
     <button>...</button>
   )}
   ```

2. **제목/설명 표시 로직**:
   ```javascript
   // showTitle이 true일 때만 텍스트 표시
   {banner.showTitle && (
     <>
       {banner.description && <p>{banner.description}</p>}
       {banner.text && <h2>{banner.text}</h2>}
     </>
   )}
   ```

3. **기본값 처리**:
   ```javascript
   // MainBannerLogic.ts의 processInitialBanner 함수 참고
   showTitle: banner.showTitle !== undefined ? banner.showTitle : true,
   showButton: banner.showButton !== undefined ? banner.showButton : true,
   ```

4. **모바일 반응형 처리**:
   ```javascript
   // 모바일에서는 별도 크기 속성 사용
   width: isMobile 
     ? (banner.mobileButtonWidth || banner.buttonWidth || 'auto') 
     : (banner.buttonWidth || 'auto')
   ```

5. **줄바꿈 처리 로직**:
   ```javascript
   // \n을 실제 줄바꿈으로 변환 (정규식으로 개선)
   {banner.text && (
     <h2>
       {banner.text.split(/\\n|\n/).map((line, index, array) => (
         <React.Fragment key={index}>
           {line}
           {index < array.length - 1 && <br />}
         </React.Fragment>
       ))}
     </h2>
   )}
   ```

6. **광고 표시 로직**:
   ```javascript
   // 광고는 showAd가 true일 때 텍스트 딱지로 표시
   {banner.showAd && (
     <div className="ad-overlay">
       {banner.adText || '광고'}
     </div>
   )}
   ```

7. **카테고리 표시 로직**:
   ```javascript
   // 카테고리는 showCategory와 categories 배열이 있을 때만 표시
   {banner.showCategory && banner.categories && banner.categories.length > 0 && (
     <div className="category-container">
       {banner.categories.filter(category => category && category.trim()).map((category, index) => (
         <div key={index} className="category-tag">
           {category}
         </div>
       ))}
     </div>
   )}
   ```

8. **반응형 위치 처리**:
   ```javascript
   // PC와 모바일에서 다른 위치 사용 가능
   const adPosition = isMobile 
     ? (banner.adPositionMobile || banner.adPosition || '3')
     : (banner.adPositionPc || banner.adPosition || '3');
   
   const categoryPosition = isMobile 
     ? (banner.categoryPositionMobile || banner.categoryPosition || '1')
     : (banner.categoryPositionPc || banner.categoryPosition || '1');
   
   <div className={`ad-overlay position-${adPosition}`}>
   <div className={`category-container position-${categoryPosition}`}>
   ```

## 🔄 마이그레이션 가이드

### 기존 내부 스킨을 외부 스킨으로 전환

#### 1단계: 기존 코드 분석
```javascript
// 기존 내부 스킨 (Before)
const OldBannerComponent = ({ banners, currentIndex, onNext }) => {
   return <div>...</div>;
};
```

#### 2단계: ComponentSkinProps 구조로 변환
```javascript
// 외부 스킨 (After)
const NewBannerSkin = ({ data, actions, utils, mode }) => {
   // props 매핑
   const banners = data.banners;
   const currentIndex = data.currentIndex;
   const onNext = actions.goToNext;

   return <div>...</div>;
};
```

#### 3단계: 액션 핸들러 업데이트
```javascript
// Before
<button onClick={() => setCurrentIndex(currentIndex + 1)}>

   // After
   <button onClick={actions.goToNext}>
```

#### 4단계: 유틸리티 활용
```javascript
// Before
<img src={process.env.PUBLIC_URL + banner.icon} />

// After
<img src={utils.getAssetUrl(banner.icon)} />
```

#### 5단계: 반응형 처리 개선
```javascript
// Before
const isMobile = window.innerWidth <= 768;

// After
const isMobile = data.isMobile; // 이미 계산된 값 사용
```

### 주요 변경사항 체크리스트

- [ ] props 구조를 `data`, `actions`, `utils`로 분리
- [ ] 상태 관리 코드 제거 (로직은 컴포넌트에서 처리됨)
- [ ] 직접적인 DOM 조작 대신 액션 사용
- [ ] 하드코딩된 값을 options나 data에서 가져오기
- [ ] 에디터 모드 대응 추가
- [ ] 에러 바운더리 구현 고려
- [ ] 접근성 속성 추가 (aria-label 등)

---

## 🎁 추가 팁

### 성능 최적화
```javascript
// 메모이제이션 활용
import { memo, useMemo } from 'react';

const OptimizedSkin = memo(({ data, actions }) => {
   const visibleBanners = useMemo(() => {
      // 복잡한 계산 캐싱
      return data.banners.filter(b => b.visible);
   }, [data.banners]);

   return <div>...</div>;
});
```

### 접근성 개선
```javascript
// 키보드 네비게이션 지원
<div
        role="region"
        aria-label="이미지 슬라이더"
        aria-roledescription="carousel"
>
   <div
           role="group"
           aria-label={`${banners.length}개 중 ${currentIndex + 1}번째 슬라이드`}
   >
      {/* 컨텐츠 */}
   </div>
</div>
```

### 애니메이션 처리
```javascript
// CSS transition 활용
<div
        className={`slider ${data.isTransitioning ? 'transitioning' : ''}`}
        style={{
           transform: `translateX(-${currentIndex * 100}%)`,
           transition: data.isTransitioning
                   ? `transform ${data.transitionSpeed}ms ease-in-out`
                   : 'none'
        }}
>
```

---

## 📚 참고 자료

- [외부 스킨 시스템 가이드](/docs/EXTERNAL_SKIN_SYSTEM_GUIDE.md)
- [ComponentSkinProps 인터페이스 정의](/src/types/component-skin.d.ts)
- [MainBanner 컴포넌트 소스 코드](/src/components/module/MainBanner/)

---

## 🤝 지원

질문이나 이슈가 있으신가요?

- **기술 지원**: support@webbuilder.com
- **개발자 포럼**: https://forum.webbuilder.com
- **GitHub Issues**: https://github.com/withcookie/webbuilder/issues

---

*이 문서는 MainBanner v2.0 기준으로 작성되었습니다.*