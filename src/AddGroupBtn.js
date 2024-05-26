import React from "react";
import { FaPlus } from "react-icons/fa";
function AddGroupBtn(props){
    return(<>
            <div className="addGroupBtnContainer">
              <button className="addGroupBtn" onClick={props.addGroups}>
                <FaPlus color="blue" /> Add Group
              </button>
          </div>
    </>);
}
export default AddGroupBtn;