import React, { useEffect, useState } from "react";
import rfid from '../img/rfid.png'
import { useAuth } from "../context/AuthContext";
import firebase from "../firebase";
import { Button } from "react-bootstrap";

const ConfirmCardID = () => {
    const { currentUser } = useAuth();
    const [currentCardID, setCurrentCardID] = useState(0);
    const [error, setError] = useState(null);
    const [reservationData, setReservationData] = useState(null);
    const [readCardID, setReadCardID] = useState('');
    const [floor, setFloor] = useState('');
    const [table, setTable] = useState('');
    const [chair, setChair] = useState('');
    const [confirmationSuccess, setConfirmationSuccess] = useState(false);

    const fetchReservationData = async () => {
        try {
            const reservationsRef = firebase.firestore().collection('reservations');
            const querySnapshot = await reservationsRef
                .where('userId', '==', currentUser.email)
                .get();

            if (!querySnapshot.empty) {
                const reservationDoc = querySnapshot.docs[0].data();
                setReservationData(reservationDoc);
                setFloor(reservationDoc.floor);
                setTable(reservationDoc.table);
                setChair(reservationDoc.chair);
            } else {
                setError('No reservation found.');
            }
        } catch (error) {
            setError('Error fetching reservation data: ' + error.message);
            console.error('Error fetching reservation data:', error.message);
        }
    };

    const checkChairStatus = async () => {
        try {
            const chairRef = firebase.database().ref(`floors/floor${floor}/tables/table${table}/chairs/chair${chair}/cardID`);
            const snapshot = await chairRef.once('value');
            const cardID = snapshot.val();
            setReadCardID(cardID);
            console.log(readCardID);
        } catch (error) {
            console.error('Error checking chair status: ', error.message);
        }
    };

    const handleConfirmationClick = async () => {
        await fetchReservationData();
        await checkChairStatus();

        if (currentCardID === readCardID) {
            setConfirmationSuccess(true);
        } else {
            setConfirmationSuccess(false);
            console.log('Error: Card ID does not match.');
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const usersRef = firebase.firestore().collection('users');
                const userSnapshot = await usersRef.where('email', '==', currentUser.email).get();

                if (!userSnapshot.empty) {
                    const userData = userSnapshot.docs[0].data();
                    setCurrentCardID(userData.cardID);
                } else {
                    setError('No user found with the provided email.');
                }
            } catch (error) {
                setError('Error fetching user data: ' + error.message);
                console.error('Error fetching user data:', error.message);
            }
        };

        fetchData();
    }, [currentUser.email]);

    useEffect(() => {
        if (confirmationSuccess) {
            const timerRedirect = setTimeout(() => {
                window.location.pathname = '/timer';
            }, 100);

            return () => clearTimeout(timerRedirect);
        } else {
            console.log('Error reading cardID');
        }
    }, [confirmationSuccess]);

    return (
        <div>
            <h2>Read Card to Start Timer</h2>
            <img src={rfid} alt="rfid logo" />
            <p>Please read your card to the RFID reader in your table, and click 'Confirmation'</p>
            <Button onClick={handleConfirmationClick}>Confirm</Button>
        </div>
    );
}

export default ConfirmCardID;
