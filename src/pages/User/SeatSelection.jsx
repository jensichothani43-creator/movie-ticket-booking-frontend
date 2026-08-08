import { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";
import Header from "../../components/Header";


export default function SeatSelection() {

  const { id: movieId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
    // ✅ AHIYA MUKO
  const formatTime = (time) => {

    if (!time) return "-";

    if (time.includes("AM") || time.includes("PM")) {
      return time;
    }

    const [hour, minute] = time.split(":");

    const date = new Date();

    date.setHours(Number(hour));
    date.setMinutes(Number(minute));

    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    });

  };



  const [offersList, setOffersList] = useState([]);
  const [offersLoading, setOffersLoading] = useState(true);  
  const { show, screen, date, movie, location: cinemaLocation, address: cinemaAddress } = location.state || {};
  console.log("SHOW DATA:", show);
console.log("SHOW ID:", show?.id);
  const fetchOffers = async () => {

    const res = await api.get(`/offers/movie/${movieId}`);
    return res.data;

  };



  useEffect(() => {

    const loadOffers = async () => {

      try {

        setOffersLoading(true);

        const data = await fetchOffers();

        setOffersList(data || []);


      } catch(err) {

        console.error(err);
        setOffersList([]);

      } finally {

        setOffersLoading(false);

      }

    };


    loadOffers();


  }, []);

const [seatLayout, setSeatLayout] = useState([]);

// Dynamic Seat Allocation
const generateSeats = (totalSeats = 48) => {

  const layout = [];
  const seatsPerRow = 8;

  const rows = Math.ceil(totalSeats / seatsPerRow);

  for(let r = 0; r < rows; r++){

    const rowName = String.fromCharCode(65 + r);

    const rowSeats = [];

    for(let i = 1; i <= seatsPerRow; i++){

     if(layout.flat().length >= totalSeats)
   break;

      rowSeats.push(`${rowName}${i}`);

    }

    layout.push(rowSeats);

  }

  return layout;

};
useEffect(()=>{

  if(screen?.total_seats){

    const layout = generateSeats(screen.total_seats);

    setSeatLayout(layout);

  }

},[screen]);
  const [selectedSeats,setSelectedSeats] = useState([]);
  const [bookedSeats,setBookedSeats] = useState([]);
  const [loading,setLoading] = useState(false);



  const pricePerSeat = show?.price || 10;

  const totalAmount =
    selectedSeats.length * pricePerSeat;




  const normalizeSeats=(data)=>{

    if(!data) return [];


    if(typeof data==="string"){

      return data.split(",").map(s=>s.trim());

    }


    if(Array.isArray(data)){

      return data.map(s=>

        typeof s==="string"
        ? s
        : s.seat || s.seat_number || s.name

      );

    }


    return [];

  };





  useEffect(()=>{


    const fetchBookedSeats=async()=>{

      try{

        if(!show?.id) return;


        const res =
        await api.get(`/bookings/seats/${show.id}`);



        const seats =
        normalizeSeats(res.data?.seats || res.data);



        setBookedSeats(seats);



      }catch(err){

        console.log(err);
        setBookedSeats([]);

      }

    };


    fetchBookedSeats();


  },[show?.id]);






  const toggleSeat=(seat)=>{


    setSelectedSeats(prev=>


      prev.includes(seat)

      ? prev.filter(s=>s!==seat)

      : [...prev,seat]


    );


  };
const handleBook = async () => {
   console.log(
    "TOKEN:",
    localStorage.getItem("token")
  );

  if(!show || !movieId)
    return alert("Missing movie or show info");


  if(selectedSeats.length === 0)
    return alert("Select seats first");


  try {

    setLoading(true);

const totalAmount = selectedSeats.length * Number(show.price);

const res = await api.post(
  "/bookings",
  {
    show_id: show.id,
    movie_id: Number(movieId),
    screen_id: screen?.id,
    seats: selectedSeats.join(","),
    customer_name: "Guest",
    total_amount: totalAmount,
  },
  {
    headers:{
      Authorization:`Bearer ${localStorage.getItem("token")}`
    }
  }
);

    const booking = res.data;


    console.log("BOOKING CREATED:", booking);


    navigate("/payment", {

      state: {

        bookingId: booking.id,

        total: totalAmount,

        screen: screen,

        date: date,

        time: formatTime(show?.show_time),

        seats: selectedSeats,

        movie: movie,

        image: movie?.image

      }

    });


  }
  catch(err){

    console.log(
      "Booking error:",
      err.response?.data || err
    );

    alert("Booking failed");

  }
  finally{

    setLoading(false);

  }

};






return (
<>
  <Header />

  <div style={styles.page}>


{/* extra bottom padding so content never hides behind the floating bar */}
<div style={{
  ...styles.container,
  marginBottom: selectedSeats.length ? "110px" : "0px"
}}>

<div style={styles.header}>
  <span style={styles.kicker}>Now Booking</span>
  <h1 style={styles.title}>{movie?.title || "Select Your Seats"}</h1>
</div>


<div style={styles.movieInfo}>

  <div style={styles.infoItem}>
    <span style={styles.infoLabel}>Cinema</span>
    <span style={styles.infoValue}>{cinemaAddress || cinemaLocation || "-"}</span>
  </div>

  <div style={styles.infoDivider} />

  <div style={styles.infoItem}>
    <span style={styles.infoLabel}>Date</span>
    <span style={styles.infoValue}>{date || "-"}</span>
  </div>

  <div style={styles.infoDivider} />

  <div style={styles.infoItem}>
    <span style={styles.infoLabel}>Time</span>
    <span style={styles.infoValue}>{formatTime(show?.show_time)}</span>
  </div>

  <div style={styles.infoDivider} />

  <div style={styles.infoItem}>
    <span style={styles.infoLabel}>Price / Seat</span>
    <span style={styles.infoValue}>₹{pricePerSeat}</span>
  </div>

</div>


<div style={styles.screenWrap}>
  <div style={styles.screen} />
  <span style={styles.screenLabel}>SCREEN THIS WAY</span>
</div>
<div style={styles.seats}>

{
seatLayout.map((rowSeats,index)=>(

<div key={index} style={styles.row}>

<span style={styles.rowLabel}>
{String.fromCharCode(65 + index)}
</span>


<div style={styles.rowSeats}>

{
rowSeats.map((seat)=>(

<button

key={seat}

disabled={bookedSeats.includes(seat)}

onClick={()=>toggleSeat(seat)}

title={seat}

style={{

...styles.seat,

...(selectedSeats.includes(seat)
? styles.selected
:{}
),

...(bookedSeats.includes(seat)
? styles.booked
:{}

)

}}

>

{seat.substring(1)}

</button>

))

}

</div>

</div>

))

}

</div>

<div style={styles.legend}>

<span style={styles.legendItem}><span style={{...styles.legendDot, ...styles.dotAvailable}} /> Available</span>

<span style={styles.legendItem}><span style={{...styles.legendDot, ...styles.dotSelected}} /> Selected</span>

<span style={styles.legendItem}><span style={{...styles.legendDot, ...styles.dotBooked}} /> Booked</span>


</div>


</div>


{/* ---- Floating summary bar: shows automatically once a seat is picked, no scroll needed ---- */}
{
selectedSeats.length > 0 && (

<div style={styles.floatingBar}>

  <div style={styles.summary}>

    <div style={styles.summaryRow}>

      <div style={styles.summaryBlock}>
        <span style={styles.infoLabel}>Seats</span>
        <span style={styles.summarySeats}>
          {selectedSeats.join(", ")}
        </span>
      </div>

      <div style={styles.summaryBlock}>
        <span style={styles.infoLabel}>Total</span>
        <span style={styles.summaryTotal}>₹{totalAmount}</span>
      </div>

    </div>


    <button

    onClick={handleBook}

    disabled={loading || offersLoading}

    style={{
      ...styles.bookBtn,
      ...((loading || offersLoading) ? styles.bookBtnDisabled : {})
    }}


    >


    {

    loading

    ?"Booking..."

    :

    offersLoading

    ?"Loading Offers..."

    :

    `Proceed to Payment · ₹${totalAmount}`


    }



    </button>


  </div>

</div>

)
}


</div>
</>

);

}
const styles={
page:{

minHeight:"100vh",

padding:"48px 20px",

background:
"radial-gradient(circle at 50% 0%, #1a2540 0%, #060912 55%, #030509 100%)",

color:"#e5e9f2",

fontFamily:"'Segoe UI', Arial, sans-serif"

},



container:{

maxWidth:"880px",

margin:"auto",

background:"#0d1424",

padding:"40px",

borderRadius:"22px",

border:"1px solid #1e293b",

boxShadow:"0 25px 60px rgba(0,0,0,.55)",

transition:"margin-bottom .15s ease"

},


header:{

textAlign:"center",

marginBottom:"30px"

},


kicker:{

display:"inline-block",

fontSize:"11px",

letterSpacing:"3px",

textTransform:"uppercase",

color:"#f59e0b",

fontWeight:700,

marginBottom:"8px"

},



title:{

fontSize:"30px",

fontWeight:700,

margin:0,

color:"#f8fafc"

},



movieInfo:{

display:"flex",

justifyContent:"space-between",

flexWrap:"wrap",

gap:"14px",

background:"#141e33",

padding:"20px 24px",

borderRadius:"16px",

marginBottom:"36px"

},


infoItem:{

display:"flex",

flexDirection:"column",

gap:"4px",

minWidth:"110px"

},


infoLabel:{

fontSize:"11px",

letterSpacing:"1px",

textTransform:"uppercase",

color:"#7c8aad"

},


infoValue:{

fontSize:"15px",

fontWeight:600,

color:"#f1f5f9"

},


infoDivider:{

width:"1px",

background:"#263353",

alignSelf:"stretch"

},


screenWrap:{

display:"flex",

flexDirection:"column",

alignItems:"center",

marginBottom:"38px"

},



screen:{

width:"75%",

height:"10px",

margin:"0 auto",

background:"linear-gradient(90deg, transparent, #94a3b8, transparent)",

borderRadius:"50%",

boxShadow:"0 0 35px 6px rgba(148,163,184,.45)"

},


screenLabel:{

marginTop:"14px",

fontSize:"11px",

letterSpacing:"4px",

color:"#7c8aad",

fontWeight:600

},



seats:{

display:"flex",

flexDirection:"column",

alignItems:"center",

gap:"8px"

},



row:{

display:"flex",

alignItems:"center",

gap:"14px"

},


rowLabel:{

width:"16px",

fontSize:"12px",

fontWeight:700,

color:"#7c8aad",

textAlign:"center"

},


rowSeats:{

display:"flex",

gap:"10px"

},



seat:{

width:"36px",

height:"36px",

borderRadius:"8px 8px 4px 4px",

border:"1px solid #2a3652",

background:"#1a2438",

color:"#cbd5e1",

fontSize:"12px",

fontWeight:600,

cursor:"pointer",

transition:"all .15s ease"

},



selected:{

background:"#22c55e",

borderColor:"#22c55e",

color:"#06210f",

transform:"scale(1.08)",

boxShadow:"0 0 14px rgba(34,197,94,.55)"

},



booked:{

background:"#3f1d24",

borderColor:"#5c2530",

color:"#f87171",

cursor:"not-allowed",

opacity:.7

},



legend:{

display:"flex",

justifyContent:"center",

gap:"28px",

margin:"32px 0 8px"

},


legendItem:{

display:"flex",

alignItems:"center",

gap:"8px",

fontSize:"13px",

color:"#a8b3cc"

},


legendDot:{

width:"12px",

height:"12px",

borderRadius:"4px",

display:"inline-block"

},


dotAvailable:{

background:"#1a2438",

border:"1px solid #2a3652"

},


dotSelected:{

background:"#22c55e"

},


dotBooked:{

background:"#3f1d24",

border:"1px solid #5c2530"

},


// ---- floating footer wrapper ----
floatingBar:{

position:"fixed",

left:0,

right:0,

bottom:0,

display:"flex",

justifyContent:"center",

padding:"16px 20px",

background:"linear-gradient(to top, rgba(3,5,9,.98), rgba(3,5,9,.92) 70%, rgba(3,5,9,0))",

zIndex:50,

animation:"none"

},


summary:{

width:"100%",

maxWidth:"840px",

background:"#141e33",

padding:"18px 22px",

borderRadius:"16px",

boxShadow:"0 -10px 30px rgba(0,0,0,.4)",

border:"1px solid #263353"

},


summaryRow:{

display:"flex",

justifyContent:"space-between",

alignItems:"flex-start",

gap:"16px",

flexWrap:"wrap",

marginBottom:"14px"

},


summaryBlock:{

display:"flex",

flexDirection:"column",

gap:"4px"

},


summarySeats:{

fontSize:"14px",

fontWeight:600,

color:"#f1f5f9",

maxWidth:"320px"

},


summaryTotal:{

fontSize:"22px",

fontWeight:800,

color:"#f59e0b"

},



bookBtn:{

width:"100%",

padding:"16px",

borderRadius:"12px",

border:"none",

background:"linear-gradient(135deg,#2563eb,#1d4ed8)",

color:"white",

fontSize:"16px",

fontWeight:700,

cursor:"pointer",

letterSpacing:".3px",

transition:"opacity .15s ease"

},


bookBtnDisabled:{

opacity:.6,

cursor:"not-allowed"

}



};