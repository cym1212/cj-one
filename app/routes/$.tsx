import { redirect } from 'react-router';

// 404 혹은 잘못된 경로로 접근했을 때 홈으로 리다이렉트합니다.
export async function loader() {
    return redirect('/');
}
