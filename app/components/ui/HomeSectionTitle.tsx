interface HomeSectionTitleProps {
    title: string;
    description?: string;
}

export function HomeSectionTitle({ title, description }: HomeSectionTitleProps) {
    return (
        <div className="poj2-home-section-title space-y-1 mb-5 lg:mb-6">
            <h2 className="text-xl lg:text-2xl font-bold">{title}</h2>
            {description && <p className="text-xs lg:text-base text-description">{description}</p>}
        </div>
    );
}
