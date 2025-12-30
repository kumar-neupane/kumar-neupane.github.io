document.addEventListener('DOMContentLoaded', () => {
    // Theme Toggle Logic
    const themeBtn = document.getElementById('theme-toggle');
    const body = document.body;
    const icon = themeBtn ? themeBtn.querySelector('i') : null;

    // Check local storage
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme) {
        body.setAttribute('data-theme', currentTheme);
        if (currentTheme === 'light' && icon) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        }
    }

    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            const isLight = body.getAttribute('data-theme') === 'light';

            if (isLight) {
                body.removeAttribute('data-theme');
                localStorage.setItem('theme', 'dark');
                icon.classList.remove('fa-sun');
                icon.classList.add('fa-moon');
            } else {
                body.setAttribute('data-theme', 'light');
                localStorage.setItem('theme', 'light');
                icon.classList.remove('fa-moon');
                icon.classList.add('fa-sun');
            }
        });
    }

    // Typing Effect
    const texts = ["Ph.D. Student", "Researcher", "Physicist"];
    let count = 0;
    let index = 0;
    let currentText = "";
    let letter = "";

    // Type effect loop
    (function type() {
        if (count === texts.length) {
            count = 0;
        }
        currentText = texts[count];
        letter = currentText.slice(0, ++index);

        const typingElement = document.querySelector('.typing-text');
        if (typingElement) {
            typingElement.textContent = letter;
        }

        if (letter.length === currentText.length) {
            count++;
            index = 0;
            setTimeout(type, 2000);
        } else {
            setTimeout(type, 100);
        }
    })();

    // Sticky Navbar
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Scroll Animations
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Stop observing once visible
            }
        });
    }, { threshold: 0.05, rootMargin: "0px 0px -50px 0px" }); // Lower threshold and add margin

    document.querySelectorAll('.fade-in-up').forEach(el => {
        observer.observe(el);
    });
});
