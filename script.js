// ==========================================
// KINO LAB
// MAIN SCRIPT
// ==========================================


// ==========================================
// FIREBASE
// ==========================================

let auth = null;
let firebaseAuth = null;


// ==========================================
// INITIALIZE FIREBASE AUTH
// ==========================================

async function initializeAuth() {

    try {

        const firebaseApp =
            await import(
                "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js"
            );


        firebaseAuth =
            await import(
                "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js"
            );


        // ==========================================
        // NEW FIREBASE CONFIG
        // ==========================================

        const firebaseConfig = {

            apiKey:
                "AIzaSyBpcMoZuogQWLzWbhHK_aib9z7eGKIZ-a8",

            authDomain:
                "kino-lab-new.firebaseapp.com",

            projectId:
                "kino-lab-new",

            storageBucket:
                "kino-lab-new.firebasestorage.app",

            messagingSenderId:
                "300822366214",

            appId:
                "1:300822366214:web:8a3f1be807ae2ab51b1b87",

            measurementId:
                "G-7B3J5ZSC6K"

        };


        // ==========================================
        // INITIALIZE APP
        // ==========================================

        const app =
            firebaseApp.initializeApp(
                firebaseConfig
            );


        // Get Auth

        auth =
            firebaseAuth.getAuth(app);


        // ==========================================
        // AUTH PERSISTENCE
        // ==========================================

        await firebaseAuth.setPersistence(
            auth,
            firebaseAuth.browserLocalPersistence
        );


        console.log(
            "Firebase initialized successfully."
        );


        console.log(
            "Firebase project: kino-lab-new"
        );


        // ==========================================
        // CHECK USER
        // ==========================================

        firebaseAuth.onAuthStateChanged(
            auth,
            (user) => {

                if (user) {

                    console.log(
                        "User authenticated:",
                        user.email
                    );

                } else {

                    console.log(
                        "No authenticated user."
                    );


                    window.location.replace(
                        "login.html"
                    );

                }

            }
        );


        // ==========================================
        // LOGOUT
        // ==========================================

        const logoutButton =
            document.getElementById(
                "logoutButton"
            );


        if (logoutButton) {

            logoutButton.addEventListener(
                "click",
                async () => {

                    try {

                        await firebaseAuth.signOut(
                            auth
                        );


                        console.log(
                            "User logged out."
                        );


                        window.location.replace(
                            "login.html"
                        );


                    } catch (error) {

                        console.error(
                            "Logout error:",
                            error
                        );

                    }

                }
            );

        }


    } catch (error) {

        console.error(
            "Firebase initialization error:",
            error
        );

    }

}



// ==========================================
// DOM ELEMENTS
// ==========================================

const moviesGrid =
    document.getElementById(
        "moviesGrid"
    );


const searchInput =
    document.getElementById(
        "searchInput"
    );


const genreFilter =
    document.getElementById(
        "genreFilter"
    );


const sortFilter =
    document.getElementById(
        "sortFilter"
    );


const movieCount =
    document.getElementById(
        "movieCount"
    );


const movieModal =
    document.getElementById(
        "movieModal"
    );


const closeModal =
    document.getElementById(
        "closeModal"
    );


const modalOverlay =
    document.getElementById(
        "modalOverlay"
    );


const modalPoster =
    document.getElementById(
        "modalPoster"
    );


const modalTitle =
    document.getElementById(
        "modalTitle"
    );


const modalGenre =
    document.getElementById(
        "modalGenre"
    );


const modalYear =
    document.getElementById(
        "modalYear"
    );


const modalDuration =
    document.getElementById(
        "modalDuration"
    );


const modalRating =
    document.getElementById(
        "modalRating"
    );


const modalDescription =
    document.getElementById(
        "modalDescription"
    );


const modalTrailer =
    document.getElementById(
        "modalTrailer"
    );



// ==========================================
// MOVIE DATA
// ==========================================

let movies = [];



// ==========================================
// LOAD MOVIES
// ==========================================

async function loadMovies() {

    try {

        const response =
            await fetch(
                "movies.json"
            );


        if (!response.ok) {

            throw new Error(
                "Could not load movies.json"
            );

        }


        movies =
            await response.json();


        console.log(
            "Movies loaded:",
            movies.length
        );


        createGenreFilter();

        displayMovies(
            movies
        );


    } catch (error) {

        console.error(
            "Error loading movies:",
            error
        );


        if (moviesGrid) {

            moviesGrid.innerHTML = `
                <div class="error-message">
                    <h3>Could not load movies</h3>
                    <p>
                        Please check that movies.json exists.
                    </p>
                </div>
            `;

        }

    }

}



// ==========================================
// CREATE GENRE FILTER
// ==========================================

function createGenreFilter() {

    if (!genreFilter) {

        return;

    }


    const genres =
        [
            ...new Set(
                movies.map(
                    movie => movie.genre
                )
            )
        ];


    genres.sort();


    genreFilter.innerHTML = `
        <option value="all">
            All genres
        </option>
    `;


    genres.forEach(
        genre => {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                genre;


            option.textContent =
                genre;


            genreFilter.appendChild(
                option
            );

        }
    );

}



// ==========================================
// DISPLAY MOVIES
// ==========================================

function displayMovies(movieList) {

    if (!moviesGrid) {

        return;

    }


    moviesGrid.innerHTML = "";


    if (movieCount) {

        movieCount.textContent =
            movieList.length;

    }


    const noResults =
        document.getElementById(
            "noResults"
        );


    if (movieList.length === 0) {

        if (noResults) {

            noResults.style.display =
                "block";

        }

        return;

    }


    if (noResults) {

        noResults.style.display =
            "none";

    }


    movieList.forEach(
        movie => {

            const movieCard =
                document.createElement(
                    "article"
                );


            movieCard.className =
                "movie-card";


            movieCard.setAttribute(
                "tabindex",
                "0"
            );


            movieCard.innerHTML = `

                <button
                    class="movie-card-button"
                    type="button"
                    aria-label="Open information about ${movie.title}"
                >

                    <div class="movie-poster">

                        <img
                            src="${movie.poster}"
                            alt="${movie.title} poster"
                            loading="lazy"
                        >

                        <div class="poster-overlay">

                            <span class="view-movie">
                                View movie
                            </span>

                        </div>

                    </div>


                    <div class="movie-card-info">

                        <div class="movie-card-top">

                            <span class="movie-genre">
                                ${movie.genre}
                            </span>

                            <span class="movie-rating">
                                ★ ${movie.rating}
                            </span>

                        </div>


                        <h3 class="movie-title">
                            ${movie.title}
                        </h3>


                        <div class="movie-card-meta">

                            <span>
                                ${movie.year}
                            </span>

                            <span>
                                •
                            </span>

                            <span>
                                ${movie.duration}
                            </span>

                        </div>

                    </div>

                </button>

            `;


            const button =
                movieCard.querySelector(
                    ".movie-card-button"
                );


            button.addEventListener(
                "click",
                () => {

                    openMovieModal(
                        movie
                    );

                }
            );


            button.addEventListener(
                "keydown",
                (event) => {

                    if (
                        event.key === "Enter" ||
                        event.key === " "
                    ) {

                        event.preventDefault();


                        openMovieModal(
                            movie
                        );

                    }

                }
            );


            moviesGrid.appendChild(
                movieCard
            );

        }
    );

}



// ==========================================
// FILTER MOVIES
// ==========================================

function filterMovies() {

    const searchTerm =
        searchInput
            ? searchInput.value
                .toLowerCase()
                .trim()
            : "";


    const selectedGenre =
        genreFilter
            ? genreFilter.value
            : "all";


    const selectedSort =
        sortFilter
            ? sortFilter.value
            : "rating";


    let filteredMovies =
        movies.filter(
            movie => {

                const matchesSearch =

                    movie.title
                        .toLowerCase()
                        .includes(
                            searchTerm
                        )

                    ||

                    movie.description
                        .toLowerCase()
                        .includes(
                            searchTerm
                        )

                    ||

                    movie.genre
                        .toLowerCase()
                        .includes(
                            searchTerm
                        );


                const matchesGenre =
                    selectedGenre === "all"
                    ||
                    movie.genre === selectedGenre;


                return (
                    matchesSearch &&
                    matchesGenre
                );

            }
        );


    // ==========================================
    // SORT
    // ==========================================

    switch (selectedSort) {

        case "rating":

            filteredMovies.sort(
                (a, b) =>
                    b.rating - a.rating
            );

            break;


        case "newest":

            filteredMovies.sort(
                (a, b) =>
                    b.year - a.year
            );

            break;


        case "oldest":

            filteredMovies.sort(
                (a, b) =>
                    a.year - b.year
            );

            break;


        case "title":

            filteredMovies.sort(
                (a, b) =>
                    a.title.localeCompare(
                        b.title
                    )
            );

            break;

    }


    displayMovies(
        filteredMovies
    );

}



// ==========================================
// OPEN MOVIE MODAL
// ==========================================

function openMovieModal(movie) {

    if (!movieModal) {

        return;

    }


    if (modalPoster) {

        modalPoster.src =
            movie.poster;


        modalPoster.alt =
            `${movie.title} poster`;

    }


    if (modalTitle) {

        modalTitle.textContent =
            movie.title;

    }


    if (modalGenre) {

        modalGenre.textContent =
            movie.genre;

    }


    if (modalYear) {

        modalYear.textContent =
            movie.year;

    }


    if (modalDuration) {

        modalDuration.textContent =
            movie.duration;

    }


    if (modalRating) {

        modalRating.textContent =
            `★ ${movie.rating}`;

    }


    if (modalDescription) {

        modalDescription.textContent =
            movie.description;

    }


    if (modalTrailer) {

        modalTrailer.src =
            movie.trailer;

    }


    movieModal.classList.add(
        "active"
    );


    movieModal.setAttribute(
        "aria-hidden",
        "false"
    );


    document.body.classList.add(
        "modal-open"
    );


    if (closeModal) {

        closeModal.focus();

    }

}



// ==========================================
// CLOSE MOVIE MODAL
// ==========================================

function closeMovieModal() {

    if (!movieModal) {

        return;

    }


    movieModal.classList.remove(
        "active"
    );


    movieModal.setAttribute(
        "aria-hidden",
        "true"
    );


    document.body.classList.remove(
        "modal-open"
    );


    if (modalTrailer) {

        modalTrailer.src =
            "";

    }

}



// ==========================================
// CLOSE BUTTON
// ==========================================

if (closeModal) {

    closeModal.addEventListener(
        "click",
        closeMovieModal
    );

}



// ==========================================
// MODAL OVERLAY
// ==========================================

if (modalOverlay) {

    modalOverlay.addEventListener(
        "click",
        closeMovieModal
    );

}



// ==========================================
// ESCAPE KEY
// ==========================================

document.addEventListener(
    "keydown",
    (event) => {

        if (
            event.key === "Escape"
            &&
            movieModal
            &&
            movieModal.classList.contains(
                "active"
            )
        ) {

            closeMovieModal();

        }

    }
);



// ==========================================
// SEARCH
// ==========================================

if (searchInput) {

    searchInput.addEventListener(
        "input",
        filterMovies
    );

}



// ==========================================
// GENRE FILTER
// ==========================================

if (genreFilter) {

    genreFilter.addEventListener(
        "change",
        filterMovies
    );

}



// ==========================================
// SORT FILTER
// ==========================================

if (sortFilter) {

    sortFilter.addEventListener(
        "change",
        filterMovies
    );

}



// ==========================================
// START APPLICATION
// ==========================================

initializeAuth();

loadMovies();