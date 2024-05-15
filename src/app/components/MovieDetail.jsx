import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField, Snackbar, IconButton, FormControl, InputLabel, Select, OutlinedInput, MenuItem, Chip, FormHelperText } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import { MovieService } from "../services/movie.service";
import { DirectorService } from "../services/director.service";
import { GenreService } from "../services/genre.service";

function MovieDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [movie, setMovie] = useState({ genresIds: [], title: '', releaseDate: '', directorId: '' });
    const [genres, setGenres] = useState([]);
    const [directors, setDirectors] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [errors, setErrors] = useState({});
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

    useEffect(() => {
        if (!id) return;
        const fetchData = async () => {
            const movie = await MovieService.getById(id);
            setMovie({
                ...movie,
                genresIds: movie.genresIds || [],
                title: movie.title || '',
                releaseDate: movie.releaseDate || '',
                directorId: movie.directorId || ''
            });
            const fetchedDirectors = await DirectorService.getAll();
            const fetchedGenres = await GenreService.getAll();
            setDirectors(fetchedDirectors);
            setGenres(fetchedGenres);
        };
        fetchData();
    }, [id]);

    if (!movie.id) return <h1>Loading...</h1>;

    const validate = () => {
        let tempErrors = {};
        tempErrors.title = movie.title ? "" : "Це поле є обов'язковим";
        tempErrors.releaseDate = movie.releaseDate ? "" : "Це поле є обов'язковим";
        tempErrors.genresIds = movie.genresIds.length > 0 ? "" : "Це поле є обов'язковим";
        tempErrors.directorId = movie.directorId ? "" : "Це поле є обов'язковим";
        setErrors(tempErrors);
        return Object.values(tempErrors).every(x => x === "");
    };

    const handleSave = async () => {
        if (validate()) {
            try {
                const updatedMovie = await MovieService.update(movie.id, movie);
                setMovie({
                    ...movie,
                    ...updatedMovie
                });
                setEditMode(false);
                setSnackbar({ open: true, message: 'Сутність була успішно відредагована', severity: 'success' });
            } catch (error) {
                console.error("Error updating movie:", error);
                setSnackbar({ open: true, message: 'Помилка при збереженні сутності', severity: 'error' });
            }
        }
    };

    const handleCancel = () => {
        setEditMode(false);
    };

    const handleBack = () => {
        navigate('/movies/');
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    return (
        <>
            <TableContainer component={Paper} key={movie.lastUpdated}>
                <IconButton onClick={() => setEditMode(!editMode)} sx={{ float: 'right' }}>
                    {editMode ? <SaveIcon /> : <EditIcon />}
                </IconButton>
                <Button onClick={handleBack} color="primary" startIcon={<CancelIcon />}>Назад</Button>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Id</TableCell>
                            <TableCell>Назва</TableCell>
                            <TableCell>Рік випуску</TableCell>
                            <TableCell>Жанри</TableCell>
                            <TableCell>Режисер</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow key={movie.id} hover>
                            <TableCell>{movie.id}</TableCell>
                            <TableCell>
                                {editMode ? (
                                    <TextField
                                        value={movie.title}
                                        onChange={(e) => setMovie({ ...movie, title: e.target.value })}
                                        error={!!errors.title}
                                        helperText={errors.title}
                                    />
                                ) : movie.title}
                            </TableCell>
                            <TableCell>
                                {editMode ? (
                                    <TextField
                                        type="date"
                                        value={movie.releaseDate}
                                        onChange={(e) => setMovie({ ...movie, releaseDate: e.target.value })}
                                        error={!!errors.releaseDate}
                                        helperText={errors.releaseDate}
                                    />
                                ) : movie.releaseDate}
                            </TableCell>
                            <TableCell>
                                {editMode ? (
                                    <FormControl fullWidth error={!!errors.genresIds}>
                                        <InputLabel id="genre-select-label">Жанр</InputLabel>
                                        <Select
                                            labelId="genre-select-label"
                                            multiple
                                            value={movie.genresIds}
                                            onChange={(e) => setMovie({ ...movie, genresIds: e.target.value })}
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
                                        {errors.genresIds && <FormHelperText>{errors.genresIds}</FormHelperText>}
                                    </FormControl>
                                ) : movie.genres.map(genre => genre.name).join(', ')}
                            </TableCell>
                            <TableCell>
                                {editMode ? (
                                    <FormControl fullWidth error={!!errors.directorId}>
                                        <InputLabel id="director-select-label">Режисер</InputLabel>
                                        <Select
                                            labelId="director-select-label"
                                            value={movie.directorId}
                                            onChange={(e) => setMovie({ ...movie, directorId: e.target.value })}
                                        >
                                            {directors.map((director) => (
                                                <MenuItem key={director.id} value={director.id}>
                                                    {director.firstName} {director.lastName}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                        {errors.directorId && <FormHelperText>{errors.directorId}</FormHelperText>}
                                    </FormControl>
                                ) : movie.director.firstName + " " + movie.director.lastName}
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
                {editMode && (
                    <Button onClick={handleSave} color="primary" startIcon={<SaveIcon />} variant="contained">Зберегти</Button>
                )}
                {editMode && (
                    <Button onClick={handleCancel} color="secondary" startIcon={<CancelIcon />} variant="contained">Скасувати</Button>
                )}
            </TableContainer>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                message={snackbar.message}
            />
        </>
    );
}

export default MovieDetail;
