import PopupModal from "@/components/UI/Modal/PopupModal";

const Credits = () => {
    return (
        <PopupModal name="credits">
            <h2 className="font-playfair text-5xl text-center mb-10 text-white shadow-[1px_1px_2px_rgba(0,0,0,0.1)]">Credits</h2>

            <div className="font-roboto text-[#e0e0e0] overflow-auto">
            <section className="mb-4">
                <p>Imagined, coded and designed by <a href="https://github.com/jolisdegats" target="_blank" rel="noopener noreferrer">Jolisdegats</a>.</p>
            </section>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                <section className="mb-6">
                        <h3 className="text-2xl mb-2">Inspirations</h3>
                        <ul className="list-none pl-0">
                            <li>All point & click games I played (the list is too long to put here), my love for anime & a bit of <a href="https://manidavilay.com/" target="_blank" rel="noopener noreferrer">my friend Many&apos;s portfolio</a> (which is awesome by the way).</li>
                        </ul>
                    </section>
                    <section className="mb-6">
                        <h3 className="text-2xl mb-2">Libraries and Frameworks</h3>
                        <ul className="list-none pl-0">
                            <li className="mb-2">Next.js</li>
                            <li className="mb-2">React</li>
                            <li>Tailwind CSS</li>
                        </ul>
                    </section>
                    <section className="mb-6">
                        <h3 className="text-2xl mb-2">Games</h3>
                        <ul className="list-none pl-0">
                            <li className="mb-2">Coffee game: Original idea from <a href="https://codepen.io/ElJefe/pen/vEERrW" target="_blank" rel="noopener noreferrer">Beer Filling Game by Jeff Putnam</a></li>
                       <li>Flowers animation based on <a href="https://codepen.io/ksenia-k/full/RwqrxBG" target="_blank" rel="noopener noreferrer">Draw With WebGL Flowers by Ksenia Kondrashova</a></li>
                       </ul>
                    </section>
                    {/* <section className="mb-6">
                        <h3 className="text-2xl mb-2">Sound effects</h3>   
                        <ul className="list-none pl-0 ">
                            <li className="mb-2">Radio tuning sound from <a href="https://www.youtube.com/watch?v=5rWYD-7B5UE" target="_blank" rel="noopener noreferrer">&quot;Happy Children&quot; by P. Lion</a></li>
                            <li className="mb-2">Coffee machine sounds from <a href="https://www.youtube.com/watch?v=5rWYD-7B5UE" target="_blank" rel="noopener noreferrer">&quot;Happy Children&quot; by P. Lion</a></li>
                            <li>Cat purring sound from <a href="https://www.youtube.com/watch?v=5rWYD-7B5UE" target="_blank" rel="noopener noreferrer">&quot;Happy Children&quot; by P. Lion</a></li>
                        </ul>
                    </section> */}
                   
                </div>
                <div>
                <section className="mb-6">
                        <h3 className="text-2xl mb-2">Design</h3>    
                        <ul className="list-none pl-0">
                            <li className="mb-2">Main background & images designed on <a href="https://midjourney.com/" target="_blank" rel="noopener noreferrer">Midjourney</a>, <a href="https://www.lovart.ai/" target="_blank" rel="noopener noreferrer">Lovart.ai</a> + some Photoshop edits</li>
                            <li>Video games shelf design based on <a href="https://alexandru.so/experiments/book-gallery" target="_blank" rel="noopener noreferrer">Book gallery by Alexandru Ţurcanu</a></li>
                            <li>Coffee machine design based on <a href="https://codepen.io/smail-boundaoui/pen/bGpZOVm" target="_blank" rel="noopener noreferrer">CSS Coffee Machine by Smail Boundaoui</a></li>
                        </ul>
                    </section>
                    <section className="mb-6">
                        <h3 className="text-2xl mb-2">Music</h3>
                        <ul className="list-none pl-0">
                            <li className="mb-2"><ul className="list-none pl-0">Radio musics:
                                <li ><a href="https://www.youtube.com/watch?v=5rWYD-7B5UE" target="_blank" rel="noopener noreferrer">&quot;Happy Children&quot; by P. Lion</a>,</li>
                                <li ><a href="https://www.youtube.com/watch?v=2gsRWhq1uIc" target="_blank" rel="noopener noreferrer">&quot;Shy&quot; by Kajagoogoo</a></li>
                                <li ><a href="https://www.youtube.com/watch?v=4TYv2PhG89A" target="_blank" rel="noopener noreferrer">&quot;Smooth Operator&quot; by Sade</a></li>
                                <li ><a href="https://www.youtube.com/watch?v=5oWyMakvQew" target="_blank" rel="noopener noreferrer">&quot;Dreams&quot; by Fleetwood Mac</a></li>
                                </ul>
                                </li>
                            <li>Vintage radio effect from <a href="https://voicechanger.io/" target="_blank" rel="noopener noreferrer">Voicechanger.io</a></li>
                        </ul>
                    </section>
                </div>
            </div>
            </div>
            <footer className="text-center mt-8 font-roboto italic text-[#a0a0a0]">
                <p>Thank you for visiting!</p>
            </footer>
        </PopupModal>
    )
}

export default Credits;