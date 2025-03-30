import style from "./LinkNavegacao.module.css";
import classNames from "classnames";
import { Link } from "react-router-dom";

export default function LinkNavegacao({leftIcon, texto, variant="sucess", link, ...rest}) {
    const linkClass = classNames(style.linkContainer, style[variant]);
    
    return (
        <div>
            <div className={linkClass}>
                {leftIcon ? (<div className={style.iconContainer}>{leftIcon}</div>) : null}
                <Link to={link} className={style.link} {...rest}> 
                    <h3>{texto}</h3>
                </Link>
            </div>
        </div>
    )
}