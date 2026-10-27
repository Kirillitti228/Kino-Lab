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

const googleLoginButton =
    document.getElementById("googleLoginButton");

const googleRegisterButton =
    document.getElementById("googleRegisterButton");


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
// REGISTER WITH EMAIL
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
// LOGIN WITH EMAIL
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
// GOOGLE AUTHENTICATION
// ==========================================

async function signInWithGoogle() {

    if (!auth || !firebaseAuth) {

        showMessage(
            "Firebase is not ready yet. Please wait a moment.",
            "error"
        );

        return;

    }


    try {

        showMessage(
            "Opening Google sign-in...",
            ""
        );


        googleLoginButton.disabled = true;
        googleRegisterButton.disabled = true;


        await firebaseAuth.setPersistence(
            auth,
            firebaseAuth.browserLocalPersistence
        );


        const provider =
            new firebaseAuth.GoogleAuthProvider();


        provider.setCustomParameters({
            prompt: "select_account"
        });


        const result =
            await firebaseAuth.signInWithPopup(
                auth,
                provider
            );


        console.log(
            "Google login successful."
        );


        console.log(
            "Google user:",
            result.user.email
        );


        showMessage(
            "Google login successful!",
            "success"
        );


        setTimeout(() => {

            window.location.replace(
                "index.html"
            );

        }, 500);


    } catch (error) {

        console.error(
            "Google login error:",
            error
        );


        googleLoginButton.disabled = false;
        googleRegisterButton.disabled = false;


        showMessage(
            getFirebaseErrorMessage(error),
            "error"
        );

    }

}


// ==========================================
// GOOGLE BUTTONS
// ==========================================

googleLoginButton.addEventListener(
    "click",
    signInWithGoogle
);


googleRegisterButton.addEventListener(
    "click",
    signInWithGoogle
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


        case "auth/popup-closed-by-user":

            return "Google sign-in was cancelled.";


        case "auth/popup-blocked":

            return "Your browser blocked the Google sign-in window.";


        case "auth/cancelled-popup-request":

            return "Google sign-in was cancelled.";


        case "auth/unauthorized-domain":

            return "This website domain is not authorized in Firebase.";


        case "auth/account-exists-with-different-credential":

            return "An account with this email already exists using another sign-in method.";


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