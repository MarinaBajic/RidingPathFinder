import { PropsWithChildren } from "react"
import './Button.scss'

interface ButtonProps extends PropsWithChildren {
    href?: string;
    disabled?: boolean;
    onClick?: () => void;
    hierarchy?: 'primary' | 'secondary' | 'tertiary';
}

const Button = ({ href, disabled, children, onClick, hierarchy = 'primary' }: ButtonProps) => {
    const ButtonComponent = href ? "a" : "button";

    return (
        <ButtonComponent
            {...(href ? { href } : { onClick })}
            disabled={disabled}
            className={`inline-block font-medium rounded-sm py-2 px-4 whitespace-nowrap cursor-pointer ${hierarchy} ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        >
            {children}
        </ButtonComponent>
    )
}

export default Button