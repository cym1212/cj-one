# 컴포넌트 스킨 빠른 시작 가이드

## 5분 안에 첫 스킨 만들기

### 1. 프로젝트 생성

```bash
mkdir my-login-skin
cd my-login-skin
npm init -y
```

### 2. 필요한 패키지 설치

```bash
npm install --save-dev webpack webpack-cli babel-loader @babel/core @babel/preset-react
```

### 3. 스킨 컴포넌트 작성 (src/index.jsx)

```jsx
import React from 'react';

const MyCustomLoginSkin = ({ data, actions, options, utils }) => {
  const { t } = utils;
  const { formData = {}, loading } = data;
  const { handleSubmit, handleChange } = actions;
  const { title = '로그인', buttonColor = '#007bff' } = options;
  
  return (
    <div style={{
      maxWidth: '400px',
      margin: '50px auto',
      padding: '30px',
      borderRadius: '15px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
      background: 'white'
    }}>
      <h1 style={{ textAlign: 'center', color: '#333' }}>{title}</h1>
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '20px' }}>
          <input
            id="user_id"
            type="text"
            placeholder={t('아이디')}
            value={formData.user_id || ''}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '10px',
              fontSize: '16px',
              border: '2px solid #eee',
              borderRadius: '8px'
            }}
          />
        </div>
        
        <div style={{ marginBottom: '20px' }}>
          <input
            id="password"
            type="password"
            placeholder={t('비밀번호')}
            value={formData.password || ''}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '10px',
              fontSize: '16px',
              border: '2px solid #eee',
              borderRadius: '8px'
            }}
          />
        </div>
        
        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '12px',
            fontSize: '16px',
            fontWeight: 'bold',
            color: 'white',
            backgroundColor: buttonColor,
            border: 'none',
            borderRadius: '8px',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1
          }}
        >
          {loading ? t('로그인 중...') : t('로그인')}
        </button>
      </form>
    </div>
  );
};

// UMD 내보내기
window.MyCustomLoginSkin = MyCustomLoginSkin;
```

### 4. Webpack 설정 (webpack.config.js)

```javascript
const path = require('path');

module.exports = {
  entry: './src/index.jsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'my-login-skin.umd.js',
    library: 'MyCustomLoginSkin',
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
        test: /\.jsx?$/,
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

### 5. 빌드

```bash
npx webpack --mode production
```

### 6. 스킨 등록

WithCookie WebBuilder에서:

```javascript
import { registerComponentSkin } from '@withcookie/webbuilder';

registerComponentSkin({
  id: 'my-custom-login',
  name: '나의 커스텀 로그인',
  componentTypes: ['login'],
  umdUrl: 'https://my-cdn.com/my-login-skin.umd.js',
  globalName: 'MyCustomLoginSkin'
});
```

## 로컬 개발 및 테스트

### 1. 로컬 서버 실행

```bash
npx http-server dist -p 3001 --cors
```

### 2. 개발 모드에서 테스트

```javascript
// 개발 환경에서만 실행
if (process.env.NODE_ENV === 'development') {
  registerComponentSkin({
    id: 'my-custom-login-dev',
    name: '개발중: 나의 커스텀 로그인',
    componentTypes: ['login'],
    umdUrl: 'http://localhost:3001/my-login-skin.umd.js',
    globalName: 'MyCustomLoginSkin'
  });
}
```

## 자주 사용하는 Props

### data 객체
- `formData`: 폼 데이터
- `validationErrors`: 유효성 검사 오류
- `loading`: 로딩 상태
- `loginSuccess`: 성공 상태
- `loginError`: 오류 메시지

### actions 객체
- `handleSubmit`: 폼 제출
- `handleChange`: 입력 변경
- `handleSignupClick`: 회원가입 클릭

### utils 함수
- `t('key')`: 번역
- `navigate('/path')`: 페이지 이동
- `cx('class1', 'class2')`: 클래스 조합

## 디버깅 팁

### 1. Props 확인
```jsx
const MySkin = (props) => {
  console.log('받은 Props:', props);
  // ...
};
```

### 2. 네트워크 확인
- 개발자 도구 > Network 탭에서 스킨 파일 로드 확인
- CORS 오류 확인

### 3. 전역 변수 확인
```javascript
// 브라우저 콘솔에서
console.log(window.MyCustomLoginSkin);
```

## 배포

### GitHub Pages
```bash
# gh-pages 브랜치에 배포
npm install --save-dev gh-pages

# package.json에 추가
"scripts": {
  "deploy": "gh-pages -d dist"
}

npm run deploy
```

### AWS S3
```bash
# AWS CLI로 업로드
aws s3 cp dist/my-login-skin.umd.js s3://my-bucket/skins/ --acl public-read
```

## 예제 저장소

전체 예제 코드: https://github.com/withcookie/component-skin-example