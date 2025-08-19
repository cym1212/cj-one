import React, { useEffect } from 'react';

// react-router Link 대체 (UMD 빌드용)
const Link = ({ to, children, ...props }) => (
    React.createElement('a', {
        href: to,
        onClick: (e) => {
            e.preventDefault();
            console.log('Navigate to:', to);
        },
        ...props
    }, children)
);

const DEFAULT_SERVICES = [
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

function RecommendServiceComponent(props = {}) {
    const hasExternalData = !!props.data;
    const hasExternalActions = !!props.actions;
    const mode = props.mode || 'production';
    
    const data = hasExternalData ? props.data : {
        title: props.title || 'CJ온스타일 추천 서비스',
        services: props.services || DEFAULT_SERVICES,
        className: props.className,
        style: props.style
    };
    
    const actions = hasExternalActions ? props.actions : {
        onServiceClick: (service) => {
            if (mode === 'editor') return;
            
            const url = service.linkUrl;
            if (url && url !== '#') {
                if (props.utils && props.utils.navigate) {
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
    
    return React.createElement('section', {
        className: `poj2-global-wrapper pb-15 lg:pb-30 ${data.className || ''}`,
        style: data.style
    }, [
        React.createElement('div', {
            key: 'title',
            className: 'text-center mb-8 lg:mb-12'
        }, [
            React.createElement('h2', {
                key: 'h2',
                className: 'text-xl lg:text-2xl font-bold'
            }, data.title)
        ]),
        React.createElement('ul', {
            key: 'services',
            className: 'poj2-recommend-service overflow-x-auto flex items-center min-[907px]:justify-center gap-4 lg:gap-8'
        }, data.services.map((service) => 
            React.createElement('li', {
                key: service.id
            }, [
                React.createElement(Link, {
                    key: 'link',
                    to: service.linkUrl,
                    className: 'block',
                    onClick: () => {
                        if (hasExternalActions) {
                            actions.onServiceClick(service);
                        }
                    }
                }, [
                    React.createElement('div', {
                        key: 'content',
                        className: 'w-18 lg:w-24 text-center space-y-1 lg:space-y-2'
                    }, [
                        React.createElement('img', {
                            key: 'img',
                            src: service.iconUrl,
                            alt: service.alt
                        }),
                        React.createElement('p', {
                            key: 'text',
                            className: 'text-xs lg:text-base'
                        }, service.title)
                    ])
                ])
            ])
        ))
    ]);
}

// UMD 빌드를 위한 래퍼 컴포넌트
const RecommendService = (props) => {
    const isWebbuilderEnv = props.data && props.actions && props.utils;
    
    if (isWebbuilderEnv) {
        return React.createElement(RecommendServiceComponent, props);
    } else {
        const componentProps = {
            services: props.services,
            title: props.title,
            className: props.className,
            style: props.style,
            mode: props.mode || 'production'
        };
        return React.createElement(RecommendServiceComponent, componentProps);
    }
};

export default RecommendService;