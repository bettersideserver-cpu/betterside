if (!localStorage.getItem("userName")) {
    window.location.href = "/";
}

// --- Navigation Logic ---
function showSection(sectionId) {
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(sec => sec.classList.remove('active-section'));

    document.getElementById(sectionId).classList.add('active-section');

    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => link.classList.remove('active'));
    document.getElementById('nav-' + sectionId).classList.add('active');
}

// --- Logout ---
document.getElementById("logoutBtn").addEventListener("click", function(e) {
    e.preventDefault();
    localStorage.removeItem("userName");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userProfileImage");
    window.location.href = "/";
});

// --- Profile Data ---
const userName    = localStorage.getItem("userName");
const userEmail   = localStorage.getItem("userEmail");
const userCity    = localStorage.getItem("userCity");
const companyName = localStorage.getItem("companyName");

if (userName)    document.getElementById("profileName").textContent     = userName;
if (userEmail)   document.getElementById("profileEmail").textContent    = userEmail;
if (userCity)    document.getElementById("profileLocation").textContent = userCity;
if (companyName) document.getElementById("profileCompany").textContent  = companyName;