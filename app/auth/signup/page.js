// app/auth/signup/page.js
"use client";

export default function Signup() {
  const handleSignup = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify({
        email: e.target.email.value,
        password: e.target.password.value,
      }),
    });
    const data = await res.json();
    if (data.success) alert("Signup successful!");
    else alert(data.message);
  };

  return (
    <form onSubmit={handleSignup}>
      <input type="email" name="email" placeholder="Email" required />
      <input type="password" name="password" placeholder="Password" required />
      <button type="submit">Signup</button>
    </form>
  );
}
