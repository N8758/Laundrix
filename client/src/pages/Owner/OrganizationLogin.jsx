import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function OrganizationLogin() {

const navigate = useNavigate();

const [form,setForm]=useState({

organizationName:"",
organizationHeadNumber:""

});

const handleChange=(e)=>{

const {name,value}=e.target;

let finalValue=value;

if(name==="organizationHeadNumber"){
finalValue=value.replace(/\D/g,"");
}

setForm({

...form,
[name]:finalValue

});

};


const login=async()=>{

try{

const res=await fetch(

`${process.env.REACT_APP_API_URL}/api/owner/organization-login`,

{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify(form)

}

);

const data=await res.json();

if(!res.ok){

alert(data.message);
return;

}

localStorage.setItem(
"organizationToken",
data.token
);

localStorage.setItem(
"organizationName",
data.organizationName
);

localStorage.setItem(
"organizationHeadNumber",
data.organizationHeadNumber
);

alert("Login successful");

navigate(
"/organization-dashboard"
);

}catch(error){

console.log(error);

alert("Login failed");

}

};


return(

<div style={styles.container}>

<h2>
Organization Login
</h2>

<input

name="organizationName"
placeholder="Organization Name"
value={form.organizationName}
onChange={handleChange}
style={styles.input}

/>

<input

name="organizationHeadNumber"
placeholder="Organization Head Number"
value={form.organizationHeadNumber}
onChange={handleChange}
style={styles.input}
maxLength={12}

/>

<button
style={styles.button}
onClick={login}
>

Login

</button>

</div>

);

}

const styles={

container:{
width:"400px",
margin:"100px auto",
padding:"20px",
border:"1px solid #ddd",
borderRadius:"10px",
textAlign:"center"
},

input:{
width:"100%",
padding:"10px",
margin:"10px 0"
},

button:{
width:"100%",
padding:"10px",
background:"#3a6ff7",
color:"white",
border:"none",
cursor:"pointer"
}

};