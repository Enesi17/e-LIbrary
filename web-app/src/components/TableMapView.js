import React, { useEffect, useState } from "react";
import { Button, ButtonGroup } from 'react-bootstrap';
import firebase from "../firebase"; // Import firebase

const TableMapView = ({ onSelectChair }) => {
  const [selectedChair, setSelectedChair] = useState(null);
  const [selectedFloor, setSelectedFloor] = useState(0);
  const [chairStatus, setChairStatus] = useState({});
  const [clickedChairs, setClickedChairs] = useState([]); // Track clicked chairs

  const checkChairStatus = async (floor, table, chair) => {
    try {
      const chairRef = firebase.database().ref(`floors/floor${floor}/tables/table${table}/chairs/chair${chair}/status`);
      const snapshot = await chairRef.once('value');
      const status = snapshot.val();

      // Update status and clicked state for the chair
      setChairStatus(prevStatus => ({
        ...prevStatus,
        [`${floor}-${table}-${chair}`]: status,
      }));
      setClickedChairs(prevClicked => [...prevClicked, `${floor}-${table}-${chair}`]);
    } catch (error) {
      console.error('Error checking chair status: ', error.message);
    }
  };

  const handleChairClick = (floor, table, chair) => {
    const chairKey = `${floor}-${table}-${chair}`;

    // If the chair has been clicked once, reset the status and remove from clickedChairs
    if (clickedChairs.includes(chairKey)) {
      setChairStatus(prevStatus => ({
        ...prevStatus,
        [chairKey]: '',
      }));
      setClickedChairs(prevClicked => prevClicked.filter(key => key !== chairKey));
    } else {
      // If the chair has not been clicked, fetch its status
      setSelectedChair({ floor, table, chair });
      onSelectChair({ floor, table, chair });
      checkChairStatus(floor, table, chair);
    }
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
            <p className="desk">Table {table + 1}</p>
            {chairs.map(chair => (
              <Button
                key={chair}
                variant={selectedChair?.floor === selectedFloor && selectedChair?.table === table + 1 && selectedChair?.chair === chair + 1 ? 'primary' : 'outline-primary'}
                onClick={() => handleChairClick(selectedFloor, table + 1, chair + 1)}
                style={{ backgroundColor: getChairColor(selectedFloor, table + 1, chair + 1) }}
                className="chair"
              >
                {chair + 1}
              </Button>
            ))}
          </div>
        ))}
      </div>
    );
  };

  const getChairColor = (floor, table, chair) => {
    const chairKey = `${floor}-${table}-${chair}`;
    const status = chairStatus[chairKey];
    return clickedChairs.includes(chairKey)
      ? status === 'available' ? 'green' : status === 'occupied' ? 'red' : 'orange'
      : ''; // Initial color
  };

  return (
    <div>
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
