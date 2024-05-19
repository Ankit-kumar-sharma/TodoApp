import "./App.css";
import { MdDelete } from "react-icons/md";
import { FaArrowRightLong } from "react-icons/fa6";
import { IoCheckmarkCircleSharp } from "react-icons/io5";
import { FaPlus } from "react-icons/fa";
import { useState } from "react";
import React, { useEffect } from "react";
import axios from "axios";

function App() {
  const [isGroupLimitExceed, setIsGroupLimitExceed] = useState(false);
  const [showStatus, setShowStatus] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccessMsg] = useState("");
  const [successStatus, setSuccessStatus] = useState(false);
  const [start, setStart] = useState(1);
  const [end, setEnd] = useState(10);
  const [groups, setGroups] = useState([]);
  const [isInputVisible, setInputVisible] = useState(true);
  const [taskData, setTaskData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const promises = [];
        for (let id = 1; id <= 10; id++) {
          promises.push(
            axios.get(`https://jsonplaceholder.typicode.com/todos/${id}`)
          );
        }
        const responses = await Promise.all(promises);
        const responseData = responses.map((response) => response.data);
        setTaskData(responseData);
      } catch (error) {
        console.error("Error fetching todos:", error);
      }
    };
    fetchData();
  }, []);
  const getSpecificTasksDetail = (start, end) => {
    if (start >= 0 && end < taskData.length && start <= end) {
      return taskData.slice(start, end + 1);
    }
    return [];
  };

  const deleteGroup = (e) => {
    setSuccessMsg("");
    let deleteBtn = e.target;
    let groupId = deleteBtn.id.split("-");
    let index = groupId[1];
    let allData = [...groups];
    allData.splice(index, 1);
    setGroups(allData);
    if (groups.length <= 1 || groups.length < 6) {
      setInputVisible(true);
      setIsGroupLimitExceed(false);
      setError("");
    }
    let allGroups = [...allData];
    allGroups.sort((a, b) => a.start - b.start);
    for (let i = 0; i < allGroups.length - 1; i++) {
      if (allGroups[i].end + 1 !== allGroups[i + 1].start) {
        console.log(allGroups[i].end + 1 + " " + allGroups[i + 1].start);
        setSuccessMsg("");
        setError("Groups have gaps or overlap");
        return;
      }
    }
    if (
      allGroups.length >= 1 &&
      allGroups[0] !== null &&
      allGroups[0] !== undefined &&
      (allGroups[0].start !== 1 || allGroups[allGroups.length - 1].end !== 10)
    ) {
      setError("Groups do not cover the entire range from 1 to 10");
      setSuccessMsg("");
      return;
    }
  };
  const hideInputGroup = () => {
    setInputVisible(false);
  };
  const changeShowStatus = () => {
    setShowStatus(true);
  };
  const addGroups = () => {
    if (successStatus === true) {
      return;
    }
    setInputVisible(true);
    const newStart = parseInt(start, 10);
    const newEnd = parseInt(end, 10);
    if (groups.length === 0 && isInputVisible === false) {
      setInputVisible(true);
      return;
    }
    if (groups.length === 0 && (newStart < 1 || newStart > 1)) {
      setError("Groups do not cover the entire range from 1 to 10!!!");
      setSuccessMsg("");
      return;
    }
    if (groups.length > 4) {
      setIsGroupLimitExceed(true);
      setInputVisible(false);
      setError("Maximum group limit exceeds!!!");
      return;
    }
    if (isNaN(newStart) || isNaN(newEnd)) {
      setError("Start and End must be numbers");
      return;
    }
    if (newStart < 1 || newEnd > 10 || newStart >= newEnd) {
      setError(
        "Invalid range. Start should be less than End and both should be between 1 and 10"
      );
      return;
    }
    if (groups[groups.length - 1] !== undefined) {
      let lastValidGroupEnd = groups[groups.length - 1].end;
      if (lastValidGroupEnd + 1 !== newStart) {
        setError("Groups have gaps or overlap");
        setSuccessMsg("");
        return;
      }
      if (lastValidGroupEnd === 10) {
        setSuccessMsg("Hurrah all group have been added successfully!!");
        setInputVisible(false);
        return;
      }
    }
    const newGroup = { start: newStart, end: newEnd };
    const allGroups = [...groups, newGroup];
    setGroups(allGroups);
    setStart("");
    setEnd("");
    setError("");
    if (newEnd === 10) {
      setSuccessMsg("Hurrah all group have been added successfully!!");
      setInputVisible(false);
      setSuccessStatus(true);
      return;
    }
  };
  return (
    <>
      <div className="container">
        <div className="groupContent">
          {groups.map((group, index) => (
            <div
              key={index}
              className="groupContainerParent"
              id={`groupIndex-${index}`}
            >
              <div className="groupContainer">
                <div className="deleteIconContainer">
                  <button
                    className="deleteBtn"
                    onClick={(event) => deleteGroup(event)}
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
                  {showStatus ? (
                    <>
                      {getSpecificTasksDetail(
                        group.start - 1,
                        group.end - 1
                      ).map((task) => (
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
          {isInputVisible ? (
            <div className="groupContainerParent" id="groupInputContainerField">
              <div className="groupContainer">
                <div className="deleteIconContainer">
                  <button
                    className="deleteBtn"
                    onClick={hideInputGroup}
                    id="deleteBtnIndex"
                  >
                    <span className="deleteBtnSpan">
                      <MdDelete />
                    </span>
                  </button>
                </div>
                <div className="groupInfoDiv">
                  <div className="groupName">
                    <p>Add Group</p>
                  </div>
                  <div className="startTaskNumber">
                    <input
                      type="number"
                      name="startTaskNumber"
                      id="startInputGroupIndex"
                      value={start}
                      onChange={(e) => setStart(e.target.value)}
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
                      value={end}
                      onChange={(e) => setEnd(e.target.value)}
                    ></input>
                  </div>
                </div>
                <div className="taskStatusInfoContainer"></div>
              </div>
            </div>
          ) : null}
        </div>
        <div className="groupFunctionsContainer">
          <div className="addGroupBtnContainer">
            {isGroupLimitExceed === false || successStatus === false ? (
              <button className="addGroupBtn" onClick={addGroups}>
                <FaPlus color="blue" /> Add Group
              </button>
            ) : null}
          </div>
          <div className="showStatusContainer">
            <button className="showStatusBtn" onClick={changeShowStatus}>
              Show Status
            </button>
          </div>
          <div className="errorMessageContainer">
            <p className="errorMessage">{error}</p>
            <p className="successMessage">{success}</p>
          </div>
        </div>
      </div>
    </>
  );
}
export default App;
