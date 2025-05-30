import Button from "../button/Button";

const Hero = () => {

    return (
        <section id="home" className="flex flex-col gap-12 lg:flex-row lg:gap-0 items-center justify-between scroll-mt-32">
            <div className="space-y-12 flex flex-col items-center lg:items-start text-center lg:text-left">
                <div>
                    <h1 className="text-7xl">Riding<br /> Path Finder</h1>
                    <p>Easily find Rides and Trails in Serbia!</p>
                </div>
                <Button href="#map">See Map</Button>
            </div>
            <div className="flex gap-6">
                <div className="w-48 md:w-96 aspect-[3/4] bg-cover bg-right" style={{ backgroundImage: "url('src/assets/hero.jpg')" }}></div>
                <div className="flex flex-col items-center justify-center gap-3">
                    <div className="w-36 md:w-48 aspect-[3/4] bg-cover" style={{ backgroundImage: "url('src/assets/hero2.jpg')" }}></div>
                    <Button href="#" hierarchy="tertiary">Bla bla</Button>
                </div>

            </div>
        </section>
    );
};

export default Hero;