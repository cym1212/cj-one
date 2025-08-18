import { useState } from 'react';
import { Link } from 'react-router';
import { useGSAP } from '@gsap/react';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import gsap from 'gsap';

gsap.registerPlugin(useGSAP, ScrollToPlugin);

import { HeadsetIcon, ArrowLeftIcon, CloseIcon, ArrowUpIcon } from '@/components/icons';
import { ShoppingHistoryModal } from '@/components/ui/ShoppingHistoryModal';

import { useShoppingHistory } from '@/hooks/useShoppingHistory';

export function SideQuickMenu() {
    const { shoppingHistory, removeHistory, clearAllShoppingHistory } = useShoppingHistory();
    const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

    const handleScrollTop = () => {
        gsap.to(window, {
            scrollTo: 0,
            duration: 0.9,
            ease: 'power2.inOut',
        });
    };

    return (
        <div className="poj2-side-quick-menu relative hidden sm:block space-y-2 mt-4 lg:mt-5">
            <div className="border border-border">
                <Link
                    to="/customer-center"
                    className="flex flex-col items-center justify-center gap-1 w-full aspect-square"
                >
                    <HeadsetIcon tailwind="w-12 h-12 fill-accent" />
                    <p className="text-sm">고객센터</p>
                </Link>
            </div>
            {shoppingHistory.length > 0 && (
                <div className="border border-border">
                    {shoppingHistory.length > 3 && (
                        <button
                            onClick={() => setIsHistoryModalOpen(true)}
                            className="group/shopping-history flex items-center justify-center w-full pt-2"
                        >
                            <ArrowLeftIcon tailwind="w-6 h-6 -ml-3 transition-colors group-hover/shopping-history:fill-accent" />
                            <p className="text-sm transition-colors group-hover/shopping-history:text-accent">히스토리</p>
                        </button>
                    )}
                    <ul className="p-3 space-y-2">
                        {shoppingHistory.slice(0, 3).map((item, index) => (
                            <li
                                key={index}
                                className="group/history-item w-full aspect-square relative"
                            >
                                <Link
                                    to={`/product/${item.id}`}
                                    className="relative block w-full h-full border border-border"
                                >
                                    <img
                                        src={item.thumbnail}
                                        alt={item.title}
                                        className="h-full"
                                    />
                                    <div className="absolute top-0 right-full flex flex-col items-start justify-center w-[150px] h-full px-4 bg-white border border-border opacity-0 transition-opacity pointer-events-none group-hover/history-item:opacity-100 group-hover/history-item:pointer-events-auto">
                                        <p className="poj2-line-clamp-2 text-sm leading-sm">{item.title}</p>
                                        <p className="text-sm font-bold">{item.price?.toLocaleString()}원</p>
                                    </div>
                                </Link>
                                <button
                                    type="button"
                                    className="absolute top-0 right-0 bg-white opacity-0 transition-colors transition-opacity group-hover/history-item:opacity-50 hover:opacity-100 hover:fill-accent"
                                    onClick={() => removeHistory(index)}
                                >
                                    <CloseIcon tailwind="w-5 h-5 transition-colors" />
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            <div className="border border-accent">
                <button
                    type="button"
                    className="group/scroll-to-top flex items-center justify-center w-full transition-colors hover:bg-accent"
                    onClick={handleScrollTop}
                >
                    <p className="text-accent transition-colors group-hover/scroll-to-top:text-white">TOP</p>
                    <ArrowUpIcon tailwind="w-8 h-8 -mr-3 fill-accent transition-colors group-hover/scroll-to-top:fill-white" />
                </button>
            </div>

            <ShoppingHistoryModal
                shoppingHistory={shoppingHistory}
                removeHistory={removeHistory}
                clearAllShoppingHistory={clearAllShoppingHistory}
                isOpen={isHistoryModalOpen}
                onClose={() => setIsHistoryModalOpen(false)}
            />
        </div>
    );
}
