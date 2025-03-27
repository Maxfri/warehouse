import { WarehouseMap } from "./components/WarehouseMap";
import mockWarehouse from "./FSCS-EMULATION-JSON-FOR-YARIK.json";

import "./App.css";

function App() {
  return (
    <>
      <WarehouseMap warehouse={mockWarehouse} />
    </>
  );
}

export default App;
