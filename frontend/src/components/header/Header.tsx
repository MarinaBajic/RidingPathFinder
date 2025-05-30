
const Header = () => {
    return (
        <header className="w-full flex flex-col items-center md:flex-row md:justify-between py-6">
            <a href="#hero" className="text-accent hover:text-accent-light text-3xl font-semibold">Reqal Equine Oasis</a>
            <nav>
                <ul className="flex items-center gap-6">
                    <li className="font-medium hover:shadow-[0_-1px_inset]"><a href="#home">Home</a></li>
                    <li className="font-medium hover:shadow-[0_-1px_inset]"><a href="#map">Map</a></li>
                    <li className="font-medium hover:shadow-[0_-1px_inset]"><a href="#about">About us</a></li>
                </ul >
            </nav >
        </header >
    )
}

export default Header