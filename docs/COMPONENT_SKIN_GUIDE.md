# 컴포넌트 스킨 개발 가이드

## 개요

WithCookie WebBuilder의 컴포넌트 스킨 시스템을 사용하면 컴포넌트의 로직과 UI를 분리하여 다양한 디자인을 적용할 수 있습니다. 하나의 컴포넌트에 여러 스킨을 적용할 수 있으며, 외부에서 개발한 스킨을 UMD 모듈로 로드할 수 있습니다.

## 스킨 시스템의 장점

- **재사용성**: 한 번 만든 스킨을 여러 프로젝트에서 사용
- **유지보수**: 로직과 UI 분리로 관리 용이
- **커스터마이징**: 프로젝트별로 다른 디자인 적용 가능
- **일관성**: 동일한 로직에 다양한 UI 적용

## 컴포넌트 스킨 Props 인터페이스

모든 컴포넌트 스킨은 다음과 같은 표준 props를 받습니다:

```typescript
interface ComponentSkinProps {
  // 컴포넌트 데이터
  data: {
    id: string;
    type: string;
    props: Record<string, any>;
    // 컴포넌트별 추가 데이터 (예: formData, validationErrors 등)
    [key: string]: any;
  };
  
  // 컴포넌트 액션
  actions: {
    // 컴포넌트별 액션 함수들
    [actionName: string]: Function;
  };
  
  // 컴포넌트 옵션 (사용자가 설정한 값)
  options: {
    [optionName: string]: any;
  };
  
  // 렌더링 모드
  mode: 'editor' | 'preview' | 'production';
  
  // 유틸리티 함수
  utils: {
    t: (key: string) => string; // 번역
    navigate: (path: string) => void; // 페이지 이동
    formatCurrency: (amount: number) => string;
    formatDate: (date: Date | string) => string;
    getAssetUrl: (path: string) => string;
    cx: (...classes: any[]) => string; // 클래스명 조합
  };
  
  // 앱 전역 데이터 (선택적)
  app?: {
    user?: any;
    company?: any;
    currentLanguage?: string;
    theme?: any;
  };
  
  // 에디터 모드 전용 props
  editor?: {
    isSelected: boolean;
    onSelect: () => void;
    onEdit: () => void;
    onDelete: () => void;
  };
}
```

## 스킨 개발 방법

### 1. 기본 스킨 구조

```jsx
import React from 'react';

const MyLoginSkin = ({ data, actions, options, mode, utils, app }) => {
  const { t, cx } = utils;
  const { handleSubmit, handleChange } = actions;
  const { formData, validationErrors, loading } = data;
  const { title, buttonColor } = options;
  
  return (
    <div className={cx('login-form', loading && 'loading')}>
      <h2>{title || t('로그인')}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={formData.user_id}
          onChange={handleChange}
          placeholder={t('아이디')}
        />
        <button 
          type="submit"
          style={{ backgroundColor: buttonColor }}
        >
          {t('로그인')}
        </button>
      </form>
    </div>
  );
};

export default MyLoginSkin;
```

### 2. UMD 빌드 설정 (Webpack)

```javascript
// webpack.config.js
module.exports = {
  entry: './src/MyLoginSkin.jsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'my-login-skin.umd.js',
    library: 'MyLoginSkin',
    libraryTarget: 'umd',
    globalObject: 'this'
  },
  externals: {
    'react': 'React',
    'react-dom': 'ReactDOM'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-react']
          }
        }
      }
    ]
  }
};
```

### 3. 스킨 등록

```javascript
import { registerComponentSkin } from '@withcookie/webbuilder-sdk';

registerComponentSkin({
  id: 'my-login-skin',
  name: '나의 로그인 스킨',
  componentTypes: ['login'], // 지원하는 컴포넌트 타입
  umdUrl: 'https://mycdn.com/my-login-skin.umd.js',
  cssUrls: ['https://mycdn.com/my-login-skin.css'],
  globalName: 'MyLoginSkin',
  preview: 'https://mycdn.com/preview.png',
  description: '커스텀 로그인 스킨',
  author: '개발자명',
  version: '1.0.0'
});
```

## 예제: 글래스모피즘 로그인 스킨

### 1. 스킨 컴포넌트 (GlassmorphismLogin.jsx)

```jsx
import React from 'react';

const GlassmorphismLogin = ({ data, actions, options, utils }) => {
  const { t } = utils;
  const { formData, validationErrors, loading, loginError, loginSuccess } = data;
  const { handleSubmit, handleChange, handleSignupClick } = actions;
  const { title = t('로그인'), buttonColor = '#ffffff20' } = options;
  
  return (
    <div className="glass-login-container">
      <div className="glass-login-card">
        <h2 className="glass-login-title">{title}</h2>
        
        {loginSuccess ? (
          <div className="glass-success-message">
            {t('로그인 성공!')}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="glass-login-form">
            <div className="glass-input-group">
              <input
                id="user_id"
                type="text"
                className="glass-input"
                placeholder={t('아이디')}
                value={formData.user_id || ''}
                onChange={handleChange}
                required
              />
              {validationErrors?.user_id && (
                <span className="glass-error">{validationErrors.user_id}</span>
              )}
            </div>
            
            <div className="glass-input-group">
              <input
                id="password"
                type="password"
                className="glass-input"
                placeholder={t('비밀번호')}
                value={formData.password || ''}
                onChange={handleChange}
                required
              />
              {validationErrors?.password && (
                <span className="glass-error">{validationErrors.password}</span>
              )}
            </div>
            
            {loginError && (
              <div className="glass-error-message">{loginError}</div>
            )}
            
            <button
              type="submit"
              className="glass-button"
              style={{ backgroundColor: buttonColor }}
              disabled={loading}
            >
              {loading ? t('로그인 중...') : t('로그인')}
            </button>
            
            <button
              type="button"
              className="glass-button glass-button-secondary"
              onClick={handleSignupClick}
            >
              {t('회원가입')}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

// UMD 내보내기
if (typeof module !== 'undefined' && module.exports) {
  module.exports = GlassmorphismLogin;
} else {
  window.GlassmorphismLogin = GlassmorphismLogin;
}
```

### 2. 스타일 (glassmorphism-login.css)

```css
.glass-login-container {
  width: 100%;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  overflow: hidden;
}

.glass-login-container::before {
  content: '';
  position: absolute;
  width: 400px;
  height: 400px;
  background: linear-gradient(#f00, #f0f);
  border-radius: 50%;
  top: -200px;
  right: -200px;
  filter: blur(80px);
}

.glass-login-container::after {
  content: '';
  position: absolute;
  width: 300px;
  height: 300px;
  background: linear-gradient(#00f, #0ff);
  border-radius: 50%;
  bottom: -150px;
  left: -150px;
  filter: blur(80px);
}

.glass-login-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 40px;
  width: 90%;
  max-width: 400px;
  position: relative;
  z-index: 1;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.glass-login-title {
  text-align: center;
  color: white;
  margin-bottom: 30px;
  font-size: 28px;
  font-weight: 600;
}

.glass-login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.glass-input-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.glass-input {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  padding: 12px 16px;
  color: white;
  font-size: 16px;
  transition: all 0.3s ease;
}

.glass-input::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

.glass-input:focus {
  outline: none;
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.4);
}

.glass-button {
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  padding: 12px 24px;
  color: white;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.glass-button:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

.glass-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.glass-button-secondary {
  background: transparent;
}

.glass-error {
  color: #ff6b6b;
  font-size: 12px;
  margin-top: 4px;
}

.glass-error-message {
  background: rgba(255, 107, 107, 0.2);
  border: 1px solid rgba(255, 107, 107, 0.4);
  border-radius: 10px;
  padding: 12px;
  color: white;
  text-align: center;
}

.glass-success-message {
  background: rgba(76, 175, 80, 0.2);
  border: 1px solid rgba(76, 175, 80, 0.4);
  border-radius: 10px;
  padding: 20px;
  color: white;
  text-align: center;
  font-size: 18px;
}
```

## 개발 팁

### 1. Props 활용

- `mode`를 활용하여 에디터/프리뷰/프로덕션 환경별 다른 동작 구현
- `utils` 함수들을 활용하여 일관된 포맷팅과 번역 제공
- `app` 데이터로 전역 상태 접근 가능

### 2. 반응형 디자인

```jsx
const MyResponsiveSkin = ({ data, utils }) => {
  const { cx } = utils;
  
  return (
    <div className={cx(
      'my-skin',
      'my-skin--mobile', // 모바일 스타일
      'md:my-skin--tablet', // 태블릿 스타일
      'lg:my-skin--desktop' // 데스크톱 스타일
    )}>
      {/* 컨텐츠 */}
    </div>
  );
};
```

### 3. 테마 지원

```jsx
const ThemedSkin = ({ app, options }) => {
  const theme = app?.theme || {};
  const { primaryColor = theme.primary || '#007bff' } = options;
  
  return (
    <div style={{ 
      '--primary-color': primaryColor,
      '--text-color': theme.textColor
    }}>
      {/* 컨텐츠 */}
    </div>
  );
};
```

## 배포 및 호스팅

### 1. CDN 호스팅

- AWS S3 + CloudFront
- Cloudflare Pages
- jsDelivr (GitHub 연동)
- unpkg (npm 패키지)

### 2. CORS 설정

외부 스킨을 호스팅할 때는 CORS 헤더를 설정해야 합니다:

```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET
```

### 3. 버전 관리

- 스킨 URL에 버전 포함: `https://cdn.com/skins/login-v1.0.0.umd.js`
- 캐시 무효화를 위한 쿼리 파라미터: `?v=1.0.0`

## 문제 해결

### 1. 스킨이 로드되지 않을 때

- 브라우저 콘솔에서 네트워크 오류 확인
- CORS 설정 확인
- 전역 변수명(globalName) 일치 확인

### 2. 스타일이 적용되지 않을 때

- CSS 파일 로드 확인
- CSS 선택자 우선순위 확인
- 스코프 충돌 확인

### 3. Props가 전달되지 않을 때

- 컴포넌트의 useLogic이 필요한 데이터를 반환하는지 확인
- actions 객체에 필요한 함수가 포함되어 있는지 확인

## 다음 단계

- 더 많은 컴포넌트를 스킨 시스템으로 마이그레이션
- 스킨 마켓플레이스 구축
- 스킨 에디터 도구 개발