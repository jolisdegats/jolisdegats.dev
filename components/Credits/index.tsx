import Modal from "@/components/UI/Modal";

const Credits = () => {
    return (
        <Modal name="credits">
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
                        <h3 className="text-2xl mb-2">Music</h3>
                        <ul className="list-none pl-0">
                            <li className="mb-2">Radio musics: <a href="https://www.youtube.com/watch?v=5rWYD-7B5UE" target="_blank" rel="noopener noreferrer">&quot;Happy Children&quot; by P. Lion</a></li>
                            <li>Added a vintage radio effect from <a href="https://voicechanger.io/" target="_blank" rel="noopener noreferrer">Voicechanger.io</a></li>
                        </ul>
                    </section>
                    <section className="mb-6">
                        <h3 className="text-2xl mb-2">Sound effects</h3>   
                        <ul className="list-none pl-0 ">
                            <li className="mb-2">Radio tuning sound from <a href="https://www.youtube.com/watch?v=5rWYD-7B5UE" target="_blank" rel="noopener noreferrer">&quot;Happy Children&quot; by P. Lion</a></li>
                            <li className="mb-2">Coffee machine sounds from <a href="https://www.youtube.com/watch?v=5rWYD-7B5UE" target="_blank" rel="noopener noreferrer">&quot;Happy Children&quot; by P. Lion</a></li>
                            <li>Cat purring sound from <a href="https://www.youtube.com/watch?v=5rWYD-7B5UE" target="_blank" rel="noopener noreferrer">&quot;Happy Children&quot; by P. Lion</a></li>
                        </ul>
                    </section>
                   
                </div>
                <div>
                <section className="mb-6">
                        <h3 className="text-2xl mb-2">Images</h3>    
                        <ul className="list-none pl-0">
                            <li className="mb-2">Main background & cloud images designed on <a href="https://midjourney.com/" target="_blank" rel="noopener noreferrer">Midjourney</a> + some Photoshop edits</li>
                            <li>Coffee machine design: Based on <a href="https://codepen.io/smail-boundaoui/pen/bGpZOVm" target="_blank" rel="noopener noreferrer">CSS Coffee Machine by Smail Boundaoui</a></li>
                        </ul>
                    </section>
                <section className="mb-6">
                        <h3 className="text-2xl mb-2">Games</h3>
                        <ul className="list-none pl-0">
                            <li>Coffee game: Original idea from <a href="https://codepen.io/ElJefe/pen/vEERrW" target="_blank" rel="noopener noreferrer">Beer Filling Game by Jeff Putnam</a></li>
                        </ul>
                    </section>
                    <section className="mb-6">
                        <h3 className="text-2xl mb-2">Libraries and Frameworks</h3>
                        <ul className="list-none pl-0">
                            <li className="mb-2">Next.js</li>
                            <li className="mb-2">React</li>
                            <li className="mb-2">Custom sound management hook</li>
                            <li>Tailwind CSS</li>
                        </ul>
                    </section>
                </div>
            </div>
            </div>
            <footer className="text-center mt-8 font-roboto italic text-[#a0a0a0]">
                <p>Thank you for visiting!</p>
            </footer>
        </Modal>
    )
}

export default Credits;