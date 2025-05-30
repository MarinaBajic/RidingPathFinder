import Button from "../button/Button"

const Footer = () => {
    return (
        <footer className="flex flex-col gap-8 mb-6">
            <div className="flex justify-between items-center">
                <div className="flex flex-col">
                    <span className="text-xs">Provided to you by</span>
                    <span className="text-accent uppercase font-medium">Regal Equine Oasis</span>
                    <span className="text-2xl font-semibold">Contact us +381601237896</span>
                    <span className="text-2xl font-semibold">Visit us at Subotica</span>
                </div>
                <Button hierarchy="tertiary">Schedule a session &rarr;</Button>
            </div>
            <div className="flex flex-col text-center text-sm">
                <span>&copy; 2025 <a href="https://github.com/MarinaBajic">Marina Bajic</a></span>
            </div>
        </footer>
    )
}

export default Footer