import { WarehouseMap } from "./components/WarehouseMap";
import mockWarehouse from "./UPDATE-FOR-YARIK-JSON-WAREHOUSE-EMULATION.json";

import "./App.css";

function App() {
  return (
    <>
      <WarehouseMap warehouse={mockWarehouse} />
    </>
  );
}

export default App;
