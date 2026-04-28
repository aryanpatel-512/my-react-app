import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav style={styles.nav}>
      <h2 style={styles.logo}>Sri Srinivasa Clean Rooms</h2>

      <div style={styles.links}>
        <Link to="/">Home</Link>
        <Link to="/products">Products</Link>
        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>
      </div>

      <button style={styles.btn}>Login</button>
    </nav>
  );
}

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px 50px",
    background: "#0f766e",
    color: "white"
  },

  logo: {
    margin: 0,
    fontSize: "24px"
  },

  links: {
    display: "flex",
    gap: "25px"
  },

  btn: {
    padding: "10px 20px",
    border: "none",
    background: "white",
    color: "#0f766e",
    cursor: "pointer",
    fontWeight: "bold"
  }
}

export default Navbar