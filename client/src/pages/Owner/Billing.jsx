import React, { useEffect, useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "./style/Billing.css";

const BASE_URL = process.env.REACT_APP_API_URL;

export default function Billing({ ownerId, owner }) {

  const [bookings, setBookings] = useState([]);
  const [selected, setSelected] = useState(null);

  const [services, setServices] = useState([]);
  const [billGenerated, setBillGenerated] = useState(false);

  // ✅ PER BOOKING STATE
  const [serviceState, setServiceState] = useState({});

  const [extraMap, setExtraMap] = useState({});
  const [discountMap, setDiscountMap] = useState({});

  // =========================================
  // LOAD DATA
  // =========================================

  useEffect(() => {
    if (ownerId) {
      fetchBookings();
      fetchServices();
    }
  }, [ownerId]);

  const fetchServices = async () => {
    try {
      const res = await fetch(
        `${BASE_URL}/api/customer/owner/${ownerId}/services`
      );

      const data = await res.json();

      setServices(data.services || data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchBookings = async () => {
    try {
      const res = await fetch(
        `${BASE_URL}/api/booking/owner/${ownerId}`
      );

      const data = await res.json();

     const billingBookings = data.bookings.filter((b) => {
  return (
    (b.pickupType === "self" &&
      (b.status === "accepted" ||
       b.status === "completed")) ||

    (b.pickupType === "door" &&
      (b.status === "processing" ||
       b.status === "delivered"))
  );
});

setBookings(billingBookings);


      

    } catch (err) {
      console.error(err);
    }
  };

  // =========================================
  // GENERATE BILL
  // =========================================

  const generateBill = async () => {

    if (!selected) {
      alert("Select booking");
      return;
    }

    try {

      const res = await fetch(
        `${BASE_URL}/api/billing/generate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({

            bookingId: selected.bookingId,

            extraCharges:
              Number(extraMap[selected.bookingId] || 0),

            discount:
              Number(discountMap[selected.bookingId] || 0),

            extraServices:
              serviceState[selected.bookingId]?.extraServices || []

          }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        alert("Bill generated ✅");
        setBillGenerated(true);
      } else {
        alert(data.message || "Error");
      }

    } catch (err) {
      console.error(err);
      alert("Server Error");
    }
  };

  // =========================================
  // PDF
  // =========================================

  const downloadPDF = async () => {

    const element = document.getElementById("invoice");

    const canvas = await html2canvas(element);

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF();

    pdf.addImage(imgData, "PNG", 10, 10, 180, 0);

    pdf.save("invoice.pdf");
  };

  return (
    <div className="billing-container">

      <h2>Billing</h2>

      <h3>Completed Orders</h3>

      {bookings.map((b) => {

        // =========================================
        // CURRENT STATE
        // =========================================

        const currentService =
          serviceState[b.bookingId] || {};

        const subtotal =
          Number(b.totalPrice || 0);

        const serviceTotal =
  currentService.selectedService
    ? (() => {

        if (currentService.selectedService.pricingType === "perKg") {

          const price =
            Number(currentService.selectedService.pricePerKg || 0);

          const gst =
            Number(currentService.selectedService.gst || 0);

          const finalPrice =
            price + (price * gst / 100);

          return (
            Number(currentService.inputValue || 0) *
            finalPrice
          );
        }

        const itemPrice =
          Number(
            currentService.selectedService.itemPrices?.[
              currentService.selectedItemKey
            ]?.price || 0
          );

        const gst =
          Number(currentService.selectedService.gst || 0);

        const finalPrice =
          itemPrice + (itemPrice * gst / 100);

        return (
          Number(currentService.inputValue || 0) *
          finalPrice
        );

      })()
    : 0;

        const extraServiceTotal =
          (currentService.extraServices || []).reduce(
            (sum, s) => sum + Number(s.total),
            0
          );

        const discountAmount =
          (discountMap[b.bookingId] || 0) > 0
            ? (
                subtotal *
                (discountMap[b.bookingId] || 0)
              ) / 100
            : 0;

        const final =
          subtotal +
          Number(extraMap[b.bookingId] || 0) +
          extraServiceTotal -
          discountAmount;

        return (

          <div
            key={b.bookingId}
            className={`billing-card ${
              selected?.bookingId === b.bookingId
                ? "active"
                : ""
            }`}
            onClick={async () => {

              setSelected(b);

              try {

                const res = await fetch(
                  `${BASE_URL}/api/billing/check/${b.bookingId}`
                );

                const data = await res.json();

                setBillGenerated(data.exists);
                

                if (data.exists) {
  setServiceState({
    ...serviceState,
    [b.bookingId]: {
      ...serviceState[b.bookingId],
      extraServices: (() => {
        const arr = Array.isArray(data.bill?.items)
          ? data.bill.items
          : typeof data.bill?.items === "string"
          ? JSON.parse(data.bill.items)
          : [];

        return arr
          .filter(x => x.quantity || x.qty)
          .map(x => ({
            name: x.serviceName || x.name,
            qty: x.quantity || x.qty,
            total: Number(x.total || 0)
          }));
      })()
    }
  });
}

                if(data.bill){

setExtraMap({
...extraMap,
[b.bookingId]:data.bill.extra_charges
});

setDiscountMap({
...discountMap,
[b.bookingId]:data.bill.discount
});

}

              } catch (err) {
                console.error(err);
              }
            }}
          >

            <p>
              <b>Customer:</b> {b.customerName}
            </p>

<p>
  <b>Total:</b> ₹{Number(final).toFixed(1)}
</p>

            {/* ========================================= */}
            {/* INVOICE */}
            {/* ========================================= */}

            {selected?.bookingId === b.bookingId && (

              <div
                id="invoice"
                className="invoice-box"
              >

                <h4>Invoice</h4>

                <p>
                  <b>Customer:</b> {b.customerName}
                </p>

                <p>
                  <b>Booking ID:</b> {b.bookingId}
                </p>

                <p>
                  <b>GSTIN:</b> {owner?.gstin || "N/A"}
                </p>

                <p>
                  <b>Address:</b> {owner?.address || "N/A"}
                </p>

                <hr />

                {/* ========================================= */}
                {/* ORIGINAL ITEMS */}
                {/* ========================================= */}

                {(() => {

                  let items = [];

                  try {

                    items =
                      Array.isArray(b.items)
                        ? b.items
                        : typeof b.items === "string"
                        ? JSON.parse(b.items)
                        : [];

                  } catch {
                    items = [];
                  }

                  return items.map((item, i) => {

                    const pricePerKg =
  Number(item.pricePerKg || item.price_per_kg || 0);

const gst =
  Number(item.gst || 0);

const displayPrice =
  pricePerKg + (pricePerKg * gst / 100);

const total =
  item.weight
    ? Number(item.weight) * displayPrice
    : Number(item.total || 0);

                    return (
                      <div key={i}>

                        <p>
                          {item.serviceName}
                        </p>

                        {item.weight && (
  <p>
    {item.weight} kg × ₹
    {displayPrice.toFixed(2)}
  </p>
)}
                        {item.quantity && (
                          <p>
                            {item.quantity} × ₹
                            {item.price}
                          </p>
                        )}

                        <p>
  Total: ₹{Number(total).toFixed(2)}
</p>

                      </div>
                    );
                  });
                })()}

                <hr />

                {/* ========================================= */}
                {/* SERVICE DROPDOWN */}
                {/* ========================================= */}

                <label>Add Extra Service</label>

                <br />

                <select
                  onChange={(e) => {

                    const service =
                      services.find(
                        (s) =>
                          String(s.id) === e.target.value
                      );

                    setServiceState(prev => ({
  ...prev,
  [b.bookingId]: {
    ...prev[b.bookingId],
    selectedService: service,
    inputValue: 0,
    selectedItemKey: ""
  }
}));
                  }}
                >

                  <option value="">
                    Select
                  </option>

                  {services.map((s) => (

                    <option
                      key={s.id}
                      value={s.id}
                    >
                      {s.title}
                    </option>

                  ))}
                </select>

                {/* ========================================= */}
                {/* INPUT */}
                {/* ========================================= */}

                {currentService.selectedService && (

                  <div>

                    {currentService.selectedService.pricingType === "perKg" ? (

                      <>
                        <label>Weight (kg)</label>

                        <input
                          type="number"
                          value={currentService.inputValue || 0}
                          onChange={(e) => {

                            setServiceState({

                              ...serviceState,

                              [b.bookingId]: {

                                ...serviceState[b.bookingId],

                                inputValue:
                                  Number(e.target.value)
                              }
                            });
                          }}
                        />
                      </>

                    ) : (

                      <>
                        <label>Quantity</label>

                        <input
                          type="number"
                          value={currentService.inputValue || 0}
                          onChange={(e) => {

                            setServiceState({

                              ...serviceState,

                              [b.bookingId]: {

                                ...serviceState[b.bookingId],

                                inputValue:
                                  Number(e.target.value)
                              }
                            });
                          }}
                        />
                      </>
                    )}
                  </div>
                )}

                {/* ========================================= */}
                {/* ITEM SELECT */}
                {/* ========================================= */}

                {currentService.selectedService &&
                  currentService.selectedService.pricingType !== "perKg" && (

                  <div>

                    <label>Select Item</label>

                    <select
                      onChange={(e) => {

                        setServiceState({

                          ...serviceState,

                          [b.bookingId]: {

                            ...serviceState[b.bookingId],

                            selectedItemKey:
                              e.target.value
                          }
                        });
                      }}
                    >

                      <option value="">
                        Select Item
                      </option>

                      {(currentService.selectedService.itemPrices || []).map(
                        (obj, index) => (

                          <option
                            key={index}
                            value={index}
                          >
                            {obj.item} - ₹{obj.price}
                          </option>
                        )
                      )}
                    </select>

                  </div>
                )}

                {/* ========================================= */}
                {/* ADD SERVICE */}
                {/* ========================================= */}

                {currentService.selectedService && (

                  <>

                    <p>
                      <b>Extra:</b>{" "}
                      {currentService.selectedService.title}
                    </p>

                    <p>
  Total: ₹{Number(serviceTotal).toFixed(2)}
</p>

                    <button
                      className="btn btn-add"
                      onClick={(e) => {
                        e.stopPropagation();

                        const newService = {

                          name:
                            currentService.selectedService.title,

                          qty:
                            currentService.inputValue,

                          total:
                            serviceTotal
                        };

                        setServiceState(prev => ({
  ...prev,
  [b.bookingId]: {
    ...prev[b.bookingId],
    extraServices: [
      ...(prev[b.bookingId]?.extraServices || []),
      newService
    ],
    selectedService: null,
    inputValue: 0,
    selectedItemKey: ""
  }
}));
                      }}
                    >
                      Add Service
                    </button>

                  </>
                )}

                <hr />
{/* ========================================= */}
{/* EXTRA SERVICES */}
{/* ========================================= */}

{(currentService.extraServices || []).map((s, i) => (

  <div
    key={i}
    style={{
      border: "1px solid #ddd",
      padding: "10px",
      marginBottom: "10px",
      borderRadius: "8px"
    }}
  >

    <p><b>{s.name}</b></p>

    <p>
      Qty: {s.qty}
    </p>

    <p>
      Total: ₹{Number(s.total).toFixed(2)}
    </p>

    <button
      type="button"
      className="btn btn-danger"
      onClick={(e) => {
        e.stopPropagation();

        const updatedServices =
          [...(currentService.extraServices || [])];

        updatedServices.splice(i, 1);

        setServiceState(prev => ({
  ...prev,
  [b.bookingId]: {
    ...prev[b.bookingId],
    extraServices: updatedServices
  }
}));
      }}
    >
      Remove
    </button>

  </div>

))}

                {/* ========================================= */}
                {/* EXTRA */}
                {/* ========================================= */}

               <p>
  <b>Subtotal:</b> ₹{subtotal}
</p>

{b.pickupType === "door" &&
 Number(b.deliveryCharge || 0) > 0 && (
  <p>
    <b>Door Pickup Charge:</b>
    ₹{Number(b.deliveryCharge).toFixed(2)}
  </p>
)}

{!billGenerated && (
  <>
    <label>Extra Charges</label>

    <input
      type="number"
      value={extraMap[b.bookingId] || 0}
      onChange={(e) => {
        setExtraMap({
          ...extraMap,
          [b.bookingId]: e.target.value
        });
      }}
    />
  </>
)}

{Number(extraMap[b.bookingId] || 0) > 0 && (
  <p>
    <b>Extra Charges Added:</b>
    ₹{Number(extraMap[b.bookingId]).toFixed(2)}
  </p>
)}

{!billGenerated && (
  <>
    <label>Discount %</label>

    <input
      type="number"
      value={discountMap[b.bookingId] || 0}
      onChange={(e) => {
        setDiscountMap({
          ...discountMap,
          [b.bookingId]: e.target.value
        });
      }}
    />
  </>
)}

{Number(discountMap[b.bookingId] || 0) > 0 && (
  <p>
    <b>Discount:</b>
    {discountMap[b.bookingId]}%
  </p>
)}

<h3 className="final-amount">
  ₹{Number(final).toFixed(1)}
</h3>
                {/* ========================================= */}
                {/* BUTTON */}
                {/* ========================================= */}

                {!billGenerated ? (

                  <button
                    className="btn btn-generate"
                    onClick={generateBill}
                  >
                    Generate Bill
                  </button>

                ) : (

                  <button
                    className="btn btn-download"
                    onClick={downloadPDF}
                  >
                    Download PDF
                  </button>

                )}

              </div>
            )}

          </div>
        );
      })}
    </div>
  );
}