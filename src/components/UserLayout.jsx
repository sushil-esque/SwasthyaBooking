import UserDashboard from '../pages/User/UserDashboard'
import { Outlet } from 'react-router-dom'

function UserLayout() {
  return (
    <div className='userLayout'>
        <UserDashboard/>
        <div className='userOutlet'>
        <Outlet/>
        </div>
       
    </div>
  )
}

export default UserLayout