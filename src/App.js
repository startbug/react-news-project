import "./App.css";
import IndexRouter from "./router/IndexRouter";
//redux相关----------------------------------------------------
import { Provider } from "react-redux";
import store from "./redux/store";
//redux相关----------------------------------------------------

function App() {
  return (
    //通过Provider(供应商)在最外面开始供应store
    <Provider store={store}>
      <IndexRouter></IndexRouter>
    </Provider>
  );
}

export default App;
