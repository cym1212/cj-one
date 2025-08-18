# Board 컴포넌트 외부 스킨 API 가이드

## 컴포넌트 개요

Board(게시판) 컴포넌트는 완전한 CRUD 기능을 제공하는 게시판 시스템입니다. 게시글 목록 조회, 상세 보기, 작성, 수정, 삭제와 댓글 시스템을 포함한 포괄적인 커뮤니티 기능을 제공합니다.

**주요 특징:**
- 게시글 목록 조회 (서버 기반 페이징)
- 게시글 상세 보기
- 게시글 작성/수정/삭제 (권한 기반)
- 댓글 작성/수정/삭제 (서버 기반 페이징)
- 실시간 권한 관리 (API 기반)
- 게시판별 카테고리 지원
- 조회수 관리
- 작성자 표시 (관리자/본인/익명)
- 다국어 지원
- 반응형 디자인
- 모바일/PC 디바이스별 설정
- 풍부한 텍스트 에디터 (YooptaHtmlEditor) 지원

## ComponentSkinProps 인터페이스

```typescript
interface ComponentSkinProps {
  data: {
    // 기본 정보
    id: string;
    style: React.CSSProperties;
    componentProps: object;
    
    // 게시판 모드 (중요!)
    mode: 'list' | 'detail' | 'new' | 'edit';
    
    // 게시판 설정
    boardTitle: string;           // 게시판 제목
    boardCode: string;           // 게시판 코드
    selectedBoardId: number | string | null;
    categoryId: number | string | null;
    postId: number | string | null;
    
    // 표시 설정
    showNewButton: boolean;      // 새 글 작성 버튼 표시
    showEditButton: boolean;     // 수정 버튼 표시
    showDeleteButton: boolean;   // 삭제 버튼 표시  
    showCommentButton: boolean;  // 댓글 작성 버튼 표시
    
    // 게시글 목록 데이터
    posts: Array<{
      id: number;
      title: string;
      content: string;
      createdAt: string;
      views: number;
      viewCount: number;
      userId: number | string;
      administratorId?: number;
      author?: string;
      user?: {
        name: string;
      };
    }>;
    postsLoading: boolean;
    
    // 게시글 상세 데이터
    postDetail: {
      post?: {
        id: number;
        title: string;
        content: string;
        createdAt: string;
        views: number;
        viewCount: number;
        userId: number | string;
        administratorId?: number;
        author?: string;
        user?: {
          name: string;
        };
        originalBlock?: any;      // 원본 에디터 블록 데이터
        totalComments?: number;
        permissions?: {
          canEdit: boolean;
          canDelete: boolean;
          canComment: boolean;
        };
        children?: Array<any>;    // 댓글 데이터
      };
      permissions?: {
        canEdit: boolean;
        canDelete: boolean;
        canComment: boolean;
      };
    } | null;
    postDetailLoading: boolean;
    
    // 페이징 정보
    pagination: {
      currentPage: number;
      totalPages: number;
      totalCount: number;
      perPage: number;
    };
    currentPage: number;
    
    // 댓글 관련
    paginatedComments: Array<{
      id: number;
      content: string;
      createdAt: string;
      userId: number | string;
      administratorId?: number;
      author?: string;
      user?: {
        name: string;
      };
      permissions?: {
        canEdit: boolean;
        canDelete: boolean;
      };
    }>;
    totalCommentPages: number;
    currentCommentPage: number;
    
    // 폼 데이터
    formData: {
      title: string;
      content: string;
      originalBlock: any | null;
    };
    
    // 댓글 폼 데이터
    commentData: {
      content: string;
    };
    
    // 댓글 수정 상태
    editingCommentId: number | null;
    editingCommentContent: string;
    
    // 에디터 데이터
    editorInitialData: string;
    
    // 모달 상태
    showDeleteModal: boolean;
    
    // 권한 정보
    postsData?: {
      permissions?: {
        canWrite: boolean;
        canEdit: boolean;
        canDelete: boolean;
        canComment: boolean;
      };
    };
    
    // 사용자 정보
    currentUser: any;
    isUserLoggedIn: boolean;
    isAdminLoggedIn: boolean;
    
    // 디바이스 정보
    currentDevice: 'mobile' | 'pc';
    isFinappMode: boolean;
    
    // 다국어 함수
    t: (key: string) => string;
  };
  
  actions: {
    // 네비게이션
    navigateToList: () => void;
    navigateToDetail: (postId: number) => void;
    navigateToNew: (boardCode?: string) => void;
    
    // 모드 변경
    setBoardMode: (mode: 'list' | 'detail' | 'new' | 'edit') => void;
    
    // 페이징
    handlePageChange: (page: number) => void;
    handleCommentPageChange: (page: number) => void;
    
    // 게시글 CRUD
    handleSavePost: () => void;
    handleDeletePost: () => void;
    confirmDeletePost: () => void;
    cancelDeletePost: () => void;
    setShowDeleteModal: (show: boolean) => void;
    
    // 폼 핸들링
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleEditorChange: (content: string, originalBlock?: any) => void;
    setFormData: (data: { title: string; content: string; originalBlock?: any }) => void;
    
    // 취소 액션
    handleCancelNew: () => void;
    handleCancelEdit: () => void;
    
    // 댓글 CRUD
    handleCommentSubmit: () => void;
    handleCommentChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    handleEditComment: (commentId: number, content: string) => void;
    handleUpdateComment: () => void;
    handleDeleteComment: (commentId: number) => void;
    handleCancelEditComment: () => void;
    handleEditingCommentChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
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

### data.mode (가장 중요!)
게시판의 현재 모드를 나타냅니다:
- `'list'`: 게시글 목록 화면
- `'detail'`: 게시글 상세 화면
- `'new'`: 새 글 작성 화면
- `'edit'`: 게시글 수정 화면

### data.posts (목록 모드)
게시글 목록 데이터입니다. 각 게시글은 다음 정보를 포함합니다:
- `id`: 게시글 고유 ID
- `title`: 게시글 제목
- `createdAt`: 작성일
- `views`/`viewCount`: 조회수
- `userId`/`administratorId`: 작성자 정보

### data.postDetail (상세 모드)
선택된 게시글의 상세 정보와 댓글을 포함합니다:
- `post`: 게시글 상세 정보
- `permissions`: 현재 사용자의 권한 (수정/삭제/댓글 작성)
- `children` 또는 `paginatedComments`: 댓글 목록

### data.formData (작성/수정 모드)
폼 입력 데이터입니다:
- `title`: 게시글 제목
- `content`: 게시글 내용 (HTML)
- `originalBlock`: 에디터 원본 블록 데이터

### actions 함수들
모든 사용자 인터랙션을 처리하는 함수들이 제공됩니다:
- 네비게이션: `navigateToList`, `navigateToDetail`, `navigateToNew`
- CRUD 작업: `handleSavePost`, `handleDeletePost`
- 댓글 관리: `handleCommentSubmit`, `handleEditComment`, `handleDeleteComment`

## 스킨 개발 예제

### 기본 스킨 구조

```jsx
import React from 'react';

const MyBoardSkin = (props) => {
  const { data, actions } = props;
  
  // 모드에 따른 렌더링 분기
  const renderContent = () => {
    switch (data.mode) {
      case 'list':
        return renderListMode();
      case 'detail':
        return renderDetailMode();
      case 'new':
        return renderNewMode();
      case 'edit':
        return renderEditMode();
      default:
        return renderListMode();
    }
  };
  
  // 게시글 목록 화면
  const renderListMode = () => {
    return (
      <div className="board-list">
        {/* 제목과 새 글 버튼 */}
        <div className="board-header">
          {data.boardTitle && (
            <h1 className="board-title">{data.boardTitle}</h1>
          )}
          
          {data.postsData?.permissions?.canWrite && data.showNewButton && (
            <button 
              className="new-post-btn"
              onClick={() => actions.navigateToNew(data.boardCode)}
            >
              {data.t('새 글쓰기')}
            </button>
          )}
        </div>
        
        {/* 로딩 상태 */}
        {data.postsLoading ? (
          <div className="loading">
            {data.t('게시글을 불러오는 중...')}
          </div>
        ) : (
          <>
            {/* 게시글 목록 */}
            {data.posts && data.posts.length > 0 ? (
              <div className="posts-list">
                <table className="posts-table">
                  <thead>
                    <tr>
                      <th>{data.t('번호')}</th>
                      <th>{data.t('제목')}</th>
                      <th>{data.t('작성자')}</th>
                      <th>{data.t('작성일')}</th>
                      <th>{data.t('조회')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.posts.map((post) => (
                      <tr 
                        key={post.id}
                        onClick={() => actions.navigateToDetail(post.id)}
                        className="post-row"
                      >
                        <td>{post.id}</td>
                        <td className="post-title">{post.title}</td>
                        <td className="post-author">
                          {getAuthorName(post)}
                        </td>
                        <td>{formatDate(post.createdAt)}</td>
                        <td>{post.views || post.viewCount || 0}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="empty-list">
                {data.t('게시글이 없습니다.')}
              </div>
            )}
            
            {/* 페이징 */}
            {renderPagination()}
          </>
        )}
      </div>
    );
  };
  
  // 게시글 상세 화면
  const renderDetailMode = () => {
    if (data.postDetailLoading) {
      return (
        <div className="loading">
          {data.t('게시글을 불러오는 중...')}
        </div>
      );
    }
    
    if (!data.postDetail) {
      return (
        <div className="error">
          {data.t('게시글을 찾을 수 없습니다.')}
        </div>
      );
    }
    
    const post = data.postDetail.post || data.postDetail;
    const permissions = post.permissions || data.postDetail.permissions || {};
    
    return (
      <div className="board-detail">
        {/* 액션 버튼 */}
        <div className="detail-actions">
          <button 
            className="list-btn"
            onClick={actions.navigateToList}
          >
            {data.t('목록')}
          </button>
          
          {permissions.canEdit && data.showEditButton && (
            <button 
              className="edit-btn"
              onClick={() => {
                actions.setFormData({
                  title: post.title,
                  content: post.content,
                  originalBlock: post.originalBlock || null
                });
                actions.setBoardMode('edit');
              }}
            >
              {data.t('수정')}
            </button>
          )}
          
          {permissions.canDelete && data.showDeleteButton && (
            <button 
              className="delete-btn"
              onClick={() => actions.setShowDeleteModal(true)}
            >
              {data.t('삭제')}
            </button>
          )}
        </div>
        
        {/* 게시글 내용 */}
        <div className="post-content">
          <h1 className="post-title">{post.title}</h1>
          
          <div className="post-meta">
            <span className="author">
              {data.t('작성자')}: {getAuthorName(post)}
            </span>
            <span className="date">
              {data.t('작성일')}: {formatDate(post.createdAt)}
            </span>
            <span className="views">
              {data.t('조회수')}: {post.views || post.viewCount || 0}
            </span>
          </div>
          
          <div 
            className="post-body"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>
        
        {/* 댓글 섹션 */}
        {renderCommentsSection(post, permissions)}
        
        {/* 삭제 확인 모달 */}
        {data.showDeleteModal && renderDeleteModal()}
      </div>
    );
  };
  
  // 게시글 작성 화면
  const renderNewMode = () => {
    return (
      <div className="board-form">
        <div className="form-header">
          <h2>
            {data.boardTitle ? 
              `${data.boardTitle} - ${data.t('새 글 작성')}` : 
              data.t('새 글 작성')
            }
          </h2>
        </div>
        
        <div className="form-content">
          {/* 제목 입력 */}
          <div className="form-group">
            <label htmlFor="title">{data.t('제목')}</label>
            <input
              type="text"
              id="title"
              name="title"
              value={data.formData.title}
              onChange={actions.handleInputChange}
              placeholder={data.t('제목을 입력하세요')}
              className="form-input"
            />
          </div>
          
          {/* 내용 에디터 */}
          <div className="form-group">
            <label>{data.t('내용')}</label>
            <div className="editor-wrapper">
              {/* YooptaHtmlEditor는 자동으로 로드됩니다 */}
              <div className="editor-placeholder">
                {data.t('에디터가 로드됩니다...')}
              </div>
            </div>
          </div>
          
          {/* 액션 버튼 */}
          <div className="form-actions">
            <button 
              className="cancel-btn"
              onClick={actions.handleCancelNew}
            >
              {data.t('취소')}
            </button>
            <button 
              className="save-btn"
              onClick={actions.handleSavePost}
            >
              {data.t('저장')}
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  // 게시글 수정 화면
  const renderEditMode = () => {
    return (
      <div className="board-form">
        <div className="form-header">
          <h2>
            {data.boardTitle ? 
              `${data.boardTitle} - ${data.t('게시글 수정')}` : 
              data.t('게시글 수정')
            }
          </h2>
        </div>
        
        <div className="form-content">
          {/* 제목 입력 */}
          <div className="form-group">
            <label htmlFor="title">{data.t('제목')}</label>
            <input
              type="text"
              id="title"
              name="title"
              value={data.formData.title}
              onChange={actions.handleInputChange}
              placeholder={data.t('제목을 입력하세요')}
              className="form-input"
            />
          </div>
          
          {/* 내용 에디터 */}
          <div className="form-group">
            <label>{data.t('내용')}</label>
            <div className="editor-wrapper">
              {/* 수정 모드에서는 기존 내용이 로드됩니다 */}
              <div className="editor-placeholder">
                {data.t('에디터가 로드됩니다...')}
              </div>
            </div>
          </div>
          
          {/* 액션 버튼 */}
          <div className="form-actions">
            <button 
              className="cancel-btn"
              onClick={actions.handleCancelEdit}
            >
              {data.t('취소')}
            </button>
            <button 
              className="save-btn"
              onClick={actions.handleSavePost}
            >
              {data.t('저장')}
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  // 댓글 섹션 렌더링
  const renderCommentsSection = (post, permissions) => {
    const comments = data.paginatedComments || post.children || [];
    
    return (
      <div className="comments-section">
        <h3 className="comments-title">
          {data.t('댓글')} ({post.totalComments || comments.length})
        </h3>
        
        {/* 댓글 목록 */}
        {comments.length > 0 ? (
          <div className="comments-list">
            {comments.map((comment) => (
              <div key={comment.id} className="comment-item">
                <div className="comment-header">
                  <span className="comment-author">
                    {getAuthorName(comment)}
                  </span>
                  <span className="comment-date">
                    {formatDate(comment.createdAt)}
                  </span>
                </div>
                
                {data.editingCommentId === comment.id ? (
                  // 댓글 수정 폼
                  <div className="comment-edit-form">
                    <textarea
                      value={data.editingCommentContent}
                      onChange={actions.handleEditingCommentChange}
                      className="comment-textarea"
                      placeholder={data.t('댓글을 입력하세요...')}
                    />
                    <div className="comment-edit-actions">
                      <button 
                        className="save-btn"
                        onClick={actions.handleUpdateComment}
                      >
                        {data.t('저장')}
                      </button>
                      <button 
                        className="cancel-btn"
                        onClick={actions.handleCancelEditComment}
                      >
                        {data.t('취소')}
                      </button>
                    </div>
                  </div>
                ) : (
                  // 댓글 내용
                  <div 
                    className="comment-content"
                    dangerouslySetInnerHTML={{ __html: comment.content }}
                  />
                )}
                
                {/* 댓글 액션 버튼 */}
                {data.editingCommentId !== comment.id && 
                 (comment.permissions?.canEdit || comment.permissions?.canDelete) && (
                  <div className="comment-actions">
                    {comment.permissions?.canEdit && (
                      <button 
                        className="edit-btn"
                        onClick={() => actions.handleEditComment(comment.id, comment.content)}
                      >
                        {data.t('수정')}
                      </button>
                    )}
                    {comment.permissions?.canDelete && (
                      <button 
                        className="delete-btn"
                        onClick={() => actions.handleDeleteComment(comment.id)}
                      >
                        {data.t('삭제')}
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="no-comments">
            {data.t('아직 댓글이 없습니다.')}
          </div>
        )}
        
        {/* 댓글 페이징 */}
        {data.totalCommentPages > 1 && renderCommentPagination()}
        
        {/* 댓글 작성 폼 */}
        {permissions.canComment && data.showCommentButton && (
          <div className="comment-form">
            <textarea
              value={data.commentData.content}
              onChange={actions.handleCommentChange}
              className="comment-textarea"
              placeholder={data.t('댓글을 입력하세요...')}
            />
            <button 
              className="submit-btn"
              onClick={actions.handleCommentSubmit}
            >
              {data.t('댓글 작성')}
            </button>
          </div>
        )}
      </div>
    );
  };
  
  // 페이징 렌더링
  const renderPagination = () => {
    if (!data.pagination || data.pagination.totalPages <= 1) return null;
    
    return (
      <div className="pagination">
        {Array.from({ length: data.pagination.totalPages }, (_, i) => i + 1)
          .map(page => (
            <button
              key={page}
              className={`page-btn ${page === data.currentPage ? 'active' : ''}`}
              onClick={() => actions.handlePageChange(page)}
            >
              {page}
            </button>
          ))}
      </div>
    );
  };
  
  // 댓글 페이징 렌더링
  const renderCommentPagination = () => {
    return (
      <div className="comment-pagination">
        {Array.from({ length: data.totalCommentPages }, (_, i) => i + 1)
          .map(page => (
            <button
              key={page}
              className={`page-btn ${page === data.currentCommentPage ? 'active' : ''}`}
              onClick={() => actions.handleCommentPageChange(page)}
            >
              {page}
            </button>
          ))}
      </div>
    );
  };
  
  // 삭제 확인 모달
  const renderDeleteModal = () => {
    return (
      <div className="modal-overlay">
        <div className="modal">
          <h3>{data.t('게시글을 삭제하시겠습니까?')}</h3>
          <p>{data.t('삭제한 게시글은 복구할 수 없습니다.')}</p>
          <div className="modal-actions">
            <button 
              className="cancel-btn"
              onClick={actions.cancelDeletePost}
            >
              {data.t('취소')}
            </button>
            <button 
              className="confirm-btn"
              onClick={actions.confirmDeletePost}
            >
              {data.t('삭제')}
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  // 작성자 이름 반환
  const getAuthorName = (item) => {
    if (item.administratorId) return data.t('관리자');
    
    if (data.currentUser && item.userId) {
      const isCurrentUser = 
        (data.currentUser.id && data.currentUser.id.toString() === item.userId.toString()) ||
        (data.currentUser.userId && data.currentUser.userId.toString() === item.userId.toString());
      
      if (isCurrentUser) return data.t('나');
    }
    
    return item.user?.name || item.author || data.t('익명');
  };
  
  // 날짜 포맷팅
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };
  
  return (
    <div 
      className={`board-container ${data.isFinappMode ? 'finapp-mode' : ''}`}
      data-device={data.currentDevice}
      style={data.style}
    >
      {renderContent()}
    </div>
  );
};

export default MyBoardSkin;
```

## 주요 기능 구현 가이드

### 1. 모드 기반 렌더링

게시판은 4가지 모드를 가지므로 모드에 따른 렌더링 분기가 필수입니다:

```jsx
const renderContent = () => {
  switch (data.mode) {
    case 'list':
      return <PostList />;
    case 'detail':
      return <PostDetail />;
    case 'new':
      return <PostForm isEdit={false} />;
    case 'edit':
      return <PostForm isEdit={true} />;
    default:
      return <PostList />;
  }
};
```

### 2. 권한 기반 UI 표시

모든 액션 버튼은 API에서 제공하는 권한 정보를 기반으로 표시해야 합니다:

```jsx
// 새 글 작성 버튼
{data.postsData?.permissions?.canWrite && data.showNewButton && (
  <button onClick={() => actions.navigateToNew()}>
    새 글쓰기
  </button>
)}

// 수정/삭제 버튼
{permissions.canEdit && data.showEditButton && (
  <button onClick={handleEdit}>수정</button>
)}

{permissions.canDelete && data.showDeleteButton && (
  <button onClick={handleDelete}>삭제</button>
)}
```

### 3. 댓글 시스템

댓글은 수정 모드와 일반 모드를 구분해서 처리해야 합니다:

```jsx
// 댓글 수정 상태 확인
{data.editingCommentId === comment.id ? (
  // 수정 모드 UI
  <CommentEditForm />
) : (
  // 일반 표시 UI
  <CommentDisplay />
)}
```

### 4. 페이징 처리

게시글과 댓글 모두 서버 기반 페이징을 사용합니다:

```jsx
// 게시글 페이징
const renderPagination = () => {
  if (!data.pagination || data.pagination.totalPages <= 1) return null;
  
  return (
    <div className="pagination">
      {Array.from({ length: data.pagination.totalPages }, (_, i) => i + 1)
        .map(page => (
          <button
            key={page}
            className={page === data.currentPage ? 'active' : ''}
            onClick={() => actions.handlePageChange(page)}
          >
            {page}
          </button>
        ))}
    </div>
  );
};

// 댓글 페이징
const renderCommentPagination = () => {
  return (
    <div className="comment-pagination">
      {Array.from({ length: data.totalCommentPages }, (_, i) => i + 1)
        .map(page => (
          <button
            key={page}
            className={page === data.currentCommentPage ? 'active' : ''}
            onClick={() => actions.handleCommentPageChange(page)}
          >
            {page}
          </button>
        ))}
    </div>
  );
};
```

### 5. 에디터 통합

YooptaHtmlEditor는 자동으로 통합되지만, 에디터 영역에 플레이스홀더를 제공해야 합니다:

```jsx
// 새 글 작성
<YooptaHtmlEditor
  initialData=""
  onChange={actions.handleEditorChange}
  placeholder={data.t('내용을 입력하세요')}
  editorKey={`board-new-${data.categoryId || 'default'}`}
/>

// 게시글 수정
<YooptaHtmlEditor
  initialData={data.editorInitialData}
  onChange={actions.handleEditorChange}
  placeholder={data.t('내용을 입력하세요')}
  editorKey={`board-edit-${data.postId || 'edit'}`}
/>
```

### 6. 작성자 표시 로직

작성자는 관리자/본인/익명으로 구분하여 표시합니다:

```jsx
const getAuthorName = (item) => {
  // 관리자 계정
  if (item.administratorId) {
    return data.t('관리자');
  }
  
  // 현재 로그인한 사용자인지 확인
  if (data.currentUser && item.userId) {
    const isCurrentUser = 
      (data.currentUser.id && data.currentUser.id.toString() === item.userId.toString()) ||
      (data.currentUser.userId && data.currentUser.userId.toString() === item.userId.toString());
    
    if (isCurrentUser) {
      return data.t('나');
    }
  }
  
  // 일반 사용자 또는 익명
  return item.user?.name || item.author || data.t('익명');
};
```

## 스타일링 가이드

### 기본 구조 CSS

```css
/* 게시판 컨테이너 */
.board-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.board-container[data-device="mobile"] {
  padding: 10px;
}

/* 게시글 목록 */
.board-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.board-title {
  font-size: 24px;
  font-weight: bold;
  margin: 0;
}

.new-post-btn {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

.posts-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

.posts-table th,
.posts-table td {
  padding: 12px 8px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.posts-table th {
  background-color: #f8f9fa;
  font-weight: bold;
}

.post-row {
  cursor: pointer;
  transition: background-color 0.2s;
}

.post-row:hover {
  background-color: #f8f9fa;
}

.post-title {
  font-weight: bold;
  color: #333;
}

/* 게시글 상세 */
.detail-actions {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.detail-actions button {
  padding: 8px 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  cursor: pointer;
}

.edit-btn {
  background-color: #28a745 !important;
  color: white !important;
  border-color: #28a745 !important;
}

.delete-btn {
  background-color: #dc3545 !important;
  color: white !important;
  border-color: #dc3545 !important;
}

.post-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  margin-bottom: 30px;
}

.post-title {
  font-size: 24px;
  margin-bottom: 15px;
  color: #333;
}

.post-meta {
  display: flex;
  gap: 20px;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
  margin-bottom: 20px;
  font-size: 14px;
  color: #666;
}

.post-body {
  line-height: 1.6;
  font-size: 16px;
}

/* 댓글 섹션 */
.comments-section {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.comments-title {
  font-size: 18px;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid #007bff;
}

.comment-item {
  padding: 15px 0;
  border-bottom: 1px solid #eee;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  font-size: 14px;
}

.comment-author {
  font-weight: bold;
  color: #333;
}

.comment-date {
  color: #666;
}

.comment-content {
  margin-bottom: 10px;
  line-height: 1.5;
}

.comment-actions {
  display: flex;
  gap: 10px;
}

.comment-actions button {
  padding: 4px 8px;
  font-size: 12px;
  border: 1px solid #ddd;
  border-radius: 3px;
  background: white;
  cursor: pointer;
}

/* 댓글 폼 */
.comment-form {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #eee;
}

.comment-textarea {
  width: 100%;
  min-height: 80px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  resize: vertical;
  font-family: inherit;
  font-size: 14px;
  margin-bottom: 10px;
}

/* 폼 스타일 */
.board-form {
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.form-header {
  margin-bottom: 30px;
  padding-bottom: 15px;
  border-bottom: 2px solid #007bff;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
  color: #333;
}

.form-input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

.form-input:focus {
  outline: none;
  border-color: #007bff;
}

.editor-wrapper {
  min-height: 300px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.form-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 30px;
}

.form-actions button {
  padding: 12px 24px;
  border: none;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
}

.cancel-btn {
  background-color: #6c757d;
  color: white;
}

.save-btn {
  background-color: #007bff;
  color: white;
}

/* 페이징 */
.pagination {
  display: flex;
  justify-content: center;
  gap: 5px;
  margin-top: 30px;
}

.page-btn {
  padding: 8px 12px;
  border: 1px solid #ddd;
  background: white;
  cursor: pointer;
  border-radius: 4px;
}

.page-btn:hover {
  background-color: #f8f9fa;
}

.page-btn.active {
  background-color: #007bff;
  color: white;
  border-color: #007bff;
}

/* 모달 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: white;
  padding: 30px;
  border-radius: 8px;
  max-width: 400px;
  width: 90%;
}

.modal h3 {
  margin-bottom: 15px;
  color: #333;
}

.modal p {
  margin-bottom: 20px;
  color: #666;
}

.modal-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.confirm-btn {
  background-color: #dc3545;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

/* 반응형 디자인 */
@media (max-width: 768px) {
  .board-header {
    flex-direction: column;
    gap: 15px;
    align-items: stretch;
  }
  
  .posts-table {
    font-size: 14px;
  }
  
  .posts-table th:nth-child(4),
  .posts-table td:nth-child(4),
  .posts-table th:nth-child(5),
  .posts-table td:nth-child(5) {
    display: none;
  }
  
  .post-meta {
    flex-direction: column;
    gap: 5px;
  }
  
  .detail-actions {
    flex-wrap: wrap;
  }
  
  .comment-header {
    flex-direction: column;
    gap: 5px;
  }
  
  .form-actions {
    flex-direction: column;
  }
}

/* 로딩 상태 */
.loading {
  text-align: center;
  padding: 40px;
  color: #666;
}

.empty-list {
  text-align: center;
  padding: 40px;
  color: #999;
}

.no-comments {
  text-align: center;
  padding: 20px;
  color: #999;
  font-style: italic;
}
```

## 주의사항

1. **모드 확인**: 반드시 `data.mode`를 확인하여 적절한 UI를 렌더링하세요.
2. **권한 기반 표시**: 모든 액션 버튼은 API 권한 정보를 기반으로 표시해야 합니다.
3. **댓글 수정 상태**: `editingCommentId`를 확인하여 댓글 수정 UI를 적절히 처리하세요.
4. **에디터 통합**: YooptaHtmlEditor는 자동으로 로드되므로 플레이스홀더만 제공하면 됩니다.
5. **페이징 처리**: 게시글과 댓글 페이징은 별도로 처리해야 합니다.
6. **작성자 표시**: 관리자/본인/익명 구분 로직을 정확히 구현하세요.
7. **반응형 디자인**: 모바일과 PC에서 모두 적절히 표시되도록 구현하세요.
8. **에러 처리**: 로딩 상태와 에러 상태를 적절히 처리하세요.

## 다국어 키

주요 다국어 키 목록:
- `'게시판'`, `'게시글'`, `'댓글'`
- `'목록'`, `'상세'`, `'새 글쓰기'`, `'수정'`, `'삭제'`
- `'제목'`, `'내용'`, `'작성자'`, `'작성일'`, `'조회'`, `'조회수'`
- `'댓글 작성'`, `'댓글을 입력하세요...'`
- `'저장'`, `'취소'`, `'확인'`
- `'게시글을 불러오는 중...'`, `'게시글이 없습니다.'`
- `'게시글을 찾을 수 없습니다.'`, `'아직 댓글이 없습니다.'`
- `'게시글을 삭제하시겠습니까?'`, `'삭제한 게시글은 복구할 수 없습니다.'`
- `'관리자'`, `'나'`, `'익명'`
- `'번호'`, `'새 글 작성'`, `'게시글 수정'`
- `'에디터가 로드됩니다...'`, `'제목을 입력하세요'`, `'내용을 입력하세요'`