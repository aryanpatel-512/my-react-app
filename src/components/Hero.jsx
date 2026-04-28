function Hero() {
  return (
    <section style={styles.hero}>
      <div>
        <h1 style={styles.heading}>
          Precision Medical Furniture & Clean Room Solutions
        </h1>

        <p style={styles.text}>
          We manufacture hospital beds, trolleys, lockers, ICU furniture,
          modular clean rooms and healthcare infrastructure.
        </p>

        <button style={styles.btn}>View Products</button>
      </div>
    </section>
  )
}

const styles = {
  hero: {
    padding: "100px 60px",
    background: "#f8fafc",
    minHeight: "80vh",
    display: "flex",
    alignItems: "center"
  },

  heading: {
    fontSize: "52px",
    maxWidth: "750px",
    marginBottom: "20px"
  },

  text: {
    fontSize: "18px",
    maxWidth: "650px",
    lineHeight: "1.6"
  },

  btn: {
    marginTop: "30px",
    padding: "14px 28px",
    border: "none",
    background: "#0f766e",
    color: "white",
    fontSize: "16px",
    cursor: "pointer"
  }
}

export default Hero