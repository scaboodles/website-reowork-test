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
                    an intership for the summer of 2024 building software or doing web development. I am proficient in python, java, javascript, 
                    C, C++, and more. 
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
                    This website is my digital portfolio, but more importantly it was an excuse to build something unintuitive in React and
                    flex my pixel art skillz.
                </p>
            </div>
            <div className='dashes'>----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------</div>
            <h3 className='question'>
                PigeonMingle.com? That's a weird name.
            </h3>
            <div className='dashes'>----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------</div>
            <div id='pigeons' className='dialog'>
                <p>
                    Yeah, it kinda is.
                    <br/><br/>
                    Originally, this website was gonna be something else. I pivoted when I realized it could be cool to have a digital portfolio
                    for applying to internships.
                    <br/><br/>
                    You can see the scrapped project by clicking the icon to the left. I plan to revisit it at some point, but for now I'm focusing
                    on school and getting a job.
                </p> 
                <img className='pixelMoji topMargin clickable' src={require('./resources/animatedPigeonIcon.gif')} onMouseDown={openLauncher}/>
            </div>
            <div className='dashes'>----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------</div>
            <h3 className='question'>
                So what's on here?
            </h3>
            <div className='dashes'>----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------</div>
            <div id='butFrWhat' className='dialog'>
               <p>
                    Not much at the moment. A lot of my projects are difficult to show off interactively and this website is still
                    a work in progress. Please, close this window and poke around a little bit!
                </p> 
                <img className='pixelMoji topMargin' src={require('./resources/typin.gif')}/>
            </div>
        </div>
    );
}