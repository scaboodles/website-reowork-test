import './mingleLauncherStyle.css';

export function PigeonMingleLauncher(){
    const startDefault = require('./resources/start.png');
    const startHover = require('./resources/start-hover.png');

    return(
        <div id='bigOl'>
            <img src={require('./resources/pigeonMingleTitle.png')} id='titleImage'/>
            <img id='startButton' src={startDefault} onMouseOver={e => (e.currentTarget.src = startHover)} onMouseOut={e => (e.currentTarget.src = startDefault)}/>
            <img src={require('./resources/pigeonInstructions.gif')} id='instructions'/>
        </div>
    );
}