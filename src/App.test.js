import Child from "./Child";
import axios from "axios";
import { useEffect } from "react";
import "./App.css";

function App() {
  //第二个参数为空,不依赖于任何组件,在渲染完成后只执行一次,相当于componentDitMount
  // useEffect(() => {
  //   axios
  //     .get(
  //       "/ajax/movieOnInfoList?token=&optimus_uuid=8AEA24C00FE911ECA77D918B4BDCD5F877DDB0E1CDDA43449B11D2CAC7DEEA00&optimus_risk_level=71&optimus_code=10"
  //     )
  //     .then((res) => {
  //       console.log(res);
  //     });
  // }, []);

  return (
    <div>
      App
      <ul>
        <li>111111</li>
        <li>22222</li>
      </ul>
      <Child />
    </div>
  );
}

export default App;
