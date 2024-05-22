import React from "react";
import { MdDelete } from "react-icons/md";
import { FaArrowRightLong } from "react-icons/fa6";
import { IoCheckmarkCircleSharp } from "react-icons/io5";
function Group(props) {
  return (
    <>
      {props.groups.map((group, index) => (
        <div
          key={index}
          className="groupContainerParent"
          id={`groupIndex-${index}`}
        >
          <div className="groupContainer">
            <div className="deleteIconContainer">
              <button
                className="deleteBtn"
                onClick={(event) => props.deleteGroup(event)}
                id={`deleteBtnIndex-${index}`}
              >
                <span className="deleteBtnSpan">
                  <MdDelete id={`deleteBtn-${index}`} />
                </span>
              </button>
            </div>
            <div className="groupInfoDiv">
              <div className="groupName">
                <p>Group {index + 1}</p>
              </div>
              <div className="startTaskNumber">
                <input
                  type="number"
                  name="startTaskNumber"
                  id={`startInputGroupNumber-${index}`}
                  value={group.start}
                  disabled
                ></input>
              </div>
              <div className="arrowIcon">
                <FaArrowRightLong />
              </div>
              <div className="endTaskNumber">
                <input
                  type="number"
                  name="endTaskNumber"
                  id={`endInputGroupNumber-${index}`}
                  value={group.end}
                  disabled
                ></input>
              </div>
            </div>
            <div className="taskStatusInfoContainer">
              {props.showStatus ? (
                <>
                  {props
                    .getSpecificTasksDetail(group.start - 1, group.end - 1)
                    .map((task) => (
                      <p key={task.id}>
                        {task.id}){task.completed ? "true" : "false"}
                      </p>
                    ))}
                </>
              ) : null}
              <div className="checkIconContainer">
                <IoCheckmarkCircleSharp />
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
export default Group;
