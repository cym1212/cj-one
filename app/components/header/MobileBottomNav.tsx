import React from 'react';
import { NavLink } from 'react-router';

import { HomeIcon, UserIcon, CartIcon, MenuIcon, HistoryIcon } from '@/components/icons';

export function MobileBottomNav() {
    const items: { to: string; label: string; icon: ({ tailwind }: { tailwind?: string }) => React.ReactElement; end?: boolean }[] = [
        { to: '/menu', label: '카테고리', icon: MenuIcon },
        { to: '/myzone', label: '마이존', icon: UserIcon },
        { to: '/', label: '홈', icon: HomeIcon, end: true },
        { to: '/cart', label: '장바구니', icon: CartIcon },
        { to: '/history', label: '히스토리', icon: HistoryIcon },
    ];

    return (
        <nav className="poj2-mobile-bottom-nav fixed bottom-0 left-0 right-0 z-10 lg:hidden bg-white border-t border-border">
            <ul className="flex items-stretch justify-between px-2 py-1">
                {items.map(({ to, label, icon: Icon, end }) => {
                    return (
                        <li
                            key={to}
                            className="flex-1"
                        >
                            <NavLink
                                to={to}
                                end={to === '/'}
                                className={({ isActive }) => `flex flex-col items-center justify-center py-2 gap-1 ${isActive ? 'text-accent fill-accent' : 'text-black fill-black'}`}
                            >
                                <Icon tailwind="w-[26px] h-[26px]" />
                                <span className="text-[10px] leading-none">{label}</span>
                            </NavLink>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}
