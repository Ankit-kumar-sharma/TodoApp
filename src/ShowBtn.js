import React from "react";
function ShowStatusBtn(props) {
  return (
    <>{
      props.isShowButtonVisible?<div className="showStatusContainer">
        <button className="showStatusBtn" onClick={props.changeShowStatus}>
          Show Status
        </button>
      </div>:null
    }
    </>
  );
}
export default ShowStatusBtn;
