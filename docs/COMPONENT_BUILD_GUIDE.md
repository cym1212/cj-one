# 선택적 컴포넌트 빌드 시스템 설정 가이드

이 가이드는 Webpack을 사용하여 React 프로젝트의 개별 컴포넌트를 선택적으로 빌드하는 시스템을 설정하는 방법을 설명합니다.

## 개요

이 시스템을 사용하면:
- 전체 프로젝트를 빌드하지 않고 특정 컴포넌트만 빌드 가능
- 각 컴포넌트는 독립적인 UMD 모듈로 번들링
- CSS와 JS 파일이 분리되어 생성
- npm 스크립트로 간편하게 빌드 실행

## 필요한 패키지 설치

```bash
npm install --save-dev webpack webpack-cli
npm install --save-dev babel-loader @babel/core @babel/preset-react @babel/preset-typescript
npm install --save-dev @babel/plugin-proposal-class-properties @babel/plugin-proposal-object-rest-spread
npm install --save-dev css-loader postcss-loader
npm install --save-dev mini-css-extract-plugin
npm install --save-dev terser-webpack-plugin css-minimizer-webpack-plugin
```

## 1단계: Webpack 설정 파일 생성

프로젝트 루트에 `webpack.config.multi.cjs` 파일을 생성합니다:

```javascript
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

// 컴포넌트 설정 객체
const components = {
    'component-name': {
        entry: './path/to/component/Component.tsx',
        name: 'ComponentExportName',
        filename: 'output-filename'
    },
    // 추가 컴포넌트들...
};

// CLI에서 컴포넌트 이름 가져오기
const componentName = process.env.COMPONENT || 'all';

// 단일 컴포넌트용 설정 생성 함수
function createConfig(key, component) {
    return {
        entry: component.entry,
        output: {
            path: path.resolve(__dirname, 'dist', key),
            filename: `${component.filename}.umd.js`,
            library: {
                name: component.name,
                type: 'umd',
                export: 'default'
            },
            globalObject: 'this'
        },
        externals: {
            'react': {
                commonjs: 'react',
                commonjs2: 'react',
                amd: 'react',
                root: 'React'
            },
            'react-dom': {
                commonjs: 'react-dom',
                commonjs2: 'react-dom',
                amd: 'react-dom',
                root: 'ReactDOM'
            }
        },
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: [
                                '@babel/preset-react',
                                '@babel/preset-typescript'
                            ],
                            plugins: [
                                '@babel/plugin-proposal-class-properties',
                                '@babel/plugin-proposal-object-rest-spread'
                            ]
                        }
                    }
                },
                {
                    test: /\.css$/,
                    use: [
                        MiniCssExtractPlugin.loader,
                        'css-loader',
                        'postcss-loader'
                    ]
                }
            ]
        },
        resolve: {
            extensions: ['.tsx', '.ts', '.jsx', '.js'],
            alias: {
                // 프로젝트의 경로 별칭 설정
                '@': path.resolve(__dirname, 'src'),
                '@/components': path.resolve(__dirname, 'src/components')
            }
        },
        plugins: [
            new MiniCssExtractPlugin({
                filename: `${component.filename}.css`
            })
        ],
        optimization: {
            minimizer: [
                new TerserPlugin({
                    terserOptions: {
                        compress: {
                            drop_console: false,
                        },
                    },
                }),
                new CssMinimizerPlugin()
            ]
        },
        mode: 'production'
    };
}

// 설정 내보내기
if (componentName === 'all') {
    // 모든 컴포넌트 빌드
    module.exports = Object.entries(components).map(([key, component]) =>
        createConfig(key, component)
    );
} else if (components[componentName]) {
    // 특정 컴포넌트만 빌드
    module.exports = createConfig(componentName, components[componentName]);
} else {
    throw new Error(`Unknown component: ${componentName}`);
}
```

## 2단계: 컴포넌트 설정 추가

`components` 객체에 빌드하려는 컴포넌트들을 추가합니다:

```javascript
const components = {
    'button': {
        entry: './src/components/Button.tsx',
        name: 'Button',           // UMD 라이브러리 이름
        filename: 'button'        // 출력 파일 이름 (button.umd.js, button.css)
    },
    'modal': {
        entry: './src/components/Modal.tsx',
        name: 'Modal',
        filename: 'modal'
    },
    'form': {
        entry: './src/components/Form.tsx',
        name: 'FormComponent',
        filename: 'form-component'
    }
};
```

## 3단계: package.json에 스크립트 추가

`package.json`의 `scripts` 섹션에 빌드 명령어를 추가합니다:

```json
{
  "scripts": {
    "build:component:all": "COMPONENT=all webpack --config webpack.config.multi.cjs",
    "build:component:button": "COMPONENT=button webpack --config webpack.config.multi.cjs",
    "build:component:modal": "COMPONENT=modal webpack --config webpack.config.multi.cjs",
    "build:component:form": "COMPONENT=form webpack --config webpack.config.multi.cjs"
  }
}
```

### Windows 환경에서 사용하기

Windows에서는 환경 변수 설정 방식이 다르므로 `cross-env`를 사용합니다:

```bash
npm install --save-dev cross-env
```

```json
{
  "scripts": {
    "build:component:all": "cross-env COMPONENT=all webpack --config webpack.config.multi.cjs",
    "build:component:button": "cross-env COMPONENT=button webpack --config webpack.config.multi.cjs"
  }
}
```

## 4단계: 경로 별칭 설정 (선택사항)

TypeScript를 사용하는 경우 `tsconfig.json`에도 경로 별칭을 설정합니다:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@/components/*": ["src/components/*"]
    }
  }
}
```

## 사용 방법

### 특정 컴포넌트 빌드
```bash
npm run build:component:button
```

### 모든 컴포넌트 빌드
```bash
npm run build:component:all
```

### 빌드 결과물
빌드된 파일은 `dist/[component-name]/` 디렉토리에 생성됩니다:
- `dist/button/button.umd.js` - JavaScript 번들
- `dist/button/button.css` - CSS 파일

## 고급 설정

### 외부 라이브러리 처리

특정 라이브러리를 번들에 포함시키거나 제외하려면 `externals` 설정을 수정합니다:

```javascript
externals: {
    // React는 제외 (외부에서 제공)
    'react': {
        commonjs: 'react',
            commonjs2: 'react',
            amd: 'react',
            root: 'React'
    },
    // Swiper는 번들에 포함
    // 'swiper': 제외하지 않음으로써 번들에 포함됨
}
```

### PostCSS 설정

Tailwind CSS나 다른 PostCSS 플러그인을 사용하는 경우 `postcss.config.js` 파일을 생성합니다:

```javascript
module.exports = {
    plugins: {
        'tailwindcss': {},
        'autoprefixer': {},
    }
}
```

### 환경별 설정

개발/프로덕션 환경에 따라 다른 설정을 적용하려면:

```javascript
const isDevelopment = process.env.NODE_ENV === 'development';

module.exports = {
    mode: isDevelopment ? 'development' : 'production',
    devtool: isDevelopment ? 'source-map' : false,
    // ...
};
```

## 문제 해결

### 1. 모듈을 찾을 수 없음
- 경로 별칭이 올바르게 설정되었는지 확인
- `resolve.extensions`에 필요한 확장자가 포함되어 있는지 확인

### 2. CSS가 제대로 빌드되지 않음
- PostCSS 설정 파일이 있는지 확인
- `postcss-loader`가 설치되어 있는지 확인

### 3. React is not defined 에러
- `externals` 설정이 올바른지 확인
- UMD 모듈을 사용하는 페이지에 React가 로드되어 있는지 확인

## 예제: 새 컴포넌트 추가하기

1. 컴포넌트 파일 생성 (`src/components/Card.tsx`)
2. webpack.config.multi.cjs에 설정 추가:
```javascript
'card': {
    entry: './src/components/Card.tsx',
        name: 'Card',
        filename: 'card'
}
```
3. package.json에 스크립트 추가:
```json
"build:component:card": "COMPONENT=card webpack --config webpack.config.multi.cjs"
```
4. 빌드 실행:
```bash
npm run build:component:card
```

## 빌드된 컴포넌트 테스트하기

### 테스트 HTML 파일 생성

빌드된 컴포넌트를 테스트하고 디자인을 확인하기 위해 HTML 파일을 생성합니다.

`test/index.html` 파일 생성:

```html
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>컴포넌트 테스트</title>
    
    <!-- React와 ReactDOM CDN -->
    <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
    <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
    
    <!-- 빌드된 컴포넌트 CSS -->
    <link rel="stylesheet" href="../dist/button/button.css">
    
    <!-- 기본 스타일 (선택사항) -->
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            padding: 40px;
            background-color: #f5f5f5;
        }
        .test-container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            padding: 40px;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .test-section {
            margin-bottom: 40px;
        }
        .test-section h2 {
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 2px solid #eee;
        }
        #root {
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="test-container">
        <h1>컴포넌트 테스트 페이지</h1>
        
        <div class="test-section">
            <h2>Button 컴포넌트</h2>
            <div id="button-root"></div>
        </div>
        
        <div class="test-section">
            <h2>Modal 컴포넌트</h2>
            <div id="modal-root"></div>
        </div>
        
        <!-- 추가 컴포넌트 테스트 영역 -->
    </div>
    
    <!-- 빌드된 컴포넌트 JavaScript -->
    <script src="../dist/button/button.umd.js"></script>
    <script src="../dist/modal/modal.umd.js"></script>
    
    <!-- 컴포넌트 렌더링 스크립트 -->
    <script>
        // Button 컴포넌트 렌더링
        if (typeof Button !== 'undefined') {
            const buttonContainer = document.getElementById('button-root');
            const buttonRoot = ReactDOM.createRoot(buttonContainer);
            
            // React.createElement를 사용하여 컴포넌트 생성
            const buttonElement = React.createElement(Button, {
                onClick: () => alert('버튼 클릭!'),
                children: '테스트 버튼'
            });
            
            buttonRoot.render(buttonElement);
        }
        
        // Modal 컴포넌트 렌더링 (예제)
        if (typeof Modal !== 'undefined') {
            const modalContainer = document.getElementById('modal-root');
            const modalRoot = ReactDOM.createRoot(modalContainer);
            
            const modalElement = React.createElement(Modal, {
                isOpen: true,
                title: '테스트 모달',
                children: '모달 내용입니다.'
            });
            
            modalRoot.render(modalElement);
        }
    </script>
</body>
</html>
```

### 다양한 Props 테스트를 위한 고급 테스트 페이지

`test/advanced-test.html` 파일:

```html
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>컴포넌트 고급 테스트</title>
    
    <!-- React와 ReactDOM CDN -->
    <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
    <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
    
    <!-- 빌드된 컴포넌트 CSS -->
    <link rel="stylesheet" href="../dist/button/button.css">
    
    <style>
        body {
            font-family: system-ui, -apple-system, sans-serif;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
        }
        .test-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            max-width: 1400px;
            margin: 0 auto;
        }
        .test-card {
            background: white;
            border-radius: 12px;
            padding: 24px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.1);
        }
        .test-card h3 {
            margin: 0 0 16px 0;
            color: #333;
            font-size: 18px;
        }
        .test-card .description {
            color: #666;
            font-size: 14px;
            margin-bottom: 16px;
        }
        .component-container {
            padding: 16px;
            background: #f8f9fa;
            border-radius: 8px;
            min-height: 60px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
    </style>
</head>
<body>
    <h1 style="text-align: center; color: white; margin-bottom: 40px;">
        컴포넌트 테스트 갤러리
    </h1>
    
    <div class="test-grid">
        <!-- Primary Button -->
        <div class="test-card">
            <h3>Primary Button</h3>
            <p class="description">기본 버튼 스타일</p>
            <div class="component-container" id="btn-primary"></div>
        </div>
        
        <!-- Secondary Button -->
        <div class="test-card">
            <h3>Secondary Button</h3>
            <p class="description">보조 버튼 스타일</p>
            <div class="component-container" id="btn-secondary"></div>
        </div>
        
        <!-- Disabled Button -->
        <div class="test-card">
            <h3>Disabled Button</h3>
            <p class="description">비활성화된 버튼</p>
            <div class="component-container" id="btn-disabled"></div>
        </div>
        
        <!-- Large Button -->
        <div class="test-card">
            <h3>Large Button</h3>
            <p class="description">큰 사이즈 버튼</p>
            <div class="component-container" id="btn-large"></div>
        </div>
        
        <!-- Small Button -->
        <div class="test-card">
            <h3>Small Button</h3>
            <p class="description">작은 사이즈 버튼</p>
            <div class="component-container" id="btn-small"></div>
        </div>
        
        <!-- Icon Button -->
        <div class="test-card">
            <h3>Icon Button</h3>
            <p class="description">아이콘이 포함된 버튼</p>
            <div class="component-container" id="btn-icon"></div>
        </div>
    </div>
    
    <!-- 컴포넌트 스크립트 -->
    <script src="../dist/button/button.umd.js"></script>
    
    <script>
        // 테스트 케이스 정의
        const testCases = [
            {
                id: 'btn-primary',
                props: { variant: 'primary', children: 'Primary Button' }
            },
            {
                id: 'btn-secondary',
                props: { variant: 'secondary', children: 'Secondary Button' }
            },
            {
                id: 'btn-disabled',
                props: { disabled: true, children: 'Disabled Button' }
            },
            {
                id: 'btn-large',
                props: { size: 'large', children: 'Large Button' }
            },
            {
                id: 'btn-small',
                props: { size: 'small', children: 'Small Button' }
            },
            {
                id: 'btn-icon',
                props: { 
                    children: '❤️ Icon Button',
                    variant: 'primary'
                }
            }
        ];
        
        // 각 테스트 케이스 렌더링
        testCases.forEach(test => {
            const container = document.getElementById(test.id);
            if (container && typeof Button !== 'undefined') {
                const root = ReactDOM.createRoot(container);
                root.render(React.createElement(Button, test.props));
            }
        });
    </script>
</body>
</html>
```

### 로컬 서버로 테스트하기

정적 HTML 파일을 직접 열면 CORS 에러가 발생할 수 있으므로, 간단한 로컬 서버를 사용하는 것이 좋습니다:

#### 방법 1: Python 사용
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

#### 방법 2: Node.js http-server 사용
```bash
# http-server 설치
npm install -g http-server

# 서버 실행
http-server -p 8000
```

#### 방법 3: VS Code Live Server 확장 사용
1. VS Code에서 "Live Server" 확장 설치
2. HTML 파일에서 우클릭 → "Open with Live Server"

### package.json에 테스트 스크립트 추가

편의를 위해 package.json에 테스트 서버 스크립트를 추가할 수 있습니다:

```json
{
  "scripts": {
    "test:serve": "npx http-server -p 8080 -o test/index.html",
    "test:build-and-serve": "npm run build:component:all && npm run test:serve"
  }
}
```

### 디버깅 팁

1. **콘솔 확인**: 브라우저 개발자 도구에서 에러 메시지 확인
2. **네트워크 탭**: 파일이 제대로 로드되는지 확인
3. **React DevTools**: React 컴포넌트 트리와 props 확인
4. **소스맵**: 개발 모드에서 `devtool: 'source-map'` 옵션 사용

이제 빌드된 컴포넌트를 HTML 파일에서 직접 테스트하고 디자인을 확인할 수 있습니다!