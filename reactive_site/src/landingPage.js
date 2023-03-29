import './landingWindowStyle.css';

export function LandingWindow(props){
    const openLauncher= () =>{
        console.log("open");
        props.openMingleLancher();
    }
    return(
        <div id='overrideGuts'>
            <div id='header'>
                <h1>Welcome to my website!</h1>
            </div>
            <div id='bio' className='dialog'>
                <p>
                    My name is Owen Wolff. I am a rising Junior in the engineering program at George Washington University. I'm looking for an
                    an unpaid intership for the summer of 2023 building software. I am proficient in python, java, and javascript. 
                    I'm a quick learner, and I make decent coffee.
                </p>
                <img className='pixelMoji' src={require('./resources/sipping.gif')}/>
            </div>
            <div className='dashes'>----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------</div>
            <h3 className='question'>
                So what is this website?
            </h3>
            <div className='dashes'>----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------</div>
            <div id='what' className='dialog'>
                <p>
                    This website is my digital portfolio! Well, it is for now at least. You may have noticed the strange domain
                    name. PigeonMingle.com is something I started building with my dad a while ago, and it will eventually replace this site.
                </p>
            </div>
            <div className='dashes'>----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------</div>
            <h3 className='question'>
                PigeonMingle.com? What's that?
            </h3>
            <div className='dashes'>----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------</div>
            <div id='pigeons' className='dialog'>
                <p>
                    The thesis for PigeonMingle.com was an anti-social social lobby. A multiplayer game with no usernames, no chat, 
                    no substantial communication of any kind, and at the moment no real objective. Just flapping around with your fellow pigeons.
                    <br/><br/>
                    It's kinda dumb, but I hope it's the good kind of dumb. I imagine it serving the same role as cookie clicker, where you have it
                    running in the background and check back in every so often to see what's up. Click the icon to the left to see what I have so far!
                </p> 
                <img className='pixelMoji topMargin clickable' src={require('./resources/animatedPigeonIcon.gif')} onMouseDown={openLauncher}/>
            </div>
            <div className='dashes'>----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------</div>
            <h3 className='question'>
                Ok, but what is this website right now?
            </h3>
            <div className='dashes'>----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------</div>
            <div id='butFrWhat' className='dialog'>
               <p>
                    Like I said before, this is my digital portfolio. It is a way to show off what I have done and what I am
                    working on to people who might want to exchange free labor for a refrence on my resume. The website itself is built in react and is
                    supposed to emulate a computer desktop. 
                    <br/><br/>
                    It this an intuitive layout for a website? No! Was it worth all the effort? Debatable! Is it kinda
                    weird? Now you're getting it!
                    <br/><br/>
                    At the end of the day, this was an excuse to learn React, and what better way to learn React than with a project that over-uses refs.
                    <br/><br/>
                    Please, close this window and poke around a little bit! (Just dont open the dev console)
                </p> 
                <img className='pixelMoji topMargin' src={require('./resources/typin.gif')}/>
            </div>
        </div>
    );
}