import React from "react";

export default function PaymentFailed(){

 return(
   <div>
     <h1>❌ Payment Failed</h1>
     <p>Your payment was declined.</p>

     <button onClick={()=>{
       window.location.href="/payment-failed";
     }}>
       Try Again
     </button>

   </div>
 )

}