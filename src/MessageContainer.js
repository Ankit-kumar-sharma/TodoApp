import React from "react";
function MessageContainer(props) {
  return (
    <>
      <div className="errorMessageContainer">
        <p className="errorMessage">{props.error}</p>
        <p className="successMessage">{props.success}</p>
      </div>
    </>
  );
}
export default MessageContainer;
