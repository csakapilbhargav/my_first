const notify = (msg, isError = false) => {
    const el = document.getElementById('notification');
    el.textContent = msg;
    el.style.borderColor = isError ? 'rgba(239, 68, 68, 0.4)' : 'rgba(16, 185, 129, 0.4)';
    el.classList.add('active');
    setTimeout(() => el.classList.remove('active'), 3000);
};

if (document.getElementById('loginForm')) {
    document.getElementById('loginForm').onsubmit = async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            if (res.ok) {
                const data = await res.json();
                localStorage.setItem("token", data.token);
                notify("Login successful! Redirecting...");
                setTimeout(() => window.location.href = "dashboard.html", 1000);
            } else {
                const err = await res.text();
                notify(err || "Login failed", true);
            }
        } catch (err) {
            notify("Connection error", true);
        }
    };
}

if (document.getElementById('registerForm')) {
    document.getElementById('registerForm').onsubmit = async (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password })
            });

            if (res.ok) {
                notify("Account created! Redirecting to login...");
                setTimeout(() => window.location.href = "login.html", 1500);
            } else {
                const err = await res.text();
                notify(err || "Registration failed", true);
            }
        } catch (err) {
            notify("Connection error", true);
        }
    };
}
