const form = document.querySelector("form");
const inputs = document.querySelectorAll("input");
const textareas = document.querySelectorAll("textarea");
const allFields = [...inputs, ...textareas];
const logoutBtn = document.getElementById('logoutBtn');


document.addEventListener('DOMContentLoaded', function () {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    if (!token || !user) {
        window.location.href = '/';
        return;
    }

    document.getElementById('userName').textContent = user.fullName;
});

const validateForm = (form) => {
    let valid = true;

    const name = form.querySelector(".name");
    const message = form.querySelector(".message");
    const email = form.querySelector(".email");

    if (name.value.trim() === "") {
        giveError(name, "Please enter your name");
        valid = false;
    }

    if (message.value.trim() === "") {
        giveError(message, "Please enter your message");
        valid = false;
    }

    const emailRegex = /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/;
    if (!emailRegex.test(email.value.trim())) {
        giveError(email, "Please enter a valid email");
        valid = false;
    }

    return valid;
};

const giveError = (field, message) => {
    const parent = field.parentElement;
    parent.classList.add("error");

    const existingError = parent.querySelector(".err-msg");
    if (existingError) existingError.remove();

    const error = document.createElement("span");
    error.textContent = message;
    error.classList.add("err-msg");
    parent.appendChild(error);
};

const removeError = (field) => {
    const parent = field.parentElement;
    parent.classList.remove("error");

    const error = parent.querySelector(".err-msg");
    if (error) error.remove();
};

allFields.forEach((field) => {
    field.addEventListener("input", () => removeError(field));
});

if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/';
    });
}

document.getElementById('contactForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    if (!validateForm(form)) return;

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const contactDetails = document.getElementById('contactDetails').value;
    const message = document.getElementById('message').value;

    const contactData = { name, email, contactDetails, message };

    try {
        const res = await fetch('/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(contactData)
        });

        const result = await res.json();

        if (res.status === 201) {
            alert('Message sent successfully!');
            document.getElementById('contactForm').reset();
        } else {
            alert(result.message || 'Failed to send message.');
        }
    } catch (err) {
        console.error('Error:', err);
        alert('An error occurred while sending the message.');
    }
});
document.addEventListener('DOMContentLoaded', function () {
    const themeToggleBtn = document.getElementById('themeToggle');
    const illustrationImg = document.getElementById('illustration-img');
    const currentTheme = localStorage.getItem('theme');

    // Apply the saved theme and update the icon color on page load
    if (currentTheme === 'light') {
        document.body.classList.add('light-theme');
        themeToggleBtn.innerHTML = '<i class="fas fa-moon" style="color: black;"></i>';
        illustrationImg.src = 'https://img.freepik.com/free-vector/contact-us-concept-illustration_114360-3147.jpg';
    }

    // Toggle theme and update the icon color
    themeToggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('light-theme');
        if (document.body.classList.contains('light-theme')) {
            themeToggleBtn.innerHTML = '<i class="fas fa-moon" style="color: black;"></i>';
            illustrationImg.src = 'https://img.freepik.com/free-vector/contact-us-concept-illustration_114360-3147.jpg';
            localStorage.setItem('theme', 'light');
        } else {
            themeToggleBtn.innerHTML = '<i class="fas fa-sun" style="color: white;"></i>';
            illustrationImg.src = 'https://img.freepik.com/premium-vector/lady-call-center-illustration-with-headphones-computer-speech-balloon-showing-message-woman-using-laptop-earphones-with-conversation-bubble-presenting-explanation_424947-8749.jpg';
            localStorage.setItem('theme', 'dark');
        }
    });
});