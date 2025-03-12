import SongList from "../Components/SongList";
import FilterButton from "../Components/SongFilterButton";

const SongPage = () => {

    return (
        <div className="flex flex-col gap-12">
            <FilterButton></FilterButton>
            <SongList></SongList>
        </div>
    )
}

export default SongPage