import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Select, MenuItem, InputLabel, FormControl, Chip, OutlinedInput } from '@mui/material';
import { DirectorService } from "../services/director.service";
import { GenreService } from "../services/genre.service";
import { MovieService } from "../services/movie.service";

function MovieAdd() {
    const navigate = useNavigate();
    const [movie, setMovie] = useState({
        title: '',
        releaseDate: '',
        genresIds: [],  // Store IDs of selected genres
        directorId: ''
    });
    const [genres, setGenres] = useState([]);
    const [directors, setDirectors] = useState([]);

    useEffect(() => {
        async function fetchData() {
            const fetchedGenres = await GenreService.getAll();
            const fetchedDirectors = await DirectorService.getAll();
            setGenres(fetchedGenres);
            setDirectors(fetchedDirectors);
        }
        fetchData();
    }, []);

    const handleGenreChange = (event) => {
        const {
            target: { value },
        } = event;
        setMovie({
            ...movie,
            genresIds: typeof value === 'string' ? value.split(',') : value,
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        await MovieService.save({
            ...movie,
            genres: movie.genresIds.map(id => ({ id })),
        });
        navigate('/movies');
    };

    return (
        <form onSubmit={handleSubmit}>
            <TextField
                label="Назва"
                value={movie.title}
                onChange={e => setMovie({ ...movie, title: e.target.value })}
                required
            />
            <TextField
                type="date"
                value={movie.releaseDate}
                onChange={e => setMovie({ ...movie, releaseDate: e.target.value })}
                required
            />
            <FormControl fullWidth>
                <InputLabel id="genre-select-label">Жанр</InputLabel>
                <Select
                    labelId="genre-select-label"
                    multiple
                    value={movie.genresIds}
                    onChange={handleGenreChange}
                    input={<OutlinedInput id="select-multiple-chip" label="Жанр" />}
                    renderValue={(selected) => (
                        <div>
                            {selected.map(value => (
                                <Chip key={value} label={genres.find(g => g.id === value)?.name || value} />
                            ))}
                        </div>
                    )}
                >
                    {genres.map((genre) => (
                        <MenuItem key={genre.id} value={genre.id}>
                            {genre.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <FormControl fullWidth>
                <InputLabel id="director-select-label">Режисер</InputLabel>
                <Select
                    labelId="director-select-label"
                    value={movie.directorId}
                    onChange={e => setMovie({ ...movie, directorId: e.target.value })}
                >
                    {directors.map((director) => (
                        <MenuItem key={director.id} value={director.id}>
                            {director.firstName} {director.lastName}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <Button type="submit" color="primary" variant="contained">
                Додати фільм
            </Button>
        </form>
    );
}

export default MovieAdd;