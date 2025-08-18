# CategoryMenu 컴포넌트 외부 스킨 API 가이드

## 컴포넌트 개요

CategoryMenu(카테고리 메뉴) 컴포넌트는 전자상거래 사이트의 카테고리 네비게이션 기능을 제공하는 컴포넌트입니다. 계층적 메뉴 구조, 라우팅, 다양한 레이아웃 스타일을 지원하며, 카테고리 선택 시 해당 카테고리의 상품을 자동으로 조회합니다.

**주요 특징:**
- 계층적 메뉴 구조 (최대 3단계)
- 동적 메뉴 아이템 설정
- 라우팅 기능
- 카테고리별 상품 자동 조회 (Redux 연동)
- 다양한 레이아웃 (리스트, 그리드, 드롭다운)
- 카테고리 정보 표시
- 하위 메뉴 탐색 기능 (한 depth씩 표시)
- Breadcrumb 네비게이션
- 아이콘 및 설명 표시 옵션
- 반응형 디자인 지원
- 다국어 지원

## ComponentSkinProps 인터페이스

```typescript
interface ComponentSkinProps {
  data: {
    // 기본 정보
    id: string;
    className: string;
    style: React.CSSProperties;
    componentProps: {
      menuItems: CategoryMenuItem[];      // 메뉴 아이템 배열
      showProductCount: boolean;          // 상품 개수 표시 여부
      showIcon: boolean;                  // 아이콘 표시 여부
      showDescription: boolean;           // 설명 표시 여부
      showCategoryInfo: boolean;          // 카테고리 정보 표시 여부
      layout: 'list' | 'grid' | 'dropdown'; // 레이아웃 스타일
      columns: number;                    // 그리드 열 개수
      emptyMessage: string;               // 빈 메뉴 메시지
      skin: string;                       // 스킨 선택
    };
    
    // 상태 정보
    menuItems: CategoryMenuItem[];        // 메뉴 아이템 배열 (componentProps에서 전달된 것과 동일)
    loading: boolean;                     // 로딩 상태
    error: string | null;                 // 에러 메시지
    selectedItemId: string | null;        // 선택된 메뉴 아이템 ID
    isExpanded: boolean;                  // 드롭다운 확장 상태
    breadcrumb: Array<{                   // 현재 카테고리 경로 (v2.0+)
      id: number;
      name: string;
      parentId: number | null;
    }>;
    currentChildren: CategoryMenuItem[];  // 현재 depth의 하위 메뉴들 (v2.0+)
  };
  
  actions: {
    handleMenuItemClick: (item: CategoryMenuItem) => void;  // 메뉴 아이템 클릭 핸들러
    toggleExpanded: () => void;                            // 드롭다운 토글
    handleBackToRoot: () => void;                          // 루트(전체)로 되돌아가기 (v2.1+)
  };
  
  utils: {
    t: (key: string) => string;                            // 번역 함수
    navigate: (path: string, options?: any) => void;       // 라우팅 함수
    formatDate: (date: Date | string, format?: string) => string; // 날짜 포맷
    formatCurrency: (amount: number, currency?: string) => string; // 통화 포맷
    getAssetUrl: (path: string) => string;                 // 에셋 URL 생성
    cx: (...classes: any[]) => string;                     // 클래스명 결합
  };
  
  app: {
    user: any;                             // 사용자 정보
    company: any;                          // 회사 정보
    currentLanguage: string;               // 현재 언어
    isUserLoggedIn: boolean;               // 로그인 상태
    theme: object;                         // 테마 정보
  };
  
  mode: 'editor' | 'preview' | 'production';
  
  editor?: {
    isSelected: boolean;
  };
}
```

## 메뉴 아이템 데이터 구조

### CategoryMenuItem 인터페이스

```typescript
interface CategoryMenuItem {
  id: string;                    // 고유 ID (menu-1234567890123 형식)
  categoryId: number;            // 선택된 카테고리 ID
  categoryName: string;          // 카테고리 이름 (표시용)
  routingPath: string;           // shopping 다음 경로 (예: /electronics)
  parentId: string | null;       // 부모 메뉴 ID (계층 구조용)
  order: number;                 // 정렬 순서
  visible: boolean;              // 표시 여부
  children?: CategoryMenuItem[]; // 하위 메뉴들 (렌더링 시 자동 생성)
}
```

## 속성 패널 설정

### 메뉴 아이템 설정

| 속성명 | 타입 | 기본값 | 설명 |
|--------|------|--------|------|
| `menuItems` | CategoryMenuItem[] | `[]` | 동적 메뉴 아이템 배열 |

메뉴 아이템은 속성 패널에서 다음과 같이 관리됩니다:
- 추가: "메뉴 추가" 버튼으로 새 아이템 추가
- 편집: 아이템 더블클릭으로 모달 열기
- 삭제: 호버 시 나타나는 X 버튼으로 삭제
- 순서 변경: 드래그 앤 드롭으로 순서 및 계층 변경

### 표시 옵션

| 속성명 | 타입 | 기본값 | 설명 |
|--------|------|--------|------|
| `showProductCount` | boolean | `false` | 상품 개수 표시 여부 (현재 미지원) |
| `showIcon` | boolean | `false` | 아이콘 표시 여부 |
| `showDescription` | boolean | `false` | 설명(라우팅 경로) 표시 여부 |
| `showCategoryInfo` | boolean | `true` | 카테고리 정보 표시 여부 |

### 레이아웃 설정

| 속성명 | 타입 | 기본값 | 설명 |
|--------|------|--------|------|
| `layout` | 'list' \| 'grid' \| 'dropdown' | `'list'` | 레이아웃 스타일 |
| `columns` | number | `3` | 그리드 열 개수 (2, 3, 4, 6 중 선택) |

### 기타 설정

| 속성명 | 타입 | 기본값 | 설명 |
|--------|------|--------|------|
| `emptyMessage` | string | `'메뉴가 없습니다.'` | 빈 메뉴 메시지 |

## 핵심 기능 구현

### 1. 리스트 레이아웃

```tsx
// 계층 구조로 메뉴 변환
const buildMenuTree = (items: CategoryMenuItem[]) => {
  const tree: CategoryMenuItem[] = [];
  const itemMap: { [key: string]: CategoryMenuItem } = {};
  
  // visible한 아이템만 필터링
  const visibleItems = items.filter(item => item.visible !== false);
  
  visibleItems.forEach(item => {
    itemMap[item.id] = { ...item, children: [] };
  });
  
  // 부모-자식 관계 설정
  visibleItems.forEach(item => {
    if (item.parentId && itemMap[item.parentId]) {
      itemMap[item.parentId].children!.push(itemMap[item.id]);
    } else {
      tree.push(itemMap[item.id]);
    }
  });
  
  // order 기준으로 정렬
  const sortByOrder = (items: CategoryMenuItem[]) => {
    items.sort((a, b) => (a.order || 0) - (b.order || 0));
    items.forEach(item => {
      if (item.children && item.children.length > 0) {
        sortByOrder(item.children);
      }
    });
  };
  
  sortByOrder(tree);
  return tree;
};

// 리스트 아이템 렌더링 (재귀적)
const renderListItem = (item: CategoryMenuItem, level: number = 0) => (
  <li 
    key={item.id} 
    className={`category-menu-item ${selectedItemId === item.id ? 'active' : ''} ${item.children && item.children.length > 0 ? 'has-children' : ''}`}
    style={{ paddingLeft: `${level * 20}px` }}
  >
    <div 
      onClick={() => actions.handleMenuItemClick(item)}
      className="category-menu-link"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          actions.handleMenuItemClick(item);
        }
      }}
      style={{ cursor: 'pointer' }}
    >
      {data.showIcon && (
        <i className="category-icon fas fa-folder me-2"></i>
      )}
      <span className="category-name">{item.categoryName}</span>
    </div>
    {data.showDescription && (
      <p className="category-description">
        라우팅: /shopping{item.routingPath}
      </p>
    )}
    {item.children && item.children.length > 0 && (
      <ul className="category-submenu">
        {item.children.map(child => renderListItem(child, level + 1))}
      </ul>
    )}
  </li>
);
```

### 2. 그리드 레이아웃

```tsx
// 그리드 컬럼 클래스 계산
const getGridColumnClass = () => {
  switch (data.columns) {
    case 2: return 'col-6';
    case 3: return 'col-4';
    case 4: return 'col-3';
    case 6: return 'col-2';
    default: return 'col-4';
  }
};

// 메뉴를 플랫하게 변환 (계층 레벨 포함)
const flattenMenu = (items: CategoryMenuItem[], level: number = 0): { item: CategoryMenuItem, level: number }[] => {
  const result: { item: CategoryMenuItem, level: number }[] = [];
  items.forEach(item => {
    result.push({ item, level });
    if (item.children && item.children.length > 0) {
      result.push(...flattenMenu(item.children, level + 1));
    }
  });
  return result;
};

// 그리드 레이아웃 렌더링
const renderGridLayout = () => {
  const flatMenuItems = flattenMenu(menuTree);
  return (
    <div className="category-menu-grid">
      <div className="row">
        {flatMenuItems.map(({ item, level }) => (
          <div key={item.id} className={`${getGridColumnClass()} mb-3`}>
            <div 
              className={`category-menu-card h-100 ${selectedItemId === item.id ? 'active' : ''}`}
              onClick={() => actions.handleMenuItemClick(item)}
              role="button"
              tabIndex={0}
            >
              <div className="category-card-body">
                {data.showIcon && (
                  <div className="category-card-icon">
                    <i className="fas fa-folder"></i>
                  </div>
                )}
                <h5 className="category-card-title">
                  {level > 0 && <span className="text-muted">{'└ '.repeat(level)}</span>}
                  {item.categoryName}
                </h5>
                {data.showDescription && (
                  <p className="category-card-description">
                    라우팅: /shopping{item.routingPath}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
```

### 3. 드롭다운 레이아웃

```tsx
// 드롭다운 아이템 렌더링 (재귀적)
const renderDropdownItem = (item: CategoryMenuItem, level: number = 0) => (
  <React.Fragment key={item.id}>
    <div 
      className={`dropdown-item ${selectedItemId === item.id ? 'active' : ''}`}
      style={{ paddingLeft: `${(level * 20) + 16}px`, cursor: 'pointer' }}
      onClick={() => {
        actions.handleMenuItemClick(item);
        actions.toggleExpanded();
      }}
      role="button"
      tabIndex={0}
    >
      {data.showIcon && (
        <i className="fas fa-folder me-2"></i>
      )}
      {item.categoryName}
      {data.showDescription && (
        <span className="ms-2 text-muted">(/shopping{item.routingPath})</span>
      )}
    </div>
    {item.children && item.children.length > 0 && 
      item.children.map(child => renderDropdownItem(child, level + 1))
    }
  </React.Fragment>
);

// 드롭다운 레이아웃 렌더링
const renderDropdownLayout = () => {
  const selectedItem = findSelectedItem(menuTree);
  
  return (
    <div className="category-menu-dropdown">
      <button 
        className="btn btn-outline-secondary dropdown-toggle w-100"
        onClick={actions.toggleExpanded}
        aria-expanded={data.isExpanded}
      >
        {selectedItem?.categoryName || utils.t('메뉴 선택')}
      </button>
      {data.isExpanded && (
        <div className="dropdown-menu show w-100">
          {menuTree.map(item => renderDropdownItem(item))}
        </div>
      )}
    </div>
  );
};
```

### 4. 카테고리 정보 표시

```tsx
// 현재 경로에 해당하는 카테고리 정보 확인
const location = useLocation();
const [categoryInfo, setCategoryInfo] = useState<any>(null);

useEffect(() => {
  if (location.state && location.state.categoryId) {
    setCategoryInfo(location.state);
  } else {
    // location.state가 없으면 현재 경로에 맞는 메뉴 아이템 찾기
    const currentPath = location.pathname;
    const matchingItem = data.menuItems.find((item: CategoryMenuItem) => {
      const itemFullPath = `/shopping${item.routingPath}`;
      return itemFullPath === currentPath;
    });
    
    if (matchingItem) {
      setCategoryInfo({
        categoryId: matchingItem.categoryId,
        categoryName: matchingItem.categoryName,
        menuItemId: matchingItem.id,
        routingPath: matchingItem.routingPath
      });
    }
  }
}, [location, data.menuItems]);

// 카테고리 정보 표시
{data.showCategoryInfo && (
  <div className="category-info-display">
    {categoryInfo ? (
      <>
        <h4>현재 선택된 카테고리 정보</h4>
        <div>
          <strong>카테고리 이름:</strong> {categoryInfo.categoryName}
          <strong>카테고리 ID:</strong> {categoryInfo.categoryId}
          <strong>라우팅 경로:</strong> /shopping{categoryInfo.routingPath}
        </div>
      </>
    ) : (
      <p>카테고리 정보가 없습니다.</p>
    )}
  </div>
)}
```

### 5. 메뉴 아이템 클릭 처리 및 상품 조회

```tsx
// 메뉴 아이템 클릭 시 라우팅과 함께 카테고리 정보 전달
const handleMenuItemClick = (item: CategoryMenuItem) => {
  // 에디터 모드에서는 라우팅하지 않음
  if (mode === 'editor') {
    return;
  }
  
  // 라우팅 경로가 없으면 무시
  if (!item.routingPath) {
    return;
  }
  
  // /shopping + 사용자 설정 경로로 라우팅
  const fullPath = `/shopping${item.routingPath}`;
  
  // React Router를 사용하여 카테고리 정보와 함께 라우팅
  utils.navigate(fullPath, {
    state: {
      categoryId: item.categoryId,
      categoryName: item.categoryName,
      menuItemId: item.id,
      routingPath: item.routingPath
    }
  });
};
```

### 6. 카테고리별 상품 조회 API 연동

CategoryMenu 컴포넌트는 내부적으로 Redux를 사용하여 카테고리 선택 시 해당 카테고리의 상품을 자동으로 조회합니다:

```typescript
// 카테고리 클릭 시 자동으로 실행되는 상품 조회
// CategoryMenuLogic.ts 내부 구현
if (item.categoryId && item.categoryId !== 0) {
  // 특정 카테고리 선택 시
  dispatch(fetchProducts({
    include_category_ids: [item.categoryId], // 백엔드 API 형식에 맞춰 배열로 전송
    page: 1,
    per_page: 20
  }));
} else {
  // 전체 카테고리 선택 시 (categoryId가 0이거나 없는 경우)
  dispatch(fetchProducts({
    include_category_ids: [], // 빈 배열 = 전체 상품
    page: 1,
    per_page: 20
  }));
}
```

**API 요청 형식:**
```json
{
  "include_category_ids": [8],  // 특정 카테고리
  "page": 1,
  "per_page": 20
}

// 또는 전체 상품 조회
{
  "include_category_ids": [],   // 빈 배열 = 전체
  "page": 1,
  "per_page": 20
}
```

**참고사항:**
- 백엔드 API는 `include_category_ids` 배열 형태만 지원합니다
- 단일 카테고리 ID도 배열로 감싸서 전송해야 합니다
- ProductList 컴포넌트와 자동으로 연동되어 필터링된 상품이 표시됩니다

### 7. 하위 메뉴 탐색 기능 (v2.0+)

CategoryMenu 컴포넌트는 카테고리 선택 시 해당 카테고리의 하위 메뉴와 breadcrumb 정보를 자동으로 가져옵니다:

```typescript
// 카테고리 클릭 시 자동으로 실행되는 카테고리 상세 조회
// CategoryMenuLogic.ts 내부 구현
if (item.categoryId && item.categoryId !== 0) {
  // 카테고리 상세 정보 가져오기 (하위 메뉴와 breadcrumb를 위해)
  dispatch(fetchCategoryDetail(item.categoryId));
}
```

**카테고리 상세 API 응답 형식:**
```json
{
  "current": {
    "id": 8,
    "name": "전자제품",
    "parentId": null
  },
  "breadcrumb": [
    {
      "id": 8,
      "name": "전자제품",
      "parentId": null
    }
  ],
  "children": [
    {
      "id": 9,
      "name": "스마트폰",
      "parentId": 8,
      "path": "/smartphones"
    },
    {
      "id": 10,
      "name": "노트북",
      "parentId": 8,
      "path": "/laptops"
    }
  ]
}
```

### 8. Breadcrumb 렌더링

```tsx
// breadcrumb 렌더링 함수
const renderBreadcrumb = () => {
  if (!data.breadcrumb || data.breadcrumb.length === 0) return null;
  
  return (
    <div className="category-breadcrumb">
      <span 
        style={{ cursor: 'pointer', color: '#1890ff' }}
        onClick={() => {
          // 전체 카테고리로 돌아가기
          actions.handleMenuItemClick({
            id: 'all',
            categoryId: 0,
            categoryName: '전체',
            routingPath: '',
            parentId: null,
            order: 0,
            visible: true
          });
        }}
      >
        전체
      </span>
      {data.breadcrumb.map((item: {id: number; name: string; parentId: number | null}, index: number) => (
        <span key={item.id}>
          <span style={{ margin: '0 8px', color: '#999' }}>&gt;</span>
          <span
            style={{ 
              cursor: index < data.breadcrumb.length - 1 ? 'pointer' : 'default', 
              color: index === data.breadcrumb.length - 1 ? '#333' : '#1890ff',
              fontWeight: index === data.breadcrumb.length - 1 ? 'bold' : 'normal'
            }}
            onClick={() => {
              if (index < data.breadcrumb.length - 1) {
                // 중간 breadcrumb 클릭 시 해당 카테고리로 이동
                actions.handleMenuItemClick({
                  id: `cat-${item.id}`,
                  categoryId: item.id,
                  categoryName: item.name,
                  routingPath: `/${item.id}`,
                  parentId: item.parentId ? `cat-${item.parentId}` : null,
                  order: 0,
                  visible: true
                });
              }
            }}
          >
            {item.name}
          </span>
        </span>
      ))}
    </div>
  );
};
```

### 9. 한 Depth만 표시하기

```tsx
// currentChildren이 있으면 사용, 없으면 전체 메뉴 트리 사용
const displayItems = data.currentChildren && data.currentChildren.length > 0 
  ? data.currentChildren 
  : buildMenuTree(data.menuItems);

// 리스트 레이아웃 렌더링
const renderListLayout = () => (
  <>
    {renderBreadcrumb()}
    <ul className="category-menu-list">
      {displayItems.map((item: CategoryMenuItem) => renderListItem(item))}
    </ul>
  </>
);

// 리스트 아이템 렌더링 시 currentChildren이 있으면 하위 메뉴 표시 안함
const renderListItem = (item: CategoryMenuItem, level: number = 0) => (
  <li key={item.id}>
    {/* ... 메뉴 아이템 내용 ... */}
    
    {/* currentChildren이 있으면 하위 메뉴를 표시하지 않음 (한 depth만 보여주기 위해) */}
    {!data.currentChildren && item.children && item.children.length > 0 && (
      <ul className="category-submenu">
        {item.children.map(child => renderListItem(child, level + 1))}
      </ul>
    )}
  </li>
);

// 그리드 레이아웃에서도 동일하게 적용
const renderGridLayout = () => {
  const flatMenuItems = data.currentChildren 
    ? displayItems.map((item: CategoryMenuItem) => ({ item, level: 0 })) 
    : flattenMenu(displayItems);
    
  return (
    <>
      {renderBreadcrumb()}
      <div className="category-menu-grid">
        {/* ... 그리드 아이템들 ... */}
      </div>
    </>
  );
};
```

**하위 메뉴 탐색 구현 시 주의사항:**
- `data.breadcrumb`과 `data.currentChildren`은 v2.0부터 지원됩니다
- 이전 버전과의 호환성을 위해 해당 데이터가 없을 때 fallback 처리가 필요합니다
- currentChildren이 있을 때는 하위 메뉴의 children을 렌더링하지 않아야 합니다
- breadcrumb 클릭 시 해당 카테고리로 이동하도록 구현해야 합니다
- breadcrumb은 API에서 제공되는 배열 형식입니다

### 9. 루트로 되돌아가기 기능 (v2.1+)

전체 카테고리로 되돌아가는 기능을 제공합니다:

```tsx
// "전체" 버튼 클릭 시 handleBackToRoot 사용
<span 
  style={{ cursor: 'pointer', color: '#1890ff' }}
  onClick={() => {
    // 전체 카테고리로 돌아가기
    actions.handleBackToRoot();
  }}
>
  전체
</span>
```

**handleBackToRoot 기능:**
- 선택된 카테고리 ID 초기화 (전체 메뉴로 돌아감)
- 전체 상품 조회 실행 (모든 카테고리의 상품 표시)
- 루트 경로(/shopping/)로 라우팅
- breadcrumb 및 currentChildren 초기화 (계층 네비게이션 상태 리셋)
- Redux 상태에서 카테고리별 필터링 해제

**사용 예시:**
```tsx
// Breadcrumb에서 "전체" 링크
const renderBreadcrumb = () => {
  if (!data.breadcrumb || data.breadcrumb.length === 0) return null;
  
  return (
    <div className="category-breadcrumb">
      <span 
        style={{ cursor: 'pointer', color: '#1890ff' }}
        onClick={() => {
          // handleBackToRoot를 호출하여 루트 메뉴로 돌아가기
          actions.handleBackToRoot();
        }}
      >
        전체
      </span>
      {/* ... breadcrumb 아이템들 ... */}
    </div>
  );
};

// 또는 별도의 "홈" 버튼
<button 
  className="btn btn-link"
  onClick={() => actions.handleBackToRoot()}
>
  <i className="fas fa-home me-1"></i>
  전체 카테고리
</button>
```

**주의사항:**
- `handleBackToRoot`는 v2.1+에서만 사용 가능합니다
- 이전 버전과의 호환성을 위해 함수 존재 여부를 확인하세요:
```tsx
if (actions.handleBackToRoot) {
  actions.handleBackToRoot();
} else {
  // 이전 버전 호환 방식
  actions.handleMenuItemClick({
    id: 'all',
    categoryId: 0,
    categoryName: '전체',
    routingPath: '',
    parentId: null,
    order: 0,
    visible: true
  });
}
```

### 10. 자동 라우팅 생성 (v2.1+)

백엔드에서 불러온 하위 카테고리들의 라우팅 경로를 자동으로 생성합니다:

```typescript
// 카테고리 이름 기반 URL 생성 예시
"깃털 셔틀콕" → "/깃털-셔틀콕"
"스마트폰 케이스" → "/스마트폰-케이스"
"USB-C 케이블" → "/usb-c-케이블"
```

**자동 라우팅 생성 규칙:**
1. `child.path`가 있으면 우선 사용
2. `child.path`가 없으면 카테고리 이름을 URL 친화적으로 변환:
   - 소문자로 변환
   - 공백을 하이픈(-)으로 대체
   - 한글, 영어, 숫자, 하이픈만 남김
   - 연속된 하이픈 제거
   - 시작과 끝의 하이픈 제거
3. 변환 실패 시 카테고리 ID 사용

## 기본 스킨 구현 예시

```tsx
import React, { useEffect, useState } from 'react';
import { ComponentSkinProps } from '../../../types/component-skin';
import { useLocation } from 'react-router-dom';
import { CategoryMenuItem } from '../CategoryMenu.types';

const MyCategoryMenuSkin: React.FC<ComponentSkinProps> = ({
  data,
  actions,
  utils,
  mode,
  editor
}) => {
  const location = useLocation();
  const [categoryInfo, setCategoryInfo] = useState<any>(null);
  
  // componentProps에서 설정값 추출
  const {
    showProductCount = false,
    showIcon = false,
    showDescription = false,
    showCategoryInfo = true,
    layout = 'list',
    columns = 3,
    emptyMessage = '메뉴가 없습니다.'
  } = data.componentProps || {};
  
  const { menuItems, loading, error, selectedItemId, isExpanded } = data;
  const { handleMenuItemClick, toggleExpanded } = actions;
  const { t, navigate } = utils;
  
  // 카테고리 정보 추적
  useEffect(() => {
    if (location.state && location.state.categoryId) {
      setCategoryInfo(location.state);
    } else {
      const currentPath = location.pathname;
      const matchingItem = menuItems.find((item: CategoryMenuItem) => {
        const itemFullPath = `/shopping${item.routingPath}`;
        return itemFullPath === currentPath;
      });
      
      if (matchingItem) {
        setCategoryInfo({
          categoryId: matchingItem.categoryId,
          categoryName: matchingItem.categoryName,
          menuItemId: matchingItem.id,
          routingPath: matchingItem.routingPath
        });
      } else {
        setCategoryInfo(null);
      }
    }
  }, [location, menuItems]);
  
  // 계층 구조로 메뉴 변환
  const buildMenuTree = (items: CategoryMenuItem[]) => {
    const tree: CategoryMenuItem[] = [];
    const itemMap: { [key: string]: CategoryMenuItem } = {};
    
    const visibleItems = items.filter(item => item.visible !== false);
    
    visibleItems.forEach(item => {
      itemMap[item.id] = { ...item, children: [] };
    });
    
    visibleItems.forEach(item => {
      if (item.parentId && itemMap[item.parentId]) {
        itemMap[item.parentId].children!.push(itemMap[item.id]);
      } else {
        tree.push(itemMap[item.id]);
      }
    });
    
    // order 기준으로 정렬
    const sortByOrder = (items: CategoryMenuItem[]) => {
      items.sort((a, b) => (a.order || 0) - (b.order || 0));
      items.forEach(item => {
        if (item.children && item.children.length > 0) {
          sortByOrder(item.children);
        }
      });
    };
    
    sortByOrder(tree);
    return tree;
  };
  
  const menuTree = buildMenuTree(menuItems);
  
  // 그리드 컬럼 클래스 계산
  const getGridColumnClass = () => {
    switch (columns) {
      case 2: return 'col-6';
      case 3: return 'col-4';
      case 4: return 'col-3';
      case 6: return 'col-2';
      default: return 'col-4';
    }
  };
  
  // 로딩 중
  if (loading) {
    return (
      <div className="my-category-menu-loading">
        <div className="spinner-border spinner-border-sm" role="status">
          <span className="sr-only">{t('로딩 중...')}</span>
        </div>
        <span className="ms-2">{t('카테고리를 불러오는 중...')}</span>
      </div>
    );
  }
  
  // 에러
  if (error) {
    return (
      <div className="my-category-menu-error alert alert-danger">
        <i className="fas fa-exclamation-triangle me-2"></i>
        {error}
      </div>
    );
  }
  
  // 메뉴가 없을 때
  if (!menuItems || menuItems.length === 0) {
    return (
      <div className="my-category-menu-empty">
        {emptyMessage}
      </div>
    );
  }
  
  // 리스트 아이템 렌더링 (재귀적)
  const renderListItem = (item: CategoryMenuItem, level: number = 0) => (
    <li 
      key={item.id} 
      className={`my-category-menu-item ${selectedItemId === item.id ? 'active' : ''} ${item.children && item.children.length > 0 ? 'has-children' : ''}`}
      style={{ paddingLeft: `${level * 20}px` }}
    >
      <div 
        onClick={() => handleMenuItemClick(item)}
        className="my-category-menu-link"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleMenuItemClick(item);
          }
        }}
      >
        {showIcon && (
          <i className="my-category-icon fas fa-folder me-2"></i>
        )}
        <span className="my-category-name">{item.categoryName}</span>
        {showProductCount && (
          <span className="my-category-count">(0)</span>
        )}
      </div>
      {showDescription && (
        <p className="my-category-description">
          라우팅: /shopping{item.routingPath}
        </p>
      )}
      {item.children && item.children.length > 0 && (
        <ul className="my-category-submenu">
          {item.children.map(child => renderListItem(child, level + 1))}
        </ul>
      )}
    </li>
  );
  
  // 메뉴를 플랫하게 변환
  const flattenMenu = (items: CategoryMenuItem[], level: number = 0): { item: CategoryMenuItem, level: number }[] => {
    const result: { item: CategoryMenuItem, level: number }[] = [];
    items.forEach(item => {
      result.push({ item, level });
      if (item.children && item.children.length > 0) {
        result.push(...flattenMenu(item.children, level + 1));
      }
    });
    return result;
  };
  
  // 선택된 아이템 찾기
  const findSelectedItem = (items: CategoryMenuItem[]): CategoryMenuItem | null => {
    for (const item of items) {
      if (item.id === selectedItemId) return item;
      if (item.children) {
        const found = findSelectedItem(item.children);
        if (found) return found;
      }
    }
    return null;
  };
  
  // 드롭다운 아이템 렌더링
  const renderDropdownItem = (item: CategoryMenuItem, level: number = 0) => (
    <React.Fragment key={item.id}>
      <div 
        className={`my-dropdown-item ${selectedItemId === item.id ? 'active' : ''}`}
        style={{ paddingLeft: `${(level * 20) + 16}px` }}
        onClick={() => {
          handleMenuItemClick(item);
          toggleExpanded();
        }}
        role="button"
        tabIndex={0}
      >
        {showIcon && (
          <i className="fas fa-folder me-2"></i>
        )}
        {item.categoryName}
        {showDescription && (
          <span className="ms-2 text-muted">(/shopping{item.routingPath})</span>
        )}
      </div>
      {item.children && item.children.length > 0 && 
        item.children.map(child => renderDropdownItem(child, level + 1))
      }
    </React.Fragment>
  );
  
  return (
    <div className={`my-category-menu-container my-category-menu-${layout}`}>
      {/* 카테고리 정보 표시 */}
      {showCategoryInfo && categoryInfo && (
        <div className="my-category-info-display">
          <h4>현재 카테고리: {categoryInfo.categoryName}</h4>
          <div className="my-category-info-details">
            <span>ID: {categoryInfo.categoryId}</span>
            <span>경로: /shopping{categoryInfo.routingPath}</span>
          </div>
        </div>
      )}
      
      {/* 리스트 레이아웃 */}
      {layout === 'list' && (
        <ul className="my-category-menu-list">
          {menuTree.map(item => renderListItem(item))}
        </ul>
      )}
      
      {/* 그리드 레이아웃 */}
      {layout === 'grid' && (
        <div className="my-category-menu-grid">
          <div className="row">
            {flattenMenu(menuTree).map(({ item, level }) => (
              <div key={item.id} className={`${getGridColumnClass()} mb-3`}>
                <div 
                  className={`my-category-menu-card h-100 ${selectedItemId === item.id ? 'active' : ''}`}
                  onClick={() => handleMenuItemClick(item)}
                  role="button"
                  tabIndex={0}
                >
                  <div className="my-category-card-body">
                    {showIcon && (
                      <div className="my-category-card-icon">
                        <i className="fas fa-folder"></i>
                      </div>
                    )}
                    <h5 className="my-category-card-title">
                      {level > 0 && <span className="text-muted">{'└ '.repeat(level)}</span>}
                      {item.categoryName}
                    </h5>
                    {showDescription && (
                      <p className="my-category-card-description">
                        라우팅: /shopping{item.routingPath}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* 드롭다운 레이아웃 */}
      {layout === 'dropdown' && (
        <div className="my-category-menu-dropdown">
          <button 
            className="btn btn-outline-secondary dropdown-toggle w-100"
            onClick={toggleExpanded}
            aria-expanded={isExpanded}
          >
            {findSelectedItem(menuTree)?.categoryName || t('메뉴 선택')}
          </button>
          {isExpanded && (
            <div className="my-dropdown-menu show w-100">
              {menuTree.map(item => renderDropdownItem(item))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MyCategoryMenuSkin;
```

## CSS 클래스명 충돌 방지

기본 스킨의 CSS 클래스들과 충돌을 피하기 위해 고유한 클래스명을 사용하세요:

```css
/* 기본 스킨 클래스들 (사용 금지) */
.category-menu-container { }
.category-menu-item { }
.category-menu-link { }
.category-menu-grid { }
.category-menu-card { }
.category-menu-dropdown { }

/* 외부 스킨 권장 클래스명 */
.my-category-menu-container { }
.my-category-menu-item { }
.my-category-menu-link { }
.my-category-menu-grid { }
.my-category-menu-card { }
.my-category-menu-dropdown { }
```

## 스타일링 예시

```css
/* 리스트 레이아웃 */
.my-category-menu-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.my-category-menu-item {
  margin-bottom: 10px;
  transition: all 0.3s ease;
}

.my-category-menu-link {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background-color: #f8f9fa;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.my-category-menu-link:hover {
  background-color: #e9ecef;
  transform: translateX(5px);
}

.my-category-menu-item.active .my-category-menu-link {
  background-color: #4285f4;
  color: white;
}

/* 계층적 메뉴 */
.my-category-submenu {
  list-style: none;
  padding: 0;
  margin: 8px 0 0 0;
}

.my-category-menu-item.has-children > .my-category-menu-link::after {
  content: '▶';
  margin-left: auto;
  transition: transform 0.2s;
}

/* 그리드 레이아웃 */
.my-category-menu-card {
  border: 1px solid #e9ecef;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer;
}

.my-category-menu-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.my-category-card-body {
  padding: 20px;
  text-align: center;
}

.my-category-card-icon {
  font-size: 2.5em;
  color: #4285f4;
  margin-bottom: 15px;
}

/* 드롭다운 레이아웃 */
.my-dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 1000;
  width: 100%;
  margin-top: 5px;
  border-radius: 8px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
  background-color: white;
  max-height: 300px;
  overflow-y: auto;
}

.my-dropdown-item {
  padding: 10px 16px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.my-dropdown-item:hover {
  background-color: #f8f9fa;
}

.my-dropdown-item.active {
  background-color: #4285f4;
  color: white;
}

/* 카테고리 정보 표시 */
.my-category-info-display {
  padding: 20px;
  margin-bottom: 20px;
  background-color: #e6f7ff;
  border: 1px solid #91d5ff;
  border-radius: 8px;
}

/* 반응형 디자인 */
@media (max-width: 768px) {
  .my-category-menu-link {
    padding: 10px 12px;
    font-size: 0.95em;
  }
  
  .my-category-card-body {
    padding: 15px;
  }
  
  /* 모바일에서 그리드를 2열로 */
  .my-category-menu-grid .col-3,
  .my-category-menu-grid .col-4 {
    flex: 0 0 50%;
    max-width: 50%;
  }
}

@media (max-width: 576px) {
  /* 작은 화면에서는 1열로 */
  .my-category-menu-grid [class*="col-"] {
    flex: 0 0 100%;
    max-width: 100%;
  }
}
```

## 고급 기능 처리

### 1. 라우팅과 카테고리 정보 전달

메뉴 아이템 클릭 시 React Router의 state를 통해 카테고리 정보가 전달됩니다:

```typescript
// 전달되는 정보
{
  categoryId: number,      // 카테고리 ID
  categoryName: string,    // 카테고리 이름
  menuItemId: string,      // 메뉴 아이템 ID
  routingPath: string      // 라우팅 경로
}

// 대상 페이지에서 정보 받기
const location = useLocation();
const categoryInfo = location.state;
```

### 2. 계층 구조 제한

- 최대 3단계까지의 계층 구조 지원
- 드래그 앤 드롭으로 계층 변경 시 자동 제한
- 자기 자신의 하위로는 이동 불가

### 3. 에디터 모드 처리

```tsx
// 에디터 모드에서는 클릭 이벤트 무시
if (mode === 'editor') {
  // 라우팅하지 않고 시각적 피드백만 제공
  return;
}
```

### 4. 키보드 접근성

```tsx
// Enter 또는 Space 키로 메뉴 아이템 선택 가능
onKeyDown={(e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    actions.handleMenuItemClick(item);
  }
}}
```

## 에러 처리

### 1. 빈 메뉴 상태

```tsx
if (!menuItems || menuItems.length === 0) {
  return (
    <div className="empty-menu">
      {data.emptyMessage}
    </div>
  );
}
```

### 2. 로딩 상태

```tsx
if (data.loading) {
  return (
    <div className="loading">
      <div className="spinner-border" role="status">
        <span className="sr-only">로딩 중...</span>
      </div>
    </div>
  );
}
```

### 3. 에러 상태

```tsx
if (data.error) {
  return (
    <div className="error alert alert-danger">
      <i className="fas fa-exclamation-triangle me-2"></i>
      {data.error}
    </div>
  );
}
```

## 호환성 체크리스트

- [ ] 모든 속성 패널 설정이 올바르게 반영되는가?
- [ ] 계층적 메뉴 구조가 올바르게 표시되는가?
- [ ] 메뉴 아이템 클릭 시 라우팅이 작동하는가?
- [ ] 카테고리 정보가 대상 페이지로 전달되는가?
- [ ] 카테고리 선택 시 상품 API가 자동으로 호출되는가?
- [ ] 카테고리 선택 시 하위 메뉴가 한 depth만 표시되는가? (v2.0+)
- [ ] Breadcrumb 네비게이션이 올바르게 표시되는가? (v2.0+)
- [ ] Breadcrumb 클릭 시 해당 카테고리로 이동하는가? (v2.0+)
- [ ] 리스트 레이아웃이 올바르게 표시되는가?
- [ ] 그리드 레이아웃이 올바르게 표시되는가?
- [ ] 드롭다운 레이아웃이 올바르게 표시되는가?
- [ ] 아이콘 표시 옵션이 작동하는가?
- [ ] 설명 표시 옵션이 작동하는가?
- [ ] 카테고리 정보 표시 옵션이 작동하는가?
- [ ] 빈 메뉴 메시지가 올바르게 표시되는가?
- [ ] 로딩 상태가 올바르게 표시되는가?
- [ ] 에러 상태가 올바르게 표시되는가?
- [ ] CSS 클래스명이 기본 스킨과 충돌하지 않는가?
- [ ] 반응형 디자인이 올바르게 작동하는가?
- [ ] 키보드 접근성이 지원되는가?
- [ ] visible=false인 메뉴가 숨겨지는가?
- [ ] order에 따른 정렬이 작동하는가?

이 가이드를 따라 구현하면 기본 스킨과 동일한 기능을 제공하는 외부 스킨을 만들 수 있습니다.