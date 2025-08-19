import { useEffect } from 'react';

// react-router Link 대체 (UMD 빌드용)
const Link = ({ to, children, ...props }: any) => (
    <a href={to} onClick={(e) => { e.preventDefault(); console.log('Navigate to:', to); }} {...props}>
        {children}
    </a>
);

interface RecommendServiceItem {
    id: string;
    title: string;
    iconUrl: string;
    linkUrl: string;
    alt: string;
}

const DEFAULT_SERVICES: RecommendServiceItem[] = [
    {
        id: '1',
        title: '멤버십 혜택',
        iconUrl: 'https://withcookie.b-cdn.net/c/default/0.37495945473729053.png',
        linkUrl: 'https://naver.com',
        alt: '멤버십혜택'
    },
    {
        id: '2',
        title: '출석체크',
        iconUrl: 'https://withcookie.b-cdn.net/c/default/0.37495945473729053.png',
        linkUrl: 'https://naver.com',
        alt: '출석체크'
    },
    {
        id: '3',
        title: '혜택',
        iconUrl: 'https://withcookie.b-cdn.net/c/default/0.37495945473729053.png',
        linkUrl: 'https://naver.com',
        alt: '혜택'
    },
    {
        id: '4',
        title: '체험단',
        iconUrl: 'https://withcookie.b-cdn.net/c/default/0.37495945473729053.png',
        linkUrl: 'https://naver.com',
        alt: '체험단'
    },
    {
        id: '5',
        title: '백화점',
        iconUrl: 'https://withcookie.b-cdn.net/c/default/0.37495945473729053.png',
        linkUrl: 'https://naver.com',
        alt: '백화점'
    }
];

interface RecommendServiceData {
    title?: string;
    services: RecommendServiceItem[];
    className?: string;
    style?: React.CSSProperties;
}

interface RecommendServiceActions {
    onServiceClick: (service: RecommendServiceItem) => void;
}

export interface ComponentSkinProps {
    data: RecommendServiceData;
    actions: RecommendServiceActions;
    options?: Record<string, any>;
    mode?: 'editor' | 'preview' | 'production';
    utils?: {
        t: (key: string) => string;
        navigate: (path: string) => void;
        formatCurrency: (amount: number) => string;
        formatDate: (date: Date) => string;
        getAssetUrl: (path: string) => string;
        cx: (...classes: string[]) => string;
    };
    app?: {
        user?: any;
        company?: any;
        currentLanguage?: string;
        theme?: any;
    };
    editor?: {
        isSelected: boolean;
        onSelect: () => void;
        onEdit: () => void;
        onDelete: () => void;
    };
}

export interface RecommendServiceProps extends Partial<ComponentSkinProps> {
    services?: RecommendServiceItem[];
    title?: string;
    className?: string;
    style?: React.CSSProperties;
}

function RecommendServiceComponent(props: RecommendServiceProps = {}) {
    const hasExternalData = !!props.data;
    const hasExternalActions = !!props.actions;
    const mode = props.mode || 'production';
    
    const data: RecommendServiceData = hasExternalData ? {
        ...props.data!,
        services: props.data!.services || DEFAULT_SERVICES
    } : {
        title: props.title || 'CJ온스타일 추천 서비스',
        services: props.services || DEFAULT_SERVICES,
        className: props.className,
        style: props.style
    };
    
    const actions: RecommendServiceActions = hasExternalActions ? props.actions! : {
        onServiceClick: (service: RecommendServiceItem) => {
            if (mode === 'editor') return;
            
            const url = service.linkUrl;
            if (url && url !== '#') {
                if (props.utils?.navigate) {
                    props.utils.navigate(url);
                } else {
                    console.log('Navigate to:', url);
                }
            }
        }
    };
    
    // Tailwind CDN 자동 로드
    useEffect(() => {
        if (typeof window !== 'undefined' && !document.querySelector('script[src*="cdn.tailwindcss.com"]')) {
            const script = document.createElement('script');
            script.src = 'https://cdn.tailwindcss.com';
            script.async = true;
            document.head.appendChild(script);
        }
    }, []);
    
    return (
        <section className={`poj2-global-wrapper pb-15 lg:pb-30 ${data.className || ''}`} style={data.style}>
            <div className="text-center mb-8 lg:mb-12">
                <h2 className="text-xl lg:text-2xl font-bold">{data.title}</h2>
            </div>
            <ul className="poj2-recommend-service overflow-x-auto flex items-center min-[907px]:justify-center gap-4 lg:gap-8">
                {(data.services || DEFAULT_SERVICES).map((service) => (
                    <li key={service.id}>
                        <Link
                            to={service.linkUrl}
                            className="block"
                            onClick={() => {
                                if (hasExternalActions) {
                                    actions.onServiceClick(service);
                                }
                            }}
                        >
                            <div className="w-18 lg:w-24 text-center space-y-1 lg:space-y-2">
                                <img
                                    src={service.iconUrl}
                                    alt={service.alt}
                                />
                                <p className="text-xs lg:text-base">{service.title}</p>
                            </div>
                        </Link>
                    </li>
                ))}
            </ul>
        </section>
    );
}

// UMD 빌드를 위한 래퍼 컴포넌트
const RecommendService = (props: any) => {
    const isWebbuilderEnv = props.data && props.actions && props.utils;
    
    if (isWebbuilderEnv) {
        return <RecommendServiceComponent {...props} />;
    } else {
        const componentProps: RecommendServiceProps = {
            services: props.services,
            title: props.title,
            className: props.className,
            style: props.style,
            mode: props.mode || 'production'
        };
        return <RecommendServiceComponent {...componentProps} />;
    }
};

export default RecommendService;