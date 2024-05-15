import {useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {MovieService} from "../services/movie.service";
import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from "@mui/material";

function MovieDetail() {
    const { id } = useParams();
    const [movie, setMovie] = useState({});

    useEffect(() => {
        if (!id) return

        const movieData = async () => {
            const movie = await MovieService.getById(id);
            setMovie(movie);
        }

        movieData()
    }, [id]);

    if (!(movie.id??'')) return <h1>Loading...</h1>

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Id</TableCell>
                        <TableCell>Назва</TableCell>
                        <TableCell>Рік випуску</TableCell>
                        <TableCell>Жанри</TableCell>
                        <TableCell>Режисер</TableCell>
                        <TableCell>Національність</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                        <TableRow key={movie.id} hover>
                            <TableCell>{movie.id}</TableCell>
                            <TableCell>{movie.title}</TableCell>
                            <TableCell>{movie.releaseDate}</TableCell>
                            <TableCell>
                                {movie.genres.map(genre => genre.name).join(', ')}
                            </TableCell>
                            <TableCell>{movie.director.firstName + " " + movie.director.lastName}</TableCell>
                            <TableCell>{movie.director.nationality}</TableCell>
                        </TableRow>
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default MovieDetail;