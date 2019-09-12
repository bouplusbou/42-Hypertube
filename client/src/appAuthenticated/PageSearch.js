import React, { useState, useEffect, Fragment } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { TextField, Slider, Typography } from '@material-ui/core';

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
            cover={props.movie.medium_cover_image}
            onMouseEnter={handleHover}
            onMouseLeave={handleHover}
        >
            {hover && 
                <Mask>
                    <Title>{props.movie.title}</Title>
                    <Year>({props.movie.year})</Year>
                    <Year>({props.movie.runtime} minutes)</Year>
                    <Year>({props.movie.rating})</Year>
                </Mask>
            }
        </Thumbnail>
    )
}

export default function PageSearch() {

    const [searchTerms, setSearchTerms] = useState({
        genre: "",
        page: 1,
        order: "desc",
        sort: "year",
        ratings: [0, 10],
        years: [0, 2019],
        keywords: "",
        limit:50
    })
    const [searchResult, setSearchResult] = useState({movies: []});
    const genreList = [
        'Action',
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
        'Last added',
        'Rating',
        'Title',
        'Trending',
        'Year'
    ]

    useEffect(() => {
        const fetchMovies = async () => {
            const res = await axios.post("/search/genre", searchTerms);
            if (res.data.length !== 0) setSearchResult({ movies: [...res.data] })
        }
        fetchMovies();
    }, [searchTerms])

    const handleTermsChange = event => {
        setSearchTerms({
            ...searchTerms,
            [event.target.name]: event.target.value,
        })
    }

    const handleRatingsChanges = (event, newValue) => {
        setSearchTerms({
            ...searchTerms,
            ratings: newValue
        })
    }

    const handleYearsChanges = (event, newValue) => {
        setSearchTerms({
            ...searchTerms,
            years: newValue
        })
    }

    return (
        <MainSection>
            <GenresContainer>
                <StyledTextField
                    select
                    label="Genre"
                    name="genre"
                    value={searchTerms.genre}
                    onChange={handleTermsChange}
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
                    name="sort"
                    value={searchTerms.sort}
                    onChange={handleTermsChange}
                    SelectProps={{
                      native: true,
                    }}
                    margin="normal"
                    variant="outlined"
                    >
                    {sortingList.map(sorting => (
                        <option key={sorting} value={sorting.toLowerCase()}>
                            {sorting}
                        </option>
                    ))}
                </StyledTextField>
                <StyledTextField
                    select
                    label="Order"
                    name="order"
                    value={searchTerms.order}
                    onChange={handleTermsChange}
                    SelectProps={{
                      native: true,
                    }}
                    margin="normal"
                    variant="outlined"
                    >
                    <option value="desc">Desc</option>
                    <option value="asc">Asc</option>
                </StyledTextField>
                <Typography gutterBottom>
                    Ratings
                </Typography>
                <Slider
                    name="ratings"
                    value={searchTerms.ratings}
                    onChange={handleRatingsChanges}
                    min={0}
                    max={10}
                    valueLabelDisplay="on"
                />
                <Typography gutterBottom>
                    Years
                </Typography>
                <Slider
                    name="years"
                    value={searchTerms.years}
                    onChange={handleYearsChanges}
                    valueLabelDisplay="auto"
                    aria-labelledby="range-slider"
                    min={0}
                    max={2019}
                    valueLabelDisplay="on"
                />
            </GenresContainer>
            <MoviesContainer>
                {searchResult.movies.map(movie => <MovieThumbnail movie={movie}/>)}
            </MoviesContainer>
        </MainSection>
    )
}