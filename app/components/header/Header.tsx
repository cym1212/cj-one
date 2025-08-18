import { Link, NavLink } from 'react-router';

import { UtilMenu } from '@/components/header/UtilMenu';
import { DesktopSearchBar } from '@/components/header/DesktopSearchBar';
import { MobileSearchBar } from '@/components/header/MobileSearchBar';

import { CategoryMenu } from '@/components/header/CategoryMenu';

export function Header() {
    return (
        <header className="poj2-header z-10 bg-white">
            <div>
                <div className="poj2-global-wrapper grid grid-cols-[1fr_auto] lg:grid-cols-[1fr_auto_1fr] items-center gap-5 py-3 lg:py-4">
                    <h1 className="justify-self-start">
                        <Link
                            to="/"
                            className="block h-10 lg:h-full"
                        >
                            <img
                                src="/images/logo.png"
                                alt="CJ온스타일"
                                className="max-h-12 h-full"
                            />
                        </Link>
                    </h1>
                    <div className="justify-self-center">
                        <div className="w-full hidden lg:block">
                            <DesktopSearchBar />
                        </div>
                        <div className="w-full lg:hidden">
                            <MobileSearchBar />
                        </div>
                    </div>
                    <div className="justify-self-end hidden lg:flex items-center gap-5">
                        <UtilMenu />
                    </div>
                </div>
            </div>
            <div className="hidden lg:block h-15 border-y border-border">
                <div className="poj2-global-wrapper h-full flex items-center px-5">
                    <CategoryMenu />
                    <nav className="poj2-header-nav h-full">
                        <ul className="h-full flex gap-10 ml-10">
                            <li className="h-full">
                                <NavLink
                                    to="/"
                                    end
                                    className={({ isActive }) => `h-full flex items-center px-5 ${isActive ? 'font-bold border-b-2 border-black' : undefined}`}
                                >
                                    홈
                                </NavLink>
                            </li>
                            <li className="h-full flex items-center">
                                <NavLink
                                    to="/benefit"
                                    className={({ isActive }) => `h-full flex items-center px-5${isActive ? 'font-bold border-b-2 border-black' : undefined}`}
                                >
                                    혜택
                                </NavLink>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
        </header>
    );
}
