import { Link } from 'react-router';

import { ArrowRightIcon } from '@/components/icons';

interface CreditCardBenefitProps {
    logo: string;
    name: string;
    discount: string;
    hasDiscountRange: boolean;
    href: string;
    bgColor: string;
}

export function CreditCardBenefit({ logo, name, discount, hasDiscountRange, href, bgColor }: CreditCardBenefitProps) {
    return (
        <div className="poj2-credit-card-benefit">
            <Link
                to={href}
                className="flex flex-col justify-between w-[130px] h-[170px] sm:h-[180px] rounded-lg p-4"
                style={{ backgroundColor: bgColor }}
            >
                <div>
                    <img
                        src={logo}
                        alt={name}
                        className="h-5 sm:h-6 mb-1"
                    />
                    <p className="font-bold text-white max-sm:text-sm">{name}</p>
                </div>
                <div>
                    <p className="flex items-end font-bold text-white">
                        <span className="flex items-center">
                            {hasDiscountRange && <span className="vertical-center">~</span>}
                            <strong className="text-3xl sm:text-4xl">{discount}</strong>
                        </span>
                        <span>%</span>
                    </p>
                    <div className="flex items-center text-white">
                        <p className="text-xs sm:text-sm font-bold">즉시할인</p>
                        <ArrowRightIcon tailwind="w-5 h-5 sm:w-6 sm:h-6 fill-white" />
                    </div>
                </div>
            </Link>
        </div>
    );
}
