import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';

const MainSection = styled.section `
    height:100vh;
    background-color:black;
`

const GenreContainer = styled.section `

`

const GenreButton = styled.button `
    background: none;
    border: none;
    color: white;
    font-size: 1.5rem;
    font-weight:bold;
    :hover { cursor:pointer; }
`

export default function PageSearch() {

    const [currentPage, setCurrentPage] = useState(1);
    const [selectedGenre, setSelectedGenre] = useState("Horror");
    const movieGenres = [
        'Action',
        "Adventure",
        "Animation",
        "Comedy",
        "Crime",
        "Documentary",
        "Drama",
        "Family",
        "Fantasy",
        "Film Noir", // film-noir for Popcorn Time API
        'History',
        'Horror',
        'Music',
        "Mystery",
        'Romance',
        'Sci-Fi', // science-fiction for Popcorn Time API
        "Short Film", // short for Popcorn Time API
        "Sport", // sports for Popcorn Time API
        'Thriller',
        "War",
        "Western"
    ]

    const [moviesList, setMoviesList] = useState({ movies: [] });
    useEffect(() => {
        const fetchMovies = async () => {
            const terms = {
                genre: selectedGenre
            }
            const moviesData = await axios.get("/search/genre", terms);
        }
        fetchMovies();
    }, [selectedGenre])

    return (
        <MainSection>
            <GenreContainer>
                {movieGenres.map(genre => <GenreButton onClick={() => setSelectedGenre(genre)}>{genre}</GenreButton>)}
            </GenreContainer>
        </MainSection>
    )
}