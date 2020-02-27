import React, { useState, useEffect } from 'react'
import { withFormik, Form, Field } from 'formik';
import * as Yup from "yup";
import axios from 'axios';

const UserForm = ({ values, touched, errors, status }) => {

  const [users, setUser] = useState([])

  useEffect(() => {
    console.log('Status has changed', status);
    status && setUser(users => [...users, status])
  },[status])

  return (
    <div id="onboard-form">
      <Form autoComplete="off">
        <label htmlFor="name"> Name:<br />
          <Field id="name" type="text" name="name" placeholder="Your name" />
          {touched.name && errors.name && (<p className="errors">{errors.name}</p>)}
        </label><br />

        <label htmlFor="email"> Email:<br />
          <Field id="email" type="text" name="email" placeholder="Your email" />
          {touched.email && errors.email && (<p className="errors">{errors.email}</p>)}
        </label><br />

        <label htmlFor="password"> Password:<br />
          <Field id="password" type="text" name="password" placeholder="Your password" />
          {touched.password && errors.password && (<p className="errors">{errors.password}</p>)}
        </label><br />

        <label htmlFor="tos"> Agree to our Terms of Service:<br />
          <Field checked={values.tos} id="tos" type="checkbox" name="tos"/>
          {touched.tos && errors.tos && (<p className="errors">{errors.tos}</p>)}
        </label><br />

        <button type="submit">Send it.</button>
      </Form>
      <div id="user-deck">
        {users.map(eachuser => (
          <ul id="user-card" key={eachuser.id}>
            <li>Name: {eachuser.name}</li>
            <li>Email: {eachuser.email}</li>
          </ul>
        ))}
      </div>
    </div>
  )
}

const FormikUserForm = withFormik({
  mapPropstoValues(props) {
    return {
      name: props.name || '',
      email: props.email || '',
      password: props.password || '',
      tos: props.tos || false
    }
  },
  validationSchema: Yup.object().shape({
    name: Yup.string().required("Please enter your name."),
    email: Yup.string().required("Please enter an email address."),
    password: Yup.string().required("Please enter a strong password."),
    tos: Yup.boolean().oneOf([true], "You must agree to our Terms of Service.")
  }),
  handleSubmit(values, { setStatus, resetForm }) {
    axios.post("https://reqres.in/api/users", values)
    .then(res => {
      console.log('Successful post request', res);
      setStatus(res.data);
      resetForm();
    })
    .catch(err => console.log('Something is wrong with the post request', err))
  }
})(UserForm);

export default FormikUserForm;