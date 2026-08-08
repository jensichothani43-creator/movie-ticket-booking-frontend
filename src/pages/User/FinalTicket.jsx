import React from "react";
import { FaCheckCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function FinalTicket() {

  const navigate = useNavigate();

  const ticketData =
    JSON.parse(localStorage.getItem("ticketData")) || {};


  


  const {
    bookingId,
    total,
    discount,
    finalAmount,
    screen,
    date,
    time,
    seats,
    image,
    movie_image,
    movieImage,
    poster,
    movie,
    movie_name
  } = ticketData;



  const posterImage =
    image ||
    movie_image ||
    movieImage ||
    poster ||
    movie?.image ||
    "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba";


  console.log("POSTER IMAGE:", posterImage);



  const ticket = {
    bookingId,
    total,
    discount,
    finalAmount,
    screen,
    date,
    time,
    seats,
    image: posterImage,
    movie_name
  };



  if (!bookingId) {

    return (

      <div style={styles.noTicket}>

        <h2>❌ No Ticket Found</h2>

        <button
          style={styles.homeBtn}
          onClick={()=>navigate("/")}
        >
          Go Home
        </button>

      </div>

    );

  }




  const handleDownload =()=>{

    const blob = new Blob(
      [JSON.stringify(ticket,null,2)],
      {
        type:"application/json"
      }
    );


    const url = URL.createObjectURL(blob);

    const a=document.createElement("a");

    a.href=url;

    a.download="ticket.json";

    a.click();


    URL.revokeObjectURL(url);

  };






  const handleShare = async()=>{


    const text =
`🎬 Movie Ticket

Movie: ${movie_name || "Movie"}

Screen: ${screen?.name || screen}

Date: ${date}

Time: ${time}

Seats: ${seats}

Amount: ₹${finalAmount || total}

Booking ID: ${bookingId}`;



    if(navigator.share){

      try{

        await navigator.share({
          title:"Movie Ticket",
          text
        });

        return;

      }
      catch{}

    }



    window.open(
      `https://wa.me/?text=${encodeURIComponent(text)}`,
      "_blank"
    );

  };







return (

<div

style={{

...styles.page,

backgroundImage:
`
linear-gradient(
rgba(0,0,0,.80),
rgba(0,0,0,.95)
),
url(${posterImage})
`

}}

>


<div style={styles.card}>


<h2 style={styles.title}>

<FaCheckCircle style={styles.icon}/>

Booking Confirmed

</h2>



<p style={styles.subtitle}>
🎬 Enjoy your movie!
</p>



<div style={styles.ticketBox}>


<h2 style={styles.movie}>
{movie_name || "Movie Ticket"}
</h2>



<div style={styles.row}>
<span>Screen</span>
<b>{screen?.name || screen}</b>
</div>



<div style={styles.row}>
<span>Date</span>
<b>{date}</b>
</div>



<div style={styles.row}>
<span>Time</span>
<b>{time}</b>
</div>



<div style={styles.row}>
<span>Seats</span>
<b>{seats}</b>
</div>



<div style={styles.row}>
<span>Amount</span>
<b>₹{finalAmount || total}</b>
</div>



<div style={styles.row}>
<span>Booking ID</span>
<b>#{bookingId}</b>
</div>



</div>





<div style={styles.actions}>


<button
style={styles.download}
onClick={handleDownload}
>
⬇ Download
</button>



<button
style={styles.share}
onClick={handleShare}
>
🔗 Share
</button>




<button
style={styles.myBooking}
onClick={()=>navigate("/my-bookings")}
>
📖 My Bookings
</button>




<button
style={styles.home}
onClick={()=>navigate("/")}
>
🏠 Home
</button>



</div>



</div>


</div>

);

}
const styles={

page:{
  minHeight:"100vh",

  display:"flex",
  justifyContent:"center",
  alignItems:"center",

  padding:"40px",

  backgroundSize:"cover",
  backgroundPosition:"center",
  backgroundRepeat:"no-repeat",
},

card:{
width:"100%",
maxWidth:"450px",
padding:"30px",
borderRadius:"25px",
background:"rgba(15,23,42,.88)",
backdropFilter:"blur(15px)",
color:"white",
boxShadow:"0 20px 50px rgba(0,0,0,.8)"
},
title:{
textAlign:"center",
fontSize:"32px"
},


icon:{
color:"#22c55e",
marginRight:"10px"
},


subtitle:{
textAlign:"center",
color:"#cbd5e1"
},


ticketBox:{
marginTop:"25px",
background:"rgba(255,255,255,.08)",
padding:"20px",
borderRadius:"15px"
},


movie:{
textAlign:"center"
},


row:{
display:"flex",
justifyContent:"space-between",
padding:"12px 0",
borderBottom:"1px solid rgba(255,255,255,.15)"
},


actions:{
display:"flex",
flexDirection:"column",
gap:"12px",
marginTop:"25px"
},


download:{
padding:"13px",
background:"#2563eb",
color:"white",
border:0,
borderRadius:"10px"
},


share:{
padding:"13px",
background:"#16a34a",
color:"white",
border:0,
borderRadius:"10px"
},


myBooking:{
padding:"13px",
background:"#7c3aed",
color:"white",
border:0,
borderRadius:"10px"
},


home:{
padding:"13px",
background:"transparent",
color:"white",
border:"1px solid #64748b",
borderRadius:"10px"
},


noTicket:{
height:"100vh",
background:"#020617",
color:"white",
display:"flex",
justifyContent:"center",
alignItems:"center",
flexDirection:"column"
},


homeBtn:{
padding:"12px 30px",
background:"#2563eb",
color:"white",
border:0,
borderRadius:"10px"
}

};