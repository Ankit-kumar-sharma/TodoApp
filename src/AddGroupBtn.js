import React from "react";
import { FaPlus } from "react-icons/fa";
function AddGroupBtn(props){
    return(<>
            <div className="addGroupBtnContainer">
            {props.isGroupLimitExceed === false || props.successStatus === false ? (
              <button className="addGroupBtn" onClick={props.addGroups}>
                <FaPlus color="blue" /> Add Group
              </button>
            ) : null}
          </div>
    </>);
}
export default AddGroupBtn;