import { useEffect, useRef, useState } from "react";
import { PayPalButtons } from "@paypal/react-paypal-js";

const CheckoutForm = () => {
  const [succeeded, setSucceeded] = useState(false);
  const [paypalErrorMessage, setPaypalErrorMessage] = useState("");
  const [orderID, setOrderID] = useState(false);
  const [billingDetails, setBillingDetails] = useState("");
  const orderDescription = 'DZ Chicago 2021 Dues';
  // const itemOptions = useRef();
  // const selectedItemDescription = itemOptions.options[itemOptions.selectedIndex].value;
  // const selectedItemPrice = parseFloat(itemOptions.options[itemOptions.selectedIndex].getAttribute("price"));
  // const tax = (0 === 0 || false) ? 0 : (selectedItemPrice * (parseFloat(0)/100));
  // const priceTotal = selectedItemPrice + tax;
  // const itemTotalValue = Math.round((selectedItemPrice * 100) / 100);

  const createOrder = (data, actions) => {
    return actions.order.create({
      purchase_units: [{
        description: 'DZ Chicago Dues',
        amount: {
          currency_code: 'USD',
          value: '100',
          breakdown: {
            item_total: {
              currency_code: 'USD',
              value: '100'
            },
            tax_total: {
              currency_code: 'USD',
              value: tax,
            }
          }
        },
        items: [{
          name: selectedItemDescription,
          unit_amount: {
            currency_code: 'USD',
            value: selectedItemPrice,
          }
        }]
      }]
    })
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

  return (
   <div id="smart-button-container" className="container text-center items-center justify-center">
     <div className="items-center justify-center py-4">
       <h2>DZ Chicago 2021 Dues</h2>
       <select id="item-options">
         <option value="Turtle" price="40">Turtle - $40</option>
         <option value="Rose" price="70">Rose - $70</option>
         <option value="Diamond" price="150">Diamond - $150</option>
       </select>
     </div>
     <PayPalButtons
        style={{
          color: "white",
          shape: "rect",
          layout: "vertical",
          label: "checkout",
        }}
        createOrder={createOrder}
        onApprove={onApprove}
        onError={onError}
      />
      {paypalErrorMessage && (
        <p className="text-red-600">{paypalErrorMessage}</p>
      )}

      {succeeded && <p className="text-green-600">Thank you!</p>}
   </div>
  );
};

export default CheckoutForm;