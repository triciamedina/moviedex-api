require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const MOVIEDEX = require('./moviedex.json');

const app = express();

app.use(morgan('common'));
app.use(helmet());
app.use(cors());

app.use(function validateBearerToken(req, res, next) {
    const apiToken = process.env.API_TOKEN;
    const authToken = req.get('Authorization');
    
    console.log('validate bearer token middleware');

    if( !authToken || authToken.split(' ')[1] !== apiToken) {
        return res.status(401).json({ error: 'Unauthorized request' });
    }

    next();
});

function handleGetMovies(req, res) {
    const { genre, country, avg_vote } = req.query;

    let results = MOVIEDEX;

    if (genre) {
        results = results.filter(movie => 
            movie.genre.toLowerCase().includes(genre.toLowerCase())
        );
    }

    if (country) {
        results = results.filter(movie => 
            movie.country.toLowerCase().includes(country.toLowerCase())
        );
    }

    if (avg_vote) {
        results = results.filter(movie => 
            movie.avg_vote >= Number(avg_vote));
    }

    res.json(results);
}

app.get('/movie', handleGetMovies)

const PORT = 8000;

app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`);
});