import React, {useState} from 'react';

const useForm = (defaults, callback) => {
  const [formValues, setFormValues] = useState(defaults);
  
  const handleFormSubmit = (event) => {
    if (event) {
      event.preventDefault();
    }
    callback();
  }

    // later - look at using immutability helper
  const handleFormChange = (event) => {
    event.persist();
    let value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
     setFormValues(formValues => ({...formValues, [event.target.name]:value}));
    
  }

  return {handleFormSubmit, handleFormChange, formValues};

}

export default useForm;