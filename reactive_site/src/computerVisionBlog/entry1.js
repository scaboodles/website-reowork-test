import "./blogStyle.css"
export const Entry1 = () =>{
    const tab = () => {
        return <pre>    </pre>
    }
    return(
        <div className="post">
            <div className="header">
                <h1>
                    Performing Image Recognition on Digitally Altered Images with GPT-4
                </h1>
                <h3>GWU CSCI 4527</h3>
                <h3>1/25/24 - Owen Wolff</h3>
            </div>
            <div id="intro">
                <div id="introText">
                    <h2 className="centerText">
                        My favorite artist is René Magritte
                    </h2>
                    <p className="centerText italic">
                        And surrelism is my favorite style (I find the other styles really boring)
                    </p>
                </div>
                <img src="/blogAssets/entry1/magritteBgless.png" alt="The collective invention" id="feesh"></img>
            </div>
            <p className="textBody">
                The above image is cut from "The Collective Invention" by René Magritte. One of My favorites.
                Following Magritte in transforming the familiar into the unfamiliar, I wanted to see what would happen to
                GPT-4's image recognition capabilites when I jank up the input in a series of digital transformations.
                I will be focusing on GPT-4's ability to identify the underlying image and its ability to identify the
                transformations applied.
                <br/>
                <br/>
                Technology Used:<br/>
                <ul>
                    <li>Chat GPT-4</li>
                    <li>MacOS Preview (stock image editing capabilites)</li>
                    <li>Aseprite (supposed to just be for pixel art, but very versatile software)</li>
                    <li>Notably, not Photoshop (I don't have a license)</li>
                </ul>
                Image Citations:<br/>
                <ul>
                    <li><a href="https://www.renemagritte.org/images/paintings/personal-values.jpg" target="_blank" className="hyperlink">Personal Values</a></li>
                    <li><a href="https://www.google.com/url?sa=i&url=https%3A%2F%2Fstock.adobe.com%2Fsearch%3Fk%3Dman&psig=AOvVaw05z3YC9UcOhTGqbqFE_pgl&ust=1706329774568000&source=images&cd=vfe&opi=89978449&ved=0CBUQjhxqFwoTCJDKw_Kb-oMDFQAAAAAdAAAAABAN" target="_blank" className="hyperlink">Stock Image Man</a></li>
                </ul>
            </p>
            <br/>
            <h2 className="section">Control run</h2>
            <div className="sideBy">
                <img src="/blogAssets/entry1/values.jpeg" id="values"/>
                <div className="leftText">
                    <p className="textBody">
                        The image on the left, "Personal Values", was fed to GPT-4 with the prompt:
                        <br/>
                        <br/>
                        "Identify this image"
                        <br/>
                        <p className="italic">This image is a piece of surrealist art by René Magritte called "Personal Values" (1952). It features oversized everyday objects — such as a comb, a glass, a shaving brush, and a matchstick — placed in a room that has a sky painted as a wallpaper or as the actual sky seen through the walls...</p>
                        <br/>
                        <div className="horz"/>
                        <br/>
                        GPT-4 Easily identifed the image and all the objects portrayed. Neat.
                        <br/>
                        <br/>
                        <br/>
                        With all of that out of the way, its time to get weird
                    </p>
                </div>
            </div>
            <h2 className="section">Big Ol' Hole</h2>
            <div className="sideBy">
                <div className="rightText">
                    <p className="textBody">
                        The image on the right, "Personal Values But Now Theres A Hole In It", was fed to GPT-4 with the same prompt as before.
                        <br/>
                        <br/>
                        "Identify this image"
                        <br/>
                        <p className="italic">The image you've uploaded appears to be a modified version of René Magritte's painting "Personal Values" (1952). The original artwork depicts an interior scene with oversized everyday objects, such as a comb, a bed, a glass, and a wardrobe with a room that has a sky painted on the walls and ceiling. In the version you've shared, there is a large black circle obscuring part of the image, which seems to be an intentional edit for reasons unknown without further context... </p>
                        <br/>
                        <div className="horz"/>
                        <br/>
                        "Reasons unknown without further context," well I never. That was an easy one.
                    </p>
                </div>
                <img src="/blogAssets/entry1/valuesHole.jpeg" className="fedImage"/>
            </div>
            <h2 className="section">75% Off</h2>
            <div className="sideBy">
                <img src="/blogAssets/entry1/values75.jpeg" className="fedImage"/>
                <div className="leftText">
                    <p className="textBody">
                        The image on the left, which is the bottom left quarter of "Personal Values", was fed to GPT-4 with the same prompt.
                        <br/>
                        <br/>
                        "Identify this image"
                        <br/>
                        <p className="italic">
                        This image depicts a scene with surreal elements reminiscent of the work of Spanish artist Salvador Dalí. It shows a bedroom with a traditional wooden bed and white pillow, with a red cover. On the right, there is an oversized comb standing vertically, with its teeth embedded into the floor, and its reflection seems to show a burning effect. The floor appears to be wooden, and there's a traditional patterned carpet. The backdrop gives the illusion of open sky with clouds, which suggests that the room might be without walls or set in an open space. There's also a pink elongated object on the carpet that resembles a pencil...
                        </p>
                        <br/>
                        <div className="horz"/>
                        <br/>
                        <p>
                            I thought that this was an interesting response. Although GPT-4 correctly identifies the surrealist style, it did not recognize
                            this image as part of a greater whole and it's recognition of the objects in the scene is off. 
                            The teeth of the comb are nowhere near the floor, and it could not recognize the matchstick due to the 
                            unorthodox color choice.
                            <br/> 
                            <br/> 
                            <p>Out of curiosity, I regenerated the response to see what else GPT-4 could come up with.</p>
                        </p>
                        <p className="italic">
                        This is an artwork by René Magritte called "Personal Values" (1952). It features...
                        </p>
                        <p className="textBody">Gotta love non-deterministic algorithms. Still no mention of the actual transformation performed though.</p>
                    </p>
                </div>
            </div>
            <h2 className="section italic">Crustified</h2>
            <div className="sideBy">
                <div className="rightText">
                    <p className="textBody">
                        For this next run, I jumbled up the position of the pixels which correspond to the objects in the scene.
                        GPT-4 was asked to identify the image:
                        <br/>
                        <br/>

                        <p className="italic">
                        The image you've provided appears to be a digital art piece that blurs the line between interior and exterior spaces. It shows a room with a wooden bed and a rug, but the walls have been artistically altered or replaced to merge with a sky and cloud motif, giving the impression that the room is dissolving into or emerging from a natural landscape. The style is reminiscent of surrealism, a movement known for such dream-like visual juxtapositions. This could be an artwork or a digitally manipulated photograph intended to create a thought-provoking visual effect.
                        </p>

                        <br/>
                        <div className="horz"/>
                        <br/>
                        <br/>
                        <p className="textBody">
                            GPT-4 was able to correctly identify the general style and setting of the image, but was unable
                            to identify the original work. I thought that this might have been too drastic of a transformation and 
                            was curious to have GPT-4 compare the transformed work to the original.
                        </p>
                        <br/>
                        <br/>
                    </p>
                </div>
                <img src="/blogAssets/entry1/valuesLessCrusty.jpeg" className="fedImage"/>
            </div>
            <div className="dualMargin">
                <div className="horz"/>
            </div>
            <br/>
            <br/>
            <p className="textBody">"The image is a digitally altered version of "Personal Values" by Magritte"</p>
            <br/>
            <p className="textBody italic">
                The image you've provided is indeed a digitally altered version of René Magritte's original painting "Personal Values." The alterations have introduced a pixelation or dispersion effect, particularly around what would be the boundaries of the room and objects, giving the impression that parts of the scene are disintegrating or transforming into particles...
            </p>
            <br/>
            <p className="textBody">
                GPT-4 was able to identify the transformation applied and to which objects in the scene when explicitly told to compare the
                transformed version with the original. 
            </p>
            <h2 className="section">Stock Image Man Appears</h2>
            <div className="sideBy">
                <img src="/blogAssets/entry1/valuesMan.jpeg" className="fedImage"/>
                <div className="leftText">
                    <p className="textBody">
                        For my last run, I wanted to see what would happen if I added something into the scene.
                        Meet John Stockimage.
                        <br/>
                        GPT-4 was asked to identify the image on the left:
                        <p className="italic textBody">
                        This image appears to be a digitally manipulated or photoshopped picture that combines elements of surrealism with a real photograph of a person...
                        ... It seems to be a playful take on surrealism, evoking the work of artists like René Magritte, though with a modern twist.
                        </p>
                        <p className="textBody">
                            Very close. Surrealism? Check. Magritte? Check. Digitally manipulated? Check. I pressed GPT-4 harder:
                        </p> 
                        <br/>
                        <p className="textBody">
                            "If the man were removed, what specific painting of René Magritte's paintings would this look like?"
                        </p>
                        <br/>
                        <p className="textBody italic">
                            If the man were removed, the image would resemble René Magritte's painting "Personal Values" (1952). This painting is one of Magritte's most famous works and...
                        </p>
                        <br/>
                        <p className="textBody">
                            Got there! After a little encouragement, GPT-4 was able to look beyond the transformation and identify the underlying work.
                        </p>
                    </p>
                </div>
            </div>
            <h2 className="section">Final thoughts</h2>
            <div id="end">
                <p className="textBody" id="endText">
                    Overall, GPT-4 was very successful in identifying a famous work of art when digitally manipulated.
                    In my cursory explorations, GPT-4 appeared to be most successful in identifying the image when the 
                    transformations were purely additive or subtractive. It struggled very much when the foreground objects were
                    obscured.
                    I am very impressed with GPT-4's ability to perform these identifications, especially considering the niche input.
                </p>
                <br/>
                <img src="/blogAssets/entry1/magritteBgless.png" alt="The collective invention" id="feesh2"></img>
            </div>
        </div>
    )
}