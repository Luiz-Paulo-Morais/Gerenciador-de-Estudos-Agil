import style from "./Input.module.css";


export default function Input({leftIcon, ...rest}) {
    return (
        <div>
            <div className={style.inputContainer}>
                {leftIcon ? (<div className={style.iconContainer}>{leftIcon}</div>) : null}
                <input {...rest}/>
            </div>
        </div>
    )
}