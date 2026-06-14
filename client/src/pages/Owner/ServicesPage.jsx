import React, { useState, useEffect, useRef } from "react";
import "./style/ServicesPage.css";

export default function ServicesPage({ owner, token }) {

  const BASE_URL = process.env.REACT_APP_API_URL || "https://api.neocleanhubs.com";

  const emptyForm = {
    title: "",
    category: "",
    pricingType: "perKg",
    pricePerKg: "",
    itemPrices: [{ item: "", price: "" }],
    desc: "",
    imageUrl: "",
     gst: ""
  };

  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [services, setServices] = useState([]);
  const fileInputRef = useRef(null);

  /* LOAD SERVICES */
  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/owner/services`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();
      setServices(data.services || []);

    } catch (err) {
      console.error("Load services error:", err);
    }
  };

  /* IMAGE UPLOAD */
  const handleImage = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  setForm({
    ...form,
    imageFile: file,
    imageUrl: URL.createObjectURL(file)
  });
};

  /* VALIDATION */
  const validate = () => {

    if (!form.title.trim())
      return alert("Service name is required");

    if (!form.imageFile && !form.imageUrl)
      return alert("Service image is required");

    if (form.pricingType === "perKg") {
      if (!form.pricePerKg)
        return alert("Price per KG is required");
    }

    if (form.pricingType === "perItem") {
      for (let p of form.itemPrices) {
        if (!p.item || !p.price)
          return alert("Item name & price are required");
      }
    }

    return true;
  };

  /* SAVE SERVICE */
  const saveService = async () => {

    if (!validate()) return;

    const action = editingId ? "edit" : "add";

    const payload = editingId
      ? { ...form, id: editingId }
      : form;

    const formData = new FormData();

formData.append("image", form.imageFile);
formData.append("action", action);
formData.append("service", JSON.stringify(payload));

const res = await fetch(`${BASE_URL}/api/owner/services`, {
  method: "POST",
  headers: {
    Authorization: `Bearer ${token}`
  },
  body: formData
});

    if (!res.ok) {
      return alert("Error saving service");
    }

    alert(
  editingId
    ? "Service updated successfully!"
    : "Service added successfully!"
);

    setForm(emptyForm);
setEditingId(null);

if (fileInputRef.current) {
  fileInputRef.current.value = "";
}

fetchServices();
  };

  /* EDIT */
  const editService = (s) => {

    setEditingId(s.id);

    setForm({
      title: s.title,
      category: s.category || "",
      pricingType: s.pricingType,
      pricePerKg: s.pricePerKg || "",
      itemPrices: s.itemPrices?.length
        ? s.itemPrices
        : [{ item: "", price: "" }],
      desc: s.desc || "",
      imageUrl: s.imageUrl || "",
       gst: s.gst || ""  
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* DELETE */
  const deleteService = async (id) => {

    if (!window.confirm("Delete this service?")) return;

    await fetch(`${BASE_URL}/api/owner/services`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        action: "delete",
        service: { id }
      })
    });
    alert("Service deleted successfully!");

    fetchServices();
  };

  return (
    <div className="services-container">

      <h3>{editingId ? "Edit Service" : "Add Service"}</h3>

      <div className="form-card">

        <input
          placeholder="Service Name *"
          value={form.title}
          onChange={(e) =>
            setForm({ ...form, title: e.target.value })
          }
        />

        {/* ✅ CATEGORY */}
        <input
          placeholder="Category (e.g. Wash, Iron)"
          value={form.category}
          onChange={(e) =>
            setForm({ ...form, category: e.target.value })
          }
        />

        <select
          value={form.pricingType}
          onChange={(e) =>
            setForm({ ...form, pricingType: e.target.value })
          }
        >
          <option value="perKg">Per KG</option>
          <option value="perItem">Per Item</option>
        </select>

        {form.pricingType === "perKg" && (
          <input
  type="number"
  min="0"
  placeholder="Price per KG *"
  value={form.pricePerKg}
  onChange={(e) =>
    setForm({ ...form, pricePerKg: e.target.value })
  }
/>
        )}

        {form.pricingType === "perItem" &&
          form.itemPrices.map((p, i) => (
            <div key={i} className="item-row">
              <input
                placeholder="Item Name"
                value={p.item}
                onChange={(e) => {
                  const items = [...form.itemPrices];
                  items[i].item = e.target.value;
                  setForm({ ...form, itemPrices: items });
                }}
              />

              <input
  type="number"
  min="0"
  placeholder="Price"
  value={p.price}
  onChange={(e) => {
    const items = [...form.itemPrices];
    items[i].price = e.target.value;
    setForm({ ...form, itemPrices: items });
  }}
/>
            </div>
          ))}

        {form.pricingType === "perItem" && (
          <button
            className="btn-secondary"
            onClick={() =>
              setForm({
                ...form,
                itemPrices: [
                  ...form.itemPrices,
                  { item: "", price: "" }
                ]
              })
            }
          >
            + Add Item
          </button>
        )}

        <textarea
          placeholder="Description"
          
          value={form.desc}
          onChange={(e) =>
            setForm({ ...form, desc: e.target.value })
          }
        />
        <input
  type="number"
  placeholder="GST % (e.g. 18)"
  value={form.gst}
  onChange={(e) =>
    setForm({ ...form, gst: e.target.value })
  }
/>

        <input
  ref={fileInputRef}
  type="file"
  accept="image/*"
  onChange={handleImage}
/>

        {form.imageUrl && (
  <img
    src={
      form.imageUrl.startsWith("blob:")
        ? form.imageUrl
        : `${BASE_URL}/${form.imageUrl}`
    }
    alt="preview"
    className="preview-img"
  />
)}
        <button className="btn-primary" onClick={saveService}>
          {editingId ? "Update Service" : "Add Service"}
        </button>

      </div>

      <h3>Existing Services</h3>

      <div className="services-grid">

        {services.map((s) => (
          <div key={s.id} className="service-card">

            <img src={`${BASE_URL}/${s.imageUrl}`} alt="" />

            <h4>{s.title}</h4>
            <p><b>{s.category}</b></p>
            <p>{s.desc}</p>
            { s.gst > 0 && (
  <p>GST: {s.gst}%</p>
)}

            {s.pricingType === "perKg" && (
              <p>
  ₹{s.pricePerKg} + {s.gst}% GST = ₹
{(
  Number(s.pricePerKg) +
  (Number(s.pricePerKg) * Number(s.gst) / 100)
).toFixed(2)} / KG
</p>
            )}

            {s.pricingType === "perItem" &&
              s.itemPrices?.map((p, i) => (
                <p key={i}>
                  {p.item} – ₹{p.price} + {s.gst}% = ₹
{(
  Number(p.price) +
  (Number(p.price) * Number(s.gst) / 100)
).toFixed(2)}
                </p>
              ))}

            <div className="card-actions">
              <button onClick={() => editService(s)}>Edit</button>
              <button className="danger" onClick={() => deleteService(s.id)}>
                Delete
              </button>
            </div>

          </div>
        ))}

      </div>

    </div>
  );
}