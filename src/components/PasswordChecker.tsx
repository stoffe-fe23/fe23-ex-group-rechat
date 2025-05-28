/*
    Component for checking if two specified passwords match and are long enough.
    Shows green or red indicator depending on the check. 
*/
import React from 'react';
import styles from "../stylesheets/PasswordChecker.module.css";



type PasswordCheckerProps = {
    password: string,
    passwordAgain: string,
    minLength: number
}

export default function PasswordChecker({ password, passwordAgain, minLength }: PasswordCheckerProps): React.JSX.Element {

    const verifyPasswordInput = (checkPassword: string, checkPasswordAgain: string, checkLength: number): boolean => (checkPassword.length > (checkLength - 1)) && (checkPassword == checkPasswordAgain);

    return (
        <div
            className={`${styles['password-match-indicator']} ${verifyPasswordInput(password, passwordAgain, minLength) ? styles['passwords-match'] : styles['passwords-no-match']}`}
            id="password-match-indicator"
            title={verifyPasswordInput(password, passwordAgain, minLength) ? "Password is OK" : `The passwords must match and be at least ${minLength} characters in length!`}
        ></div>
    );
}


