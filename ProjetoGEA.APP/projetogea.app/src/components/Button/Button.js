import style from "./Button.module.css";
import classNames from "classnames"; // npm install classnames

export default function Button({leftIcon, title, variant="primary", onClick, ...rest}) {
    const buttonClass = classNames(style.buttonContainer, style[variant]);
    
    return (
        <div>
            <div className={buttonClass} onClick={onClick}>
                {leftIcon ? (<div className={style.iconContainer}>{leftIcon}</div>) : null}
                <button className={style.button} {...rest}> 
                    {title}
                </button>
            </div>
        </div>
    )
}