import React, { useEffect, useState } from "react";

export default function OrganizationDashboard() {

const [stores,setStores]=useState([]);

useEffect(()=>{

const headNumber =
localStorage.getItem(
"organizationHeadNumber"
);

fetch(
`${process.env.REACT_APP_API_URL}/api/owner/organization-stores/${headNumber}`
)

.then(res=>res.json())

.then(data=>{

setStores(data);

})

.catch(err=>{

console.log(err);

});

},[]);


return(

<div style={styles.container}>

<h1>
Organization Dashboard
</h1>

<div style={styles.cardContainer}>

<div style={styles.card}>
<h3>Total Owners</h3>
<p>{stores.length}</p>
</div>

<div style={styles.card}>
<h3>Stores</h3>
<p>{stores.length}</p>
</div>

<div style={styles.card}>
<h3>Subscriptions</h3>
<p>View Only</p>
</div>

<div style={styles.card}>
<h3>Approval Status</h3>
<p>View Only</p>
</div>

</div>


<h2 style={{
marginTop:"30px"
}}>
Laundry Stores
</h2>


{
stores.length===0 ?

(
<p>
No stores found
</p>
)

:

stores.map((item,index)=>(

<div
key={index}
style={styles.storeCard}
>

<h3>
{item.shop_name}
</h3>

<p>
Owner :
{item.owner_name}
</p>

<p>
Mobile :
{item.mobile}
</p>

<p>
Status :
{item.status}
</p>

</div>

))
}


<div style={styles.note}>

Edit ❌ <br/>
Delete ❌ <br/>
Settings ❌ <br/>

</div>

</div>

);

}

const styles={

container:{
padding:"30px"
},

cardContainer:{
display:"flex",
gap:"20px",
flexWrap:"wrap"
},

card:{
width:"220px",
padding:"20px",
border:"1px solid #ddd",
borderRadius:"10px"
},

storeCard:{
marginTop:"15px",
padding:"15px",
border:"1px solid #ddd",
borderRadius:"10px"
},

note:{
marginTop:"30px",
fontSize:"18px"
}

};