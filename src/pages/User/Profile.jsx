import { useEffect, useState } from "react";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";

export default function Profile(){

  const [user,setUser] = useState(null);
  const navigate = useNavigate();


  useEffect(()=>{

    const token = localStorage.getItem("token");

    if(!token){
      navigate("/login");
      return;
    }


    api.get("/me",{
      headers:{
        Authorization:`Bearer ${token}`
      }
    })
    .then(res=>{
      setUser(res.data);
    })
    .catch(err=>{
      console.log(err);
      localStorage.removeItem("token");
      navigate("/login");
    });


  },[]);



  if(!user){
    return <h2>Loading...</h2>
  }


  return(

    <div style={styles.container}>

      <div style={styles.card}>

        <h1>👤 My Profile</h1>


        <div style={styles.item}>
          <b>Name:</b>
          <span>{user.name}</span>
        </div>


        <div style={styles.item}>
          <b>Email:</b>
          <span>{user.email}</span>
        </div>


        <div style={styles.item}>
          <b>Mobile:</b>
          <span>{user.mobile || "Not Added"}</span>
        </div>


        <button
          onClick={()=>{
            localStorage.removeItem("token");
            navigate("/login");
          }}
          style={styles.button}
        >
          Logout
        </button>


      </div>

    </div>

  )

}



const styles={

container:{
 height:"100vh",
 display:"flex",
 justifyContent:"center",
 alignItems:"center",
 background:"#0f172a"
},


card:{
 width:"400px",
 padding:"30px",
 borderRadius:"15px",
 background:"#1e293b",
 color:"white"
},


item:{
 display:"flex",
 justifyContent:"space-between",
 margin:"15px 0"
},


button:{
 width:"100%",
 padding:"12px",
 marginTop:"20px",
 background:"#ef4444",
 color:"white",
 border:"none",
 borderRadius:"8px",
 cursor:"pointer"
}

}