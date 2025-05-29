import { NavLink } from "react-router-dom";

import styles from "../stylesheets/FrontPage.module.css";
import iconChat from "/icons/icon-chat.png";
import iconCheck from "/icons/icon-check.png";
import iconUser from "/icons/icon-user.png";
import iconRegister from "/icons/icon-user-add.png";


export default function FrontPage(): React.JSX.Element {

    return (
        <>
            <section className={styles['page-front']}>
                <div className={styles['page-front-image']}>
                    <h2 className="front-heading">Group <span>Re</span>Chat</h2>
                    <div className={styles['front-boxes']}>
                        <div className={styles['front-text']}>
                            <img src={iconChat} alt="chat icon" />
                            <p><strong>Group ReChat</strong> is a simple real-time textbased web chat application supporting Markdown formatting in message text.</p><p>Join an existing chat channel on a variety of topics, or create your own.</p>
                        </div>
                        <div className={styles['front-text']}>
                            <img src={iconCheck} alt="checkmark icon" />
                            <p><strong>Group ReChat is an educational project.</strong> It is the final project of the Frontend development course I am studying. It is built using React and Redux on the front-end and using the Google Firebase service as back-end.</p>
                            <p>It was built from the ground up in four weeks during the spring of 2025. And yes, this is a dummy placeholder text in place of standard lorem ipsum... 😊</p>
                        </div>
                        <div className={styles['front-text']}>
                            <img src={iconUser} alt="key icon" />
                            <p>To use <strong>Group ReChat</strong> you must first create your user account.</p>
                            <div className={styles['front-buttonlink']}>
                                <NavLink to="/user/login">
                                    <img src={iconUser} alt="Login icon" />
                                    <strong>Log in</strong>
                                </NavLink>
                                <NavLink to="/user/register">
                                    <img src={iconRegister} alt="Sign up icon" />
                                    Sign up
                                </NavLink>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}