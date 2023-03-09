import './landingWindowStyle.css';

export function landingWindow(){
    return(
        <div id='overrideGuts'>
            <div id='header'>
                <h1>Welcome to my website!</h1>
            </div>
            <div id='bio' className='dialog'>
                <p>
                    I am a rising Junior in the engineering program at George Washington University. I'm looking for an
                    an unpaid intership for the summer of 2023 building software. I am proficient in python, java, and javascript, 
                    I'm a quick learner, and I make decent coffee.
                </p>
            </div>
            <div className='dashes'>----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------</div>
            <h3>
                So what is this website?
            </h3>
            <div className='dashes'>----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------</div>
            <div id='what' className='dialog'>
                <p>
                    This website is my digital portfolio! Well, it is for now at least. You may have noticed the strange domain
                    name. PigeonMingle.com is something I started building with my dad a while ago.
                </p>
            </div>
            <div className='dashes'>----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------</div>
            <h3>
                Ok, but what is it right now?
            </h3>
            <div className='dashes'>----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------</div>
            <div id='butFrWhat' className='dialog'>
               <p>
                    Good question, me! Like I said before, this is my digital portfolio. It is a way to show off what I have done and what I am
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
            </div>
        </div>
    );
}