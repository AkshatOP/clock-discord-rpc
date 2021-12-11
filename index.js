const TimesObject = require('./times.json');
const config = require('./config.json');
const {Client} = require("discord-rpc")
const rpc = new Client({ transport: 'ipc' })
  
/**
 * 
 * @param {date} date date object 
 * @returns String which is time in either 00minutes or 30minutes
 */ 
 function formatAMPM(date){
    let hours = date.getHours();
    let minutes = date.getMinutes(); 
    const ampm = hours >= 12 ? 'pm' : 'am';   
    hours %= 12;
    hours = hours || 12;    
    minutes = minutes <= 29 ? `00` : `30`;
    const strTime = `${hours}:${minutes}${ampm}`;
    return strTime;
};

/**
 * 
 * @param {date} date date object 
 * @returns String which is time
 */
function formatTime(date){
    let hours = (date.getHours()<10?'0':'') + date.getHours();
    let minutes = (date.getMinutes()<10?'0':'') + date.getMinutes();; 
    const ampm = hours >= 12 ? 'pm' : 'am';
    const strTime = `${hours}:${minutes}${ampm}`;
    return strTime;
  };
  

/**
 * Sets the Activity for the RPCClient!
 * @returns void
 */
async function setGame(){
  if(!rpc) return console.warn(config.messages.norpc);
  const _Date = new Date()
  const CurrentTime = formatAMPM(_Date);
  const CurrentTimeExact = formatTime(_Date);
  const Large_IMAGE_Key = TimesObject[CurrentTime];

    rpc.request('SET_ACTIVITY', {
        pid: process.pid,
        activity : {
        state: config.data.state,
        // details : config.data.details,
        assets : {
        large_image : Large_IMAGE_Key,
        large_text : `${CurrentTimeExact} is my current time!!`,
        small_image: config.data.smallImageKey,
        small_text: config.data.smallImageText,
        },
        timestamps: {
        start: 1638988200
        },
        
        buttons : [
            {
                label : "My Server" ,
                url : "https://discord.gg/DQR7xv3qFb"
            },
            {
                label: "My Bot",
                url: "https://top.gg/bot/901846419344871534"
            }
        ]
        
        }
    })
}


rpc.on('ready', () => {
    console.info(`RPC Connected in ${rpc.user.username}`);
    setGame();
    setInterval(() => {
    setGame();
    }, 60000);//1 Minute

});

rpc.login({ clientId : "918805519764963388" }).catch(console.error);