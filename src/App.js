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
  const [isInputVisible, setInputVisible] = useState(false);
  const [taskData, setTaskData] = useState([]);
  const [count, setCount] = useState(0);
  const [isAddOptionVisible, setAddOptionVisible] = useState(true);
  const [isShowButtonVisible, setIsShowButtonVisible] = useState(true);

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
    const addDefaultValue = () => {
      let data = [{ start: 1, end: 10 }];
      setGroups(data);
    };

    fetchData();
    addDefaultValue();
  }, []);

  const getSpecificTasksDetail = (start, end) => {
    if (start >= 0 && end < taskData.length && start <= end) {
      return taskData.slice(start, end + 1);
    }
    return [];
  };

  const deleteGroup = (e) => {
    setSuccessMsg("");
    setError("");
    setAddOptionVisible(true);
    setShowStatus(false);
    let deleteBtn = e.target;
    let groupId = deleteBtn.id.split("-");
    let index = groupId[1];
    let allData = [...groups];
    allData.splice(index, 1);
    setGroups(allData);
    let allGroups = [...allData];
    if (allGroups.length === 0) {
      setIsShowButtonVisible(false);
    }
    allGroups.sort((a, b) => a.start - b.start);
    for (let i = 0; i < allGroups.length - 1; i++) {
      if (allGroups[i].end + 1 !== allGroups[i + 1].start) {
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
    const newStart = parseInt(start, 10);
    const newEnd = parseInt(end, 10);
    const newGroup = { start: newStart, end: newEnd };
    const allGroups = [...groups, newGroup];
    allGroups.sort((a, b) => a.start - b.start);
    if (count === 0 && groups[groups.length - 1] !== undefined) {
      let lastValidGroupEnd = groups[groups.length - 1].end;
      if (lastValidGroupEnd === newEnd) {
        let allData = [...groups];
        allData.splice(0, 1);
        setGroups(allData);
        setInputVisible(true);
        setCount(1);
        return;
      }
    }
    setInputVisible(true);
    setShowStatus(false);
    if (successStatus === true) {
      setInputVisible(true);
      setSuccessStatus(false);
      return;
    }
    if (groups.length === 0 && isInputVisible === false) {
      setInputVisible(true);
      return;
    }
    if (
      groups.length === 0 &&
      (newStart < 1 || newStart > 1) &&
      newEnd === 10
    ) {
      setError("Groups do not cover the entire range from 1 to 10!!!");
      setInputVisible(true);
      setSuccessMsg("");
      return;
    }
    if (isNaN(newStart) || isNaN(newEnd)) {
      setError("Start and End can't be empty and must be numbers");
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
    for (let i = 0; i < allGroups.length - 1; i++) {
      if (allGroups[i].end + 1 !== allGroups[i + 1].start) {
        setSuccessMsg("");
        setError("Groups have gaps or overlap");
        setInputVisible(true);
        return;
      }
    }
    setGroups(allGroups);
    setIsShowButtonVisible(true);
    setStart("");
    setEnd("");
    setError("");

    for (let g = 0; g < allGroups.length; g++) {
      if (allGroups[g].end === 10) {
        if (
          allGroups.length >= 1 &&
          allGroups[0] !== null &&
          allGroups[0] !== undefined &&
          (allGroups[0].start !== 1 ||
            allGroups[allGroups.length - 1].end !== 10)
        ) {
          setError("Groups do not cover the entire range from 1 to 10");
          setSuccessMsg("");
          setInputVisible(true);
          return;
        }
        setInputVisible(false);
        setAddOptionVisible(false);
        setSuccessStatus(true);
        setSuccessMsg(
          "Hurrah all group have been added successfully!! Click Show Status to see the status"
        );
      }
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
          {isAddOptionVisible ? (
            <AddGroupBtn
              isGroupLimitExceed={isGroupLimitExceed}
              successStatus={successStatus}
              addGroups={addGroups}
            ></AddGroupBtn>
          ) : null}
          <ShowBtn
            changeShowStatus={changeShowStatus}
            isShowButtonVisible={isShowButtonVisible}
          ></ShowBtn>
          <MessageContainer success={success} error={error}></MessageContainer>
        </div>
      </div>
    </>
  );
}
export default App;
