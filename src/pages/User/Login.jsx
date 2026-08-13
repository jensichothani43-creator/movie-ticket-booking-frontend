import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../services/api";

export default function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();


  // Token hoy to direct home
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      navigate("/home");
    }
  }, [navigate]);



  const login = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await api.post("/login", {
        email,
        password
      });
      console.log("LOGIN RESPONSE:", response.data);


      // save JWT token
      localStorage.setItem("token",response.data.access_token);
    
      // save user role
localStorage.setItem(
  "role",
  response.data.role
);

// save user email
localStorage.setItem(
  "email",
  email
);

// save user id
localStorage.setItem(
  "user_id",
  response.data.user_id
);

console.log("SAVED EMAIL:", email);
console.log("TOKEN:", response.data.access_token);
console.log("USER ID:", response.data.user_id);


      navigate("/home");


    } catch(error) {

      console.log("FULL ERROR:", error);
      console.log("Response:", error.response);
      console.log("Message:", error.message);

     const detail = error.response?.data?.detail;

setMsg(
  Array.isArray(detail)
    ? detail.map((item) => item.msg).join(", ")
    : typeof detail === "string"
      ? detail
      : "Login Failed"
);
    } finally {
      setLoading(false);
    }
  };



  return (
    <div style={styles.container}>

      <div style={styles.overlay}></div>
      <div style={styles.glow}></div>


      <div style={styles.card}>

       


        <p style={styles.subtitle}>
          Sign in to continue
        </p>



        <form 
          onSubmit={login} 
          style={styles.form}
        >


          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            style={styles.input}
          />



          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            style={styles.input}
          />



          <button
            type="submit"
            disabled={loading}
            style={styles.button}
          >
            {
              loading 
              ? "Logging In..."
              : "Login"
            }
          </button>


        </form>



        {
          msg && 
          <p style={styles.msg}>
            {msg}
          </p>
        }



        <p style={styles.signupText}>
          Don't have an account?{" "}

          <Link 
            to="/register"
            style={styles.signupLink}
          >
            Sign up
          </Link>

        </p>


      </div>

    </div>
  );
}




const styles = {

  container: {
    height:"100vh",
    display:"flex",
    justifyContent:"center",
    alignItems:"center",
    fontFamily:"Segoe UI",
    position:"relative",

    backgroundImage:
    "url('https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?auto=format&fit=crop&w=1600&q=80')",

    backgroundSize:"cover",
    backgroundPosition:"center",
  },


  overlay:{
    position:"absolute",
    inset:0,
    background:"rgba(0,0,0,0.85)",
  },


  glow:{
    position:"absolute",
    width:"400px",
    height:"400px",
    background:"rgba(56,189,248,0.3)",
    filter:"blur(120px)",
    top:"-100px",
    left:"-100px",
    borderRadius:"50%",
  },


  card:{
    position:"relative",
    width:"420px",
    padding:"40px",
    borderRadius:"16px",
    background:"rgba(15,23,42,0.85)",
    backdropFilter:"blur(20px)",
    border:"1px solid rgba(255,255,255,0.1)",
    zIndex:10,
    textAlign:"center",
  },


  logo:{
    color:"#38bdf8",
    fontSize:"26px",
    fontWeight:"800",
    marginBottom:"10px",
  },


  subtitle:{
    color:"#94a3b8",
    fontSize:"14px",
    marginBottom:"20px",
  },


  form:{
    display:"flex",
    flexDirection:"column",
    gap:"15px",
  },


  input:{
    padding:"12px",
    borderRadius:"10px",
    border:"1px solid #334155",
    background:"#0f172a",
    color:"white",
    outline:"none",
  },


  button:{
    width:"100%",
    padding:"16px",
    borderRadius:"12px",
    border:"none",
    background:"linear-gradient(135deg,#38bdf8,#2563eb)",
    color:"white",
    fontWeight:"700",
    fontSize:"18px",
    cursor:"pointer",
  },


  msg:{
    marginTop:"20px",
    color:"#fca5a5",
  },


  signupText:{
    marginTop:"16px",
    color:"#94a3b8",
  },


  signupLink:{
    color:"#38bdf8",
    fontWeight:"700",
    textDecoration:"none",
  }

};