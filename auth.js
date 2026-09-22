// ==========================================
// KINO LAB - AUTHENTICATION
// ==========================================


// ==========================================
// ELEMENTS
// ==========================================

const loginTab = document.getElementById("loginTab");
const registerTab = document.getElementById("registerTab");

const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");

const authMessage = document.getElementById("authMessage");


// ==========================================
// FIREBASE VARIABLES
// ==========================================

let auth = null;
let firebaseAuth = null;


// ==========================================
// SWITCH LOGIN / REGISTER
// ==========================================

loginTab.addEventListener("click", () => {

    loginTab.classList.add("active");
    registerTab.classList.remove("active");

    loginForm.classList.remove("hidden");
    registerForm.classList.add("hidden");

    clearMessage();

});


registerTab.addEventListener("click", () => {

    registerTab.classList.add("active");
    loginTab.classList.remove("active");

    registerForm.classList.remove("hidden");
    loginForm.classList.add("hidden");

    clearMessage();

});


// ==========================================
// FIREBASE CONFIG
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
// INITIALIZE FIREBASE
// ==========================================

async function initializeFirebase() {

    try {

        const firebaseApp =
            await import(
                "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js"
            );


        firebaseAuth =
            await import(
                "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js"
            );


        const app =
            firebaseApp.initializeApp(
                firebaseConfig
            );


        auth =
            firebaseAuth.getAuth(app);


        // Keep the user logged in
        // when moving between pages

        await firebaseAuth.setPersistence(
            auth,
            firebaseAuth.browserLocalPersistence
        );


        console.log(
            "Firebase initialized successfully."
        );


        console.log(
            "Authentication persistence enabled."
        );


    } catch (error) {

        console.error(
            "Firebase initialization error:",
            error
        );


        showMessage(
            "Could not connect to Firebase.",
            "error"
        );

    }

}


// ==========================================
// REGISTER
// ==========================================

registerForm.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();


        if (!auth || !firebaseAuth) {

            showMessage(
                "Firebase is not ready yet. Please wait a moment.",
                "error"
            );

            return;

        }


        const email =
            document
                .getElementById("registerEmail")
                .value
                .trim();


        const password =
            document
                .getElementById("registerPassword")
                .value;


        const confirmPassword =
            document
                .getElementById("confirmPassword")
                .value;


        // Check passwords

        if (password !== confirmPassword) {

            showMessage(
                "Passwords do not match.",
                "error"
            );

            return;

        }


        try {

            showMessage(
                "Creating your account...",
                ""
            );


            const userCredential =
                await firebaseAuth
                    .createUserWithEmailAndPassword(
                        auth,
                        email,
                        password
                    );


            console.log(
                "Registration successful."
            );


            console.log(
                "Registered user:",
                userCredential.user.email
            );


            showMessage(
                "Account created successfully!",
                "success"
            );


            // Wait a little before opening
            // the main page

            setTimeout(() => {

                window.location.replace(
                    "index.html"
                );

            }, 800);


        } catch (error) {

            console.error(
                "Registration error:",
                error
            );


            showMessage(
                getFirebaseErrorMessage(error),
                "error"
            );

        }

    }
);


// ==========================================
// LOGIN
// ==========================================

loginForm.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();


        if (!auth || !firebaseAuth) {

            showMessage(
                "Firebase is not ready yet. Please wait a moment.",
                "error"
            );

            return;

        }


        const email =
            document
                .getElementById("loginEmail")
                .value
                .trim();


        const password =
            document
                .getElementById("loginPassword")
                .value;


        try {

            showMessage(
                "Logging you in...",
                ""
            );


            // Make sure the login is saved

            await firebaseAuth.setPersistence(
                auth,
                firebaseAuth.browserLocalPersistence
            );


            const userCredential =
                await firebaseAuth
                    .signInWithEmailAndPassword(
                        auth,
                        email,
                        password
                    );


            console.log(
                "Login successful."
            );


            console.log(
                "Logged in user:",
                userCredential.user.email
            );


            showMessage(
                "Login successful!",
                "success"
            );


            // Open the main page

            setTimeout(() => {

                window.location.replace(
                    "index.html"
                );

            }, 800);


        } catch (error) {

            console.error(
                "Login error:",
                error
            );


            showMessage(
                getFirebaseErrorMessage(error),
                "error"
            );

        }

    }
);


// ==========================================
// MESSAGE
// ==========================================

function showMessage(message, type) {

    authMessage.textContent =
        message;


    authMessage.className =
        "auth-message";


    if (type) {

        authMessage.classList.add(
            type
        );

    }

}


function clearMessage() {

    authMessage.textContent =
        "";


    authMessage.className =
        "auth-message";

}


// ==========================================
// FIREBASE ERRORS
// ==========================================

function getFirebaseErrorMessage(error) {

    console.error(
        "Firebase error code:",
        error.code
    );


    switch (error.code) {

        case "auth/email-already-in-use":

            return "This email is already registered.";


        case "auth/invalid-email":

            return "Please enter a valid email.";


        case "auth/weak-password":

            return "Password must contain at least 6 characters.";


        case "auth/invalid-credential":

            return "Incorrect email or password.";


        case "auth/user-not-found":

            return "No account was found with this email.";


        case "auth/wrong-password":

            return "Incorrect password.";


        case "auth/too-many-requests":

            return "Too many attempts. Please try again later.";


        case "auth/network-request-failed":

            return "Network error. Check your internet connection.";


        default:

            return (
                "Something went wrong: " +
                error.message
            );

    }

}


// ==========================================
// START FIREBASE
// ==========================================

initializeFirebase();