import React from "react";
import Cells from "./Cells";
import './Table.css'

function Table(){
    return(
        <>
        <div className="table">
            <table>
                <tr>
                    <td>Meter</td>
                    <td>Name</td>
                    <td>Ammount</td>
                    <td>OR Number</td>
                </tr>
                
            </table>
            <Cells/>
        </div>
        </>
    )
}

export default Table;