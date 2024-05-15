import React, { useEffect, useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Dialog,
    DialogActions,
    DialogTitle,
    Button,
    Snackbar
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { MovieService } from "../services/movie.service";
import {useNavigate} from "react-router-dom";

function MovieList() {
    const [movies, setMovies] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const movieData = async () => {
            const movies = await MovieService.getAll();
            setMovies(movies);
        };

        movieData();
    }, []);

    // Proper check for empty array
    if (movies.length === 0) return <h1>Loading...</h1>;

    const handleAddMovie = () => {
        navigate("/movies/create");
    };

    const handleClickOpen = (movie) => {
        setSelectedMovie(movie);
        setOpenDialog(true);
    };

    const handleRowClick = (movieId) => {
        navigate(`/movies/${movieId}`);
    };

    const handleClose = () => {
        setOpenDialog(false);
    };

    const handleDelete = async () => {
        try {
            await MovieService.deleteById(selectedMovie.id);
            const newMovies = movies.filter(movie => movie.id !== selectedMovie.id);
            setMovies(newMovies);
            setSnackbarMessage("Сутність була успішно видалена");
        } catch (error) {
            console.error("Error deleting movie:", error);
            setSnackbarMessage("Помилка при видаленні сутності");
        }
        setOpenDialog(false);
        setOpenSnackbar(true);
    };

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackbar(false);
    };

    return (
        <>
            <TableContainer component={Paper}>
                <Button variant="contained" onClick={handleAddMovie}>Додати фільм</Button>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Назва</TableCell>
                            <TableCell>Дата випуску</TableCell>
                            <TableCell>Режисер</TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {movies.map(movie => (
                            <TableRow key={movie.id} hover
                                      sx={{
                                          '&:hover .deleteIconButton': {
                                              visibility: 'visible'
                                          }
                                      }}
                            >
                                <TableCell onClick={() => handleRowClick(movie.id)}> {movie.title}</TableCell>
                                <TableCell onClick={() => handleRowClick(movie.id)}>{movie.releaseDate}</TableCell>
                                <TableCell onClick={() => handleRowClick(movie.id)}>{movie.director.lastName}</TableCell>
                                <TableCell>
                                    <IconButton onClick={() => handleClickOpen(movie)} color="error"
                                                sx={{ visibility: 'hidden' }}
                                                className="deleteIconButton">
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog
                open={openDialog}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
            >
                <DialogTitle id="alert-dialog-title">{"Підтвердіть видалення сутності"}</DialogTitle>
                <DialogActions>
                    <Button onClick={handleClose}>Відмінити</Button>
                    <Button onClick={handleDelete} autoFocus color="error">
                        Видалити
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                message={snackbarMessage}
            />
        </>
    );
}

export default MovieList;
