import React, { useState, useEffect, Fragment } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { TextField, Typography } from '@material-ui/core';
import 'rc-slider/assets/index.css';
import 'rc-tooltip/assets/bootstrap.css';
import Slider from 'rc-slider';

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
            cover={props.movie.poster}
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
        ratings: [0, 5],
        years: [1915, 2019],
        keywords: "",
        limit:50
    })
    const [searchResult, setSearchResult] = useState({movies: []});
    const genreList = [
        'Action',
        'Adventure',
        'Animation',
        'Comedy',
        'Crime',
        'Documentary',
        'Drama',
        'Family',
        'Fantasy',
        'History',
        'Holiday',
        'Horror',
        'Music',
        'Mystery',
        'Romance',
        'Science-fiction',
        'Short',
        'Suspense',
        'Thriller',
        'Tv-movie',
        'War',
        'Western'
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
            console.log(res.data)
            const test = res.data.slice(0, 20);
            if (res.data.length !== 0) setSearchResult({ movies: [...test] })
        }
        fetchMovies();
    }, [searchTerms])

    const handleTermsChange = event => {
        setSearchTerms({
            ...searchTerms,
            [event.target.name]: event.target.value,
        })
    }

    const handleRatingsChanges = value => {
        setSearchTerms({
            ...searchTerms,
            ratings: value
        })
    }

    const handleYearsChanges = value => {
        setSearchTerms({
            ...searchTerms,
            years: value
        })
    }

    const createSliderWithTooltip = Slider.createSliderWithTooltip;
    const Range = createSliderWithTooltip(Slider.Range);

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
                <Range 
                    onAfterChange={handleRatingsChanges}
                    min={0}
                    max={5}
                    allowCross={false}
                    defaultValue={searchTerms.ratings}
                    tipFormatter={value => `${value}`} 
                />
                <Typography gutterBottom>
                    Years
                </Typography>
                <Range 
                    onAfterChange={handleYearsChanges}
                    min={1915}
                    max={2019}
                    allowCross={false}
                    defaultValue={searchTerms.years}
                    tipFormatter={value => `${value}`} 
                />
            </GenresContainer>
            <MoviesContainer>
                {searchResult.movies.map(movie => <MovieThumbnail movie={movie}/>)}
            </MoviesContainer>
        </MainSection>
    )
}