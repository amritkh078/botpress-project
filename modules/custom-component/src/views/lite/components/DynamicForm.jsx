import React, { useState, useEffect } from 'react'

export const DynamicForm = props => {
  const [fields, setFields] = useState([])
  const [inputValues, setInputValues] = useState({})
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async e => {
    e.preventDefault()
    if (fields.length > 0) {
      setIsSubmitted(true)
      const confirm = window.confirm(`This would be sent to the configured endpoint: ${props.endpoint}`)
      if (confirm) {
        await props.bp.axios.post('/mod/custom-component/test-end-point', {
          endpoint: props.endpoint,
          inputValues: inputValues
        })
      }
    }
  }

  const handleInputChange = (e, field) => {
    setInputValues({
      ...inputValues,
      [field?.name]: e?.target?.value
    })
  }

  const renderInputField = field => {
    switch (field?.type) {
      case 'dropdown':
        return (
          <>
            <select
              name={field?.name}
              id={field?.name}
              onChange={e => handleInputChange(e, field)}
              className="dropdown"
              required={field?.isRequired ? true : false}
            >
              {field?.options?.split(',')?.map((option, index) => {
                return (
                  <option value={option} className="dropdown_option">
                    {option}
                  </option>
                )
              })}
            </select>
          </>
        )
      case 'radio':
        return (
          <>
            <div onChange={e => handleInputChange(e, field)}>
              {field?.options?.split(',')?.map((option, index) => {
                return (
                  <>
                    <input
                      type={field?.type}
                      value={option}
                      name={field?.name}
                      className="input_field_radio"
                      required={field?.isRequired ? true : false}
                    />
                    {option}
                  </>
                )
              })}
            </div>
            <br />
          </>
        )
      case 'checkbox':
        return (
          <>
            <div>
              {field?.options?.split(',')?.map((option, index) => {
                return (
                  <>
                    <input
                      type={field?.type}
                      onChange={e => handleInputChange(e, field)}
                      value={option}
                      name={field?.name}
                      className="input_field_box"
                      required={field?.isRequired ? true : false}
                    />
                    {option}
                  </>
                )
              })}
            </div>
            <br />
          </>
        )
      case 'text':
        return (
          <>
            <input
              name={field?.name}
              id={field?.name}
              type={field?.type}
              className="input_field_type"
              value={inputValues[field?.name] || ''}
              onChange={e => handleInputChange(e, field)}
              required={field?.isRequired ? true : false}
            />
          </>
        )
      case 'textarea':
        return (
          <>
            <textarea
              name={field?.name}
              id={field?.name}
              className="input_field_textarea"
              value={inputValues[field?.name] || ''}
              onChange={e => handleInputChange(e, field)}
              required={field?.isRequired ? true : false}
            />
          </>
        )
      case 'file':
        return (
          <>
            <input
              name={field?.name}
              id={field?.name}
              type={field?.type}
              className="input_field_type"
              value={inputValues[field?.name] || ''}
              onChange={e => handleInputChange(e, field)}
              required={field?.isRequired ? true : false}
            />
          </>
        )
      case 'email':
        return (
          <>
            <input
              name={field?.name}
              id={field?.name}
              type={field?.type}
              className="input_field_type"
              value={inputValues[field?.name] || ''}
              onChange={e => handleInputChange(e, field)}
              required={field?.isRequired ? true : false}
            />
          </>
        )
      case 'password':
        return (
          <>
            <input
              name={field?.name}
              id={field?.name}
              type={field?.type}
              className="input_field_type"
              value={inputValues[field?.name] || ''}
              onChange={e => handleInputChange(e, field)}
              required={field?.isRequired ? true : false}
            />
          </>
        )
      case 'date':
        return (
          <>
            <input
              name={field?.name}
              id={field?.name}
              type={field?.type}
              className="input_field_type"
              value={inputValues[field?.name] || ''}
              onChange={e => handleInputChange(e, field)}
              required={field?.isRequired ? true : false}
            />
          </>
        )

      default:
        return <></>
    }
  }

  const renderForm = () => {
    if (!isSubmitted) {
      return (
        <>
          <form className="form_container">
            <h3 className="form_title">{props.response?.data?.title}</h3>
            {props.response?.data?.input_fields?.map((field, index) => (
              <div className="input_group" key={index}>
                <label htmlFor={field?.name} className="input_field_label">
                  {field?.label}
                </label>

                <br />

                {renderInputField(field)}

                <br />
              </div>
            ))}

            <br />

            <button onClick={handleSubmit} className="form_button" disabled={isSubmitted}>
              Submit
            </button>
          </form>
        </>
      )
    } else {
      return <p>Form submission successful!</p>
    }
  }

  useEffect(() => {
    const filterFields = props.response?.data?.input_fields?.filter(field => field !== undefined)
    setFields(filterFields)
  }, [props])

  useEffect(() => {
    for (const field of fields) {
      setInputValues(prevState => {
        return { ...prevState, [field?.name]: '' }
      })
    }
  }, [fields])

  return renderForm()
}
