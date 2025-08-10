import React from "react";
import "animate.css";

const Login = () => {
  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        minHeight: "80vh",
        background: "linear-gradient(135deg, #1a1a1a, #2b0052)",
        padding: "20px",
      }}
    >
      <div
        className="card shadow-lg p-4 animate__animated animate__fadeIn"
        style={{
          width: "100%",
          maxWidth: "400px",
          backgroundColor: "#111",
          borderRadius: "15px",
          color: "#fff",
        }}
      >
        <h3 className="text-center mb-4" style={{ color: "#ff4081" }}>
          Iniciar Sesión
        </h3>

        <form>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              placeholder="Ingresa tu correo"
              style={{
                backgroundColor: "#222",
                border: "1px solid #444",
                color: "#fff",
              }}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Contraseña</label>
            <input
              type="password"
              className="form-control"
              placeholder="Ingresa tu contraseña"
              style={{
                backgroundColor: "#222",
                border: "1px solid #444",
                color: "#fff",
              }}
              required
            />
          </div>

          <button
            type="submit"
            className="btn w-100 mt-3"
            style={{
              background:
                "linear-gradient(90deg, #ff4081, #673ab7)",
              border: "none",
              color: "#fff",
              fontWeight: "bold",
              transition: "0.3s",
            }}
            onMouseOver={(e) =>
              (e.target.style.background =
                "linear-gradient(90deg, #673ab7, #ff4081)")
            }
            onMouseOut={(e) =>
              (e.target.style.background =
                "linear-gradient(90deg, #ff4081, #673ab7)")
            }
          >
            Entrar
          </button>
        </form>

        <p className="text-center mt-3 text-secondary" style={{ fontSize: "0.9rem" }}>
          ¿No tienes cuenta? <a href="/register" style={{ color: "#00bcd4" }}>Regístrate aquí</a>
        </p>
      </div>
    </div>
  );
};

export default Login;

