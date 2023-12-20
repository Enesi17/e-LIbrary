import React, { useState } from "react";
import { Button, ButtonGroup } from 'react-bootstrap';

const TableMapView = ({ onSelectChair }) => {
  const [selectedChair, setSelectedChair] = useState(null);
  const [selectedFloor, setSelectedFloor] = useState(0);

  const handleChairClick = (floor, table, chair) => {
    // Set the selected chair in the local state
    setSelectedChair({ floor, table, chair });
    // Call the parent component's function to update the form fields
    onSelectChair({ floor, table, chair });
  };

  const renderTableMap = () => {
    const floors = [...Array(3).keys()]; // Assuming 3 floors
    const tables = [...Array(10).keys()]; // Assuming 10 tables per floor
    const chairs = [...Array(4).keys()]; // Assuming 4 chairs per table

    return (
      <div>
        <h3>Floor {selectedFloor}</h3>
        {tables.map(table => (
          <div key={table}>
            <p>Table {table + 1}</p>
            {chairs.map(chair => (
              <Button
                key={chair}
                variant={selectedChair?.floor === selectedFloor && selectedChair?.table === table + 1 && selectedChair?.chair === chair + 1 ? 'primary' : 'outline-primary'}
                onClick={() => handleChairClick(selectedFloor, table + 1, chair + 1)}
              >
                Chair {chair + 1}
              </Button>
            ))}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div>
      <h3>Table Map View</h3>
      <ButtonGroup>
        {[0, 1, 2].map(floor => (
          <Button
            key={floor}
            variant={selectedFloor === floor ? 'primary' : 'outline-primary'}
            onClick={() => setSelectedFloor(floor)}
          >
            Floor {floor}
          </Button>
        ))}
      </ButtonGroup>
      {renderTableMap()}
    </div>
  );
}

export default TableMapView;
