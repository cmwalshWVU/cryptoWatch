import React from 'react'
import moment from 'moment';
import '../../styles/card.css';

const Notifications = ( props ) => {
  const {notifications} = props;
  return (
    <div className="dashboard-section section">
      <div className="rounded-card card z-depth-0">
        <div className="card-content">
          <span className="card-title">Notifications</span>
          <ul className="Notifications">
            { notifications && notifications.map(item => {
              return (
                <li key={item.id}>
                  <span className="pink-text">{item.user} </span>
                  <span> {item.content}</span>
                  <div className="grey-text note-date">
                    {moment(item.time.toDate()).fromNow()}
                  </div>
                </li>
                )
            })}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Notifications;
