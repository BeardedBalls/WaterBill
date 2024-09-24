import React from "react";
import './Billing.css';

function Billing(){
    return (
        <>
             <h1>Client Table</h1>
            <div>
                <div>Water System</div>
                <div>Damortis,Rosario, La Union</div>
                <div>Non-VAT Reg. TIn: 111-434-420-00000</div>
                <div>Tel. No.: 072-609-2389</div>
                <div>Billing Reciept</div>
                <div>Date</div>
                <div>Water User Name</div>
                <div>Address</div>
                <div>
                    <Table>
                        <thead>
                            <tr>
                                <th>Billing Period</th>
                                <th>Previous Reading</th>
                                <th>Present Reading</th>
                                <th>Cubic Meter Consumed</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr></tr>
                            <tr>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                        </tbody>
                    </Table>
                </div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
        </>
    )
}

export default Billing;