import { NavLink } from "react-router-dom";
import styles from "../stylesheets/FrontPage.module.css";
import iconChat from "/icons/icon-chat.png";
import iconCheck from "/icons/icon-check.png";
import iconUser from "/icons/icon-user.png";



export default function FrontPage(): React.JSX.Element {

    return (
        <>
            <section className={styles['page-front']}>
                <div className={styles['page-front-image']}>
                    <h2 className="front-heading">Group <span>Re</span>Chat</h2>
                    <div className={styles['front-boxes']}>
                        <div className={styles['front-text']}>
                            <img src={iconChat} alt="chat icon" />
                            <p><strong>Group ReChat</strong> is a simple real-time textbased web chat application.</p><p>Join an existing chat channel on a variety of topics, or create your own.</p>
                        </div>
                        <div className={styles['front-text']}>
                            <img src={iconCheck} alt="checkmark icon" />
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Temporibus, odit qui saepe laboriosam, voluptas tenetur voluptatem error architecto velit earum pariatur cumque, mollitia exercitationem illum ad dolore magni labore delectus deleniti porro reiciendis! Nisi deserunt error vel laudantium, vitae corporis voluptatem consectetur sit reiciendis a sapiente deleniti iusto id expedita.
                        </div>
                        <div className={styles['front-text']}>
                            <img src={iconUser} alt="key icon" />
                            <p>To use <strong>Group ReChat</strong> you must first create your user account.</p>
                            <div className={styles['front-buttonlink']}>
                                <NavLink to="/user/login"><strong>Log in</strong></NavLink>
                                <NavLink to="/user/register">Sign up</NavLink>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}