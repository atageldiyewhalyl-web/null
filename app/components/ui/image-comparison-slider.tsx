import React, { useState } from 'react';

interface ImageComparisonProps {
  beforeImage: string;
  afterImage: string;
  altBefore?: string;
  altAfter?: string;
}

export const ImageComparison: React.FC<ImageComparisonProps> = ({ 
  beforeImage, 
  afterImage, 
  altBefore = 'Before', 
  altAfter = 'After' 
}) => {
    const [activeImage, setActiveImage] = useState<'before' | 'after'>('after');
    const isBefore = activeImage === 'before';

    return (
        <div className="w-full">
            <div className="relative mx-auto aspect-video w-full select-none overflow-hidden rounded-[1.35rem] border border-black/[0.08] bg-[#f5f5f7] shadow-[0_24px_80px_rgba(15,23,42,0.055)]">
                <img
                    src={beforeImage}
                    alt={altBefore}
                    className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${isBefore ? 'opacity-100' : 'opacity-0'}`}
                    draggable="false"
                />
                <img
                    src={afterImage}
                    alt={altAfter}
                    className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${isBefore ? 'opacity-0' : 'opacity-100'}`}
                    draggable="false"
                />
            </div>
            
            <div className="mx-auto mt-5 flex w-fit items-center rounded-full border border-black/10 bg-[#f5f5f7] p-1">
                <button
                    type="button"
                    onClick={() => setActiveImage('before')}
                    className={`rounded-full px-5 py-2 text-[0.8125rem] font-bold transition ${isBefore ? 'bg-white text-[#007aff] shadow-sm' : 'text-[#86868b] hover:text-[#0e0e10]'}`}
                >
                    {altBefore}
                </button>
                <button
                    type="button"
                    onClick={() => setActiveImage('after')}
                    className={`rounded-full px-5 py-2 text-[0.8125rem] font-bold transition ${!isBefore ? 'bg-white text-[#007aff] shadow-sm' : 'text-[#86868b] hover:text-[#0e0e10]'}`}
                >
                    {altAfter}
                </button>
            </div>
        </div>
    );
};
