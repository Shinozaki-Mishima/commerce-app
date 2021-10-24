import React, { useEffect, useState } from "react";
import { Paper, Step, Stepper, StepLabel, Typography, CircularProgress, Divider, Button, CssBaseline } from "@material-ui/core";
//import styles
import useStyles from "./checkout-styles";
// import forms
import AddressForm from "../AddressForm";
import PaymentForm from "../PaymentForm";
// import api
import { commerce } from "../../../lib/commerce";
import { Link, useHistory } from "react-router-dom";

const STEPS = ["Shipping address", "Payment details"];

const Checkout = ({ cart, incomingOrder, onCaptureCheckout, error }) => {
  const [checkoutToken, setCheckoutToken] = useState(null);
  const [activeStep, setActiveStep] = useState(0);
  const [shippingData, setShippingData] = useState({});
  const [isFinished, setIsFinished] = useState(false);
  const classes = useStyles();
  const history = useHistory();

  // use useEffect to generate the token as soon as a user enters the checkout process
  useEffect(() => {
    if (cart.id) {
      // can not use async in the useEffect function itself, so we need to create a seperate function
      const generateToken = async () => {
        try {
          const token = await commerce.checkout.generateToken(cart.id, {
            type: "cart",
          });
          //console.log(token)
          // set the checkout token
          setCheckoutToken(token);
        } catch (error) {
            if (activeStep !== STEPS.length) history.push('/');
        }
      };
      generateToken();
    }
  }, [cart]);

  function nextStep() {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  }

  function backStep() {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  }

  function next(data) {
    setShippingData(data);
    nextStep();
  }

  const timeout = () => {
      setTimeout(() => {
          setIsFinished(true);
      }, 3000);
  }

  // confirmation 'component'
  let Confirmation = () => incomingOrder.customer ? (
    <>
    <div>
      <Typography variant="h5">Thank you for your purchase.</Typography>
      <Divider className={classes.divider} />
    </div>
      <br />
      <Button component={Link} to="/" variant="outlined" type="button">Back To Home Page.</Button> 
  </>
  ) : (
      <div className={classes.spinner}>
          <CircularProgress />
      </div>
  );

  if(error) {
      Confirmation = () => (
      <>
          <Typography variant="h5">Thank you for your purchase.</Typography>
          <br />
          <Button component={Link} to="/" variant="outlined" type="button">Back To Home Page.</Button>
      </>
      )
  }

  // return something based on which step we're currently on
  // if currently on active step that is = 0, then show the address form, else show the payment form
  const Form = () =>
    activeStep === 0 ? (
      <AddressForm checkoutToken={checkoutToken} next={next} />
    ) : (
      <PaymentForm
        shippingData={shippingData}
        checkoutToken={checkoutToken}
        nextStep={nextStep}
        backStep={backStep}
        onCaptureCheckout={onCaptureCheckout}
        timeout={timeout}
      />
    );

  // render jsx --> useEffect --> Re:render

  return (
    <>
      <CssBaseline />
      <div className={classes.toolbar} />
      <main className={classes.layout}>
        <Paper className={classes.paper}>
          <Typography variant="h4" align="center">
            Checkout
          </Typography>
          <Stepper activeStep={activeStep} className={classes.stepper}>
            {STEPS.map((step) => (
              <Step key={step}>
                <StepLabel>{step}</StepLabel>
              </Step>
            ))}
          </Stepper>
          {/*
            the address form depended the token, so we need to add one more check to show the form.
            if we have the checkout token, only then render the form 
        */}
          {activeStep === STEPS.length ? (
            <Confirmation />
          ) : (
            checkoutToken && <Form />
          )}
        </Paper>
      </main>
    </>
  );
};

export default Checkout;
