import { Link, NavLink } from "react-router-dom";
// import styles from "../styles/FrontPage.module.css";
// styles['front-page']

export default function ChannelPage(): React.JSX.Element {


    return (
        <div className='front-page'>
            <h2 className="front-heading">Channel: Lorem Ipsum</h2>
            <ul>
                <li>
                    <NavLink to="/user/login">Log in</NavLink>
                </li>
                <li>
                    <NavLink to="/user/register">Sign on</NavLink>
                </li>
                <li>
                    <NavLink to="/user/profile">User profile</NavLink>
                </li>
            </ul>
        </div>
    );
}