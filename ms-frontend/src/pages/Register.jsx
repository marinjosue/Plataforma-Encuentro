import React from "react";
import "animate.css";

const Register = () => {
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
          maxWidth: "450px",
          backgroundColor: "#111",
          borderRadius: "15px",
          color: "#fff",
        }}
      >
        <h3 className="text-center mb-4" style={{ color: "#00bcd4" }}>
          Crear Cuenta
        </h3>

        <form>
          <div className="mb-3">
            <label className="form-label">Nombre completo</label>
            <input
              type="text"
              className="form-control"
              placeholder="Ingresa tu nombre"
              style={{
                backgroundColor: "#222",
                border: "1px solid #444",
                color: "#fff",
              }}
              required
            />
          </div>

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
              placeholder="Crea una contraseña"
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
                "linear-gradient(90deg, #00bcd4, #673ab7)",
              border: "none",
              color: "#fff",
              fontWeight: "bold",
              transition: "0.3s",
            }}
            onMouseOver={(e) =>
              (e.target.style.background =
                "linear-gradient(90deg, #673ab7, #00bcd4)")
            }
            onMouseOut={(e) =>
              (e.target.style.background =
                "linear-gradient(90deg, #00bcd4, #673ab7)")
            }
          >
            Crear cuenta
          </button>
        </form>

        <p
          className="text-center mt-3 text-secondary"
          style={{ fontSize: "0.9rem" }}
        >
          ¿Ya tienes cuenta?{" "}
          <a href="/login" style={{ color: "#ff4081" }}>
            Inicia sesión
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
