import Button from "../button/Button";

const Hero = () => {

    return (
        <section className="flex items-center justify-between scroll-mt-32">
            <div className="space-y-12">
                <div>
                    <h1 className="text-7xl">Riding<br /> Path Finder</h1>
                    <p>Get ready to ride!</p>
                </div>
                <div className="space-x-3">
                    <Button href="#map">See Map</Button>
                    <Button href="#" hierarchy="secondary">Find Paths</Button>
                </div>
            </div>
            <div className="flex gap-6">
                <div className="w-96 aspect-[3/4] bg-cover bg-right" style={{ backgroundImage: "url('src/assets/hero.jpg')" }}></div>
                <div className="flex flex-col items-center justify-center gap-3">
                    <div className="w-48 aspect-[3/4] bg-cover" style={{ backgroundImage: "url('src/assets/hero2.jpg')" }}></div>
                    <Button href="#" hierarchy="tertiary">Bla bla</Button>
                </div>

            </div>
        </section>
    );
};

export default Hero;