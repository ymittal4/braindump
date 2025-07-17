
interface FilterButtonProps {
    isAlphabetical: boolean;
    toggleSorting: () => void;
}

const FilterButton = ({ isAlphabetical, toggleSorting }: FilterButtonProps) => {
    return (
        <button 
            className="border py-4 flex justify-center hover:bg-gray-500 transition-all duration-300"
            onClick={toggleSorting}
        >
            {isAlphabetical ? 'Sort by Date Added' : 'Sort Alphabetically'}
        </button>
    )
}

export default FilterButton
