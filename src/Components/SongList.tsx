interface SongListProps {
    songData: {
        song_name: string;
        created_at: string;
        song_artists: string;
        album_cover: string;
    }[] | undefined;
}

const SongList = ({ songData }: SongListProps) => {
    function getRandomInt(min:number, max:number) {
        return Math.floor(Math.random() * (max - min) + min);
      }

    function convertDateToPST(timeStamp:string) {
        const date = new Date(timeStamp)

        const formattedDate = date.toLocaleDateString('en-US', { 
            day: 'numeric',
            month:'numeric',
            year:'numeric',
          });

        return formattedDate
    }

    return (
        <div className="overflow-hidden gap-16">
            <div className="flex flex-wrap gap-4">{songData && songData.map((currentSongs) => {
                return (
                    // <div className= {`w-${getRandomInt(1, 6)}`}>
                    <div className= 'w-20'>
                        <img src={currentSongs.album_cover} className="w-full h-auto"></img>
                        <div className="text-xs tracking-tighter">{currentSongs.song_name}</div>
                        <div className="text-xs opacity-35 tracking-tighter"> {convertDateToPST(currentSongs.created_at)}</div>
                        <div className="text-xs opacity-35 tracking-tighter">{currentSongs.song_artists}</div>
                    </div>
                )
            })}
            </div>
        </div>
    )
}

export default SongList
