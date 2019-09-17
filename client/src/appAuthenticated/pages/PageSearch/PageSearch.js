import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import { TextField, Typography } from '@material-ui/core';
import 'rc-slider/assets/index.css';
import 'rc-tooltip/assets/bootstrap.css';
import Slider from 'rc-slider';

const MainSection = styled.section `
    background-color:#141414;
    padding:1rem;
    min-height:100vh;
`

const TermsContainer = styled.section `
    display:flex;
    justify-content:space-between;
    align-items:center;
    padding: 0 15vw;
`

const StyledTextField = styled(TextField) `
    label {
        color:#C50C15;
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
    select { border-color: #C50C15; }
`

const MoviesContainer = styled.section `
    margin:3rem 0;
    display:grid;
    grid-template-columns: repeat( auto-fill, 225px );
    grid-column-gap:5px;
    grid-row-gap:1rem;
    justify-content:center;
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

const StyledSearchInput = styled(StyledTextField) `
    div {
        color:white;
    }
`
export default function PageSearch() {

    const [searchTerms, setSearchTerms] = useState({
        genre: "All",
        page: 1,
        order:  -1,
        sort: "year",
        ratings: [0, 5],
        years: [1915, 2019],
        keywords: "",
        limit: 50
    })
    const [searchResult, setSearchResult] = useState({movies: []});
    const genreList = [
        'All',
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
        'Horror',
        'Music',
        'Musical',
        'Mystery',
        'Romance',
        'Sci-Fi',
        'Sport',
        'Thriller',
        'War',
        'Western'
    ]

    const sortingList = [
        'rating',
        'year'
    ]

    useEffect(() => {
        const fetchMovies = async () => {
            console.table({...searchTerms});
            const res = await axios.post("/search/genre", searchTerms);
            const test = res.data;
            console.log(test.length);
            if (res.data.length !== 0) {
                if (searchTerms.page === 1) setSearchResult({ movies: [...test] })
                else setSearchResult({ movies: searchResult.movies.concat(test)})
            }
        }
        fetchMovies();
    }, [searchTerms])

    const handleTermsChange = event => {
        setSearchTerms({
            ...searchTerms,
            page: 1,
            [event.target.name]: event.target.value,
        })
    }

    const handleGenreChanges = event => {
        setSearchTerms({
            ...searchTerms,
            genre: event.target.value,
            page: 1,
            order:  -1,
            sort: "year",
            ratings: [0, 5],
            years: [1915, 2019],
            limit: 50
        })
    }
    const handleRatingsChanges = value => {
        setSearchTerms({
            ...searchTerms,
            page: 1,
            ratings: value
        })
    }

    const handleYearsChanges = value => {
        setSearchTerms({
            ...searchTerms,
            page: 1,
            years: value
        })
    }

    const handleSearchInput = event => {
        setSearchResult({movies: []})
        setSearchTerms({
            ...searchTerms,
            page: 1,
            ratings: [0, 5],
            years: [1915, 2019],
            keywords: event.target.value,
            limit: 50
        })
    }

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);
    
    const handleScroll = () => {
        if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight) return;
        setSearchTerms(p => {
            const terms = {
                ...p,
                page: p.page + 1
            }
            return terms
        })
    }

    const createSliderWithTooltip = Slider.createSliderWithTooltip;
    const Range = createSliderWithTooltip(Slider.Range);

    const StyledRange = styled(Range) `
        max-width: 10rem;
    `

    return (
        <MainSection>
            <TermsContainer>
                <StyledTextField
                    select
                    label="Genre"
                    name="genre"
                    value={searchTerms.genre}
                    onChange={handleGenreChanges}
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
                            {sorting.charAt(0).toUpperCase() + sorting.slice(1)}
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
                    <option value={-1}>Desc</option>
                    <option value={1}>Asc</option>
                </StyledTextField>
                <Typography gutterBottom>
                    Ratings
                </Typography>
                <StyledRange 
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
                <StyledRange 
                    onAfterChange={handleYearsChanges}
                    min={1915}
                    max={2019}
                    allowCross={false}
                    defaultValue={searchTerms.years}
                    tipFormatter={value => `${value}`} 
                />
                <StyledSearchInput
                    label="Search"
                    value={searchTerms.keywords}
                    onChange={handleSearchInput}
                    variant="outlined"
                />
            </TermsContainer>
            <MoviesContainer>
                {searchResult.movies.map(movie => <Link to={`/movies/${movie.imdbId}`}><MovieThumbnail movie={movie}/></Link>)}
            </MoviesContainer>
        </MainSection>
    )
}