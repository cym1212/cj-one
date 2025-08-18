# OrderHistory 컴포넌트 외부 스킨 API 가이드

## 컴포넌트 개요

OrderHistory(주문 내역) 컴포넌트는 사용자의 주문 내역을 조회하고 관리하는 컴포넌트입니다. 주문 목록, 상세 정보, 배송 추적, 재주문, 리뷰 작성 등의 기능을 포함합니다.

**주요 특징:**
- 주문 목록 표시 (페이지네이션 지원)
- 주문 상태별 필터링
- 날짜 범위 필터링
- 주문 검색 기능
- 주문 상세 정보 보기
- 배송 추적
- 재주문(다시 담기) 기능
- 주문 취소
- 리뷰 작성 모달
- 배송 조회 모달
- 반응형 디자인
- 다국어 지원

## ComponentSkinProps 인터페이스

```typescript
interface ComponentSkinProps {
  data: {
    // 기본 정보
    id: string;
    style: React.CSSProperties;
    componentProps: {
      title?: string;
      emptyText?: string;
      itemsPerPage?: number;
    };
    
    // 주문 데이터
    orders: Array<{
      id: number;
      orderNumber?: string; // 선택사항 - 제공되지 않을 수 있음
      status: string;
      createdAt: string;
      updatedAt: string;
      totalAmount: number;
      shippingFee: number;
      paymentMethod: string;
      deliveryInfo?: {
        recipientName: string;
        recipientPhone: string;
        zipCode: string;
        address: string;
        addressDetail: string;
        deliveryMessage?: string;
        trackingNumber?: string;
        carrierName?: string;
      };
      carts: Array<{
        id: number;
        count: number;
        unitPrice: string;
        options?: {
          options?: Array<{
            groupName: string;
            valueName: string;
          }>;
        };
        product: {
          id: number;
          title: string;
          config?: {
            img_url?: string;
            default_price?: number;
            discounted_price?: number;
          };
        };
      }>;
    }>;
    
    // 상태 정보
    loading: boolean;
    error: any;
    currentPage: number;
    totalPages: number;
    totalOrders: number;
    searchQuery: string;
    selectedStatus: string;
    selectedDateRange: string;
    selectedOrder: any | null;
    showOrderDetail: boolean;
    
    // 사용자 정보
    isUserLoggedIn: boolean;
    isAdminMode: boolean;
    theme: any;
    
    // 디바이스 정보
    isMobile: boolean;
    deviceType: string;
    
    // 페이지네이션
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
    };
    
    // 원본 호환성
    checkouts: any[]; // orders와 동일 (레거시 호환)
    itemsPerPage: number;
    title: string;
    emptyText: string;
    
    // 모달 상태
    reviewModalOpen: boolean;
    selectedProduct: any;
    selectedOrderForReview: any;
    deliveryModalOpen: boolean;
    selectedCheckout: any;
  };
  
  actions: {
    // 필터 및 검색
    setSearchQuery: (query: string) => void;
    setSelectedStatus: (status: string) => void;
    setSelectedDateRange: (range: string) => void;
    
    // 주문 관련 액션
    handleViewDetail: (order: any) => void;
    handleCancelOrder: (orderId: number) => void;
    handleTrackShipment: (trackingNumber: string) => void; // 실제로는 배송조회 모달 사용
    handleAddToCartAgain: (order: any) => void;
    
    // 페이지네이션
    handlePageChange: (page: number) => void;
    
    // UI 제어
    setShowOrderDetail: (show: boolean) => void;
    
    // 헬퍼 함수
    getStatusText: (status: string) => string;
    getStatusInfo: (status: string) => { text: string; class: string; icon: string };
    formatDate: (date: string) => string;
    loadOrders: (page: number, take: number) => void;
    
    // 리뷰 모달
    openReviewModal: (product: any, order: any) => void;
    handleReviewSubmitted: () => void;
    setReviewModalOpen: (open: boolean) => void;
    
    // 배송조회 모달
    openDeliveryModal: (order: any) => void;
    setDeliveryModalOpen: (open: boolean) => void;
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

### data.orders
주문 목록 배열입니다. 각 주문은 다음 정보를 포함합니다:

- `id`: 주문 ID
- `id`: 주문 ID (주문 번호로 사용)
- `orderNumber`: 주문 번호 (선택사항, 제공되지 않을 수 있음)
- `status`: 주문 상태 ('pending', 'processing', 'shipped', 'delivered', 'cancelled' 등)
- `createdAt`: 주문 일시
- `totalAmount`: 총 결제 금액
- `shippingFee`: 배송비
- `carts`: 주문 상품 목록
- `deliveryInfo`: 배송 정보

### data.componentProps
컴포넌트 설정값들입니다:

- `title`: 주문 내역 제목 (기본값: '주문 내역')
- `emptyText`: 주문이 없을 때 메시지 (기본값: '주문 내역이 없습니다.')
- `itemsPerPage`: 페이지당 표시할 주문 수 (기본값: 10)

### actions
사용자 인터랙션을 처리하는 함수들입니다:

- `handleViewDetail(order)`: 주문 상세 보기
- `handleCancelOrder(orderId)`: 주문 취소
- `handleTrackShipment(order)`: 배송 추적
- `handleAddToCartAgain(order)`: 재주문 (모든 상품을 장바구니에 추가)
- `handlePageChange(page)`: 페이지 변경
- `getStatusInfo(status)`: 주문 상태에 따른 표시 정보 반환

## 스킨 개발 예제

### 기본 스킨 구조

```jsx
import React from 'react';

const MyOrderHistorySkin = (props) => {
  const {
    data: {
      orders,
      loading,
      error,
      currentPage,
      totalPages,
      totalOrders,
      searchQuery,
      selectedStatus,
      selectedDateRange,
      showOrderDetail,
      selectedOrder,
      isUserLoggedIn,
      isMobile,
      title,
      emptyText,
      pagination,
      reviewModalOpen,
      deliveryModalOpen
    },
    actions: {
      setSearchQuery,
      setSelectedStatus,
      setSelectedDateRange,
      handleViewDetail,
      handleCancelOrder,
      handleTrackShipment,
      handleAddToCartAgain,
      handlePageChange,
      getStatusInfo,
      formatDate,
      openReviewModal,
      openDeliveryModal,
      setReviewModalOpen,
      setDeliveryModalOpen
    },
    utils: { t, navigate, formatCurrency }
  } = props;

  // 로딩 상태
  if (loading) {
    return (
      <div className="order-history-loading">
        <p>{t('주문 내역을 불러오는 중입니다...')}</p>
      </div>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <div className="order-history-error">
        <p>{t('주문 내역을 불러오는데 실패했습니다')}</p>
        <button onClick={() => window.location.reload()}>
          {t('다시 시도')}
        </button>
      </div>
    );
  }

  // 로그인 필요
  if (!isUserLoggedIn) {
    return (
      <div className="order-history-login-required">
        <p>{t('주문 내역을 확인하려면 로그인이 필요합니다.')}</p>
        <button onClick={() => navigate('/login')}>
          {t('로그인')}
        </button>
      </div>
    );
  }

  // 주문이 없는 경우
  if (!orders || orders.length === 0) {
    return (
      <div className="order-history-empty">
        <h2>{title}</h2>
        <p>{emptyText}</p>
        <button onClick={() => navigate('/shop')}>
          {t('쇼핑 계속하기')}
        </button>
      </div>
    );
  }

  // 주문 내역 표시
  return (
    <div className="order-history">
      <h2>{title}</h2>
      
      {/* 필터 영역 */}
      <div className="filters">
        <input
          type="text"
          placeholder={t('주문 검색...')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
        >
          <option value="">{t('전체 상태')}</option>
          <option value="pending">{t('결제 대기')}</option>
          <option value="processing">{t('처리중')}</option>
          <option value="shipped">{t('배송중')}</option>
          <option value="delivered">{t('배송 완료')}</option>
          <option value="cancelled">{t('취소됨')}</option>
        </select>
        
        <select
          value={selectedDateRange}
          onChange={(e) => setSelectedDateRange(e.target.value)}
        >
          <option value="">{t('전체 기간')}</option>
          <option value="week">{t('1주일')}</option>
          <option value="month">{t('1개월')}</option>
          <option value="3months">{t('3개월')}</option>
          <option value="6months">{t('6개월')}</option>
          <option value="year">{t('1년')}</option>
        </select>
      </div>

      {/* 주문 목록 */}
      <div className="order-list">
        {orders.map(order => (
          <OrderItem
            key={order.id}
            order={order}
            onViewDetail={() => handleViewDetail(order)}
            onCancel={() => handleCancelOrder(order.id)}
            onTrackShipment={() => openDeliveryModal(order)} // 배송조회 모달 열기
            onReorder={() => handleAddToCartAgain(order)}
            onReview={(product) => openReviewModal(product, order)}
            getStatusInfo={getStatusInfo}
            formatDate={formatDate}
            formatCurrency={formatCurrency}
            t={t}
            isMobile={isMobile}
          />
        ))}
      </div>

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          t={t}
          isMobile={isMobile}
        />
      )}

      {/* 리뷰 모달 */}
      {reviewModalOpen && (
        <ReviewModal
          isOpen={reviewModalOpen}
          onClose={() => setReviewModalOpen(false)}
          onSubmitted={actions.handleReviewSubmitted}
          product={data.selectedProduct}
          order={data.selectedOrderForReview}
        />
      )}

      {/* 배송조회 모달 */}
      {deliveryModalOpen && (
        <DeliveryModal
          isOpen={deliveryModalOpen}
          onClose={() => setDeliveryModalOpen(false)}
          checkout={data.selectedCheckout}
        />
      )}
    </div>
  );
};

// 주문 아이템 컴포넌트
const OrderItem = ({ 
  order, 
  onViewDetail, 
  onCancel, 
  onTrackShipment, 
  onReorder,
  onReview,
  getStatusInfo, 
  formatDate, 
  formatCurrency, 
  t,
  isMobile 
}) => {
  const statusInfo = getStatusInfo(order.status);
  
  return (
    <div className="order-item">
      {/* 주문 헤더 */}
      <div className="order-header">
        <span className={`order-status ${statusInfo.class}`}>
          <span className="status-icon">{statusInfo.icon}</span>
          {statusInfo.text}
        </span>
        <span className="order-number">주문번호: {order.id}</span>
        <span className="order-date">{formatDate(order.createdAt)}</span>
      </div>

      {/* 주문 상품 목록 */}
      <div className="order-products">
        {order.carts.map(cartItem => (
          <div key={cartItem.id} className="order-product-item">
            <img 
              src={cartItem.product?.config?.img_url || '/placeholder.png'} 
              alt={cartItem.product?.title}
            />
            <div className="product-info">
              <h4>{cartItem.product?.title}</h4>
              {cartItem.options?.options?.map((opt, idx) => (
                <span key={idx} className="option">
                  {opt.groupName}: {opt.valueName}
                </span>
              ))}
              <div className="price-quantity">
                <span>{formatCurrency(Number(cartItem.unitPrice))}</span>
                <span>× {cartItem.count}</span>
              </div>
            </div>
            {order.status === 'delivered' && (
              <button 
                className="review-button"
                onClick={() => onReview(cartItem.product)}
              >
                {t('리뷰 작성')}
              </button>
            )}
          </div>
        ))}
      </div>

      {/* 주문 총액 */}
      <div className="order-total">
        <span>{t('총 결제금액')}: </span>
        <strong>{formatCurrency(order.totalAmount)}</strong>
      </div>

      {/* 액션 버튼들 */}
      <div className="order-actions">
        <button onClick={onViewDetail} className="detail-button">
          {t('주문 상세')}
        </button>
        
        {order.status === 'pending' && (
          <button onClick={onCancel} className="cancel-button">
            {t('주문 취소')}
          </button>
        )}
        
        {/* 실제 구현에서는 배송 상태에 따라 배송조회 모달을 엽니다 */}
        {(order.status === 'SHIPPING' || order.status === 'ARRIVED' || order.status === 'FINISHED') && (
          <button onClick={() => openDeliveryModal(order)} className="track-button">
            {t('배송조회')}
          </button>
        )}
        
        <button onClick={onReorder} className="reorder-button">
          {t('다시 담기')}
        </button>
      </div>
    </div>
  );
};

// 페이지네이션 컴포넌트
const Pagination = ({ currentPage, totalPages, onPageChange, t, isMobile }) => {
  const pageNumbers = [];
  const maxPages = isMobile ? 5 : 10;
  
  let startPage = Math.max(1, currentPage - Math.floor(maxPages / 2));
  let endPage = Math.min(totalPages, startPage + maxPages - 1);
  
  if (endPage - startPage < maxPages - 1) {
    startPage = Math.max(1, endPage - maxPages + 1);
  }
  
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }
  
  return (
    <div className="pagination">
      <button
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
      >
        {t('처음')}
      </button>
      
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        {t('이전')}
      </button>
      
      {pageNumbers.map(number => (
        <button
          key={number}
          onClick={() => onPageChange(number)}
          className={number === currentPage ? 'active' : ''}
        >
          {number}
        </button>
      ))}
      
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        {t('다음')}
      </button>
      
      <button
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
      >
        {t('마지막')}
      </button>
    </div>
  );
};

export default MyOrderHistorySkin;
```

## 주요 기능 구현 가이드

### 1. 주문 상태 표시

```jsx
// getStatusInfo 함수를 활용한 상태 표시
const OrderStatusDisplay = ({ status, getStatusInfo }) => {
  const statusInfo = getStatusInfo(status);
  
  return (
    <div className={`status-badge ${statusInfo.class}`}>
      <span className="status-icon">{statusInfo.icon}</span>
      <span className="status-text">{statusInfo.text}</span>
    </div>
  );
};

// 상태별 클래스와 아이콘 (실제 사용되는 상태값)
// REQUESTED: 📋 주문 요청됨
// PENDING: ⏳ 결제 대기 중
// PREPARING: 📦 상품 준비 중
// PAID: 💰 결제 완료
// SHIPPING: 🚚 배송 중
// ARRIVED: 🏠 배송 도착
// FINISHED: ✅ 배송 완료
// ISSUE: ⚠️ 배송 문제 발생
// CANCELLED/CANCELED: ❌ 주문 취소됨
// REFUNDED: 💸 환불 완료
```

### 2. 주문 상세 모달

```jsx
const OrderDetailModal = ({ order, isOpen, onClose, t, formatCurrency }) => {
  if (!isOpen || !order) return null;
  
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h3>{t('주문 상세 정보')}</h3>
        
        {/* 주문 정보 */}
        <div className="order-info-section">
          <p>주문번호: {order.id}</p>
          <p>주문일시: {new Date(order.createdAt).toLocaleString()}</p>
          <p>결제방법: {order.paymentMethod}</p>
        </div>
        
        {/* 배송 정보 */}
        {order.deliveryInfo && (
          <div className="delivery-info-section">
            <h4>{t('배송 정보')}</h4>
            <p>받는분: {order.deliveryInfo.recipientName}</p>
            <p>연락처: {order.deliveryInfo.recipientPhone}</p>
            <p>주소: [{order.deliveryInfo.zipCode}] {order.deliveryInfo.address} {order.deliveryInfo.addressDetail}</p>
            {order.deliveryInfo.deliveryMessage && (
              <p>배송 메시지: {order.deliveryInfo.deliveryMessage}</p>
            )}
          </div>
        )}
        
        {/* 주문 상품 */}
        <div className="order-products-section">
          <h4>{t('주문 상품')}</h4>
          {order.carts.map(item => (
            <div key={item.id} className="product-item">
              <span>{item.product.title}</span>
              <span>{formatCurrency(Number(item.unitPrice))} × {item.count}</span>
            </div>
          ))}
        </div>
        
        {/* 결제 정보 */}
        <div className="payment-info-section">
          <div className="amount-row">
            <span>상품 금액</span>
            <span>{formatCurrency(order.totalAmount - order.shippingFee)}</span>
          </div>
          <div className="amount-row">
            <span>배송비</span>
            <span>{formatCurrency(order.shippingFee)}</span>
          </div>
          <div className="amount-row total">
            <span>총 결제금액</span>
            <span>{formatCurrency(order.totalAmount)}</span>
          </div>
        </div>
        
        <button onClick={onClose}>{t('닫기')}</button>
      </div>
    </div>
  );
};
```

### 3. 배송 추적/조회

실제 구현에서는 배송조회 모달을 사용합니다:

```jsx
// 배송 조회 버튼 처리
const handleDeliveryTracking = (order) => {
  // 배송 상태 확인
  if (['SHIPPING', 'ARRIVED', 'FINISHED'].includes(order.status)) {
    openDeliveryModal(order);
  }
};
```

### 4. 재주문 처리

```jsx
// handleAddToCartAgain 액션 활용
const handleReorder = async (order) => {
  try {
    await actions.handleAddToCartAgain(order);
    
    if (confirm(t('장바구니에 상품이 담겼습니다. 장바구니로 이동하시겠습니까?'))) {
      navigate('/cart');
    }
  } catch (error) {
    alert(t('재주문 처리 중 오류가 발생했습니다.'));
  }
};
```

### 4. 모바일 반응형 처리

```jsx
// 모바일용 주문 아이템
const MobileOrderItem = ({ order, ...props }) => {
  return (
    <div className="mobile-order-item">
      {/* 모바일 최적화 레이아웃 */}
      <div className="mobile-header">
        <span className="order-date">{props.formatDate(order.createdAt)}</span>
        <OrderStatusDisplay status={order.status} getStatusInfo={props.getStatusInfo} />
      </div>
      
      {/* 접을 수 있는 상품 목록 */}
      <details className="order-details">
        <summary>
          {order.carts.length}개 상품 - {props.formatCurrency(order.totalAmount)}
        </summary>
        {/* 상품 목록 */}
      </details>
      
      {/* 모바일 액션 버튼 */}
      <div className="mobile-actions">
        {/* 버튼들 */}
      </div>
    </div>
  );
};
```

## 스타일링 팁

### 주문 상태별 스타일
```css
.order-status {
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
}

.order-status.pending {
  background-color: #fef3c7;
  color: #92400e;
}

.order-status.processing {
  background-color: #dbeafe;
  color: #1e40af;
}

.order-status.shipped {
  background-color: #d1fae5;
  color: #065f46;
}

.order-status.delivered {
  background-color: #e0e7ff;
  color: #3730a3;
}

.order-status.cancelled {
  background-color: #fee2e2;
  color: #991b1b;
}
```

### 모바일 반응형
```css
@media (max-width: 768px) {
  .order-item {
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 16px;
    margin-bottom: 12px;
  }
  
  .order-header {
    flex-direction: column;
    gap: 8px;
  }
  
  .order-actions {
    flex-wrap: wrap;
    gap: 8px;
  }
  
  .order-actions button {
    flex: 1 1 calc(50% - 4px);
    min-width: 120px;
  }
}
```

## 주의사항

1. **로그인 상태 확인**: 주문 내역은 로그인한 사용자만 볼 수 있습니다.
2. **주문 취소**: 'pending' 상태의 주문만 취소 가능합니다.
3. **배송 추적**: 'SHIPPING', 'ARRIVED', 'FINISHED' 상태에서 배송조회 모달이 열립니다.
4. **리뷰 작성**: 'delivered' 상태의 주문만 리뷰 작성 가능합니다.
5. **페이지네이션**: 서버 사이드 페이지네이션을 사용합니다.
6. **에러 처리**: 네트워크 오류나 권한 오류를 적절히 처리해야 합니다.

## 다국어 키

주요 다국어 키 목록:
- `'주문 내역'`
- `'주문 내역을 불러오는 중입니다...'`
- `'주문 내역을 불러오는데 실패했습니다'`
- `'주문 내역이 없습니다.'`
- `'주문 내역을 확인하려면 로그인이 필요합니다.'`
- `'쇼핑 계속하기'`
- `'전체 상태'`, `'결제 대기'`, `'처리중'`, `'배송중'`, `'배송 완료'`, `'취소됨'`
- `'전체 기간'`, `'1주일'`, `'1개월'`, `'3개월'`, `'6개월'`, `'1년'`
- `'주문 상세'`, `'주문 취소'`, `'배송 추적'`, `'다시 담기'`
- `'리뷰 작성'`
- `'총 결제금액'`
- `'처음'`, `'이전'`, `'다음'`, `'마지막'`