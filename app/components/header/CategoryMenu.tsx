import { useState } from 'react';
import { Link } from 'react-router';

import { MenuIcon, ArrowRightIcon } from '@/components/icons';

import { CATEGORY_ITEMS } from '@/constants/Navigation';

import type { CategoryType, SimplifiedCategory, ThirdCategory, RecommendedBrand } from '@/constants/Navigation';

type SubCategories = SimplifiedCategory['subcategories'];

export function CategoryMenu() {
    const [isNavVisible, setIsNavVisible] = useState(false);
    const [categoryType, setCategoryType] = useState<CategoryType>('normal');
    const [subCategories, setSubCategories] = useState<SubCategories>([]);
    const [thirdCategory, setThirdCategory] = useState<ThirdCategory[]>([]);
    const [recommendedBrands, setRecommendedBrands] = useState<RecommendedBrand[]>([]);
    const [activeCategory, setActiveCategory] = useState<string>('');
    const [activeSubCategory, setActiveSubCategory] = useState<string>('');

    const handleCategoryHover = (type: CategoryType, subcategories: SubCategories, categoryName: string, recommendedBrands?: RecommendedBrand[]) => {
        setCategoryType(type);
        setSubCategories(subcategories);
        setActiveCategory(categoryName);
        setRecommendedBrands(recommendedBrands || []);
        setActiveSubCategory('');
    };

    const handleSubCategoryHover = (thirdCategory: ThirdCategory[], subCategoryName: string) => {
        setThirdCategory(thirdCategory);
        setActiveSubCategory(subCategoryName);
    };

    const handleDepthTwoEnter = () => {
        setThirdCategory([]);
        setActiveSubCategory('');
    };

    const handleThirdCategoryMouseLeave = (e: React.MouseEvent) => {
        const relatedTarget = e.relatedTarget as Element;
        if (relatedTarget && relatedTarget.closest('.poj2-recommended-brands')) {
            return;
        }
        setThirdCategory([]);
        setActiveSubCategory('');
    };

    const handleCategoryButtonEnter = () => {
        setIsNavVisible(true);
        resetState();
    };

    const handleMenuAreaLeave = () => {
        setIsNavVisible(false);
        resetState();
    };

    const resetState = () => {
        setCategoryType('normal');
        setSubCategories([]);
        setThirdCategory([]);
        setRecommendedBrands([]);
        setActiveCategory('');
        setActiveSubCategory('');
    };

    return (
        <div
            className="poj2-category-menu z-9 relative h-full"
            onMouseLeave={handleMenuAreaLeave}
        >
            <div
                className={`group/category-menu h-full w-[180px] flex items-center justify-center gap-2 cursor-pointer border-x border-border transition-colors hover:bg-accent ${isNavVisible ? 'bg-accent' : 'bg-white'}`}
                onMouseEnter={handleCategoryButtonEnter}
            >
                <MenuIcon tailwind={`w-[36px] h-[36px] transition-colors group-hover/category-menu:fill-white ${isNavVisible ? 'fill-white' : 'fill-black'}`} />
                <p className={`transition-colors group-hover/category-menu:text-white ${isNavVisible ? 'text-white' : 'text-black'}`}>카테고리</p>
            </div>
            {isNavVisible && (
                <nav className="absolute top-full left-0 flex w-auto border-1 border-accent bg-white shadow-lg">
                    <CategoryMenuItems
                        onCategoryHover={handleCategoryHover}
                        activeCategory={activeCategory}
                    />

                    {categoryType === 'special' && subCategories.length > 0 && <SpecialShopItems subCategories={subCategories} />}

                    {categoryType === 'normal' && subCategories.length > 0 && (
                        <DepthTwoItems
                            subCategories={subCategories}
                            onCategoryHover={handleSubCategoryHover}
                            onMouseEnter={handleDepthTwoEnter}
                            activeSubCategory={activeSubCategory}
                        />
                    )}

                    {categoryType === 'normal' && thirdCategory.length > 0 && (
                        <DepthThreeItems
                            thirdCategories={thirdCategory}
                            onMouseLeave={handleThirdCategoryMouseLeave}
                        />
                    )}

                    {categoryType === 'normal' && recommendedBrands.length > 0 && <RecommendedBrandItems brands={recommendedBrands} />}
                </nav>
            )}
        </div>
    );
}

// 카테고리 메뉴 아이템
function CategoryMenuItems({ onCategoryHover, activeCategory }: { onCategoryHover: (type: CategoryType, subcategories: SubCategories, categoryName: string, recommendedBrands?: RecommendedBrand[]) => void; activeCategory: string }) {
    return (
        <ul className="w-55">
            {CATEGORY_ITEMS.map(({ name, type, image, subcategories, recommendedBrands }) => {
                const isActive = activeCategory === name;
                return (
                    <li
                        key={name}
                        className="group/category-item relative px-4 py-2 cursor-pointer transition-colors"
                        onMouseEnter={() => onCategoryHover(type, subcategories, name, recommendedBrands)}
                    >
                        <div className="shrink-0 flex items-center gap-2">
                            <img
                                src={image}
                                alt={name}
                            />
                            <span className={`pt-0.5 transition-colors group-hover/category-item:text-accent group-hover/category-item:font-bold ${isActive ? 'text-accent font-bold' : ''}`}>{name}</span>
                        </div>
                        <ArrowRightIcon tailwind={`absolute top-1/2 right-1.5 -translate-y-1/2 w-[24px] h-[24px] fill-accent transition-opacity ${isActive ? 'opacity-100' : 'opacity-0 group-hover/category-item:opacity-100'}`} />
                    </li>
                );
            })}
        </ul>
    );
}

// 2차 카테고리 메뉴 아이템
function DepthTwoItems({ subCategories, onCategoryHover, onMouseEnter, activeSubCategory }: { subCategories: SubCategories; onCategoryHover: (thirdCategory: ThirdCategory[], subCategoryName: string) => void; onMouseEnter: () => void; activeSubCategory: string }) {
    return (
        <ul
            className="w-50 py-4 border-l border-border"
            onMouseEnter={onMouseEnter}
        >
            {subCategories.map((data) => {
                const { name, path } = data;
                const thirdCategory = 'thirdCategory' in data ? data.thirdCategory : undefined;
                const isActive = activeSubCategory === name;

                return (
                    <li
                        key={name}
                        className="group/sub-category-item relative px-4 py-1 cursor-pointer transition-colors"
                        onMouseEnter={() => thirdCategory && onCategoryHover(thirdCategory, name)}
                    >
                        <Link
                            to={path}
                            className={`text-sm transition-colors group-hover/sub-category-item:text-accent group-hover/sub-category-item:font-bold ${isActive ? 'text-accent font-bold' : ''}`}
                        >
                            {name}
                        </Link>
                        {thirdCategory && <ArrowRightIcon tailwind={`absolute top-1/2 right-1.5 -translate-y-1/2 w-[24px] h-[24px] fill-accent transition-opacity ${isActive ? 'opacity-100' : 'opacity-0 group-hover/sub-category-item:opacity-100'}`} />}
                    </li>
                );
            })}
        </ul>
    );
}

// 3차 카테고리 메뉴 아이템
function DepthThreeItems({ thirdCategories, onMouseLeave }: { thirdCategories: ThirdCategory[]; onMouseLeave: (e: React.MouseEvent) => void }) {
    return (
        <ul
            className="w-50 py-4 border-l border-border"
            onMouseLeave={onMouseLeave}
        >
            {thirdCategories.map((data) => {
                const { name, path } = data;

                return (
                    <li
                        key={name}
                        className="group/third-category-item px-4 py-1 cursor-pointer"
                    >
                        <Link
                            to={path}
                            className="text-sm transition-colors group-hover/third-category-item:text-accent group-hover/third-category-item:font-bold"
                        >
                            {name}
                        </Link>
                    </li>
                );
            })}
        </ul>
    );
}

// 추천 브랜드 아이템
function RecommendedBrandItems({ brands }: { brands: RecommendedBrand[] }) {
    // 페이지당 표시할 브랜드 수
    const PAGE_SIZE = 8;
    const [page, setPage] = useState(0);
    const pageCount = Math.ceil(brands.length / PAGE_SIZE);
    const start = page * PAGE_SIZE;
    const currentItems = brands.slice(start, start + PAGE_SIZE);

    const handlePrev = () => setPage((p) => (p > 0 ? p - 1 : p));
    const handleNext = () => setPage((p) => (p < pageCount - 1 ? p + 1 : p));

    return (
        <div className="poj2-recommended-brands w-[300px] px-6 py-5 border-l border-border">
            {/* 헤더 */}
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold ">추천 브랜드</h3>
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={handlePrev}
                        disabled={page === 0}
                        aria-label="이전"
                        className={`w-6 h-6 flex items-center justify-center rounded transition-colors ${page === 0 ? 'opacity-30 cursor-default' : 'hover:bg-accent/10'}`}
                    >
                        <ArrowRightIcon tailwind="w-5 h-5 fill-accent rotate-180" />
                    </button>
                    <span className="text-sm tabular-nums">
                        {page + 1}/{pageCount}
                    </span>
                    <button
                        type="button"
                        onClick={handleNext}
                        disabled={page === pageCount - 1}
                        aria-label="다음"
                        className={`w-6 h-6 flex items-center justify-center rounded transition-colors ${page === pageCount - 1 ? 'opacity-30 cursor-default' : 'hover:bg-accent/10'}`}
                    >
                        <ArrowRightIcon tailwind="w-5 h-5 fill-accent" />
                    </button>
                </div>
            </div>

            {/* 그리드 */}
            <ul className="grid grid-cols-2 gap-x-2 gap-y-5">
                {currentItems.map(({ name, path, image }) => (
                    <li
                        key={name}
                        className="group/brand-item"
                    >
                        <Link
                            to={path}
                            className="block"
                        >
                            <div className="w-full aspect-[4/2] mb-2 overflow-hidden">
                                <img
                                    src={image}
                                    alt={name}
                                    className="w-full h-full object-cover transition-transform group-hover/brand-item:scale-105"
                                />
                            </div>
                            <p className="text-sm text-center font-medium transition-colors group-hover/brand-item:text-accent">{name}</p>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}

function SpecialShopItems({ subCategories }: { subCategories: SubCategories }) {
    return (
        <ul className="w-[700px] grid grid-cols-4 gap-x-1 gap-y-5 p-8 border-l border-border">
            {subCategories.map((data, idx) => {
                const { name, path } = data;
                const image = 'image' in data ? data.image : undefined;
                return (
                    <li
                        key={name + idx}
                        className="group/special-item flex flex-col items-center justify-center"
                    >
                        <Link
                            to={path}
                            className="block"
                        >
                            {image && (
                                <div className="w-full aspect-[4/2] mb-2 overflow-hidden">
                                    <img
                                        src={image}
                                        alt={name}
                                        className="w-full h-full object-cover transition-transform group-hover/special-item:scale-105"
                                    />
                                </div>
                            )}
                            <p className="text-sm text-center font-medium transition-colors group-hover/special-item:text-accent">{name}</p>
                        </Link>
                    </li>
                );
            })}
        </ul>
    );
}
