import React from "react";
function ShowStatusBtn(props) {
  return (
    <>
      <div className="showStatusContainer">
        <button className="showStatusBtn" onClick={props.changeShowStatus}>
          Show Status
        </button>
      </div>
    </>
  );
}
export default ShowStatusBtn;
