import React, { useEffect, useState } from "react";
import { InputLabel, Select, MenuItem, Button, Grid, Typography } from "@material-ui/core";
import { useForm, FormProvider } from "react-hook-form";

import { commerce } from "../../lib/commerce";

import FormInput from "./CustomTextField";
import { Link } from "react-router-dom";

const AddressForm = ({ checkoutToken, next }) => {
  // state management
  const [shippingCountries, setShippingCountries] = useState([]);
  const [shippingCountry, setShippingCountry] = useState("");
  const [shippingSubdivisions, setShippingSubdivisions] = useState([]);
  const [shippingSubdivision, setShippingSubdivision] = useState("");
  const [shippingOptions, setShippingOptions] = useState([]);
  const [shippingOption, setShippingOption] = useState("");

  // get the methods we need to run the form
  const method = useForm();

  // convert object of countries, subdivision to a 2d array, then map to convert to a normal array 
  // return an array with objects that have the id and label 
  const countries = Object.entries(shippingCountries).map(([code, name]) => ({id: code, label: name}));
  const subdivisions = Object.entries(shippingSubdivisions).map(([code, name]) => ({id: code, label: name}));
  // shippingOptions are an arr by default 
  const options = shippingOptions.map((sOption) => ({ id: sOption.id, label: `${sOption.description} - (${sOption.price.formatted_with_symbol})` }));

  // fetch the shipping details from the commerce js api
  // also need to create the token before we call the fetch function
  const fetchShippingCountries = async (checkout_token_id) => {
    // get the response, to get the list of countries
    const { countries } = await commerce.services.localeListShippingCountries(checkout_token_id);

    // set shipping countries
    setShippingCountries(countries);
    // get the 1st element in the object by setting the individual country
    // Object.keys(countries) --> [AL, AT, BA]
    setShippingCountry(Object.keys(countries)[0])
  };

  // fetch subdivision
  const fetchSubdivisions = async (countryCode) => {
      const { subdivisions } = await commerce.services.localeListSubdivisions(countryCode);

      setShippingSubdivisions(subdivisions);
      setShippingSubdivision(Object.keys(subdivisions)[0])
   }

   // fetch shipping options
   const fetchShippingOptions = async (checkout_token_id, country, region = null) => {
       const options = await commerce.checkout.getShippingOptions(checkout_token_id, { country, region });

       setShippingOptions(options);
       setShippingOption(options[0].id);
   }

  // run the fetch func immediately when rendered
  useEffect(() => {
    //console.log(checkoutToken.id)
    fetchShippingCountries(checkoutToken.id);
  }, []);

  // whenever the shipping coultry changes, call fetchSubdivisions
  useEffect(() => {
      if(shippingCountry) {
        fetchSubdivisions(shippingCountry);
      }
  }, [shippingCountry])

  // run once the shipping subdivision changes
  useEffect(() => {
      if(shippingSubdivision) {
          fetchShippingOptions(checkoutToken.id, shippingCountry, shippingSubdivision)
      }
  }, [shippingSubdivision])

  return (
    <>
      <Typography variant="h6" gutterBottom>
        Shipping Address
      </Typography>
      <FormProvider {...method}>
        <form onSubmit={method.handleSubmit((data) => next({ ...data, shippingCountry, shippingSubdivision, shippingOption }))}>
          <Grid container spacing={3}>
            <FormInput required name="firstName" label="First Name" />
            <FormInput required name="lastName" label="Last Name" />
            <FormInput required name="address1" label="Address" />
            <FormInput required name="email" label="Email" />
            <FormInput required name="city" label="City" />
            <FormInput required name="zip" label="Postal/ZIP Code" />
            <Grid item xs={12} sm={6}>
                <InputLabel>Shipping Country</InputLabel>
                <Select value={shippingCountry} fullWidth onChange={(e) => setShippingCountry(e.target.value)}>
                    {countries.map((country) => (
                        <MenuItem key={country.id} value={country.id}>
                            {country.label}
                        </MenuItem>
                    ))}
                </Select>
            </Grid>
            <Grid item xs={12} sm={6}>
                <InputLabel>Shipping Subdivision</InputLabel>
                <Select value={shippingSubdivision} fullWidth onChange={(e) => setShippingSubdivision(e.target.value)}>
                    {subdivisions.map((subdivision) => (
                        <MenuItem key={subdivision.id} value={subdivision.id}>
                            {subdivision.label}
                        </MenuItem>
                    ))}
                </Select>
            </Grid>
            <Grid item xs={12} sm={6}>
                <InputLabel>Shipping Options</InputLabel>
                <Select value={shippingOption} fullWidth onChange={(e) => setShippingOption(e.target.value)}>
                {options.map((option) => (
                    <MenuItem key={option.id} value={option.id}>
                        {option.label}
                    </MenuItem>
                ))}
                </Select>
            </Grid>
          </Grid>
          <br />
          <div style={{display: 'flex', justifyContent: 'space-between'}}>
              <Button component={Link} to="/cart" variant="outlined">Back to Cart</Button>
              <Button type='submit' variant="contained" color='primary'>Next</Button>
          </div>
        </form>
      </FormProvider>
    </>
  );
};

export default AddressForm;
