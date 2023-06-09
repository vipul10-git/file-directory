import { useState, useRef, Children } from "react";
import { sampleData, splitPath } from "./helper";
import FileAdd from "./Icons/FileAdd";
import FolderAdd from "./Icons/FolderAdd";
import Delete from "./Icons/Delete";
import Close from "./Icons/Close";
import "./App.css";
import FolderOpen from "./Icons/FolderOpen";
import FolderClose from "./Icons/FolderClose";
import File from "./Icons/File";

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

function App() {
  const [activeItemId, setActiveItemId] = useState({
    path: "",
    directory: false,
  });
  const [rename, setRename] = useState({ id: "", text: "" });
  const [clickedPath, setClickedPath] = useState("");
  const [random, setRandom] = useState(new Date().getTime());
  const refPath = useRef();

  const handleRename = (path, event) => {
    if (event.key === "Enter") {
      if (rename.text) {
        var i = 1;
        const splitPathArr = splitPath(path);
        let findIndex = sampleData.findIndex(
          (id) => id.name === splitPathArr[0]
        );
        sampleData[findIndex].children.forEach(function iter(a) {
          if (i === splitPathArr.length - 1) {
            if (a.name === splitPathArr[i]) {
              a.name = rename.text;
            }
          } else {
            if (a.name === splitPathArr[i]) {
              i += 1;
              a.children.forEach(iter);
            }
          }
        });
      }
      event.target.blur();
      setRename({ id: "", text: "" });
    }
  };

  const handleDelete = () => {
    var i = 0;
    const splitPathArr = splitPath(activeItemId.path);
    sampleData.forEach(function del(a) {
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
    setRandom(new Date().getTime());
  };

  const handleAddNew = (type) => {
    var i = 0;
    const splitPathArr = splitPath(activeItemId.path);
    sampleData.forEach(function del(a) {
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
    setRandom(new Date().getTime());
  };

  const handleCloseUpdate = () => {
    setRename({ id: "", text: "" });
  };

  const action = (isDirectory, allowDelete) => {
    return (
      <>
        <div className="mR8 verticalCenter" style={{ gap: "0.25rem" }}>
          {isDirectory && (
            <>
              <span onClick={() => handleAddNew("file")} className="pointer">
                <FileAdd />
              </span>
              <span onClick={() => handleAddNew("folder")} className="pointer">
                <FolderAdd />
              </span>
            </>
          )}
          {!allowDelete && !rename.id.length && (
            <span onClick={() => handleDelete()} className="pointer">
              <Delete />
            </span>
          )}
          {!!rename.id.length && (
            <span onClick={() => handleCloseUpdate()} className="pointer">
              <Close />
            </span>
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
            className={`rootDiv ${
              pathArr === activeItemId.path ? "hover" : ""
            }`}
            onMouseEnter={() =>
              !rename.id.length &&
              setActiveItemId({ path: pathArr, directory: true })
            }
            onMouseLeave={() =>
              !rename.id.length &&
              setActiveItemId({ path: "", directory: false })
            }
          >
            <div
              className="verticalCenter pointer"
              style={{
                marginLeft: `${index}rem`,
              }}
              onClick={() => {
                setClickedPath(clickedPath === pathArr ? "" : pathArr);
                refPath.current = {
                  ...refPath.current,
                  [data.name]: !refPath.current?.[data.name],
                };
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
              <div>{data.name}</div>
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
        className={`rootDiv ${pathArr === activeItemId.path ? "hover" : ""}`}
        onMouseEnter={() =>
          !rename.id.length &&
          setActiveItemId({ path: pathArr, directory: false })
        }
        onMouseLeave={() => !rename.id.length && setActiveItemId({})}
      >
        <div
          className="verticalCenter"
          style={{
            marginLeft: `${index}rem`,
          }}
        >
          <div className="mR8">{iconMapper(data.type)}</div>
          {rename.id !== pathArr ? (
            <div
              onDoubleClick={() => {
                setRename({ id: pathArr, text: "" });
              }}
            >
              {data.name}
            </div>
          ) : (
            <input
              type="text"
              value={rename.text}
              onChange={(e) => setRename({ ...rename, text: e.target.value })}
              onKeyPress={(e) => handleRename(pathArr, e)}
            />
          )}
        </div>
        {pathArr === activeItemId.path ? action(false) : <></>}
      </div>
    );
  };

  return (
    <div className="root">
    <div className="fileRoot">
      {Children.toArray(
        sampleData.map((item, index) => <>{treeRender(item, index)}</>)
      )}
      </div>
      <div>
      How To Use:
      <ol>
        <li>
        {iconMapper("file")} - file
        </li>
        <li>
        {iconMapper("folderClosed")} - closed folder
        </li>
        <li> {iconMapper("folderOpen")} - folder is open</li>
        <li>
          Double click on any file to update the name ( close option <Close/> will be appear to cancel the update )
        </li>
        <li>
          Hover file option - <Delete />
        </li>
        <li>
          files can be deleted by clicking- <Delete />
        </li>
        <li>
          Hover folder option - <Delete />,<FileAdd />,<FolderAdd />
        </li>
        <li>clicking on any folder will collapse s/ expand the folder</li>
        <li>
          folders can be also deleted by clicking - <Delete />
        </li>
        <li>
          new file can be added by clicking - <FileAdd />
        </li>
        <li>
          new folder can be added by clicking - <FolderAdd />
        </li>
      </ol>
        <strong>*** for now we are using dummy file and folder when new items being added</strong>
        <br/>
        <strong>*** no validation is being added when file name is being changed</strong>
      </div>
      </div>
  );
}

export default App;
