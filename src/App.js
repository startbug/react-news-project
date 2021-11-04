import "./App.css";
import IndexRouter from "./router/IndexRouter";
//redux相关----------------------------------------------------
import { Provider } from "react-redux";
import { store, persistor } from "./redux/store";
import { PersistGate } from "redux-persist/integration/react";
//redux相关----------------------------------------------------

function App() {
  return (
    //通过Provider(供应商)在最外面开始供应store
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <IndexRouter></IndexRouter>
      </PersistGate>
    </Provider>
  );
}

export default App;
