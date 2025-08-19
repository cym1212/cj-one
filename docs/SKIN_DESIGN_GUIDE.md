# 스킨 컴포넌트 디자인 유지 가이드

## 개요
외부 환경(웹빌더 등)에서 스킨 컴포넌트를 사용할 때 Tailwind CSS 디자인을 유지하는 방법을 설명합니다.

## 핵심 전략

### 1. Tailwind CSS CDN 자동 로드
각 컴포넌트에서 Tailwind CSS를 자동으로 로드하여 외부 환경에 의존하지 않고 독립적으로 동작합니다.

```javascript
// 컴포넌트 내부에 추가
useEffect(() => {
    if (typeof window !== 'undefined' && !document.querySelector('script[src*="cdn.tailwindcss.com"]')) {
        const script = document.createElement('script');
        script.src = 'https://cdn.tailwindcss.com';
        script.async = true;
        document.head.appendChild(script);
    }
}, []);
```

#### 장점
- 외부 환경에서 Tailwind 설치 불필요
- JIT(Just-In-Time) 컴파일로 사용된 클래스만 생성
- 자동으로 스타일 적용

#### 주의사항
- 중복 로드 방지 로직 필수
- 페이지 전체에 영향을 줄 수 있음
- CDN 로드 시간 고려

### 2. 아이콘 인라인화
외부 아이콘 라이브러리 의존성을 제거하기 위해 SVG를 직접 컴포넌트에 포함합니다.

```javascript
// 아이콘 컴포넌트 인라인화 예시
const ArrowLeftIcon = ({ tailwind }: { tailwind?: string }) => (
    <svg className={tailwind} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);
```

### 3. 이미지 처리
이미지 컴포넌트를 인라인화하여 외부 의존성을 제거합니다.

```javascript
const ImageBox = ({ src, alt = '' }: ImageBoxProps) => (
    <div className="relative w-full aspect-[4/5] overflow-hidden">
        <img src={src} alt={alt} className="absolute inset-0 w-full h-full object-cover" />
    </div>
);
```

#### 중요 포인트
- `aspect-ratio` 사용으로 비율 유지
- `object-cover`로 이미지 크롭
- 고정 높이 대신 비율 기반 크기 설정

### 4. 외부 라이브러리 번들링
필수 라이브러리(예: Swiper)는 번들에 포함시킵니다.

```javascript
// webpack.config.multi.mjs
externals: {
    'react': { /* ... */ },
    'react-dom': { /* ... */ }
    // Swiper는 번들에 포함
}
```

## 스킨화 체크리스트

### 필수 작업
- [x] Tailwind CDN 자동 로드 코드 추가
- [x] 모든 아이콘을 SVG 인라인 컴포넌트로 변환
- [x] 이미지 컴포넌트 인라인화
- [x] Next.js 특정 기능(Link, Image) 제거 및 대체
- [x] 외부 라이브러리 번들링 설정

### 디자인 관련
- [x] Tailwind 클래스 그대로 유지
- [x] 고정 높이 대신 aspect-ratio 사용
- [x] 반응형 클래스(sm:, lg:) 유지
- [x] 커스텀 값(`sm:!w-[384px]`) 사용 가능

### 테스트
- [x] Tailwind CDN 없는 환경에서 테스트
- [x] 웹빌더 환경에서 디자인 확인
- [x] 이미지 비율 유지 확인
- [x] 반응형 동작 확인

## 빌드 및 배포

### 빌드 명령어
```bash
# 특정 컴포넌트 빌드
COMPONENT=main-slider npx webpack --config webpack.config.multi.mjs
```

### 생성 파일
- `poj2-main-slider.umd.js` - JavaScript 번들 (Tailwind CDN 로더 포함)
- `poj2-main-slider.css` - Swiper 등 라이브러리 스타일

### 사용 방법
```html
<!-- CSS 파일 (라이브러리 스타일) -->
<link rel="stylesheet" href="./poj2-main-slider.css">

<!-- React (필수) -->
<script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>

<!-- 컴포넌트 번들 (Tailwind CDN 자동 로드) -->
<script src="./poj2-main-slider.umd.js"></script>

<script>
    // 컴포넌트 사용
    const MainSlider = window.Poj2MainSlider;
    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(React.createElement(MainSlider, { data: sliderData }));
</script>
```

## 주의사항

### Tailwind CDN 관련
1. **로드 타이밍**: CDN 로드 전 잠시 스타일이 적용되지 않을 수 있음
2. **전역 영향**: Tailwind가 페이지 전체에 영향을 줄 수 있음
3. **버전 관리**: CDN은 항상 최신 버전 사용

### 성능 고려사항
1. **CDN 로드 시간**: 초기 로드 시 약간의 지연
2. **JIT 컴파일**: 브라우저에서 실시간 컴파일로 인한 부하
3. **캐싱**: CDN 리소스는 브라우저 캐싱 활용

### 호환성
- 모던 브라우저 필수 (ES6+ 지원)
- React 18+ 필요
- Tailwind CSS JIT 지원 브라우저

## 다른 컴포넌트 적용 시

### 1. 컴포넌트 수정
```javascript
// 1. Tailwind CDN 로더 추가
useEffect(() => {
    // 위의 CDN 로드 코드
}, []);

// 2. Next.js 컴포넌트 대체
const Link = ({ to, children, ...props }) => (
    <a href={to} onClick={(e) => { e.preventDefault(); }} {...props}>
        {children}
    </a>
);

// 3. 아이콘 인라인화
// 각 아이콘을 SVG 컴포넌트로 변환

// 4. 이미지 컴포넌트 인라인화
// ImageBox 컴포넌트 추가
```

### 2. webpack 설정 추가
```javascript
// webpack.config.multi.mjs
const components = {
    'component-name': {
        entry: './app/components/ui/ComponentName.tsx',
        name: 'Poj2ComponentName',
        filename: 'poj2-component-name'
    }
};
```

### 3. 빌드 및 테스트
```bash
COMPONENT=component-name npx webpack --config webpack.config.multi.mjs
```

## 결론
이 방법을 통해 외부 환경에서도 Tailwind CSS 디자인을 완벽하게 유지하면서 독립적으로 동작하는 스킨 컴포넌트를 만들 수 있습니다.