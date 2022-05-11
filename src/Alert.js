import React, { useEffect } from "react";

const Alert = (props) => {
  const { msg, type, handleAlert } = props;

  useEffect(() => {
    const timeout = setTimeout(() => {
      handleAlert();
    }, 3000);
    return () => clearInterval(timeout);
    // We need to invoke the useEffect each time there is a change to the list
  }, [handleAlert]);

  return <p className={`alert alert-${type}`}>{msg}</p>;
};

export default Alert;
