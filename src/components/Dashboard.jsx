import React from 'react';
import UsersNumber from './UserCount';
import Collection from './Collection';
import CalendarComponent from './CalendarComponent'
import Table from './Table';
import './Dashboard.css'



const Dashboard = () => (
  <>
  <div className="title">Dashboard</div>
  <div id="Container">
    <div id="User">
      <UsersNumber/>
      <Collection/>
    </div>
    <div id="Content">
      <div id="Table">
      <Table/>
      </div>
      <div id="Calendar">
        <CalendarComponent/>
      </div>
    </div>
  </div>
  </>
);

export default Dashboard;
