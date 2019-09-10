import React, { useState, useEffect, Fragment } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { TextField } from '@material-ui/core';

const MainSection = styled.section `
    background-color:#141414;
    padding:1rem 2.5rem;
    min-height:100vh;
`

const GenresContainer = styled.section `
`


const StyledTextField = styled(TextField) `
    label {
        color:white;
        font-size:1.25rem;
        font-weight:bold;
    }
    div {
        color:white;
        height:100%;
        option {
            color:#2b2c2e;
            background-color:black;
        }
    }
    svg { color: white}
    p { color: white;}
`
const MoviesContainer = styled.section `
    margin:3rem 0;
    display:grid;
    grid-template-columns: repeat( auto-fill, 225px );
    grid-column-gap:5px;
    grid-row-gap:1rem;
`

const MovieThumbnail = props => {

    const [hover, setHover] = useState();

    const Thumbnail = styled.div `
        background-image:url(${props => props.cover});
        height:338px;
        width:225px;
        background-size:cover;
        :hover { cursor:pointer }
    `

    const Mask = styled.div `
        height:100%;
        width:100%;
        background-color: rgba(0, 0, 0, 0.75);
        padding:1rem;
        box-sizing:border-box;
        display:flex;
        flex-direction:column;
        align-items:center;
    `

    const Title = styled.h3 `
        font-size:1.5rem;
        color:white;
        margin:0;
    `

    const Year = styled.p `
        color:white;
        margin:0;
        font-weight:bold;
    `
    const handleHover = () => {
        setHover(p => !p)
    }
    return (
        <Thumbnail 
            cover={props.movie.images.poster}
            onMouseEnter={handleHover}
            onMouseLeave={handleHover}
        >
            {hover && 
                <Mask>
                    <Title>{props.movie.title}</Title>
                    <Year>({props.movie.year})</Year>
                    <Year>({props.movie.runtime} minutes)</Year>
                </Mask>
            }
        </Thumbnail>
    )
}

export default function PageSearch() {

    const [currentPage, setCurrentPage] = useState(1);
    const [selectedOrder, setSelectedOrder] = useState(-1)
    const [selectedSorting, setSelectedSorting] = useState('year')
    const [selectedGenre, setSelectedGenre] = useState("orror");
    const genreList = [
        'action',
        'adventure',
        'animation',
        'comedy',
        'crime',
        'documentary',
        'drama',
        'family',
        'fantasy',
        'history',
        'holiday',
        'horror',
        'music',
        'mystery',
        'romance',
        'science-fiction',
        'short',
        'suspense',
        'thriller',
        'tv-movie',
        'war',
        'western'
    ]

    const sortingList = [
        'last added',
        'rating',
        'title',
        'trending',
        'year'
    ]

    const [moviesList, setMoviesList] = useState({ movies: [] });
    const [displayedMovies, setDisplayedMovies] = useState({ movies: []});
    useEffect(() => {
        const fetchMovies = async () => {
            const terms = {
                genre: selectedGenre,
                order: selectedOrder,
                sort: selectedSorting,
            }
            const res = await axios.post("/search/genre", terms);
            // let page = 1;
            // let completeResult = []
            // let res = await axios.get(`https://tv-v2.api-fetch.website/movies/${page}?sort=${selectedSorting}&order=${selectedOrder}&genre=${selectedGenre}`);
            // completeResult = res.data;
            // page++;
            // while (res.data.length !== 0) {
            //     console.log(page, selectedGenre, selectedOrder, selectedSorting);
            //     res = await axios.get(`https://tv-v2.api-fetch.website/movies/${page}?genre=${selectedGenre}&order=${selectedOrder}&sort=${selectedSorting}`);
            //     completeResult.push(...res.data);
            //     page++;
            // }
            // setMoviesList({movies: [...completeResult]});
            // setDisplayedMovies({movies: completeResult.slice(0, 20)});
        }
        fetchMovies();
    }, [selectedGenre, selectedSorting, selectedOrder])

    const switchGenre = name => event => {
        setSelectedGenre(event.target.value)
    }

    const switchSorting = name => event => {
        setSelectedSorting(event.target.value);
    }

    const switchOrdering = name => event => {
        setSelectedOrder(event.target.value);
    }

    return (
        <MainSection>
            <GenresContainer>
                <StyledTextField
                    select
                    label="Genre"
                    value={selectedGenre}
                    onChange={switchGenre()}
                    SelectProps={{
                      native: true,
                    }}
                    margin="normal"
                    variant="outlined"
                    >
                    {genreList.map(genre => (
                        <option key={genre} value={genre}>
                            {genre}
                        </option>
                    ))}
                </StyledTextField>
                <StyledTextField
                    select
                    label="Sort by"
                    value={selectedSorting}
                    onChange={switchSorting()}
                    SelectProps={{
                      native: true,
                    }}
                    margin="normal"
                    variant="outlined"
                    >
                    {sortingList.map(sorting => (
                        <option key={sorting} value={sorting}>
                            {sorting}
                        </option>
                    ))}
                </StyledTextField>
                <StyledTextField
                    select
                    label="Order"
                    value={selectedOrder}
                    onChange={switchOrdering()}
                    SelectProps={{
                      native: true,
                    }}
                    margin="normal"
                    variant="outlined"
                    >
                    <option value="-1">Desc</option>
                    <option value="1">Asc</option>
                </StyledTextField>
            </GenresContainer>
            <MoviesContainer>
                {displayedMovies.movies.map(movie => <MovieThumbnail movie={movie}/>)}
            </MoviesContainer>
        </MainSection>
    )
}