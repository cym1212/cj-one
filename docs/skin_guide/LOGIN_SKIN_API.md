# Login 컴포넌트 외부 스킨 API 가이드

## 컴포넌트 개요

Login(로그인) 컴포넌트는 사용자 인증을 처리하는 컴포넌트입니다. 아이디/비밀번호 입력, 유효성 검사, 로그인 처리, 회원가입 연결 등의 기능을 제공합니다.

**주요 특징:**
- 아이디/비밀번호 입력 폼
- 실시간 유효성 검사
- 로그인 상태 관리
- 로그인 성공 시 자동 리다이렉트
- 커스터마이징 가능한 배경 (이미지/비디오/없음)
- 회원가입 페이지 연결
- 반응형 디자인
- 다국어 지원
- 테마 색상 적용

## ComponentSkinProps 인터페이스

```typescript
interface ComponentSkinProps {
  data: {
    // 폼 상태
    formData: {
      user_id: string;
      password: string;
    };
    validationErrors: {
      user_id?: string;
      password?: string;
    };
    loading: boolean;
    loginSuccess: boolean;
    loginError: string | null;
    
    // 테마 및 전역 상태
    theme: any;
    withcookieData: any;
    isUserLoggedIn: boolean;
    isAdminLoggedIn: boolean;
    
    // 컴포넌트 설정
    redirectUrl: string;
    backgroundType: 'none' | 'image' | 'video';
    backgroundUrl: string;
    title: string;
    buttonColor?: string;
    titleColor: string;
    labelColor: string;
    inputTextColor: string;
    style: React.CSSProperties;
    className: string;
    
    // 에디터 모드
    isEditor: boolean;
    isPreview: boolean;
  };
  
  actions: {
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleSubmit: (e: React.FormEvent) => void;
    handleSignupClick: () => void;
  };
  
  options: ComponentProps;
  mode: 'production' | 'preview' | 'editor';
  
  utils: {
    t: (key: string) => string;
    navigate: (path: string) => void;
    formatCurrency: (amount: number, currency?: string) => string;
    formatDate: (date: string | Date, format?: string) => string;
    getAssetUrl: (path: string) => string;
    cx: (...classes: (string | undefined | null | false)[]) => string;
  };
  
  app: {
    user: any | null;
    settings: Record<string, any>;
    theme: any;
    company?: {
      id: number;
    };
  };
  
  editor?: {
    isSelected: boolean;
    onSelect: () => void;
    onEdit: () => void;
    onDelete: () => void;
    dragHandleProps?: any;
  };
}
```

## Props 상세 설명

### data.formData
로그인 폼의 입력값을 담는 객체입니다:
- `user_id`: 사용자가 입력한 아이디 (**주의**: `id`가 아닌 `user_id`입니다)
- `password`: 사용자가 입력한 비밀번호

### data.validationErrors
폼 유효성 검사 오류 메시지입니다:
- `user_id`: 아이디 형식 오류 메시지 (**주의**: `id`가 아닌 `user_id`입니다)
- `password`: 비밀번호 형식 오류 메시지

### data 상태 정보
- `loading`: 로그인 요청 처리 중 여부
- `loginSuccess`: 로그인 성공 여부
- `loginError`: 로그인 실패 시 오류 메시지
- `isUserLoggedIn`: 사용자 로그인 상태
- `isAdminLoggedIn`: 관리자 로그인 상태

### data 컴포넌트 설정
- `title`: 로그인 폼 제목 (기본값: '로그인')
- `redirectUrl`: 로그인 성공 후 이동할 경로 (기본값: '/')
- `backgroundType`: 배경 타입 ('none', 'image', 'video')
- `backgroundUrl`: 배경 이미지/비디오 URL
- `titleColor`: 제목 색상
- `labelColor`: 레이블 색상
- `inputTextColor`: 입력 필드 텍스트 색상
- `buttonColor`: 버튼 색상 (테마 색상으로 대체 가능)

### actions
사용자 인터랙션을 처리하는 함수들입니다:
- `handleChange(e)`: 입력 필드 값 변경 처리
- `handleSubmit(e)`: 로그인 폼 제출 처리
- `handleSignupClick()`: 회원가입 페이지로 이동

## 스킨 개발 예제

### 기본 스킨 구조

```jsx
import React from 'react';

const MyLoginSkin = (props) => {
  const {
    data: {
      formData,
      validationErrors,
      loading,
      loginSuccess,
      loginError,
      theme,
      title,
      backgroundType,
      backgroundUrl,
      titleColor,
      labelColor,
      inputTextColor,
      buttonColor,
      style
    },
    actions: {
      handleChange,
      handleSubmit,
      handleSignupClick
    },
    utils: { t, cx }
  } = props;

  // 테마 색상
  const primaryColor = theme?.primary || buttonColor || "#007bff";
  
  // 배경 스타일
  const containerStyle = {
    ...style,
    backgroundImage: backgroundType === 'image' && backgroundUrl ? 
      `url(${backgroundUrl})` : 'none'
  };

  // 로그인 성공 메시지
  if (loginSuccess) {
    return (
      <div className="login-success">
        <p>{t('로그인되었습니다. 잠시 후 이동합니다...')}</p>
      </div>
    );
  }

  return (
    <div className="login-container" style={containerStyle}>
      {/* 비디오 배경 */}
      {backgroundType === 'video' && backgroundUrl && (
        <video className="background-video" autoPlay loop muted>
          <source src={backgroundUrl} type="video/mp4" />
        </video>
      )}
      
      <div className="login-form-wrapper">
        <h2 style={{ color: titleColor }}>{title}</h2>
        
        <form onSubmit={handleSubmit}>
          {/* 아이디 입력 */}
          <div className="form-group">
            <label style={{ color: labelColor }}>
              {t('아이디')}
            </label>
            <input
              type="text"
              id="user_id"
              value={formData.user_id}
              onChange={handleChange}
              style={{ color: inputTextColor }}
              placeholder={t('아이디를 입력하세요')}
              required
            />
            {validationErrors.user_id && (
              <span className="error-message">
                {validationErrors.user_id}
              </span>
            )}
          </div>
          
          {/* 비밀번호 입력 */}
          <div className="form-group">
            <label style={{ color: labelColor }}>
              {t('비밀번호')}
            </label>
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              style={{ color: inputTextColor }}
              placeholder={t('비밀번호를 입력하세요')}
              required
            />
            {validationErrors.password && (
              <span className="error-message">
                {validationErrors.password}
              </span>
            )}
          </div>
          
          {/* 에러 메시지 */}
          {loginError && (
            <div className="login-error">
              {loginError}
            </div>
          )}
          
          {/* 로그인 버튼 */}
          <button
            type="submit"
            className="login-button"
            style={{ backgroundColor: primaryColor }}
            disabled={loading}
          >
            {loading ? t('로그인 중...') : t('로그인')}
          </button>
        </form>
        
        {/* 회원가입 링크 */}
        <div className="signup-link">
          <p>{t('아직 회원이 아니신가요?')}</p>
          <button
            onClick={handleSignupClick}
            className="signup-button"
            style={{ color: primaryColor }}
          >
            {t('회원가입')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyLoginSkin;
```

## 주요 기능 구현 가이드

### 1. 폼 유효성 검사

유효성 검사는 LoginLogic에서 자동으로 처리되며, 오류 메시지는 `validationErrors`에 제공됩니다:

```jsx
// 아이디 오류 표시
{validationErrors.user_id && (
  <div className="error-field">
    <i className="error-icon">⚠️</i>
    <span>{validationErrors.user_id}</span>
  </div>
)}

// 비밀번호 오류 표시
{validationErrors.password && (
  <div className="error-field">
    <i className="error-icon">⚠️</i>
    <span>{validationErrors.password}</span>
  </div>
)}
```

### 2. 로딩 상태 처리

```jsx
// 로딩 중일 때 버튼 비활성화 및 스피너 표시
<button 
  type="submit" 
  disabled={loading}
  className={cx('login-btn', loading && 'loading')}
>
  {loading ? (
    <>
      <span className="spinner"></span>
      {t('로그인 중...')}
    </>
  ) : (
    t('로그인')
  )}
</button>
```

### 3. 배경 처리

```jsx
// 배경 타입에 따른 처리
const renderBackground = () => {
  switch (backgroundType) {
    case 'image':
      return backgroundUrl ? (
        <div 
          className="background-image"
          style={{ backgroundImage: `url(${backgroundUrl})` }}
        />
      ) : null;
      
    case 'video':
      return backgroundUrl ? (
        <video 
          className="background-video" 
          autoPlay 
          loop 
          muted
          playsInline
        >
          <source src={backgroundUrl} type="video/mp4" />
        </video>
      ) : null;
      
    case 'none':
    default:
      return null;
  }
};
```

### 4. 테마 색상 적용

```jsx
// 테마 색상 우선순위: theme.primary > buttonColor > 기본값
const primaryColor = theme?.primary || buttonColor || "#007bff";

// 어두운 색상 생성 (호버 효과용)
const darkenColor = (color, percent) => {
  // 색상을 어둡게 만드는 로직
};

const primaryDarkColor = darkenColor(primaryColor, 15);

// 버튼 스타일
const buttonStyle = {
  backgroundColor: primaryColor,
  ':hover': {
    backgroundColor: primaryDarkColor
  }
};
```

### 5. 반응형 디자인

```jsx
// 모바일 감지
const isMobile = window.innerWidth <= 768;

return (
  <div className={cx('login-form', isMobile && 'mobile')}>
    {/* 모바일에서는 다른 레이아웃 적용 */}
    {isMobile ? (
      <div className="mobile-layout">
        {/* 모바일 최적화 UI */}
      </div>
    ) : (
      <div className="desktop-layout">
        {/* 데스크톱 UI */}
      </div>
    )}
  </div>
);
```

## 스타일링 팁

### 입력 필드 스타일
```css
.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
}

.form-group input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  transition: border-color 0.2s;
}

.form-group input:focus {
  outline: none;
  border-color: var(--primary-color);
}

/* 에러 상태 */
.form-group.error input {
  border-color: #dc3545;
  background-color: #fff5f5;
}

.error-message {
  color: #dc3545;
  font-size: 14px;
  margin-top: 4px;
  display: block;
}
```

### 버튼 스타일
```css
.login-button {
  width: 100%;
  padding: 14px 20px;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
}

.login-button:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.login-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* 로딩 스피너 */
.spinner {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid #fff;
  border-radius: 50%;
  border-top-color: transparent;
  animation: spin 0.8s linear infinite;
  margin-right: 8px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
```

### 배경 오버레이
```css
/* 배경 이미지/비디오 위에 오버레이 추가 */
.background-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1;
}

.login-form-wrapper {
  position: relative;
  z-index: 2;
  background: rgba(255, 255, 255, 0.95);
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}
```

## 주의사항

1. **로그인 성공 처리**: 로그인 성공 시 자동으로 redirectUrl로 이동합니다. 스킨에서는 성공 메시지만 표시하면 됩니다.
2. **에디터 모드**: isEditor가 true일 때는 실제 로그인 요청을 보내지 않습니다.
3. **필수 입력**: user_id와 비밀번호는 필수 입력 항목입니다.
4. **중복 로그인 방지**: 이미 로그인된 상태에서는 자동으로 redirectUrl로 이동합니다.
5. **에러 처리**: 네트워크 오류나 서버 오류는 loginError에 표시됩니다.

## 외부 스킨 개발 시 주의사항

### 필드명 주의
- **올바른 필드명**: `formData.user_id`, `validationErrors.user_id`
- **잘못된 필드명**: `formData.id`, `validationErrors.id` (❌ 작동하지 않음)

### Actions 함수 타입
- `handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void`
- `handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void` (❗ `FormEvent`가 아닌 `FormEvent<HTMLFormElement>`)
- `handleSignupClick: () => void`

### 외부 스킨 에러 처리
외부 스킨에서 에러가 발생하면 자동으로 기본 스킨으로 폴백됩니다:
```javascript
// 외부 스킨에서 에러 발생 시 기본 스킨으로 전환
try {
  // 외부 스킨 로딩
} catch (error) {
  console.error('외부 스킨 에러:', error);
  // 기본 스킨으로 폴백
}
```

### 디버깅 팁
1. **브라우저 콘솔** 확인: 외부 스킨 로딩 에러
2. **네트워크 탭** 확인: 스킨 리소스 로딩 실패
3. **필드명 확인**: `user_id` vs `id` 혼동 주의

## 다국어 키

주요 다국어 키 목록:
- `'로그인'`
- `'아이디'`
- `'비밀번호'`
- `'아이디를 입력하세요'`
- `'비밀번호를 입력하세요'`
- `'로그인 중...'`
- `'로그인되었습니다. 잠시 후 이동합니다...'`
- `'아직 회원이 아니신가요?'`
- `'회원가입'`
- `'아이디를 입력해주세요'`
- `'아이디는 2~20자로 입력해주세요'`
- `'비밀번호를 입력해주세요'`
- `'브라우저가 비디오 태그를 지원하지 않습니다.'`