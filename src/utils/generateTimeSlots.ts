export const generateHourlySlots=(ranges:{start:string,end:string}[],date:Date,duration=60)=>{
    const slots:string[]=[]
const now = new Date();
    const isToday = date.toDateString() === now.toDateString();

    const currentTotalMinutes = now.getHours() * 60 + now.getMinutes();
    for(const range of ranges){
        let startMin=timeToMin(range.start)
        let endMin=timeToMin(range.end)

        while(startMin+duration<=endMin){
            if (isToday && startMin <= currentTotalMinutes) {
                startMin += duration;
                continue;
            }
            let slotStart=minutesToTime(startMin)

            slots.push(`${slotStart}`);
            startMin += duration;
        }
    }
    return slots
}

export const timeToMin=(time:string):number=>{
    console.log(time)
    const [t,modifier]=time.split(" ")
    let [hours,minutes]=t.split(":").map(Number)
    console.log('modify',modifier)
    if(modifier==="PM" && hours!==12) hours+=12
    if(modifier==="AM" && hours===12) hours=0

    return hours*60+minutes
}

export const minutesToTime = (mins: number): string => {
  let hours = Math.floor(mins / 60);
  const minutes = mins % 60;

  const modifier = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;

  return `${hours}:${minutes.toString().padStart(2, "0")} ${modifier}`;
};

    