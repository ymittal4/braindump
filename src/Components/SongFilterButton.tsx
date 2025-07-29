/**
 * Props interface for FilterButton component
 * Defines the sorting state and toggle functionality
 */
interface FilterButtonProps {
    isAlphabetical: boolean;    // Current sorting mode: true = alphabetical, false = by date
    toggleSorting: () => void;  // Function to switch between sorting modes
}

/**
 * FilterButton Component
 * A retro-styled button that toggles between alphabetical and date-based sorting
 * Features vintage 70s/80s design with orange gradients and 3D effects
 * 
 * STYLING BREAKDOWN:
 * - BASE: Orange gradient background with chunky 4px border
 * - TYPOGRAPHY: Bold, uppercase white text with wide letter spacing
 * - 3D EFFECTS: Shadows and smooth transitions for depth
 * - HOVER: Button lifts up (-translate-y-1) with lighter colors
 * - ACTIVE: Button presses down (translate-y-0) when clicked
 * - RETRO: Sharp corners (rounded-none) for blocky vintage look
 * - SHINE: Pseudo-element overlay creates subtle highlight effect
 */
const FilterButton = ({ isAlphabetical, toggleSorting }: FilterButtonProps) => {
    return (
        <button 
            className="
                bg-gradient-to-b from-orange-400 to-orange-600 
                border-4 border-orange-800 
                px-6 py-4 
                font-bold text-white text-lg 
                uppercase tracking-wider 
                shadow-lg 
                transform transition-all duration-200 
                hover:from-orange-300 hover:to-orange-500 
                hover:border-orange-700 
                hover:shadow-xl hover:-translate-y-1 
                active:translate-y-0 active:shadow-md 
                rounded-none 
                relative 
                before:content-[''] before:absolute before:inset-0 
                before:bg-gradient-to-b before:from-white/20 before:to-transparent 
                before:pointer-events-none
            "
            onClick={toggleSorting}  // Toggle between sorting modes when clicked
        >
            {/* Text content with proper z-index to appear above shine effect */}
            <span className="relative z-10">
                {/* Conditional text and icons based on current sorting mode */}
                {isAlphabetical ? '📅 Sort by Date Added' : '🔤 Sort Alphabetically'}
            </span>
        </button>
    )
}

export default FilterButton
