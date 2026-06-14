import React, { useState } from "react";
import axios from "axios";
import "./style/Subscription.css";

export default function Subscription() {

const API = process.env.REACT_APP_API_URL;

const token = localStorage.getItem("ownerToken");

const owner = token
? {
uniqueID: JSON.parse(
atob(token.split(".")[1])
).ownerID
}
: {};

const [loading,setLoading]=useState(false);

const [selectedPlan,setSelectedPlan]=useState(null);

const loadRazorpay = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";

    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);

    document.body.appendChild(script);
  });
};

const subscription =
JSON.parse(
localStorage.getItem(
"subscription"
)
) || {};


// ================= MANUAL =================

const handleManualPayment = async (
planName,
amount,
months
)=>{

const loaded = await loadRazorpay();

if(!loaded){
  alert("Razorpay Load Failed");
  return;
}

try{

const response=
await axios.post(
`${API}/api/subscription/create-subscription`,
{
ownerId:owner?.uniqueID,
planName,
amount
}
);

const order=response.data.order;

const options={

key:response.data.key,

amount:order.amount,

currency:"INR",

name:"Laundry Management System",

description:
`${planName} Subscription`,

order_id:order.id,

handler:async function(response){

await axios.post(
`${API}/api/subscription/verify-payment`,
{
ownerId:owner?.uniqueID,

razorpay_order_id:
response.razorpay_order_id,

razorpay_payment_id:
response.razorpay_payment_id,

razorpay_signature:
response.razorpay_signature,

planName,
amount,

paymentType:"manual",

months
}
);

alert(
"Subscription Activated"
);

// GET LATEST SUBSCRIPTION
const latestSubscription =
await axios.get(
`${API}/api/subscription/status/${owner.uniqueID}`
);

localStorage.setItem(
"subscription",
JSON.stringify(
latestSubscription.data.data
)
);

window.location.reload();

}

};

new window.Razorpay(
options
).open();

}catch(error){

console.log(error);

alert("Payment Failed");

}

};


// ================= AUTOPAY =================

const handleAutoPay = async(
planName
)=>{

const loaded = await loadRazorpay();

if(!loaded){
  alert("Razorpay Load Failed");
  return;
}

try{

const response=
await axios.post(
`${API}/api/subscription/create-autopay`,
{
ownerId:owner?.uniqueID,
planName
}
);

const sub=
response.data.subscription;

const options={

key:response.data.key,

subscription_id:
sub.id,

name:
"Laundry Management System",

description:
`${planName} AutoPay`,

handler:async function(){

alert(
"AutoPay Activated"
);

// GET LATEST SUBSCRIPTION
const latestSubscription =
await axios.get(
`${API}/api/subscription/status/${owner.uniqueID}`
);

localStorage.setItem(
"subscription",
JSON.stringify(
latestSubscription.data.data
)
);

window.location.reload();

}

};

new window.Razorpay(
options
).open();

}catch(error){

console.log(error);

alert("AutoPay Failed");

}

};



return(

<div className="subscription-container">

<div className="subscription-container">

<h1 className="subscription-title">
Subscription Plans
</h1>

<p className="subscription-subtitle">
Select a plan and payment method
</p>

{subscription?.subscription_status==="active"&&(

<div className="subscription-info">

<h5>
Plan:
{
subscription?.subscription_plan
||
(
subscription?.free_trial_used
?
"Free Trial"
:
"No Active Plan"
)
}
</h5>

<p>
Payment Type:
{
subscription?.payment_type || "manual"
}
</p>

{
subscription?.autopay_status==="active"
&&
(
<div>

<p
style={{
color:"green",
fontWeight:"bold"
}}
>
🟢 AutoPay Active
</p>

<button
className="cancel-btn"
onClick={async()=>{

const confirmCancel =
window.confirm(
"Are you sure you want to cancel AutoPay?"
);

if(!confirmCancel){
return;
}

try{

await axios.post(
`${API}/api/subscription/cancel-autopay`,
{
ownerId:
owner.uniqueID
}
);


// GET LATEST SUBSCRIPTION
const latestSubscription =
await axios.get(
`${API}/api/subscription/status/${owner.uniqueID}`
);

localStorage.setItem(
"subscription",
JSON.stringify(
latestSubscription.data.data
)
);

alert(
"AutoPay Cancelled Successfully"
);

window.location.reload();

}catch(error){

console.log(error);

alert(
"Failed to cancel AutoPay"
);

}

}}

>

Cancel AutoPay

</button>

</div>
)
}

{
subscription?.autopay_status==="cancelled"
&&
(
<div>

<p
style={{
color:"red",
fontWeight:"bold"
}}
>

🔴 AutoPay Cancelled

</p>

</div>
)
}

<p>
Start:
{
subscription?.subscription_start
?
new Date(
subscription.subscription_start
).toLocaleDateString()

:

subscription?.trial_start_date
?
new Date(
subscription.trial_start_date
).toLocaleDateString()

:

"N/A"
}
</p>

<p>
Expiry:
{
subscription?.subscription_end
?
new Date(
subscription.subscription_end
).toLocaleDateString()

:

subscription?.trial_end_date
?
new Date(
subscription.trial_end_date
).toLocaleDateString()

:

"N/A"
}
</p>

</div>

)}

</div>


{selectedPlan&&(

<div className="selected-card">

<h4>

Selected:
{selectedPlan.name}

</h4>

<button
className="manual-btn"
onClick={()=>handleManualPayment(
selectedPlan.name,
selectedPlan.amount,
selectedPlan.months
)}
>

Manual Pay

</button>

<button
className="auto-btn"
onClick={()=>handleAutoPay(
selectedPlan.name
)}
>

AutoPay

</button>

</div>

)}


<div className="row g-4">


<div className="col-md-3">
<div className="plan-card">

<h3>Monthly</h3>
<h1>₹199</h1>

<button
className="plan-select-btn"
onClick={()=>setSelectedPlan({
name:"Monthly",
amount:199,
months:1
})}
>

Select Plan

</button>

</div>
</div>



<div className="col-md-3">
<div className="plan-card">

<h3>3 Months</h3>
<h1>₹549</h1>

<button
className="plan-select-btn"
onClick={()=>setSelectedPlan({
name:"3 Months",
amount:549,
months:3
})}
>

Select Plan

</button>

</div>
</div>



<div className="col-md-3">
<div className="plan-card">

<h3>6 Months</h3>
<h1>₹1049</h1>

<button
className="plan-select-btn"
onClick={()=>setSelectedPlan({
name:"6 Months",
amount:1049,
months:6
})}
>

Select Plan

</button>

</div>
</div>



<div className="col-md-3">
<div className="plan-card">

<h3>Yearly</h3>
<h1>₹1999</h1>

<button
className="plan-select-btn"
onClick={()=>setSelectedPlan({
name:"Yearly",
amount:1999,
months:12
})}
>

Select Plan

</button>

</div>
</div>

</div>

</div>

);

}