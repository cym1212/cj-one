import { Link } from 'react-router';

import { LoginIcon, UserIcon, CartIcon } from '@/components/icons';

const MENU_DATA = [
    {
        to: '/login',
        icon: <LoginIcon tailwind="w-[27px] h-[27px] transition-colors group-hover/util-menu-item:fill-accent" />,
        label: '로그인',
        isDesktopOnly: true,
    },
    {
        to: '/myzone',
        icon: <UserIcon tailwind="w-[27px] h-[27px] transition-colors group-hover/util-menu-item:fill-accent" />,
        label: '마이존',
        isDesktopOnly: true,
    },
    {
        to: '/cart',
        icon: <CartIcon tailwind="w-[27px] h-[27px] transition-colors group-hover/util-menu-item:fill-accent" />,
        label: '장바구니',
    },
];

export function UtilMenu() {
    return (
        <ul className="poj2-util-menu flex items-center gap-5">
            {MENU_DATA.map((item) => (
                <li
                    key={item.to}
                    className={item.isDesktopOnly ? 'hidden lg:block' : ''}
                >
                    <Link
                        to={item.to}
                        className="group/util-menu-item flex flex-col items-center justify-center gap-1"
                    >
                        {item.icon}
                        <span className="hidden lg:block text-xs text-description transition-colors group-hover/util-menu-item:text-accent">{item.label}</span>
                    </Link>
                </li>
            ))}
        </ul>
    );
}
