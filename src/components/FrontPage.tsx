import { Link, NavLink } from "react-router-dom";
import styles from "../stylesheets/FrontPage.module.css";


export default function FrontPage(): React.JSX.Element {


    return (
        <div className={styles['page-front']}>
            <h2 className="front-heading">Front Page</h2>
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