import path from 'path';
import { fileURLToPath } from 'url';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 컴포넌트 설정 객체
const components = {
  'main-slider': {
    entry: './app/components/ui/MainSlider.tsx',
    name: 'Poj2MainSlider',
    filename: 'poj2-main-slider'
  },
  'product-section': {
    entry: './app/components/ui/ProductSection.tsx',
    name: 'Poj2ProductSection',
    filename: 'poj2-product-section'
  },
  'md-recommend': {
    entry: './app/components/ui/MDRecommend.tsx',
    name: 'Poj2MDRecommend',
    filename: 'poj2-md-recommend'
  },
  'category-ranking': {
    entry: './app/components/ui/CategoryRanking.tsx',
    name: 'Poj2CategoryRanking',
    filename: 'poj2-category-ranking'
  },
  'recommend-service': {
    entry: './app/components/ui/RecommendService.tsx',
    name: 'Poj2RecommendService',
    filename: 'poj2-recommend-service'
  },
  // 추가 컴포넌트들을 여기에 추가할 수 있습니다
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
      // Swiper는 번들에 포함됨
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
      extensions: ['.tsx', '.ts', '.jsx', '.js'],
      alias: {
        '@': path.resolve(__dirname, 'app'),
        '@/components': path.resolve(__dirname, 'app/components')
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
let config;
if (componentName === 'all') {
  // 모든 컴포넌트 빌드
  config = Object.entries(components).map(([key, component]) => 
    createConfig(key, component)
  );
} else if (components[componentName]) {
  // 특정 컴포넌트만 빌드
  config = createConfig(componentName, components[componentName]);
} else {
  throw new Error(`Unknown component: ${componentName}`);
}

export default config;