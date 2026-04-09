import React, { useState, useRef, useCallback, useEffect } from 'react';
import { ChevronsLeftRight } from 'lucide-react';

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
    const [sliderPosition, setSliderPosition] = useState(50);
    const [isDragging, setIsDragging] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleMove = useCallback((clientX: number) => {
        if (!isDragging || !containerRef.current) return;
        
        const rect = containerRef.current.getBoundingClientRect();
        let newPosition = ((clientX - rect.left) / rect.width) * 100;
        newPosition = Math.max(0, Math.min(100, newPosition));
        
        setSliderPosition(newPosition);
    }, [isDragging]);

    const handleMouseDown = () => setIsDragging(true);
    const handleMouseUp = useCallback(() => setIsDragging(false), []);
    const handleMouseMove = (e: React.MouseEvent) => handleMove(e.clientX);
    
    const handleTouchStart = () => setIsDragging(true);
    const handleTouchEnd = () => setIsDragging(false);
    const handleTouchMove = (e: React.TouchEvent) => handleMove(e.touches[0].clientX);

    useEffect(() => {
        window.addEventListener('mouseup', handleMouseUp);
        return () => {
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [handleMouseUp]);

    return (
        <div 
            ref={containerRef}
            className="relative w-full aspect-video mx-auto select-none rounded-2xl overflow-hidden bg-[#f5f5f7] border border-[#d2d2d7]/50"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseUp}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >
            {/* After Image (Top Layer) - Modern Authority */}
            <div
                className="absolute top-0 left-0 h-full w-full overflow-hidden z-10"
                style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
            >
                <img
                    src={afterImage}
                    alt={altAfter}
                    className="h-full w-full object-cover"
                    draggable="false"
                />
                <div className="absolute top-6 left-6 px-4 py-1.5 rounded-full bg-[#007aff] text-white text-[0.75rem] font-bold shadow-lg">
                    MODERN AUTHORITY
                </div>
            </div>

            {/* Before Image (Bottom Layer) - Legacy Library */}
            <img
                src={beforeImage}
                alt={altBefore}
                className="block h-full w-full object-cover"
                draggable="false"
            />
            <div className="absolute top-6 right-6 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-[0.75rem] font-bold shadow-lg">
                LEGACY FIRM
            </div>

            {/* Slider Handle */}
            <div
                className="absolute top-0 bottom-0 w-1 bg-white/30 backdrop-blur-sm cursor-ew-resize flex items-center justify-center z-20 group"
                style={{ left: `calc(${sliderPosition}% - 2px)` }}
                onMouseDown={handleMouseDown}
                onTouchStart={handleTouchStart}
            >
                <div className={`bg-white rounded-full h-12 w-12 flex items-center justify-center shadow-2xl transition-all duration-300 ease-in-out border-4 border-white/50 backdrop-blur-xl ${isDragging ? 'scale-110' : 'group-hover:scale-105'}`}>
                    <ChevronsLeftRight size={24} className="text-[#0e0e10]" />
                </div>
            </div>
            
            {/* Tooltip Overlay */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-black/50 backdrop-blur-xl border border-white/10 text-white/70 text-[0.75rem] font-medium pointer-events-none transition-opacity duration-300 group-hover:opacity-100 opacity-0 md:opacity-100">
                Drag to compare transformation
            </div>
        </div>
    );
};
