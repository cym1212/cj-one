import { Link } from 'react-router';

import { RollingText } from '@/components/ui/RollingText';
interface Notice {
    id: number;
    title: string;
    link: string;
}

const notices: Notice[] = [
    { id: 1, title: '공지사항 첫 번째 항목입니다', link: '/notice/1' },
    { id: 2, title: '공지사항 두 번째 항목입니다', link: '/notice/2' },
    { id: 3, title: '공지사항 세 번째 항목입니다', link: '/notice/3' },
    { id: 4, title: '공지사항 네 번째 항목입니다', link: '/notice/4' },
];

export function Footer() {
    return (
        <footer className="poj2-footer pb-16 lg:pb-0 bg-border/25 lg:bg-white">
            {/* 풋터 상단 */}
            <div className="border-y border-border">
                <div className="lg:poj2-global-wrapper flex flex-col lg:flex-row items-center justify-between">
                    {/* 공지사항 */}
                    <div className="poj2-footer-rolling-notice w-full flex-1 flex items-center gap-3 px-4 lg:px-2.5 py-3 leading-[1] text-sm bg-white">
                        <p className="shrink-0 px-3 py-1 border border-accent rounded-full text-accent">공지사항</p>
                        <div className="w-full h-5">
                            <RollingText>
                                {notices.map((notice) => (
                                    <Link
                                        key={notice.id}
                                        to={notice.link}
                                        data-rolling-item
                                        className="absolute inset-0 flex items-center truncate hover:text-accent transition-colors"
                                    >
                                        {notice.title}
                                    </Link>
                                ))}
                            </RollingText>
                        </div>
                    </div>
                    {/* 고객센터 버튼 */}
                    <div className="shrink-0 flex items-center gap-4 w-full lg:w-auto px-4 lg:px-2.5 py-3 text-sm font-bold border-t lg:border-none border-border">
                        <Link
                            to={'/customer-center'}
                            className="transition-colors hover:text-accent w-full lg:w-auto text-center"
                        >
                            고객센터
                        </Link>
                        <Link
                            to={'/login'}
                            className="transition-colors hover:text-accent w-full lg:w-auto text-center"
                        >
                            로그인
                        </Link>
                    </div>
                </div>
            </div>

            {/* 풋터 하단 */}
            <div className="poj2-global-wrapper flex items-center py-4">
                {/* logo */}
                <div className="hidden lg:block shrink-0 w-[210px]">
                    <h2>
                        <img
                            src="/images/logo.png"
                            alt="CJ온스타일"
                            className="max-h-12 h-full"
                        />
                    </h2>
                </div>
                {/* 내용 */}
                <div className="flex-1 space-y-5">
                    {/* 회사 정보 */}
                    <div className="flex flex-wrap gap-x-3 lg:gap-x-0 text-xs text-description leading-lg">
                        <span className="poj2-auto-divider">(주)씨제이이엔엠</span>
                        <span className="poj2-auto-divider">대표이사 : 윤상현</span>
                        <span className="poj2-auto-divider">주소 : 06761 서울시 서초구 과천대로 870-13</span>
                        <span className="poj2-auto-divider">통신판매업자 : (주)CJ ENM</span>
                        <span className="poj2-auto-divider">사업자등록번호 : 106-81-51510</span>
                        <span className="poj2-auto-divider">통신판매업신고 : 서초 제 0000015호</span>
                        <span className="poj2-auto-divider">개인정보 보호책임자 : 정보보안센터 공진희</span>
                        <span className="poj2-auto-divider">이메일 : webmaster@cjonstyle.com</span>
                        <span className="poj2-auto-divider">고객센터 : 1644-2525(유료)</span>
                        <span>FAX : 02-2107-1009</span>
                    </div>

                    {/* 네비게이션 메뉴 */}
                    <nav>
                        <ul className="flex flex-wrap gap-x-3 lg:gap-x-5 gap-y-2 text-xs">
                            <li className="transition-colors hover:text-accent">
                                <Link
                                    to={'/about'}
                                    className=""
                                >
                                    사업자정보확인
                                </Link>
                            </li>
                            <li className="transition-colors hover:text-accent">
                                <Link
                                    to={'/about'}
                                    className=""
                                >
                                    이용약관
                                </Link>
                            </li>
                            <li className="transition-colors hover:text-accent">
                                <Link
                                    to={'/about'}
                                    className=""
                                >
                                    개인정보처리방침
                                </Link>
                            </li>
                            <li className="transition-colors hover:text-accent">
                                <Link
                                    to={'/about'}
                                    className=""
                                >
                                    전기매출 이용약관
                                </Link>
                            </li>
                            <li className="transition-colors hover:text-accent">
                                <Link
                                    to={'/about'}
                                    className=""
                                >
                                    청소년보호정책
                                </Link>
                            </li>
                            <li className="transition-colors hover:text-accent">
                                <Link
                                    to={'/about'}
                                    className=""
                                >
                                    법적고지
                                </Link>
                            </li>
                            <li className="transition-colors hover:text-accent">
                                <Link
                                    to={'/about'}
                                    className=""
                                >
                                    국민은행 구매안전 서비스
                                </Link>
                            </li>
                            <li className="transition-colors hover:text-accent">
                                <Link
                                    to={'/about'}
                                    className=""
                                >
                                    방문판매법 신원확인
                                </Link>
                            </li>
                            <li className="transition-colors hover:text-accent">
                                <Link
                                    to={'/about'}
                                    className=""
                                >
                                    금융소비자 내부통제기준
                                </Link>
                            </li>
                        </ul>
                    </nav>

                    {/* 고객 고지사항 */}
                    <div>
                        <p className="text-xs text-description">CJ ONSTYLE 내 판매 상품 중 일부는 개별 판매자의 상품이 포함되어있고, 이 경우 CJ ENM 은 통신판매의 당사자가 아니므로 해당 상품, 거래정보 및 거래에 대하여는 개별 판매자에 책임이 있습니다.</p>
                    </div>

                    {/* 저작권 */}
                    <div className="border-t border-border pt-4">
                        <p className="text-xs text-description">Copyright(C) CJ ENM All Rights Reserved.</p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
