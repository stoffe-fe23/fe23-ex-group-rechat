import { Link, NavLink } from "react-router-dom";
// import styles from "../styles/FrontPage.module.css";
// styles['front-page']

type PageTabsProps = {
    activeTab: string
}

export default function PageTabs({ activeTab }: PageTabsProps): React.JSX.Element {


    return (
        <>
            <div>Active tab: {activeTab}</div>
            <div className="tabs">
                <div><NavLink to="/user/profile">User</NavLink></div>
                <div><NavLink to="/channels">Channel</NavLink></div>
            </div>
        </>

    );
}