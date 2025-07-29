/**
 * Props interface for SongList component
 * Defines the structure of song data that will be displayed
 */
interface SongListProps {
    songData: {
        song_name: string;      // Title of the song
        created_at: string;     // ISO timestamp when song was added
        song_artists: string;   // Artist name(s)
        album_cover: string;    // URL to album cover image
    }[] | undefined;            // Array of songs, can be undefined while loading
}

/**
 * SongList Component
 * Displays a responsive grid of songs with album covers, names, dates, and artists
 * Each song is rendered as a compact card with image and metadata
 * 
 * PERFORMANCE CONSIDERATIONS:
 * - Uses conditional rendering (songData &&) to prevent errors during loading
 * - No key prop in map() - should add unique keys for React optimization
 * - Images loaded directly from URLs - could benefit from lazy loading
 * 
 * UI DESIGN:
 * - Fixed width cards (w-20 = 80px) for consistent grid layout
 * - Flexbox with wrapping for responsive behavior
 * - Compact typography with reduced opacity for secondary info
 * - Tight letter spacing (tracking-tighter) for space efficiency
 * 
 * DATA FLOW:
 * - Receives songData from parent component (likely fetched from API)
 * - Handles undefined state gracefully during initial load
 * - Formats timestamps to user-friendly dates
 */
import React, { useState } from 'react';

const SongList = ({ songData }: SongListProps) => {
    /**
     * Utility function to generate random integers (currently unused)
     * Originally intended for dynamic card widths but commented out for consistency
     * 
     * POTENTIAL USE CASE:
     * Could create Pinterest-style masonry layout with varying card sizes
     * Example: className={`w-${getRandomInt(20, 32)}`} for widths 80px-128px
     * 
     * @param min - Minimum value (inclusive)
     * @param max - Maximum value (exclusive) 
     * @returns Random integer between min and max
     * 
     * NOTE: Currently unused - kept for potential future feature
     */
    function getRandomInt(min:number, max:number) {
        return Math.floor(Math.random() * (max - min) + min);
    }

    /**
     * Converts ISO timestamp to user-friendly date format
     * 
     * FUNCTION PURPOSE:
     * - Transforms database timestamps into readable dates for users
     * - Uses browser's built-in Intl.DateTimeFormat via toLocaleDateString
     * - Handles timezone conversion automatically based on user's system
     * 
     * INPUT FORMAT: ISO 8601 string (e.g., "2024-01-15T10:30:00.000Z")
     * OUTPUT FORMAT: MM/DD/YYYY (e.g., "1/15/2024")
     * 
     * CONSIDERATIONS:
     * - Function name mentions PST but actually uses system timezone
     * - Could be enhanced to handle specific timezone conversion
     * - Error handling could be added for invalid date strings
     * 
     * @param timeStamp - ISO timestamp string from database
     * @returns Formatted date string in MM/DD/YYYY format
     */
    function convertDateToPST(timeStamp:string) {
        const date = new Date(timeStamp)  // Parse ISO string to Date object

        // Format date to US locale with numeric day, month, and year
        // This automatically handles timezone conversion to user's local time
        const formattedDate = date.toLocaleDateString('en-US', { 
            day: 'numeric',    // No leading zeros (1, 2, 3...)
            month:'numeric',   // No leading zeros (1, 2, 3...)
            year:'numeric',    // Full year (2024)
        });

        return formattedDate
    }

    // Use song_name as unique identifier for favoriting (can be improved with unique IDs if available)
    const [favoriteSongs, setFavoriteSongs] = useState<string[]>([]);

    const toggleFavorite = (songName: string) => {
        setFavoriteSongs((prev) =>
            prev.includes(songName)
                ? prev.filter((name) => name !== songName)
                : [...prev, songName]
        );
    };

    return (
        <div className="overflow-hidden gap-16">
            {/* 
                Flexbox container for song cards with wrapping
                - flex: Creates horizontal layout
                - flex-wrap: Allows cards to wrap to new lines on smaller screens
                - gap-4: 16px spacing between cards for visual breathing room
            */}
            <div className="flex flex-wrap gap-4">
                {/* 
                    Conditional rendering with null-safety check
                    - songData &&: Prevents rendering if data is undefined/null during loading
                    - .map(): Transforms each song object into a JSX element
                    - currentSongs: Each individual song object from the array
                    
                    PERFORMANCE NOTE: Missing 'key' prop - React will use array index
                    Better practice: key={currentSongs.id} or similar unique identifier
                */}
                {songData && songData.map((currentSongs) => {
    const isFavorited = favoriteSongs.includes(currentSongs.song_name);
                    return (
                        // TODO: Dynamic width based on random size (currently commented out)
                        // Original idea: <div className={`w-${getRandomInt(1, 6)}`}>
                        // Would create varying widths from w-1 (4px) to w-5 (20px)
                        // Current implementation uses fixed width for consistency
                        
                        /* 
                            Fixed width song card container
                            - w-20: 80px fixed width for consistent grid alignment
                            - No padding/margin - relies on parent gap for spacing
                            - Block display allows stacking of child elements
                        */
                        <div className='w-20 relative'>
                            {/* 
                                Album cover image - the visual anchor of each card
                                - src: Direct URL to album artwork from music service
                                - w-full: Takes full width of container (80px)
                                - h-auto: Maintains aspect ratio, prevents distortion
                                - No alt text: Should add for accessibility
                                - No loading optimization: Could add lazy loading
                            */}
                            <img src={currentSongs.album_cover} className="w-full h-auto" alt={currentSongs.song_name} />

    {/* Favorite (heart) icon */}
    <button
        className="absolute top-1 right-1 z-10 p-1 bg-white bg-opacity-80 rounded-full hover:bg-opacity-100 transition"
        onClick={() => toggleFavorite(currentSongs.song_name)}
        aria-label={isFavorited ? "Unfavorite song" : "Favorite song"}
        type="button"
    >
        {isFavorited ? (
            <svg xmlns="http://www.w3.org/2000/svg" fill="#e0245e" viewBox="0 0 24 24" width="20" height="20">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
        ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="#e0245e" strokeWidth="2" viewBox="0 0 24 24" width="20" height="20">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
        )}
    </button>
                            
                            {/* 
                                Song title - primary information
                                - text-xs: 12px font size for compact display
                                - tracking-tighter: Reduced letter spacing (-0.05em)
                                - No truncation: Long titles may overflow
                            */}
                            <div className="text-xs tracking-tighter">{currentSongs.song_name}</div>
                            
                            {/* 
                                Date added - secondary metadata
                                - text-xs: Same small size as title
                                - opacity-35: 35% opacity for visual hierarchy
                                - tracking-tighter: Consistent spacing with title
                                - Leading space: Extra space before date text
                            */}
                            <div className="text-xs opacity-35 tracking-tighter"> {convertDateToPST(currentSongs.created_at)}</div>
                            
                            {/* 
                                Artist name - secondary metadata
                                - Same styling as date for consistency
                                - opacity-35: Muted appearance, less visual weight
                                - Could be enhanced with artist links or hover effects
                            */}
                            <div className="text-xs opacity-35 tracking-tighter">{currentSongs.song_artists}</div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default SongList
