import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

gsap.registerPlugin(useGSAP);

interface RollingTextProps {
    children: React.ReactElement[];
    duration?: number; // 대기 시간 설정 가능
    transitionDuration?: number; // 전환 시간 설정 가능
}

/**
 * 롤링 텍스트 컴포넌트
 * @param children - 롤링할 텍스트 아이템들 (data-rolling-item Attribute 및 position: absolute 필수)
 * @returns
 */
export function RollingText({ children, duration, transitionDuration }: RollingTextProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const currentNoticeIndex = useRef(0);

    useGSAP(() => {
        const container = containerRef.current;
        if (!container || children.length === 0) return;

        const items = container.querySelectorAll('[data-rolling-item]');
        if (items.length === 0) return;

        // 초기 설정: 모든 애니메이션 상태 초기화 후 첫 번째 아이템만 보이게 설정
        gsap.killTweensOf(items); // 기존 트윈 제거
        gsap.set(items, { y: '100%', opacity: 0, clearProps: 'transform' });
        gsap.set(items[0], { y: 0, opacity: 1 });

        // 롤링 애니메이션 생성
        const tl = gsap.timeline({ repeat: -1, delay: 2 });

        children.forEach((_, index) => {
            const currentIndex = index;
            const nextIndex = (index + 1) % children.length;

            tl.to(items[currentIndex], {
                y: '-100%',
                opacity: 0,
                duration: transitionDuration || 0.5,
                ease: 'power2.inOut',
            })
                .set(
                    items[nextIndex],
                    {
                        y: '100%',
                        opacity: 1,
                    },
                    '<=0.25'
                )
                .to(
                    items[nextIndex],
                    {
                        y: 0,
                        duration: transitionDuration || 0.5,
                        ease: 'power2.inOut',
                    },
                    '<='
                )
                .call(() => {
                    currentNoticeIndex.current = nextIndex;
                })
                .to({}, { duration: duration || 3 }); // 3초 대기
        });
    }, [children.length]);

    // children는 있지만 data-rolling-item을 가진 items가 없을 경우 첫 번째 요소만 표시
    if (children.length > 0) {
        const container = containerRef.current;
        if (container) {
            const items = container.querySelectorAll('[data-rolling-item]');
            if (items.length === 0) {
                return (
                    <div
                        ref={containerRef}
                        className="flex-1 relative h-5 overflow-hidden"
                    >
                        {children[0]}
                    </div>
                );
            }
        }
    }

    return (
        <div
            ref={containerRef}
            className="flex-1 relative h-5 overflow-hidden"
        >
            {children}
        </div>
    );
}
