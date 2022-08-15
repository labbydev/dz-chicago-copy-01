import { useState } from "react";
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';

const CheckoutForm = () => {
  const [succeeded, setSucceeded] = useState(false);
  const [paypalErrorMessage, setPaypalErrorMessage] = useState("");
  const [orderID, setOrderID] = useState(0);
  const [billingDetails, setBillingDetails] = useState("");
  const orderDescription = 'Membership  Tea Ticket';

  const availableOptions = [
    {
      title: "Member Ticket",
      price: 70.00
    },
    {
      title: "Diamond Member Ticket",
      price: 49.00
    }
  ];

  const [itemOptions, setItemOptions] = useState(availableOptions[0]);

  const createOrder = (data, actions) => {

    const price = parseFloat(itemOptions.price).toString();
    const description = itemOptions.title;

    const request = {
      purchase_units: [{
        description: orderDescription,
        amount: {
          currency_code: 'USD',
          value: price
        }
      }],
      items: [{
        name: description,
        unit_amount: {
          currency_code: 'USD',
          value: price,
        },
        quantity: 1
      }]
    };

    return actions.order.create(request)
    .then((orderID) => {
      setOrderID(orderID);
      return orderID;
    });
  };

  const onApprove = (data, actions) => {
    return actions.order.capture().then(function (details){
      const {payer} = details;
      setBillingDetails(payer);
      setSucceeded(true);
    })
  };

  const onError = (data, actions) => {
    setPaypalErrorMessage("Something went wrong with your payment")
  };

  const handleChange = (event) => {
    setItemOptions(availableOptions[event.target.selectedIndex]);
  }
  
  return (
   <div id="smart-button-container" className="container text-center items-center justify-center">
     <div className="items-center justify-center py-4">
       <h2>Membership  Tea Ticket</h2>
       <select id="item-options" onChange={handleChange}>
         {availableOptions.map((object, i) => <option key={i}>{object.title} - ${object.price}</option>)}
       </select>
     </div>
     <PayPalScriptProvider options={{
            "client-id": "AQB-Evp78boBotKxXEHRznHL626_10LNylGcPP1_VzlJicRdVgEp263YPSKnGzUr5AJEXQoBC8VmDMS_",
    }}>
      <PayPalButtons
          style={{
            color: "white",
            shape: "rect",
            layout: "vertical",
            label: "checkout",
          }}
          forceReRender={[itemOptions]}
          createOrder={createOrder}
          onApprove={onApprove}
          onError={onError}
        />
      </PayPalScriptProvider>
      {paypalErrorMessage && (
        <p className="text-red-600">{paypalErrorMessage}</p>
      )}

      {succeeded && <p className="text-green-600">Thank you!</p>}
   </div>
  );
};

export default CheckoutForm;