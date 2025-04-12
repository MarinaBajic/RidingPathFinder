import { PropsWithChildren } from "react"
import './Button.scss'

interface ButtonProps extends PropsWithChildren {
    href?: string;
    onClick?: () => void;
    hierarchy?: 'primary' | 'secondary' | 'tertiary';
}

const Button = ({ href, children, onClick, hierarchy = 'primary' }: ButtonProps) => {
    const ButtonComponent = href ? "a" : "button";

    return (
        <ButtonComponent
            {...(href ? { href } : { onClick })}
            className={`inline-block font-medium rounded-sm py-2 px-4 whitespace-nowrap ${hierarchy}`}
        >
            {children}
        </ButtonComponent>
    )
}

export default Button