import React, { useState } from "react";

export default function UploadQRCode({ owner, token, onUploaded }) {
  const [preview, setPreview] = useState(null);

  function handleFile(e) {
    const f = e.target.files[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = () => setPreview(r.result);
    r.readAsDataURL(f);
  }

  async function upload() {
    if (!preview) return alert("Choose a QR image (PNG)");
    const res = await fetch("https://api.neocleanhubs.com/api/owner/upload-qr", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ qrCodeDataUrl: preview })
    });
    if (res.ok) {
      alert("QR uploaded");
      onUploaded();
      setPreview(null);
    } else {
      const data = await res.json();
      alert("Error: " + (data.message || "upload failed"));
    }
  }

  return (
    <div style={{ border: "1px solid #ddd", padding: 16, borderRadius: 8 }}>
      <h3>Upload / Replace QR</h3>
      <input type="file" accept="image/*" onChange={handleFile} />
      {preview && <div style={{ marginTop: 8 }}>
        <img src={preview} alt="preview" style={{ width: 160, height:160, objectFit:"contain", border:"1px solid #eee" }} />
      </div>}
      <div style={{ marginTop: 8 }}>
        <button onClick={upload}>Upload QR</button>
      </div>
    </div>
  );
}
