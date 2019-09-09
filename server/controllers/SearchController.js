const axios = require("axios");

const getPopcornResults = terms => {
    if (terms.genre) {
        if (terms.genre === "Film Noir") terms.genre = "film-noir";
        else if (terms.genre === "Sci-Fi") terms.genre = "science-fiction";
        else if (terms.genre === "Short Film") terms.genre = "short";
        else if (terms.genre === "Sport") terms.genre = "sports";
        else terms.genre = terms.genre.toLowerCase();
    }
    console.log(terms.genre);
}
const search = (req, res) => {
    console.log(req.body)
    getPopcornResults(req.body);
    res.status(200).send('Search called.');
}

module.exports = {
    search
}