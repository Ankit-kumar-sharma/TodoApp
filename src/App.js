import "./App.css";
import { useState } from "react";
import React, { useEffect } from "react";
import Group from "./Group";
import AddGroupOption from "./AddGroupOption";
import AddGroupBtn from "./AddGroupBtn";
import ShowBtn from "./ShowBtn";
import MessageContainer from "./MessageContainer";

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
    const fetchData = () => {
      const promises = [];
      for (let id = 1; id <= 10; id++) {
        promises.push(
          fetch(`https://jsonplaceholder.typicode.com/todos/${id}`).then(
            (response) => {
              if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
              }
              return response.json();
            }
          )
        );
      }

      Promise.all(promises)
        .then((responses) => {
          setTaskData(responses);
        })
        .catch((error) => {
          console.error("Error fetching todos:", error);
        });
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
    setShowStatus(false);
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
    setInputVisible(true);
    setShowStatus(false);
    if (successStatus === true) {
      setInputVisible(true);
      setSuccessStatus(false);
      return;
    }
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
      setSuccessMsg("");
      setError("Maximum group limit exceeds!!!");
      return;
    }
    if (isNaN(newStart) || isNaN(newEnd)) {
      setError("Start and End must be numbers");
      setSuccessMsg("");
      return;
    }
    if (newStart < 1 || newEnd > 10 || newStart >= newEnd) {
      setError(
        "Invalid range. Start should be less than End and both should be between 1 and 10"
      );
      setSuccessMsg("");
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
        setSuccessMsg(
          "Hurrah all group have been added successfully!! Click Show Status to see the status"
        );
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
      setSuccessMsg(
        "Hurrah all group have been added successfully!! Click Show Status to see the status"
      );
      setInputVisible(false);
      setSuccessStatus(true);
      return;
    }
  };
  const addStartValue = (value) => {
    setStart(value);
  };
  const addEndValue = (value) => {
    setEnd(value);
  };

  return (
    <>
      <div className="container">
        <div className="groupContent">
          <Group
            groups={groups}
            deleteGroup={deleteGroup}
            getSpecificTasksDetail={getSpecificTasksDetail}
            showStatus={showStatus}
          ></Group>
          <AddGroupOption
            isInputVisible={isInputVisible}
            hideInputGroup={hideInputGroup}
            setStartValue={addStartValue}
            setEndValue={addEndValue}
            start={start}
            end={end}
          />
        </div>
        <div className="groupFunctionsContainer">
          <AddGroupBtn
            isGroupLimitExceed={isGroupLimitExceed}
            successStatus={successStatus}
            addGroups={addGroups}
          ></AddGroupBtn>
          <ShowBtn changeShowStatus={changeShowStatus}></ShowBtn>
          <MessageContainer success={success} error={error}></MessageContainer>
        </div>
      </div>
    </>
  );
}
export default App;
