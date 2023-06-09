/* eslint-disable react/prop-types */
import { useState, useRef, Children } from "react";
import { sampleData } from "./helper";
import FolderOpen from "./Icons/FolderOpen";
import FolderClose from "./Icons/FolderClose";
import File from "./Icons/File";
import FileAdd from "./Icons/FileAdd";
import FolderAdd from "./Icons/FolderAdd";
import Delete from "./Icons/Delete";
import './App.css';

const iconMapper = (type) => {
  switch (type) {
    case "file":
      return <File />;
    case "folderOpen":
      return <FolderOpen />;
    case "folderClosed":
      return <FolderClose />;
    default:
      return <FolderClose />;
  }
};
const splitPath = (path) => path.split("/");

function App() {
  const [activeItemId, setActiveItemId] = useState({
    path: "",
    directory: false,
  });
  const [folderData, setFolderData] = useState(sampleData);
  const [renameId, setRenameId] = useState("");
  const [renameText, setRenameText] = useState("");
  const [clickedPath, setClickedPath] = useState("");
  const refPath = useRef();

  const handleRename = (path, event) => {
    if (event.key === "Enter") {
      if (renameText) {
        var i = 1;
        const splitPathArr = splitPath(path);
        let dataToArr = sampleData;
        let findIndex = sampleData.findIndex(
          (id) => id.name === splitPathArr[0]
        );
        dataToArr[findIndex].children.forEach(function iter(a) {
          if (i === splitPathArr.length - 1) {
            if (a.name === splitPathArr[i]) {
              a.name = renameText;
            }
          } else {
            if (a.name === splitPathArr[i]) {
              i += 1;
              a.children.forEach(iter);
            }
          }
        });
        setFolderData(dataToArr);
      }
      event.target.blur();
      setRenameId("");
      setRenameText("");
    }
  };

  const handleDelete = () => {
    var i = 0;
    const splitPathArr = splitPath(activeItemId.path);
    let dataToArr = sampleData;
    dataToArr.forEach(function del(a) {
      if (a.name === splitPathArr[i]) {
        i += 1;
        if (i === splitPathArr.length - 1) {
          a.children.splice(
            a.children.findIndex((item) => item.name === splitPathArr[i]),
            1
          );
          return;
        } else {
          a.children.forEach(del);
        }
      }
    });
    setFolderData(dataToArr);
  };

  const handleAddNew = (type) => {
    var i = 0;
    const splitPathArr = splitPath(activeItemId.path);
    let dataToArr = sampleData;
    dataToArr.forEach(function del(a) {
      if (a.name === splitPathArr[i]) {
        i += 1;
        if (i === splitPathArr.length) {
          a.children.push(
            type === "file"
              ? {
                  name: "new_file.jsx",
                  type: "file",
                }
              : { name: "new Folder", type: "directory", children: [] }
          );
          return;
        } else {
          a.children.forEach(del);
        }
      }
    });
    setFolderData(dataToArr);
  };

  const action = (isDirectory, allowDelete) => {
    return (
      <>
        <div className="mR8">
          {!allowDelete && (
            <span onClick={() => handleDelete()} className="pointer">
              <Delete />
            </span>
          )}
          {isDirectory && (
            <>
              <span
                onClick={() => handleAddNew("file")}
                className="pointer"
              >
                <FileAdd />
              </span>
              <span
                onClick={() => handleAddNew("folder")}
                className="pointer"
              >
                <FolderAdd />
              </span>
            </>
          )}
        </div>
      </>
    );
  };

  const treeRender = (data, index, filePath) => {
    var pathArr;
    if (!filePath) {
      pathArr = `${data.name}`;
    } else {
      pathArr = `${filePath}/${data.name}`;
    }
    if (data.type === "directory") {
      if (refPath.current?.[data.name] !== false) {
        refPath.current = { ...refPath.current, [data.name]: true };
      }
      return (
        <>
          <div
            className="rootDiv"
            onMouseEnter={() =>
              !renameId.length &&
              setActiveItemId({ path: pathArr, directory: true })
            }
            onMouseLeave={() =>
              !renameId.length &&
              setActiveItemId({ path: "", directory: false })
            }
          >
            <div
              className="verticalCenter"
              style={{
                marginLeft: `${index}rem`,
              }}
            >
              <div className="mR8">
                {iconMapper(
                  data.type === "directory"
                    ? data?.children?.length && refPath.current[data.name]
                      ? "folderOpen"
                      : "folderClose"
                    : data.type
                )}
              </div>
              <div
                onClick={() => {
                  setClickedPath(clickedPath === pathArr ? "" : pathArr);
                  refPath.current = {
                    ...refPath.current,
                    [data.name]: !refPath.current?.[data.name],
                  };
                }}
              >
                {data.name}
              </div>
            </div>
            {pathArr === activeItemId.path ? (
              action(true, data.noDelete)
            ) : (
              <></>
            )}
          </div>
          {data?.children?.length && refPath.current[data.name] ? (
            Children.toArray(
              data.children.map((node) => (
                <>{treeRender(node, index + 1, pathArr)}</>
              ))
            )
          ) : (
            <></>
          )}
        </>
      );
    }
    return (
      <div
      className={`rootDiv ${pathArr === activeItemId.path ? 'hover':''}`}
        onMouseEnter={() =>
          !renameId.length &&
          setActiveItemId({ path: pathArr, directory: false })
        }
        onMouseLeave={() => !renameId.length && setActiveItemId({})}
      >
        <div
        className="verticalCenter"
          style={{
            marginLeft: `${index}rem`,
          }}
        >
          <div className="mR8">{iconMapper(data.type)}</div>
          {renameId !== pathArr ? (
            <div
              onDoubleClick={() => {
                setRenameId(pathArr);
                setRenameText("");
              }}
            >
              {data.name}
            </div>
          ) : (
            <input
              type="text"
              value={renameText}
              onChange={(e) => setRenameText(e.target.value)}
              onKeyPress={(e) => handleRename(pathArr, e)}
            />
          )}
        </div>
        {pathArr === activeItemId.path ? action(false) : <></>}
      </div>
    );
  };

  return (
    <div className="m48">
      {Children.toArray(
        folderData.map((item, index) => <>{treeRender(item, index)}</>)
      )}
    </div>
  );
}

export default App;
