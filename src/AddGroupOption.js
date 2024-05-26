import React from "react";
import { MdDelete } from "react-icons/md";
import { FaArrowRightLong } from "react-icons/fa6";
function AddGroupOption(props) {
  return (
    <>
      {props.isInputVisible ? (
        <div className="groupContainerParent" id="groupInputContainerField">
          <div className="groupContainer">
            <div className="deleteIconContainer">
              <button
                className="deleteBtn"
                onClick={props.hideInputGroup}
                id="deleteBtnIndex"
              >
                <span className="deleteBtnSpan">
                  <MdDelete />
                </span>
              </button>
            </div>
            <div className="groupInfoDiv">
              <div className="groupName">
                <p>Group {props.groupIndex+1}</p>
              </div>
              <div className="startTaskNumber">
                <input
                  type="number"
                  name="startTaskNumber"
                  id="startInputGroupIndex"
                  value={props.start}
                  onChange={(e) => props.setStartValue(e.target.value)}
                ></input>
              </div>
              <div className="arrowIcon">
                <FaArrowRightLong />
              </div>
              <div className="endTaskNumber">
                <input
                  type="number"
                  name="endTaskNumber"
                  id="endInputGroupNumber"
                  value={props.end}
                  onChange={(e) => props.setEndValue(e.target.value)}
                ></input>
              </div>
            </div>
            <div className="taskStatusInfoContainer"></div>
          </div>
        </div>
      ) : null}
    </>
  );
}
export default AddGroupOption;
