import React from "react";
import NFCLogo from "./nfcLogo.png"

const NFCReader = () => {
    return ( 
        <div>
            <h2 >Read Your Student Card to Start the Timer</h2>
            <img style={{margin:'auto'}} src={NFCLogo} alt="nfcReader" />
        </div>
     );
}
 
export default NFCReader;